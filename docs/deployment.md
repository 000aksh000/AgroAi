# AgroSmart AI — Deployment & Infrastructure Guide

## 1. Deployment Topology
AgroSmart AI is designed as a decoupled full-stack architecture that can be deployed across modern cloud platforms:

- **Frontend (`apps/web`)**: Vercel, Netlify, AWS CloudFront + S3, or Nginx container.
- **Backend API (`apps/api`)**: Render, Railway, AWS ECS, or DigitalOcean App Platform.
- **Machine Learning Service (`services/ml`)**: Render Web Service, Railway, AWS ECS, or Fly.io with Python 3.11+.
- **Database**: MongoDB Atlas (M0 Free Tier or Dedicated Cluster).

---

## 2. Docker Compose Deployment (Local & Single-Server)

To launch the entire stack (Database, ML Service, Node API, and React Web) locally or on a virtual private server (VPS):

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Build and launch all containers
docker compose up --build -d

# 3. Verify container status
docker compose ps
```

Services will be accessible at:
- Web Application: `http://localhost:5173`
- Node.js REST API: `http://localhost:5000`
- API Documentation: `http://localhost:5000/docs`
- Python ML Microservice: `http://localhost:8000`
- MongoDB Database: `localhost:27017`

---

## 3. Cloud Deployment Instructions

### A. MongoDB Atlas
1. Create a free cluster on MongoDB Atlas.
2. Under "Network Access", add your deployment server IPs or `0.0.0.0/0`.
3. Under "Database Access", create a user with read/write permissions.
4. Copy connection string to `MONGODB_URI` in `.env`.

### B. Python ML Service (Render / Railway)
- **Root Directory**: `services/ml`
- **Build Command**: `pip install -r requirements.txt && python training/train_crop_model.py && python training/train_disease_model.py`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `PYTHONUNBUFFERED=1`
  - `GEMINI_API_KEY` (optional)

### C. Node.js API (Render / Railway)
- **Root Directory**: Workspace root
- **Build Command**:
  ```bash
  npm install && npm run build --workspace=@agrosmart/shared-types && npm run build --workspace=@agrosmart/shared-validation && npm run build --workspace=@agrosmart/api
  ```
- **Start Command**: `node apps/api/dist/index.js`
- **Environment Variables**:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI=your_atlas_connection_string`
  - `ML_SERVICE_URL=https://your-ml-service.onrender.com`
  - `CLIENT_ORIGIN=https://your-frontend.vercel.app`
  - `JWT_ACCESS_SECRET=min_32_characters_secret`
  - `JWT_REFRESH_SECRET=min_32_characters_secret`

### D. React Frontend (Vercel)
- **Framework Preset**: Vite
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL=https://your-api.onrender.com/api/v1`

---

## 4. Database Backup & Restore

### Backup
```bash
mongodump --uri="mongodb://localhost:27017/agrosmart_ai" --out="./backup-$(date +%F)"
```

### Restore
```bash
mongorestore --uri="mongodb://localhost:27017/agrosmart_ai" ./backup-folder/agrosmart_ai
```
