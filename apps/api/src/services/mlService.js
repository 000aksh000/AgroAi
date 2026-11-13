import fs from "fs";
import { ENV } from "../config/env.js";
import { AppError } from "../middleware/errorHandler.js";

export class MLService {
  static baseUrl = ENV.ML_SERVICE_URL;

  static async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ml/health`, {
        signal: AbortSignal.timeout(3000)
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
        signal: AbortSignal.timeout(10000)
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
    // 1. Prioritize Gemini Multimodal Vision if API key is configured
    if (ENV.GEMINI_API_KEY) {
      try {
        console.log('Analyzing leaf image using Gemini Vision AI...');
        return await this.detectDiseaseWithGemini(filePath, mimeType);
      } catch (geminiErr) {
        console.warn('Gemini Vision analysis failed, falling back to local ML model:', geminiErr.message);
      }
    }

    // 2. Fall back to local Python ML microservice
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer], { type: mimeType });
      const formData = new FormData();
      formData.append("file", blob, originalFilename);
      const response = await fetch(`${this.baseUrl}/api/v1/ml/disease-detect`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(15000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (mlErr) {
      console.warn('Local ML disease service unavailable:', mlErr.message);
    }

    throw new AppError(
      `Plant disease classification service is unavailable. Please check your network and API key.`,
      503,
      "ML_SERVICE_UNAVAILABLE"
    );
  }

  static async detectDiseaseWithGemini(filePath, mimeType) {
    const key = ENV.GEMINI_API_KEY;
    if (!key) throw new AppError("Gemini API key is not configured.", 500);

    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString("base64");

    const prompt = `You are an expert agricultural scientist, agronomist, and plant pathologist specialized in Indian crops.
Examine this plant photograph and provide an agronomic diagnosis.
If the image does not depict a plant or crop leaf, identify it as "Dashboard Interface / Not a Plant Leaf" or "Non-Plant Subject", and provide appropriate guidance in expertAdvisoryNotes.

Return strictly valid JSON with this exact structure:
{
  "diseaseName": "string",
  "scientificName": "string",
  "crop": "string",
  "isHealthy": boolean,
  "severity": "None" | "Low" | "Moderate" | "Severe",
  "confidence": number between 0.80 and 0.99,
  "symptoms": ["string"],
  "cause": "string",
  "preventionTips": ["string"],
  "organicTreatment": ["string"],
  "chemicalTreatment": ["string"],
  "expertAdvisoryNotes": "string"
}`;

    const models = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
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
                    inlineData: {
                      mimeType: mimeType || "image/jpeg",
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json"
            }
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const cleanText = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const raw = JSON.parse(cleanText);
            const p = raw.prediction || raw;

            const prediction = {
              diseaseName: p.diseaseName || (p.isHealthy ? "Healthy Foliage" : "Crop Pathological Infection"),
              scientificName: p.scientificName || "",
              crop: p.crop || "Identified Crop",
              isHealthy: Boolean(p.isHealthy),
              confidence: Number(p.confidence) || 0.95,
              severity: p.severity || (p.isHealthy ? "None" : "Moderate"),
              symptoms: Array.isArray(p.symptoms) && p.symptoms.length > 0 ? p.symptoms : ["Observed foliage patterns analyzed."],
              cause: p.cause || "Agronomic and environmental pathogen analysis completed.",
              preventionTips: Array.isArray(p.preventionTips) && p.preventionTips.length > 0 ? p.preventionTips : ["Maintain field sanitation and certified seed stock."],
              organicTreatment: Array.isArray(p.organicTreatment) && p.organicTreatment.length > 0 ? p.organicTreatment : ["Apply neem oil or bio-fungicide spray."],
              chemicalTreatment: Array.isArray(p.chemicalTreatment) && p.chemicalTreatment.length > 0 ? p.chemicalTreatment : ["Apply recommended fungicide adhering to label dosages and safety PPE."],
              expertAdvisoryNotes: p.expertAdvisoryNotes || "For confirmed diagnosis, consult your nearest Krishi Vigyan Kendra (KVK)."
            };

            return {
              success: true,
              prediction,
              topMatches: [
                { label: prediction.diseaseName, confidence: prediction.confidence }
              ],
              modelMetadata: {
                modelName: `AgroSmart Gemini Vision AI (${model})`,
                modelVersion: "2.5.0"
              }
            };
          }
        }
      } catch (err) {
        console.warn(`Gemini Vision model ${model} attempt failed:`, err.message);
        continue;
      }
    }

    throw new AppError("Gemini Vision analysis was unable to process the leaf image.", 502);
  }

  static async chatWithAssistant(message, history = [], farmContext) {
    // 1. Prioritize live Gemini LLM for dynamic, intelligent agronomic responses
    if (ENV.GEMINI_API_KEY) {
      try {
        console.log('Generating assistant response with Gemini AI...');
        return await this.callGeminiDirect(message, history, farmContext);
      } catch (geminiErr) {
        console.warn('Gemini Assistant call failed, falling back to local knowledge engine:', geminiErr.message);
      }
    }

    // 2. Fall back to Python ML microservice knowledge engine
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ml/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, farmContext }),
        signal: AbortSignal.timeout(10000)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (mlErr) {
      console.warn('Local assistant service unavailable:', mlErr.message);
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
User Farm Context:
- Farm Name: ${farmContext.name || "N/A"}
- Location: ${farmContext.district || ""}, ${farmContext.state || ""}
- Soil Type: ${farmContext.soilType || "N/A"}
- Current Crops: ${(farmContext.currentCrops || []).join(", ") || "None specified"}` : "";

    const systemInstruction = `You are AgroSmart AI, an expert agricultural scientist, agronomist, and trusted advisor for Indian farmers.
Provide actionable, culturally appropriate, scientifically grounded farming advice using metric units, Indian rupee (INR), Indian crop names (e.g. Rabi, Kharif, Zaid), and strict safety guidelines for chemicals.
Be courteous, practical, and clear. Format responses with neat markdown headings, bullet points, and dosages where applicable.${farmInfo}`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      // Keep up to 6 previous messages
      const previousTurns = history.slice(-6);
      for (const turn of previousTurns) {
        if (turn.content) {
          contents.push({
            role: turn.role === "assistant" ? "model" : "user",
            parts: [{ text: turn.content }]
          });
        }
      }
    }

    // If the latest message isn't already the last item in contents
    if (contents.length === 0 || contents[contents.length - 1]?.parts?.[0]?.text !== message) {
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });
    }

    const models = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            contents
          }),
          signal: AbortSignal.timeout(15000)
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
      } catch (err) {
        console.warn(`Gemini model ${model} attempt failed:`, err.message);
        continue;
      }
    }

    throw new AppError("Failed to generate response from Gemini AI models.", 502);
  }
}
