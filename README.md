# AgroSmart AI — Intelligent Agriculture Platform for Indian Farmers

[![CI Pipeline](https://github.com/agrosmart-ai/agrosmart/actions/workflows/ci.yml/badge.svg)](https://github.com/agrosmart-ai/agrosmart/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-teal.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-99.6%25_Accuracy-orange.svg)](https://scikit-learn.org/)

**AgroSmart AI** is a complete, scalable, production-ready AI agriculture platform engineered to help Indian farmers make data-backed farming decisions. It unifies machine learning crop recommendations, computer vision plant pathology, real-time meteorological forecasting, APMC mandi live market price tracking, and conversational AI advisory into an accessible, mobile-friendly interface.

---

## 🌟 Key Features

1. **AI Crop Recommendation Engine**
   - Calibrated `RandomForestClassifier` trained on 2,640 samples across 22 Indian agricultural crops.
   - Evaluates Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Temperature, Humidity, and Rainfall.
   - 99.6% model validation accuracy with confidence scores, crop alternatives, and agronomic management advice.
2. **Plant Pathology & Leaf Disease Diagnostics**
   - Computer vision feature extraction pipeline for foliage discoloration, chlorosis ($ExG$), necrotic ratios, and edge textures.
   - Covers 15 common Indian crop conditions across Tomato, Potato, Rice/Paddy, Cotton, and Corn.
   - Dual IPM guidance: Certified Organic bio-controls (Neem oil, *Trichoderma*) alongside targeted chemical fungicides with safety withholding intervals.
3. **Hyperlocal Weather & Spraying Advisory**
   - Live meteorological conditions and 7-day forecasts powered by Open-Meteo (requires no API key).
   - Dedicated agricultural decision windows: Chemical spraying suitability (based on wind speed and drift), irrigation urgency, and crop thermal/moisture stress indices.
4. **APMC Mandi & Market Price Intelligence**
   - Live commodity rates across Indian states (Maharashtra, Punjab, Gujarat, MP, UP, Karnataka, Haryana, Rajasthan, AP) and primary trading mandis.
   - Modal, Minimum, and Maximum trading rates in INR (₹) per Quintal with 7-day price trend history charts.
5. **Kisan AI Conversational Assistant**
   - Provider-independent LLM adapter supporting Google Gemini 1.5, OpenAI, or a rich local domain-specific agricultural knowledge engine.
   - Dynamic farm context injection tailored to the farmer's active land plot.
6. **Farm & Land Management**
   - Multi-plot farm management tracking acreage, soil type, N-P-K history, irrigation method, and cultivated crops.
   - Single-click parameter auto-fill between saved farm profiles and AI recommendation engines.
7. **Unified Prediction History**
   - Filterable, searchable, and persistent timeline of past crop recommendations and disease scans.
8. **Administrative Command Center**
   - Role-based console for user account management, role toggles, platform aggregate metrics, real-time service health diagnostics, and security audit trails.

---

## 🏗️ Architecture & Technology Stack

```
agrosmart-ai/
├── apps/
│   ├── web/               # React 18, Vite, TypeScript, Tailwind CSS, TanStack Query, Recharts, Lucide
│   └── api/               # Node.js 20, Express, TypeScript, Mongoose, JWT, Zod, Swagger UI
├── services/
│   └── ml/                # Python 3.11+, FastAPI, Scikit-learn, NumPy, Pandas, Pillow, Pytest
├── packages/
│   ├── shared-types/      # Common TypeScript contracts across web and api
│   └── shared-validation/ # Zod validation schemas
├── infrastructure/
│   ├── docker/            # Production Dockerfiles (web, api, ml)
│   └── deployment/        # Cloud deployment guides and manifests
├── docs/                  # In-depth architectural and API documentation
└── docker-compose.yml     # Local multi-container development environment
```

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- **Node.js** >= 20.0.0 & **npm** >= 10.0.0
- **Python** >= 3.10.0 with `venv`
- *(Optional)* Docker and Docker Compose

### Step 1: Install Dependencies & Setup Monorepo
```bash
# Clone the repository
git clone https://github.com/agrosmart-ai/agrosmart.git
cd agrosmart

# Install all Node.js workspace dependencies
npm install

# Compile shared TypeScript packages
npm run build --workspace=@agrosmart/shared-types
npm run build --workspace=@agrosmart/shared-validation
```

### Step 2: Setup Python Machine Learning Service
```bash
# Create virtual environment in services/ml
python -m venv services/ml/venv

# Activate virtual environment
# Windows:
.\services\ml\venv\Scripts\activate
# Linux/macOS:
source services/ml/venv/bin/activate

# Install requirements
pip install -r services/ml/requirements.txt

# Train real ML crop and disease models
python services/ml/training/train_crop_model.py
python services/ml/training/train_disease_model.py
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
> **Note on Database**: If you do not have MongoDB running locally, leave `MONGODB_URI` empty. AgroSmart AI will automatically start an embedded in-memory MongoDB instance (`mongodb-memory-server`) for frictionless zero-setup development!

### Step 4: Run the Full Stack Locally
Open three terminal tabs (or use our orchestration script):

```bash
# Terminal 1: Run Python ML Service
.\services\ml\venv\Scripts\uvicorn app.main:app --host 0.0.0.0 --port 8000 --app-dir services/ml

# Terminal 2: Run Node.js API Server
npm run dev --workspace=@agrosmart/api

# Terminal 3: Run React Vite Frontend
npm run dev --workspace=@agrosmart/web
```

Or run API and Web concurrently:
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**!

---

## 🔑 Demo Accounts for Immediate Evaluation

| Account Type | Email | Password |
|---|---|---|
| **Farmer Account** | `ramesh.farmer@example.com` | `Password@123` |
| **Admin Account** | `admin@agrosmart.ai` | `Admin@AgroSmart2026` |

*(Quick demo auto-fill buttons are also available on the Login screen).*

---

## 🧪 Running Automated Tests

```bash
# Run all backend and frontend tests (20 tests)
npm run test

# Run Python ML model and inference tests (6 tests)
.\services\ml\venv\Scripts\pytest services/ml/tests/test_ml_service.py -v
```

Total test suite: **26 automated tests passing with 100% pass rate**.

---

## 🐳 Docker Compose Execution

```bash
docker compose up --build
```
- Web Application: `http://localhost:5173`
- REST API & Swagger UI: `http://localhost:5000/docs`
- Python ML Service: `http://localhost:8000/docs`

---

## 📚 Documentation Links
- [System Architecture](docs/architecture.md)
- [REST API Specifications](docs/api.md)
- [Database Models & Indexes](docs/database.md)
- [ML Models & Training](docs/ml-models.md)
- [Deployment Guide](docs/deployment.md)
- [Security & Compliance](docs/security.md)

---

## ⚖️ Responsible AI & Farmer Support Helpline
- **Kisan Call Centre (Toll-Free)**: **1800-180-1551** (Available 6:00 AM to 10:00 PM across Indian regional languages).
- **Disclaimer**: AgroSmart AI provides scientific agricultural advisory based on calibrated statistical machine learning models. Predictions depend on submitted soil test inputs and regional agro-climatic conditions. Consult your nearest Krishi Vigyan Kendra (KVK) for laboratory-verified crop decisions.
