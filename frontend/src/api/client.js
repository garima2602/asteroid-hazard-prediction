import axios from "axios";

// In dev, Vite proxies "/api" to the local FastAPI server (see vite.config.js).
// In production, set VITE_API_BASE_URL to the deployed backend's URL, e.g.
// https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
});

export const getFeatureRanges = () => api.get("/feature-ranges").then((r) => r.data);
export const getMetrics = () => api.get("/metrics").then((r) => r.data);
export const getFeatureImportance = () => api.get("/feature-importance").then((r) => r.data);
export const getEda = () => api.get("/eda").then((r) => r.data);
export const postPrediction = (payload) => api.post("/predict", payload).then((r) => r.data);
