"""
AgroSmart AI — ML Unit & Integration Tests
Validates machine learning model artifacts, inference pipelines, and knowledge bases.
"""

import json
import os
import joblib
import numpy as np
import pytest
from PIL import Image

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from training.train_disease_model import extract_leaf_features, DISEASE_KNOWLEDGE_BASE
from app.main import fallback_agri_response

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
CROP_MODEL_PATH = os.path.join(MODELS_DIR, 'crop_recommendation_model.joblib')
CROP_META_PATH = os.path.join(MODELS_DIR, 'crop_model_metadata.json')
DISEASE_MODEL_PATH = os.path.join(MODELS_DIR, 'plant_disease_model.joblib')
DISEASE_KB_PATH = os.path.join(MODELS_DIR, 'disease_knowledge_base.json')


def test_crop_model_artifact_exists():
    assert os.path.exists(CROP_MODEL_PATH), "Crop recommendation model artifact missing"
    assert os.path.exists(CROP_META_PATH), "Crop recommendation metadata missing"


def test_crop_model_metadata_accuracy():
    with open(CROP_META_PATH, 'r') as f:
        meta = json.load(f)
    assert meta['num_classes'] == 22
    assert meta['test_accuracy'] >= 0.90, f"Expected model accuracy >= 90%, got {meta['test_accuracy']}"
    assert 'classes' in meta


def test_crop_inference():
    import pandas as pd
    model = joblib.load(CROP_MODEL_PATH)
    # Test typical rice parameters: high N, high humidity, high rainfall, acidic-neutral pH
    features = pd.DataFrame([{
        'N': 80.0, 'P': 45.0, 'K': 40.0,
        'temperature': 24.0, 'humidity': 82.0,
        'ph': 6.2, 'rainfall': 220.0
    }])
    probabilities = model.predict_proba(features)[0]
    classes = model.classes_
    top_pred = classes[np.argmax(probabilities)]

    assert top_pred == 'rice'
    assert probabilities.max() > 0.5


def test_disease_model_artifact_and_kb():
    assert os.path.exists(DISEASE_MODEL_PATH), "Disease model artifact missing"
    assert len(DISEASE_KNOWLEDGE_BASE) >= 15, "Knowledge base should cover at least 15 crop conditions"

    # Verify each disease entry has required fields
    for disease_id, data in DISEASE_KNOWLEDGE_BASE.items():
        assert 'diseaseName' in data
        assert 'crop' in data
        assert 'symptoms' in data and len(data['symptoms']) > 0
        assert 'preventionTips' in data
        assert 'organicTreatment' in data
        assert 'chemicalTreatment' in data


def test_image_feature_extraction():
    # Create test synthetic leaf image (green leaf with center spot)
    img_arr = np.zeros((100, 100, 3), dtype=np.uint8)
    img_arr[:, :] = [40, 160, 40] # green foliage
    img_arr[35:65, 35:65] = [120, 80, 20] # brown necrotic lesion
    img = Image.fromarray(img_arr)

    feats = extract_leaf_features(img)
    assert len(feats) == 12
    assert not np.isnan(feats).any()
    assert feats[6] > 0 # Greenness ExG should be positive


def test_agri_assistant_fallback_engine():
    resp_fert = fallback_agri_response("What fertilizer should I use for paddy?", None)
    assert "Fertilizer" in resp_fert or "Urea" in resp_fert

    resp_pest = fallback_agri_response("How to control tomato leaf curl virus and whiteflies?", None)
    assert "Pest" in resp_pest or "Neem" in resp_pest

    resp_scheme = fallback_agri_response("Tell me about PM-KISAN benefits and KCC", None)
    assert "PM-KISAN" in resp_scheme
