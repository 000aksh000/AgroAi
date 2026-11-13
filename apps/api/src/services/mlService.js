import fs from "fs";
import { ENV } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";
export class MLService {
  static baseUrl = ENV.ML_SERVICE_URL;
  static async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ml/health`, {
        signal: AbortSignal.timeout(3e3)
      });
      if (response.ok) {
        return await response.json();
      }
      return { status: "degraded", statusCode: response.status };
    } catch (err) {
      return { status: "offline", error: err.message };
    }
  }
  static async recommendCrop(payload) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ml/crop-recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1e4)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || "Crop recommendation ML service failed to process inputs.",
          response.status === 503 ? 503 : 500,
          "ML_SERVICE_ERROR"
        );
      }
      return await response.json();
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(
        `Unable to reach AI Machine Learning Service at ${this.baseUrl}. Please ensure the Python service is running. Error: ${err.message}`,
        503,
        "ML_SERVICE_UNAVAILABLE"
      );
    }
  }
  static async detectDisease(filePath, originalFilename, mimeType) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: mimeType });
      const formData = new FormData();
      formData.append("file", blob, originalFilename);
      const response = await fetch(`${this.baseUrl}/api/v1/ml/disease-detect`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(15e3)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
    }
    if (ENV.GEMINI_API_KEY) {
      return await this.detectDiseaseWithGemini(filePath, mimeType);
    }
    throw new AppError(
      `Plant disease classification service is unavailable and no AI vision key is configured.`,
      503,
      "ML_SERVICE_UNAVAILABLE"
    );
  }
  static async detectDiseaseWithGemini(filePath, mimeType) {
    const key = ENV.GEMINI_API_KEY;
    if (!key) throw new AppError("Gemini API key is not configured.", 500);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");
    const prompt = `You are an expert agricultural scientist and plant pathologist.
Analyze this leaf/plant image and diagnose any disease, pest, or nutritional deficiency.
Return strictly valid JSON with this exact schema:
{
  "prediction": {
    "diseaseName": "string",
    "crop": "string",
    "isHealthy": boolean,
    "severity": "Low" | "Moderate" | "High" | "Critical",
    "symptoms": ["string"],
    "cause": "string",
    "preventionTips": ["string"],
    "organicTreatment": ["string"],
    "chemicalTreatment": ["string"],
    "expertAdvisoryNotes": "string",
    "confidence": 0.95
  },
  "topMatches": [
    { "label": "string", "confidence": 0.95 }
  ]
}`;
    const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-2.5-flash"];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: mimeType || "image/jpeg",
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              response_mime_type: "application/json"
            }
          }),
          signal: AbortSignal.timeout(25e3)
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return {
              success: true,
              prediction: parsed.prediction,
              topMatches: parsed.topMatches || [
                { label: parsed.prediction.diseaseName, confidence: parsed.prediction.confidence || 0.9 }
              ],
              modelMetadata: {
                modelName: `AgroSmart Gemini Vision AI (${model})`,
                modelVersion: "2.0.0"
              }
            };
          }
        }
      } catch {
        continue;
      }
    }
    throw new AppError("Gemini Vision analysis was unable to process the leaf image.", 502);
  }
  static async chatWithAssistant(message, history = [], farmContext) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ml/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, farmContext }),
        signal: AbortSignal.timeout(1e4)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
    }
    if (ENV.GEMINI_API_KEY) {
      return await this.callGeminiDirect(message, history, farmContext);
    }
    throw new AppError(
      `AI Assistant service is currently unreachable and no LLM API key is configured.`,
      503,
      "AI_ASSISTANT_UNAVAILABLE"
    );
  }
  static async callGeminiDirect(message, history = [], farmContext) {
    const key = ENV.GEMINI_API_KEY;
    if (!key) throw new AppError("Gemini API key is not configured.", 500);
    const farmInfo = farmContext ? `
Farm Details:
- Name: ${farmContext.name || "N/A"}
- Location: ${farmContext.district || ""}, ${farmContext.state || ""}
- Soil: ${farmContext.soilType || "N/A"}
- Crops: ${(farmContext.currentCrops || []).join(", ")}` : "";
    const systemPrompt = `You are AgroSmart AI, an expert agricultural scientist and advisor for Indian farmers. Provide actionable, culturally appropriate, scientifically grounded farming advice using metric units, Indian rupee (INR), Indian crop names, and safety guidelines for chemicals. Be courteous, clear, and structured.`;
    const contents = [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}${farmInfo}

Farmer Query: ${message}` }]
      }
    ];
    const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-2.5-flash"];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
          signal: AbortSignal.timeout(2e4)
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              success: true,
              response: text,
              provider: `gemini (${model})`
            };
          }
        }
      } catch {
        continue;
      }
    }
    throw new AppError("Failed to generate response from Gemini API models.", 502);
  }
}
