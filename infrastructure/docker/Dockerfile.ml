# ==============================================================================
# AgroSmart AI — Python FastAPI Machine Learning Microservice Dockerfile
# ==============================================================================
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY services/ml/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY services/ml/ ./

# Train and cache initial models if not present
RUN python training/train_crop_model.py
RUN python training/train_disease_model.py

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
