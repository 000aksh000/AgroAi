"""
AgroSmart AI — Crop Recommendation Model Training Pipeline
Trains a calibrated RandomForestClassifier on agricultural soil and climatic parameters
for 22 crops common in Indian agriculture.
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split

# Crop profiles: (N_min, N_max, P_min, P_max, K_min, K_max, temp_min, temp_max, hum_min, hum_max, ph_min, ph_max, rain_min, rain_max)
CROP_PROFILES = {
    'rice': (60, 100, 35, 60, 35, 45, 20.0, 27.5, 80.0, 85.0, 5.0, 7.0, 180.0, 300.0),
    'maize': (60, 100, 35, 60, 15, 25, 18.0, 27.0, 55.0, 75.0, 5.5, 7.5, 60.0, 110.0),
    'chickpea': (20, 60, 55, 80, 75, 85, 17.0, 20.0, 14.0, 20.0, 5.9, 8.5, 65.0, 95.0),
    'kidneybeans': (15, 40, 55, 80, 15, 25, 15.0, 24.0, 18.0, 25.0, 5.5, 5.9, 60.0, 150.0),
    'pigeonpeas': (15, 40, 55, 80, 15, 25, 25.0, 35.0, 30.0, 65.0, 4.5, 7.5, 90.0, 200.0),
    'mothbeans': (15, 40, 35, 60, 15, 25, 24.0, 32.0, 40.0, 65.0, 5.0, 7.5, 30.0, 75.0),
    'mungbean': (15, 40, 35, 60, 15, 25, 27.0, 30.0, 80.0, 90.0, 6.2, 7.2, 35.0, 60.0),
    'blackgram': (35, 60, 55, 80, 15, 25, 25.0, 35.0, 60.0, 70.0, 6.5, 7.8, 60.0, 75.0),
    'lentil': (15, 40, 55, 80, 15, 25, 18.0, 30.0, 60.0, 70.0, 6.0, 7.5, 35.0, 55.0),
    'pomegranate': (15, 40, 10, 30, 35, 45, 18.0, 25.0, 85.0, 95.0, 5.5, 7.2, 100.0, 115.0),
    'banana': (80, 120, 70, 95, 45, 55, 25.0, 30.0, 75.0, 85.0, 5.5, 6.5, 90.0, 120.0),
    'mango': (15, 40, 15, 35, 25, 35, 27.0, 36.0, 45.0, 55.0, 4.5, 7.0, 90.0, 105.0),
    'grapes': (15, 40, 120, 145, 195, 205, 8.0, 42.0, 80.0, 85.0, 5.5, 6.5, 65.0, 75.0),
    'watermelon': (80, 120, 5, 30, 45, 55, 24.0, 27.0, 80.0, 90.0, 6.0, 7.0, 40.0, 60.0),
    'muskmelon': (80, 120, 5, 30, 45, 55, 27.0, 30.0, 90.0, 95.0, 6.0, 6.8, 20.0, 30.0),
    'apple': (15, 40, 120, 145, 195, 205, 21.0, 24.0, 90.0, 95.0, 5.5, 6.5, 100.0, 125.0),
    'orange': (15, 40, 5, 25, 5, 15, 10.0, 35.0, 90.0, 95.0, 6.0, 8.0, 100.0, 115.0),
    'papaya': (40, 70, 45, 70, 45, 55, 23.0, 44.0, 90.0, 95.0, 6.5, 7.0, 140.0, 250.0),
    'coconut': (15, 40, 5, 30, 25, 35, 25.0, 29.0, 90.0, 99.0, 5.5, 6.5, 130.0, 225.0),
    'cotton': (100, 140, 35, 60, 15, 25, 22.0, 26.0, 75.0, 85.0, 6.0, 8.0, 60.0, 100.0),
    'jute': (60, 100, 35, 60, 35, 45, 23.0, 27.0, 70.0, 90.0, 6.0, 7.5, 150.0, 200.0),
    'coffee': (80, 120, 15, 35, 25, 35, 23.0, 28.0, 50.0, 70.0, 6.0, 7.5, 115.0, 200.0),
}


def generate_synthetic_agri_dataset(samples_per_crop: int = 100, random_seed: int = 42) -> pd.DataFrame:
    """Generates realistic agronomic data points with natural Gaussian variance."""
    np.random.seed(random_seed)
    data = []

    for crop, ranges in CROP_PROFILES.items():
        n_min, n_max, p_min, p_max, k_min, k_max, t_min, t_max, h_min, h_max, ph_min, ph_max, r_min, r_max = ranges

        for _ in range(samples_per_crop):
            n = np.clip(np.random.normal((n_min + n_max) / 2, (n_max - n_min) / 4), n_min * 0.8, n_max * 1.2)
            p = np.clip(np.random.normal((p_min + p_max) / 2, (p_max - p_min) / 4), p_min * 0.8, p_max * 1.2)
            k = np.clip(np.random.normal((k_min + k_max) / 2, (k_max - k_min) / 4), k_min * 0.8, k_max * 1.2)
            temp = np.clip(np.random.normal((t_min + t_max) / 2, (t_max - t_min) / 4), t_min - 2, t_max + 2)
            hum = np.clip(np.random.normal((h_min + h_max) / 2, (h_max - h_min) / 4), 10.0, 100.0)
            ph = np.clip(np.random.normal((ph_min + ph_max) / 2, (ph_max - ph_min) / 4), 4.0, 9.0)
            rain = np.clip(np.random.normal((r_min + r_max) / 2, (r_max - r_min) / 4), 10.0, 400.0)

            data.append({
                'N': round(float(n), 2),
                'P': round(float(p), 2),
                'K': round(float(k), 2),
                'temperature': round(float(temp), 2),
                'humidity': round(float(hum), 2),
                'ph': round(float(ph), 2),
                'rainfall': round(float(rain), 2),
                'label': crop
            })

    return pd.DataFrame(data)


def train_and_save_crop_model(output_dir: str = '../models'):
    os.makedirs(output_dir, exist_ok=True)
    csv_path = os.path.join(output_dir, 'crop_recommendation_dataset.csv')

    print("Generating calibrated agricultural dataset for 22 crops...")
    df = generate_synthetic_agri_dataset(samples_per_crop=120, random_seed=42)
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated: {len(df)} samples across {df['label'].nunique()} crops saved to {csv_path}")

    features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[features]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f"Training set: {len(X_train)} samples, Test set: {len(X_test)} samples.")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=16,
        min_samples_split=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average='macro')
    report = classification_report(y_test, y_pred, output_dict=True)

    print(f"Model Training Complete! Accuracy: {acc * 100:.2f}%, Macro F1: {macro_f1:.4f}")

    # Save artifacts
    model_path = os.path.join(output_dir, 'crop_recommendation_model.joblib')
    joblib.dump(model, model_path)
    print(f"Trained model saved to: {model_path}")

    metadata = {
        'model_name': 'AgroSmart Crop Recommendation Random Forest',
        'model_version': '1.0.0',
        'algorithm': 'RandomForestClassifier',
        'n_estimators': 100,
        'features': features,
        'classes': sorted(list(df['label'].unique())),
        'num_classes': len(df['label'].unique()),
        'total_samples': len(df),
        'test_accuracy': round(float(acc), 4),
        'macro_f1': round(float(macro_f1), 4),
        'metrics_summary': {
            'accuracy': round(float(acc), 4),
            'macro_f1': round(float(macro_f1), 4),
        },
        'created_at': pd.Timestamp.now().isoformat()
    }

    meta_path = os.path.join(output_dir, 'crop_model_metadata.json')
    with open(meta_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Model metadata saved to: {meta_path}")

    return model, metadata


if __name__ == '__main__':
    train_and_save_crop_model(output_dir=os.path.join(os.path.dirname(__file__), '..', 'models'))
