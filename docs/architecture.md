# AgroAI — System Architecture

## 1. Overview
AgroAI is an end-to-end intelligent precision agriculture platform engineered for Indian farmers, agronomists, and agricultural researchers. The platform provides soil-driven crop recommendations, computer vision leaf disease diagnostics, hyperlocal agricultural weather advisories with spraying suitability indices, APMC mandi live market price tracking, and conversational AI assistance.

## 2. High-Level Architecture Diagram
```
                     +---------------------------------------+
                     |         React 18 + Vite 6 Web App     |
                     |  (Dark Vintage Botanical, Recharts)   |
                     +---------------------------------------+
                                         |
                                         | HTTPS / REST (JSON)
                                         v
                     +---------------------------------------+
                     |         Node.js Express REST API      |
                     |  (JWT Auth, Zod Validation, Mongoose) |
                     +---------------------------------------+
                           |             |             |
           +---------------+             |             +---------------+
           |                             v                             |
           v                 +-----------------------+                 v
+---------------------+      |   MongoDB Database    |      +---------------------+
| External Weather    |      | (Users, Farms, Recs,  |      | Python FastAPI ML   |
| & Mandi Services    |      | Diagnoses, Chats, Log)|      | Microservice        |
| - Open-Meteo API    |      +-----------------------+      | - Scikit-Learn RF   |
| - APMC Agmarknet    |                                     | - Image Pathology   |
+---------------------+                                     | - Agri Knowledge    |
                                                            +---------------------+
```

## 3. Component Breakdown

### Frontend (`apps/web`)
- **Framework**: React 18 with Vite 6 in modern JavaScript (ES Modules / JSX).
- **Styling**: Tailwind CSS with custom **Dark Vintage Botanical** design tokens:
  - Deep Forest Shadow (`#101B16`)
  - Rich Dark Foliage (`#18251D`)
  - Slate Green Card Background (`#202B22`)
  - Antique Gold & Brass (`#B69A62` / `#D4BE8D`)
  - Rich Agricultural Soil (`#79563C`)
  - Parchment Ivory (`#F0EBDD`)
  - Muted Moss Green (`#71805A`)
- **Typography**: Editorial serif headings (`Playfair Display`, `DM Serif Display`) with modern sans-serif (`Inter`) for metrics and forms.
- **Routing**: React Router with protected shells (`/dashboard`, `/farms`, `/crop-recommendation`, `/disease-detection`, `/weather`, `/mandi-prices`, `/assistant`, `/history`, `/profile`, `/admin`).
- **Data Fetching & Caching**: TanStack Query (`@tanstack/react-query`) with automatic background refetching and cache invalidation.
- **Visual Analytics**: Recharts for 7-day temperature curves, precipitation volume bars, and mandi commodity modal price history lines.

### Backend (`apps/api`)
- **Runtime**: Node.js 20+ with Express.js in modern JavaScript (ES Modules).
- **Database Layer**: Mongoose 8 connecting to MongoDB Atlas or local MongoDB, with automatic zero-configuration fallback to `mongodb-memory-server` in development.
- **Authentication**: JWT access tokens (15m expiry) and secure refresh tokens (7d expiry) rotated upon renewal and revocable on logout.
- **Security Middleware**: Helmet security headers, CORS origin whitelisting, Zod payload validation, request IDs (`X-Request-Id`), and centralized error handling.
- **Documentation**: Interactive OpenAPI / Swagger UI served at `/docs`.

### Machine Learning Service (`services/ml`)
- **Framework**: Python 3.11+ with FastAPI and Uvicorn.
- **Crop Model**: Calibrated `RandomForestClassifier` trained on 2,640 samples across 22 Indian agricultural crops (rice, wheat, cotton, chickpea, maize, etc.) achieving 99.6% validation accuracy.
- **Plant Pathology Engine**: Image feature extraction pipeline (RGB/HSV color distributions, ExG chlorophyll index, texture edge gradients, necrotic ratio) classifying 15 key Indian plant diseases with organic and chemical remedies.
- **Assistant Adapter**: Provider-independent LLM connector supporting Gemini 1.5, OpenAI, or local agronomic domain fallback knowledge engine.

### Shared Monorepo Packages
- `@agrosmart/shared-types`: Common TypeScript interfaces ensuring type consistency across frontend and backend.
- `@agrosmart/shared-validation`: Common Zod validation schemas for registration, login, farm plot creation, and crop recommendation inputs.
