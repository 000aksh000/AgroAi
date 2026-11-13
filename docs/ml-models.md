# AgroSmart AI — Machine Learning Models & Training Pipeline

## 1. Crop Recommendation Engine

### Algorithm & Dataset
- **Model**: `RandomForestClassifier` (100 estimators, max depth 16)
- **Dataset**: Calibrated agricultural soil and climate dataset (2,640 samples across 22 crops)
- **Input Features (7)**:
  1. `N`: Nitrogen ratio in soil (kg/ha)
  2. `P`: Phosphorus ratio in soil (kg/ha)
  3. `K`: Potassium ratio in soil (kg/ha)
  4. `temperature`: Ambient temperature (°C)
  5. `humidity`: Relative humidity (%)
  6. `ph`: Soil pH (3.5 to 9.5)
  7. `rainfall`: Seasonal precipitation (mm)
- **Target Classes (22)**:
  `rice`, `maize`, `chickpea`, `kidneybeans`, `pigeonpeas`, `mothbeans`, `mungbean`, `blackgram`, `lentil`, `pomegranate`, `banana`, `mango`, `grapes`, `watermelon`, `muskmelon`, `apple`, `orange`, `papaya`, `coconut`, `cotton`, `jute`, `coffee`.

### Performance & Evaluation Metrics
- **Train / Test Split**: 80% train (2,112 samples), 20% test (528 samples, stratified)
- **Accuracy**: **99.62%**
- **Macro F1-Score**: **0.9962**
- **Artifacts Saved**:
  - `services/ml/models/crop_recommendation_model.joblib`
  - `services/ml/models/crop_model_metadata.json`

### Training Command
```bash
python services/ml/training/train_crop_model.py
```

---

## 2. Plant Disease Classification & Pathology Pipeline

### Architecture
- **Feature Extraction**:
  - Normalized RGB and HSV color channel distributions (Mean, Std Dev)
  - Excess Green Index ($ExG = 2G - R - B$) measuring chlorophyll vigor vs chlorosis
  - Spatial gradient edge density (Sobel differences) detecting necrotic spots and lesions
  - Necrotic tissue ratio ($R > G$ with thresholding)
- **Classifier**: Random Forest classifier calibrated on 15 key Indian agricultural conditions.
- **Pathology Knowledge Base**: Integrated database mapping each disease to pathogen name, symptom descriptions, cause, certified organic bio-controls (Neem, Trichoderma), and chemical fungicides with withholding periods.

### Supported Conditions (15)
1. `Tomato___Early_blight` (*Alternaria solani*)
2. `Tomato___Late_blight` (*Phytophthora infestans*)
3. `Tomato___Bacterial_spot` (*Xanthomonas*)
4. `Tomato___healthy`
5. `Potato___Early_blight` (*Alternaria solani*)
6. `Potato___Late_blight` (*Phytophthora infestans*)
7. `Potato___healthy`
8. `Rice___Leaf_Blast` (*Magnaporthe oryzae*)
9. `Rice___Brown_Spot` (*Bipolaris oryzae*)
10. `Rice___healthy`
11. `Cotton___Bacterial_Blight` (*Xanthomonas citri*)
12. `Cotton___healthy`
13. `Corn___Common_rust` (*Puccinia sorghi*)
14. `Corn___Northern_Leaf_Blight` (*Exserohilum turcicum*)
15. `Corn___healthy`

### Training Command
```bash
python services/ml/training/train_disease_model.py
```

---

## 3. Conversational Kisan AI Assistant

- **Architecture**: Provider-independent adapter supporting Google Gemini 1.5, OpenAI, or local agronomic domain fallback knowledge engine.
- **Context Injection**: When a farmer selects an active farm, soil type, district, and current crops are automatically injected into the prompt.
- **Safety Safeguards**: Pesticide and chemical recommendations enforce protective equipment disclaimers, dilution warnings, and safety intervals.
