# AgroAI — Next-Generation AgriTech Platform for Indian Farmers

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.11+-teal.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-99.6%25_Accuracy-orange.svg)](https://scikit-learn.org/)
[![UI Design](https://img.shields.io/badge/Design-Dark_Vintage_Botanical-B69A62.svg)](#-design-system--dark-vintage-botanical-aesthetic)
[![Repository](https://img.shields.io/badge/GitHub-000aksh000%2FAgroAi-174C35.svg)](https://github.com/000aksh000/AgroAi)

**AgroAI** is an intelligent, full-stack precision agriculture and farm advisory platform engineered specifically for Indian farmers, agricultural extension workers, and agronomists. It bridges cutting-edge machine learning, computer vision, and generative AI with a distinctive **Dark Vintage Botanical** visual identity inspired by rich agricultural soil, forest greenery, and vintage botanical journals.

---

## 🌿 Highlights & What Makes AgroAI Unique

- **Dark Vintage Botanical UI/UX**: Designed like an editorial agricultural research journal—featuring rich deep forest green (`#101B16`), slate green cards (`#202B22`), antique brass/gold accents (`#B69A62`), vintage parchment cream (`#F0EBDD`), editorial serif typography (*Playfair Display*, *DM Serif Display*), and subtle organic soil grain textures.
- **Pure JavaScript Architecture**: Streamlined modern ES Modules (`.jsx` / `.js`) across frontend and backend for fast development cycles and zero transpilation friction.
- **Multi-Location Weather Tracing**: Real-time browser GPS location detection with instant multi-state search (Uttar Pradesh, Delhi, Maharashtra, Punjab, Haryana, and all Indian districts) with spraying suitability indices and 7-day agricultural forecasts.
- **Enterprise-Grade AI & ML Microservices**: Calibrated Random Forest model for 22 crops (99.6% validation accuracy), computer vision leaf disease pathology (15 crop conditions with organic & chemical IPM protocols), and Gemini 1.5-powered conversational agricultural advisor.

---

## 🌟 Core Modules & Capabilities

### 1. 🌾 AI Soil & Crop Recommendation Engine
- **Features Analyzed**: Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Temperature (°C), Relative Humidity (%), and Rainfall (mm).
- **Model**: Multi-class `RandomForestClassifier` trained on 2,640 soil samples across 22 major Indian agricultural crops.
- **Output**: Primary recommended crop with confidence score, alternative crop options, seasonal cultivation window, required water regime, and detailed soil replenishment guidelines.

### 2. 🔬 Leaf Pathology & Disease Diagnostics
- **Vision Pipeline**: Multi-spectral color space analysis (Excess Green Index $ExG$, HSV chlorosis grading, necrotic brown tissue ratio, and edge texture analysis).
- **Diagnosis Matrix**: Detects 15 major diseases across staple Indian crops (Tomato Late Blight, Tomato Early Blight, Potato Late Blight, Rice Bacterial Leaf Blight, Rice Brown Spot, Cotton Leaf Curl Virus, Corn Common Rust, and more).
- **Dual IPM Strategy**: Certified organic bio-controls (*Trichoderma viride*, Neem oil, *Pseudomonas*) alongside targeted chemical fungicides with strict Pre-Harvest Intervals (PHI).

### 3. 🌦️ Hyperlocal Meteorological Station & Spraying Index
- **Live Weather**: Instant location detection via HTML5 Geolocation API, with fallback to district/state search across India (e.g. Pune, Lucknow, Varanasi, New Delhi, Ludhiana).
- **Agricultural Spraying Advisory**: Real-time evaluation of wind drift risk (<15 km/h optimal), precipitation probability, and leaf burn risk based on temperature and relative humidity.
- **7-Day Trend Analytics**: Interactive temperature and rainfall distribution charts powered by Recharts.

### 4. 📊 APMC Mandi Market Intelligence
- **Commodity Coverage**: Live trading data for Wheat, Rice, Cotton, Tomato, Potato, Onion, Soybean, Mustard, Maize, and pulses across APMC markets in Maharashtra, Punjab, Gujarat, MP, UP, Rajasthan, and Karnataka.
- **Price Analytics**: Modal, Minimum, and Maximum trading rates in INR (₹) per Quintal with 7-day historical price trend charts.

### 5. 🤖 Kisan AI Agricultural Assistant
- **Dual Engine**: Google Gemini 1.5 LLM integration with an intelligent fallback agricultural knowledge engine covering Indian agronomy, crop protection, fertilizer schedules, and PM-KISAN schemes.
- **Farm Context Injection**: Automatically attaches the farmer's active farm acreage, soil type, and current crops to every consultation query.

### 6. 🗺️ Multi-Plot Land & Farm Parcel Management
- Track multiple land parcels with dedicated soil profiles, irrigation methods (drip, sprinkler, furrow), active crops, and acreage.
- Single-click parameter auto-fill from saved farm profiles into the crop recommendation engine.

### 7. 📜 Centralized Farm History & Audit Log
- Searchable and filterable history of all soil analyses, crop recommendations, and plant disease scans.
- Detailed agronomic advisory modals for past diagnoses.

### 8. 🛡️ Role-Based Administrative Command Center
- System health overview (Node API, Python ML microservice, Database status).
- User management with role assignment (Farmer, Agronomist, Admin).
- Full security audit trails tracking authentication, predictions, and platform events.

---

## 🎨 Design System & Dark Vintage Botanical Aesthetic

The AgroAI interface combines the elegance of historic botanical encyclopedias with the clarity of modern AgriTech SaaS:

| Token | Hex Value | Application |
| :--- | :--- | :--- |
| **Deep Forest Background** | `#101B16` | Main application canvas with layered radial forest gradients |
| **Secondary Background** | `#18251D` | Navigation sidebar, dialog panels, and elevated containers |
| **Botanical Card Surface** | `#202B22` | Dashboard cards, diagnostic containers, and form panels |
| **Antique Gold / Brass** | `#B69A62` | Primary borders, accents, badge highlights, and active indicators |
| **Soft Pale Gold** | `#D4BE8D` | Monospace numbers, currency rates (₹/Qtl), and metrics |
| **Forest Foliage Green** | `#294C36` | Primary action buttons and user chat bubbles |
| **Muted Moss Green** | `#71805A` | Secondary badges, progress rings, and chart indicators |
| **Rich Soil Brown** | `#79563C` | Earth and soil parameter indicators |
| **Parchment Ivory** | `#F0EBDD` | Primary typography and editorial headings |
| **Soft Sage / Moss Mute** | `#A5AA96` | Helper text, secondary descriptions, and table headers |

---

## 🏗️ Architecture & Monorepo Structure

```
AgroAi/
├── apps/
│   ├── web/                     # React 18 frontend with Vite 6 & Tailwind CSS
│   │   ├── src/
│   │   │   ├── components/      # Modular UI components, layouts, dialogs
│   │   │   ├── pages/           # 12 complete application pages
│   │   │   ├── services/        # API client, weather service, mandi service
│   │   │   └── context/         # Auth, Farm selection, Notification contexts
│   │   ├── index.html           # Playfair Display & Inter font configurations
│   │   └── tailwind.config.js   # Dark Vintage Botanical design tokens
│   │
│   └── api/                     # Node.js 20 Express REST API server
│       ├── src/
│       │   ├── controllers/     # Request handlers (auth, crop, disease, weather, mandi, assistant, farms)
│       │   ├── models/          # Mongoose schema models (User, Farm, CropRecommendation, etc.)
│       │   ├── routes/          # Express route definitions
│       │   ├── services/        # Business logic & ML microservice proxy
│       │   └── seed.js          # Database seeding script with realistic Indian farm data
│       └── .env.example         # API environment template
│
├── services/
│   └── ml/                      # Python 3.11+ Machine Learning Microservice
│       ├── app/
│       │   ├── models/          # Trained scikit-learn models & label encoders
│       │   ├── services/        # Crop inference & CV leaf pathology extractors
│       │   └── main.py          # FastAPI application endpoints
│       ├── training/            # Model training & evaluation scripts
│       └── requirements.txt     # Python dependencies
│
├── packages/
│   ├── shared-types/            # Shared interfaces and type contracts
│   └── shared-validation/       # Zod data schemas
│
├── docs/                        # Architecture, API, and security documentation
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Python** >= 3.10.0 with `venv`
- *(Optional)* MongoDB (If omitted, AgroAI automatically uses an embedded in-memory MongoDB instance for zero-setup execution).

### Step 1: Clone the Repository
```bash
git clone https://github.com/000aksh000/AgroAi.git
cd AgroAi
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Setup Python ML Microservice
```bash
# Navigate to the ML service directory
cd services/ml

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# (Optional) Retrain models if needed:
# python training/train_crop_model.py
# python training/train_disease_model.py

cd ../..
```

### Step 4: Environment Configuration
Copy `.env.example` to `.env` in `apps/api`:
```bash
cp apps/api/.env.example apps/api/.env
```
> **Zero-Setup Database**: Leave `MONGODB_URI` blank to run with the embedded zero-configuration memory server, or add your MongoDB connection string. To enable live Gemini AI chat, add your `GEMINI_API_KEY`.

### Step 5: Launch the Application
Run all services simultaneously:

```bash
# Option A: Start API and Web Frontend
npm run dev

# Option B: Start Python ML Microservice in a separate terminal
cd services/ml
.\venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Access the interfaces:
- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **REST API Gateway**: [http://localhost:5000](http://localhost:5000)
- **API Swagger Documentation**: [http://localhost:5000/docs](http://localhost:5000/docs)
- **Python ML Microservice Docs**: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

---

## 🔑 Demo Access Credentials

Pre-configured credentials for evaluation:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Farmer** | `ramesh.farmer@example.com` | `Password@123` | Farm plots, crop advisory, leaf disease scan, mandi prices, weather |
| **Administrator** | `admin@agrosmart.ai` | `Admin@AgroSmart2026` | Full platform control, system health metrics, user management, audit logs |

*(Quick-fill demo buttons are available on the Login screen).*

---

## 🧪 Testing Suite

Run full-stack automated tests across workspaces:

```bash
# Run API and Web unit/integration tests
npm run test

# Run Python ML inference and validation tests
cd services/ml
.\venv\Scripts\pytest tests/ -v
```

---

## ⚖️ Responsible Agricultural Advisory

AgroAI provides scientific farming guidance synthesized from validated machine learning models and agro-meteorological sources. Predictions should be corroborated with local field testing and Krishi Vigyan Kendra (KVK) guidance.

- **National Kisan Call Centre (Toll-Free)**: **1800-180-1551** (Available 6:00 AM – 10:00 PM across all Indian regional languages).
- **ICAR Technical Guidance**: Indian Council of Agricultural Research guidelines incorporated into all pesticide and nutrient recommendations.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
