"""
Trains the asteroid hazard classifier and precomputes every artifact the API
serves statically (metrics, feature importance, EDA data).

Source data: NASA NEO dataset (backend/data/nasa.csv), the same dataset used
in asteroidhazard.ipynb, kept in its original (un-trimmed) column form so we
can expose the physically meaningful features the frontend needs: diameter,
velocity, miss distance, magnitude and orbital elements.

Run once (or whenever data/nasa.csv changes):
    python train.py
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve,
    confusion_matrix,
)

ROOT = Path(__file__).parent
DATA_PATH = ROOT / "data" / "nasa.csv"
ARTIFACTS_DIR = ROOT / "artifacts"
ARTIFACTS_DIR.mkdir(exist_ok=True)

# Raw NASA column -> clean feature key exposed through the API / frontend.
FEATURE_MAP = {
    "Absolute Magnitude": "absolute_magnitude",
    "Est Dia in KM(min)": "est_diameter_min_km",
    "Est Dia in KM(max)": "est_diameter_max_km",
    "Relative Velocity km per hr": "relative_velocity_kph",
    "Miss Dist.(kilometers)": "miss_distance_km",
    "Orbital Period": "orbital_period_days",
    "Semi Major Axis": "semi_major_axis_au",
    "Eccentricity": "eccentricity",
    "Inclination": "inclination_deg",
    "Minimum Orbit Intersection": "min_orbit_intersection_au",
}
FEATURE_KEYS = list(FEATURE_MAP.values())

FEATURE_LABELS = {
    "absolute_magnitude": "Absolute Magnitude (H)",
    "est_diameter_min_km": "Est. Diameter Min (km)",
    "est_diameter_max_km": "Est. Diameter Max (km)",
    "relative_velocity_kph": "Relative Velocity (km/h)",
    "miss_distance_km": "Miss Distance (km)",
    "orbital_period_days": "Orbital Period (days)",
    "semi_major_axis_au": "Semi-Major Axis (AU)",
    "eccentricity": "Eccentricity",
    "inclination_deg": "Inclination (deg)",
    "min_orbit_intersection_au": "Min. Orbit Intersection Distance (AU)",
}


def load_dataset() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df = df.rename(columns=FEATURE_MAP)
    df["hazardous"] = df["Hazardous"].astype(bool).astype(int)
    keep = FEATURE_KEYS + ["hazardous"]
    df = df[keep].dropna()
    return df


def build_histogram(values: np.ndarray, edges: np.ndarray) -> dict:
    counts, _ = np.histogram(values, bins=edges)
    return {
        "counts": counts.tolist(),
        "binEdges": [round(float(e), 4) for e in edges],
    }


def main():
    df = load_dataset()

    X = df[FEATURE_KEYS]
    y = df["hazardous"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train_scaled, y_train)

    pred = model.predict(X_test_scaled)
    proba = model.predict_proba(X_test_scaled)[:, 1]

    fpr, tpr, _ = roc_curve(y_test, proba)
    # Downsample ROC curve points for a lightweight chart payload.
    roc_idx = np.linspace(0, len(fpr) - 1, min(60, len(fpr))).astype(int)

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, pred)), 4),
        "precision": round(float(precision_score(y_test, pred)), 4),
        "recall": round(float(recall_score(y_test, pred)), 4),
        "f1": round(float(f1_score(y_test, pred)), 4),
        "rocAuc": round(float(roc_auc_score(y_test, proba)), 4),
        "confusionMatrix": confusion_matrix(y_test, pred).tolist(),  # [[TN, FP], [FN, TP]]
        "rocCurve": [
            {"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)}
            for i in roc_idx
        ],
        "trainSize": int(len(X_train)),
        "testSize": int(len(X_test)),
        "modelType": "RandomForestClassifier",
    }

    importance = sorted(
        (
            {"feature": key, "label": FEATURE_LABELS[key], "importance": round(float(imp), 4)}
            for key, imp in zip(FEATURE_KEYS, model.feature_importances_)
        ),
        key=lambda r: r["importance"],
        reverse=True,
    )

    # --- EDA payload ---
    class_counts = df["hazardous"].value_counts().to_dict()
    distributions = {}
    for key in FEATURE_KEYS:
        shared_edges = np.histogram_bin_edges(df[key].values, bins=20)
        distributions[key] = {
            "label": FEATURE_LABELS[key],
            "hazardous": build_histogram(df.loc[df["hazardous"] == 1, key].values, shared_edges),
            "nonHazardous": build_histogram(df.loc[df["hazardous"] == 0, key].values, shared_edges),
            "min": round(float(df[key].min()), 6),
            "max": round(float(df[key].max()), 6),
            "mean": round(float(df[key].mean()), 6),
            "median": round(float(df[key].median()), 6),
        }

    corr = df[FEATURE_KEYS].corr().round(3)
    correlation = {
        "features": FEATURE_KEYS,
        "labels": [FEATURE_LABELS[k] for k in FEATURE_KEYS],
        "matrix": corr.values.tolist(),
    }

    eda = {
        "rowCount": int(len(df)),
        "classCounts": {
            "hazardous": int(class_counts.get(1, 0)),
            "nonHazardous": int(class_counts.get(0, 0)),
        },
        "distributions": distributions,
        "correlation": correlation,
    }

    feature_ranges = {
        key: {
            "min": round(float(df[key].min()), 6),
            "max": round(float(df[key].max()), 6),
            "mean": round(float(df[key].mean()), 6),
            "median": round(float(df[key].median()), 6),
            "std": round(float(df[key].std()), 6),
            "label": FEATURE_LABELS[key],
        }
        for key in FEATURE_KEYS
    }

    # --- persist artifacts ---
    joblib.dump(
        {"model": model, "scaler": scaler, "feature_keys": FEATURE_KEYS},
        ARTIFACTS_DIR / "model.pkl",
    )
    (ARTIFACTS_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))
    (ARTIFACTS_DIR / "feature_importance.json").write_text(json.dumps(importance, indent=2))
    (ARTIFACTS_DIR / "eda.json").write_text(json.dumps(eda, indent=2))
    (ARTIFACTS_DIR / "feature_ranges.json").write_text(json.dumps(feature_ranges, indent=2))

    print(f"Trained on {len(df)} rows ({class_counts.get(1, 0)} hazardous / {class_counts.get(0, 0)} non-hazardous)")
    print(f"Accuracy={metrics['accuracy']}  ROC-AUC={metrics['rocAuc']}  F1={metrics['f1']}")
    print(f"Artifacts written to {ARTIFACTS_DIR}")


if __name__ == "__main__":
    main()
