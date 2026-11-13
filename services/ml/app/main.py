"""
AgroSmart AI — Python Machine Learning & AI Service
FastAPI microservice providing Crop Recommendation, Plant Disease Detection,
and AI Agricultural Assistant endpoints.
"""

import io
import json
import os
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional
import httpx
import joblib
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image

# Add parent directory to path for training/feature utilities
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
try:
    from training.train_disease_model import (
        DISEASE_KNOWLEDGE_BASE,
        extract_leaf_features,
    )
except ImportError:
    DISEASE_KNOWLEDGE_BASE = {}
    extract_leaf_features = None

app = FastAPI(
    title="AgroSmart AI ML Service",
    description="Agricultural AI & ML inference engine for crop recommendation, disease classification, and advisory.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
CROP_MODEL_PATH = os.path.join(MODELS_DIR, 'crop_recommendation_model.joblib')
CROP_METADATA_PATH = os.path.join(MODELS_DIR, 'crop_model_metadata.json')
DISEASE_MODEL_PATH = os.path.join(MODELS_DIR, 'plant_disease_model.joblib')
DISEASE_KB_PATH = os.path.join(MODELS_DIR, 'disease_knowledge_base.json')

# Global cached models
_crop_model = None
_crop_metadata = None
_disease_model = None
_disease_kb = None


def get_crop_model():
    global _crop_model, _crop_metadata
    if _crop_model is None:
        if os.path.exists(CROP_MODEL_PATH):
            _crop_model = joblib.load(CROP_MODEL_PATH)
            if os.path.exists(CROP_METADATA_PATH):
                with open(CROP_METADATA_PATH, 'r') as f:
                    _crop_metadata = json.load(f)
        else:
            return None, None
    return _crop_model, _crop_metadata


def get_disease_model():
    global _disease_model, _disease_kb
    if _disease_model is None:
        if os.path.exists(DISEASE_MODEL_PATH):
            _disease_model = joblib.load(DISEASE_MODEL_PATH)
            if os.path.exists(DISEASE_KB_PATH):
                with open(DISEASE_KB_PATH, 'r') as f:
                    _disease_kb = json.load(f)
            else:
                _disease_kb = DISEASE_KNOWLEDGE_BASE
        else:
            return None, None
    return _disease_model, _disease_kb


# Pydantic Schemas
class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=300, description="Nitrogen content (N) in soil (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (P) in soil (kg/ha)")
    potassium: float = Field(..., ge=0, le=300, description="Potassium content (K) in soil (kg/ha)")
    soilPh: float = Field(..., ge=3.5, le=9.5, description="Soil pH level")
    temperature: float = Field(..., ge=5, le=55, description="Average temperature in °C")
    humidity: float = Field(..., ge=10, le=100, description="Relative humidity percentage")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")
    state: Optional[str] = None
    district: Optional[str] = None
    season: Optional[str] = None


class ChatMessagePayload(BaseModel):
    role: str
    content: str


class AssistantRequest(BaseModel):
    message: str
    history: List[ChatMessagePayload] = []
    farmContext: Optional[Dict[str, Any]] = None


# Agronomic guidance generator
def generate_agronomic_advice(crop: str, n: float, p: float, k: float, ph: float, rain: float) -> Dict[str, str]:
    crop_info = {
        'rice': {
            'fert': 'Apply Urea in split doses (50% basal, 25% tillering, 25% panicle initiation). Maintain optimal phosphorus.',
            'irrig': 'Maintain 2-5 cm standing water from tillering until 15 days before harvest.',
            'pest': 'Scout for stem borer and leaf blast, particularly under humid cloudy spells.',
            'mkt': 'High MSP support in India (FCI procurement) and active demand across all APMC mandis.'
        },
        'cotton': {
            'fert': 'Balanced N-P-K (120:60:60 kg/ha). Top dress Nitrogen at square formation and flowering.',
            'irrig': 'Critical irrigation at flowering and boll development. Avoid waterlogging in black soils.',
            'pest': 'Monitor for pink bollworm using pheromone traps and jassids/whiteflies during early vegetative stage.',
            'mkt': 'Commercial cash crop with high liquidity in CCI and regional cotton mandis.'
        },
        'wheat': {
            'fert': 'NPK 120:60:40 kg/ha. Apply zinc sulfate 25 kg/ha if soil is zinc-deficient.',
            'irrig': 'Crown Root Initiation (CRI at 21 days) is the most critical irrigation stage.',
            'pest': 'Watch for yellow rust in North Indian plains; spray Propiconazole if symptoms appear.',
            'mkt': 'Extensive MSP procurement with stable market pricing across North & Central India.'
        },
        'maize': {
            'fert': 'Apply 120 kg N, 60 kg P2O5, and 40 kg K2O per hectare. Split N into 3 applications.',
            'irrig': 'Tasseling and silking are the most moisture-sensitive growth periods.',
            'pest': 'Scout for Fall Armyworm (FAW); apply emamectin benzoate early if whorl damage occurs.',
            'mkt': 'Growing demand for poultry feed, cattle feed, and starch manufacturing.'
        },
        'chickpea': {
            'fert': 'Inoculate seed with Rhizobium culture. Apply 20 kg N and 40-50 kg P2O5 at sowing.',
            'irrig': 'Requires 1-2 irrigations: branching and pod development. Sensitive to excess moisture.',
            'pest': 'Helicoverpa pod borer is the primary pest; install pheromone traps and spray NPV or indoxacarb.',
            'mkt': 'Strong domestic pulse consumption with high market value in pulses mandis.'
        }
    }

    base = crop_info.get(crop.lower(), {
        'fert': f'Apply recommended balanced N-P-K according to soil test recommendations. Current soil pH {ph} is suitable.',
        'irrig': f'Provide scheduled irrigation matching crop growth stages; soil rainfall estimate: {rain} mm.',
        'pest': 'Conduct regular field monitoring and adopt Integrated Pest Management (IPM) practices.',
        'mkt': 'Commercial marketability depends on crop quality and regional mandi demand.'
    })

    return {
        'fertilizerGuidance': base['fert'],
        'irrigationSchedule': base['irrig'],
        'pestRiskAssessment': base['pest'],
        'marketPotential': base['mkt']
    }


@app.get("/api/v1/ml/health")
def get_ml_health():
    crop_model, crop_meta = get_crop_model()
    disease_model, disease_kb = get_disease_model()

    return {
        "status": "healthy",
        "service": "AgroSmart AI Machine Learning Engine",
        "timestamp": datetime.utcnow().isoformat(),
        "models": {
            "cropRecommendation": {
                "available": crop_model is not None,
                "version": crop_meta.get("model_version") if crop_meta else None,
                "accuracy": crop_meta.get("test_accuracy") if crop_meta else None,
                "classesCount": len(crop_meta.get("classes", [])) if crop_meta else 0
            },
            "diseaseDetection": {
                "available": disease_model is not None,
                "classesCount": len(disease_kb) if disease_kb else 0,
                "version": "1.0.0"
            }
        }
    }


@app.post("/api/v1/ml/crop-recommend")
def recommend_crop(req: CropRecommendationRequest):
    crop_model, crop_meta = get_crop_model()

    if crop_model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Crop recommendation model artifact is not currently loaded or trained. Please run training pipeline first."
        )

    # Features: ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    features = np.array([[
        req.nitrogen,
        req.phosphorus,
        req.potassium,
        req.temperature,
        req.humidity,
        req.soilPh,
        req.rainfall
    ]], dtype=np.float32)

    try:
        probabilities = crop_model.predict_proba(features)[0]
        classes = crop_model.classes_

        # Sort by confidence
        sorted_indices = np.argsort(probabilities)[::-1]
        top_idx = sorted_indices[0]
        primary_crop = str(classes[top_idx])
        top_confidence = float(probabilities[top_idx])

        # Get top alternatives
        alternatives = []
        for idx in sorted_indices[1:4]:
            alt_conf = float(probabilities[idx])
            if alt_conf > 0.03:
                alternatives.append({
                    "crop": str(classes[idx]).capitalize(),
                    "confidence": round(alt_conf, 3),
                    "expectedYieldScore": round(float(alt_conf * 10), 1),
                    "matchScorePercentage": round(float(alt_conf * 100), 1)
                })

        advice = generate_agronomic_advice(
            primary_crop, req.nitrogen, req.phosphorus, req.potassium, req.soilPh, req.rainfall
        )

        rationale = (
            f"Based on soil nutrients (N: {req.nitrogen}, P: {req.phosphorus}, K: {req.potassium} kg/ha), "
            f"pH {req.soilPh}, ambient temperature of {req.temperature}°C, humidity of {req.humidity}%, "
            f"and rainfall of {req.rainfall} mm, {primary_crop.capitalize()} is the most agronomically suitable crop."
        )

        return {
            "success": True,
            "primaryCrop": primary_crop.capitalize(),
            "confidence": round(top_confidence, 3),
            "confidenceScore": round(top_confidence, 3),
            "rationale": rationale,
            "growingSeason": req.season or "Optimal for Current Season",
            "waterRequirements": "Moderate to High" if req.rainfall > 120 else "Low to Moderate",
            "soilSuitability": f"Optimal for pH {req.soilPh}",
            "alternatives": alternatives,
            "agronomicAdvice": advice,
            "modelMetadata": {
                "modelName": crop_meta.get("model_name", "Random Forest Crop Classifier") if crop_meta else "Random Forest",
                "modelVersion": crop_meta.get("model_version", "1.0.0") if crop_meta else "1.0.0",
                "evaluationAccuracy": crop_meta.get("test_accuracy", 0.98) if crop_meta else 0.98,
                "trainedDate": crop_meta.get("created_at", "2026-10-25") if crop_meta else "2026-10-25"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during crop recommendation: {str(e)}"
        )


@app.post("/api/v1/ml/disease-detect")
async def detect_plant_disease(file: UploadFile = File(...)):
    # Validate mime type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image (JPEG, PNG, WEBP)."
        )

    disease_model, disease_kb = get_disease_model()
    if disease_model is None or not disease_kb:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Plant disease detection model artifact is not loaded. Please train or provide model artifacts."
        )

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file size exceeds the 10MB limit."
        )

    try:
        image = Image.open(io.BytesIO(contents))
        image.verify()  # Verify valid image bytes
        image = Image.open(io.BytesIO(contents))  # Reopen after verify
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Corrupted or unreadable image file."
        )

    try:
        # Extract computer vision features
        features = extract_leaf_features(image).reshape(1, -1)
        probabilities = disease_model.predict_proba(features)[0]
        classes = disease_model.classes_

        sorted_indices = np.argsort(probabilities)[::-1]
        top_idx = sorted_indices[0]
        top_class = str(classes[top_idx])
        top_confidence = float(probabilities[top_idx])

        # Lookup disease knowledge base
        disease_info = disease_kb.get(top_class, {
            "diseaseName": top_class.replace("___", " ").replace("_", " "),
            "crop": top_class.split("___")[0] if "___" in top_class else "Unknown",
            "isHealthy": "healthy" in top_class.lower(),
            "severity": "Mild",
            "symptoms": ["Symptom details available upon agricultural lab confirmation."],
            "cause": "Pathogen or nutritional stress.",
            "preventionTips": ["Maintain field hygiene and proper spacing."],
            "organicTreatment": ["Apply organic bio-fungicide or neem oil."],
            "chemicalTreatment": ["Consult local Krishi Vigyan Kendra (KVK) for chemical advisory."],
            "expertAdvisoryNotes": "Consult local agricultural extension officer for confirmation."
        })

        top_matches = []
        for idx in sorted_indices[:3]:
            cls_name = str(classes[idx])
            top_matches.append({
                "label": cls_name.replace("___", " ").replace("_", " "),
                "confidence": round(float(probabilities[idx]), 3)
            })

        return {
            "success": True,
            "prediction": {
                **disease_info,
                "confidence": round(top_confidence, 3)
            },
            "topMatches": top_matches,
            "imageUrl": f"/uploads/{file.filename}",
            "modelMetadata": {
                "modelName": "AgroSmart Plant Disease Classifier",
                "modelVersion": "1.0.0",
                "imageResolution": f"{image.width}x{image.height}"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during disease detection: {str(e)}"
        )


# Fallback Agricultural AI Knowledge Engine
def fallback_agri_response(query: str, farm_context: Optional[Dict[str, Any]]) -> str:
    q = query.lower()
    farm_info = ""
    if farm_context and farm_context.get("name"):
        farm_info = f"\n\n*(Tailored for your farm: **{farm_context.get('name')}**, located in {farm_context.get('district', '')}, {farm_context.get('state', '')} with {farm_context.get('soilType', '')} soil)*"

    if any(k in q for k in ['fertilizer', 'urea', 'dap', 'npk', 'potash']):
        return (
            "### Fertilizer Guidance & Nutrient Management in India\n\n"
            "1. **Basal Application**: Apply full dose of Phosphorus (DAP/SSP) and Potash (MOP) along with 25-33% of Nitrogen during final land preparation.\n"
            "2. **Top Dressing**: Apply remaining Nitrogen (Urea) in 2 to 3 split doses at active tillering/branching and flowering stages.\n"
            "3. **Neem Coated Urea (NCU)**: Ensures slow release of nitrogen, preventing leaching losses during rainfall.\n"
            "4. **Micronutrients**: Zinc deficiency (Khaira disease in paddy) is common across Indian soils. Apply Zinc Sulfate (25 kg/ha) or 0.5% foliar spray with 0.25% lime."
            + farm_info
        )
    elif any(k in q for k in ['pest', 'insect', 'spray', 'fungicide', 'chemical', 'worm', 'virus', 'whitefl', 'disease', 'blight', 'rot', 'curl', 'caterpillar']):
        return (
            "### Integrated Pest Management (IPM) Advisory\n\n"
            "- **Monitoring**: Install yellow sticky traps (10-15 per acre) for sucking pests (aphids, whiteflies, thrips) and pheromone traps (4-5 per acre) for bollworms/fruit borers.\n"
            "- **Biological Control**: Use *Trichoderma viride* (5g/L) for fungal root rots and *Pseudomonas fluorescens* for bacterial blights.\n"
            "- **Organic Spray**: 5% Neem Seed Kernel Extract (NSKE) or cold-pressed Neem Oil (3-5 ml/L) during early vegetative stages.\n"
            "- **Safety Precaution**: Always wear protective gloves and face masks when applying chemical fungicides/pesticides. Never spray during strong wind or peak afternoon sun."
            + farm_info
        )
    elif any(k in q for k in ['pm-kisan', 'kcc', 'scheme', 'subsidy', 'insurance', 'pmfby']):
        return (
            "### Key Government Agricultural Schemes for Indian Farmers\n\n"
            "1. **PM-KISAN**: Direct income support of ₹6,000 per year transferred in three equal 4-monthly installments of ₹2,000 directly to farmer bank accounts.\n"
            "2. **Kisan Credit Card (KCC)**: Concessional crop loans up to ₹3 Lakhs at 7% interest, reduced to 4% upon prompt repayment.\n"
            "3. **Pradhan Mantri Fasal Bima Yojana (PMFBY)**: Crop insurance at nominal premiums (2% for Kharif crops, 1.5% for Rabi crops, 5% for commercial/horticultural crops) covering yield losses due to non-preventable natural risks.\n"
            "4. **Soil Health Card Scheme**: Periodic soil nutrient assessment providing crop-specific fertilizer recommendations."
        )
    elif any(k in q for k in ['weather', 'rain', 'irrigation', 'water']):
        return (
            "### Water Management & Irrigation Scheduling\n\n"
            "- **Critical Stages**: Ensure moisture during Crown Root Initiation (Wheat), Tillering & Panicle Initiation (Rice), and Flowering & Pod Fill (Pulses/Oilseeds).\n"
            "- **Micro-Irrigation**: Drip irrigation saves 40-60% water while increasing yield by 20-30% in row crops and orchards (subsidized under PMKSY - Per Drop More Crop).\n"
            "- **Pre-Rain Action**: Delay fertilizer spraying and chemical applications if rainfall is forecast within 24 hours to prevent runoff."
            + farm_info
        )
    else:
        return (
            f"### Agricultural Advisory: {query.strip()}\n\n"
            "To maximize farm productivity, follow these core agronomic practices:\n\n"
            "1. **Soil Health**: Test your soil every 2-3 years through a certified Krishi Vigyan Kendra (KVK) or soil testing laboratory.\n"
            "2. **Certified Seeds**: Always procure certified, disease-resistant seed varieties from NSC or state seed corporations.\n"
            "3. **Crop Rotation**: Alternate heavy feeding cereal crops with leguminous pulses (chickpea, lentil, mungbean) to biologically fix nitrogen and restore soil fertility.\n"
            "4. **Timely Sowing**: Adhere to local meteorological advisories to avoid heat stress or untimely rains during harvesting."
            + farm_info
        )


@app.post("/api/v1/ml/assistant")
async def chat_with_assistant(req: AssistantRequest):
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    farm_context_str = ""
    if req.farmContext:
        fc = req.farmContext
        farm_context_str = (
            f"\n\nUser Farm Context:\n"
            f"- Farm Name: {fc.get('name', 'N/A')}\n"
            f"- Location: {fc.get('district', '')}, {fc.get('state', '')}\n"
            f"- Soil Type: {fc.get('soilType', 'N/A')}, pH: {fc.get('soilPh', 'N/A')}\n"
            f"- Current Crops: {', '.join(fc.get('currentCrops', []))}\n"
            f"- Irrigation: {fc.get('irrigationMethod', 'N/A')}\n"
        )

    # If Gemini API key is configured
    if gemini_key:
        models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-2.5-flash"]
        system_instruction = (
            "You are AgroSmart AI, an expert agricultural scientist and advisor for Indian farmers. "
            "Provide actionable, culturally appropriate, scientifically grounded farming advice using metric units, "
            "Indian rupee (INR), Indian crop names, and safety guidelines for chemicals. Be courteous, clear, and structured."
        )
        prompt_text = f"{system_instruction}\n{farm_context_str}\n\nFarmer's Query: {req.message}"
        payload = {
            "contents": [{"parts": [{"text": prompt_text}]}]
        }
        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        answer = data['candidates'][0]['content']['parts'][0]['text']
                        return {"success": True, "response": answer, "provider": f"gemini ({model})"}
            except Exception:
                continue

    # Fallback to AgroSmart Agricultural Knowledge Engine
    answer = fallback_agri_response(req.message, req.farmContext)
    return {
        "success": True,
        "response": answer,
        "provider": "agrosmart-agri-engine-v1",
        "notice": "Response generated by AgroSmart Agricultural Knowledge Engine."
    }
