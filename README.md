# 🚀 Asteroid Hazard Prediction using Machine Learning

## 📌 Overview
This project predicts whether a Near-Earth Object (asteroid) is hazardous or not using machine learning models trained on NASA data.

The goal is to build an end-to-end ML pipeline that can assist in identifying potentially dangerous asteroids based on their physical and orbital characteristics.

## 📌 Key Learnings
Handling imbalanced datasets using SMOTE
Comparing multiple ML models
Feature importance analysis
Building an end-to-end ML pipeline

---

## 📊 Dataset
- Source: NASA Near-Earth Object (NEO) dataset
- Total Records: ~4687
- Total Features: 40

### Key Features:
- Absolute Magnitude (brightness)
- Estimated Diameter
- Relative Velocity
- Orbital Period
- Perihelion Distance
- Mean Motion

### Target Variable:
- `pha` → Potentially Hazardous Asteroid (Y/N)

---

## ⚙️ Project Pipeline

Data → Cleaning → Feature Engineering → Encoding → Scaling → SMOTE → Model Training → Evaluation

---

## ⚖️ Handling Imbalanced Data
The dataset was highly imbalanced (very few hazardous asteroids).

To address this:
- Applied **SMOTE (Synthetic Minority Oversampling Technique)**  
- Balanced classes before training

---

## 🧠 Models Used
- Logistic Regression  
- Random Forest  
- LightGBM  

---

## 📈 Results

### Logistic Regression
- Accuracy: 99.25%
- Precision: 0.70
- Recall: 0.95
- F1 Score: 0.78

### Random Forest (Best Model)
- Accuracy: 99.89%
- Precision: 0.95
- Recall: 0.95
- F1 Score: 0.95

### LightGBM
- High performance with tuned parameters

---

## 📊 Feature Importance (Random Forest)
Top features influencing predictions:
- MOID (Minimum Orbit Intersection Distance)
- Orbital Eccentricity
- Semi-major Axis
- Absolute Magnitude

---

## 🛠️ Tech Stack
- Python  
- Pandas, NumPy  
- Scikit-learn  
- LightGBM  
- Imbalanced-learn (SMOTE)  
- Matplotlib, Seaborn  

---

## 📂 Project Structure

asteroid-hazard-prediction/
│── data/
│── notebooks/
│── README.md
│── requirements.txt


---

## ▶️ How to Run

```bash
git clone https://github.com/garima2602/asteroid-hazard-prediction.git
cd asteroid-hazard-prediction
pip install -r requirements.txt
jupyter notebook


