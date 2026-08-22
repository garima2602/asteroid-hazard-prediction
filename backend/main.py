"""
FastAPI server exposing the trained asteroid hazard model plus the
precomputed metrics/EDA artifacts produced by train.py.

Run:
    uvicorn main:app --reload --port 8000
"""
import json
import os
from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import PredictionRequest, PredictionResponse, FeatureContribution

ROOT = Path(__file__).parent
ARTIFACTS_DIR = ROOT / "artifacts"

app = FastAPI(title="Asteroid Hazard Prediction API", version="1.0.0")

# Comma-separated list of extra allowed origins, e.g. your deployed frontend:
# ALLOWED_ORIGINS=https://your-app.vercel.app
extra_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", *extra_origins],
    allow_methods=["*"],
    allow_headers=["*"],
)

RISK_BANDS = [
    (0.25, "Low", "#22c55e"),
    (0.5, "Moderate", "#eab308"),
    (0.75, "High", "#f97316"),
    (1.01, "Critical", "#ef4444"),
]


def risk_for(probability: float) -> tuple[str, str]:
    for threshold, label, color in RISK_BANDS:
        if probability < threshold:
            return label, color
    return "Critical", "#ef4444"


class ModelStore:
    def __init__(self):
        bundle = joblib.load(ARTIFACTS_DIR / "model.pkl")
        self.model = bundle["model"]
        self.scaler = bundle["scaler"]
        self.feature_keys: list[str] = bundle["feature_keys"]
        self.metrics = json.loads((ARTIFACTS_DIR / "metrics.json").read_text())
        self.feature_importance = json.loads((ARTIFACTS_DIR / "feature_importance.json").read_text())
        self.eda = json.loads((ARTIFACTS_DIR / "eda.json").read_text())
        self.feature_ranges = json.loads((ARTIFACTS_DIR / "feature_ranges.json").read_text())
        self.importance_by_feature = {row["feature"]: row for row in self.feature_importance}


store: ModelStore | None = None


@app.on_event("startup")
def load_artifacts():
    global store
    try:
        store = ModelStore()
    except FileNotFoundError as exc:
        raise RuntimeError(
            "Model artifacts not found. Run `python train.py` from the backend/ "
            "directory before starting the API."
        ) from exc


@app.get("/api/health")
def health():
    return {"status": "ok", "modelLoaded": store is not None}


@app.get("/api/feature-ranges")
def feature_ranges():
    return store.feature_ranges


@app.get("/api/metrics")
def metrics():
    return store.metrics


@app.get("/api/feature-importance")
def feature_importance():
    return store.feature_importance


@app.get("/api/eda")
def eda():
    return store.eda


@app.post("/api/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    if store is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    row = payload.model_dump()
    ordered = np.array([[row[key] for key in store.feature_keys]])
    scaled = store.scaler.transform(ordered)

    probability = float(store.model.predict_proba(scaled)[0, 1])
    hazardous = probability >= 0.5
    risk_level, risk_color = risk_for(probability)

    # Lightweight, model-agnostic contribution proxy: how far (in std units)
    # each input sits from the training-set mean, weighted by that feature's
    # global importance in the forest.
    contributions = []
    for key in store.feature_keys:
        rng = store.feature_ranges[key]
        std = rng["std"] or 1.0
        z = abs(row[key] - rng["mean"]) / std
        weight = store.importance_by_feature[key]["importance"]
        contributions.append(
            FeatureContribution(
                feature=key,
                label=rng["label"],
                value=row[key],
                importance=round(weight * z, 4),
            )
        )
    contributions.sort(key=lambda c: c.importance, reverse=True)

    return PredictionResponse(
        hazardous=hazardous,
        probability=round(probability, 4),
        riskLevel=risk_level,
        riskColor=risk_color,
        topContributors=contributions[:4],
    )
