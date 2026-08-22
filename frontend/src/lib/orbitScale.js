// Maps real-world kilometers onto a compact, log-scaled scene radius so an
// Earth-radius-sized object and a 74-million-km miss distance can share the
// same 3D scene. Purely illustrative — not to true scale.
const EARTH_RADIUS_KM = 6371;
const MIN_KM = EARTH_RADIUS_KM;
const MAX_KM = 80_000_000;
const MIN_SCENE_RADIUS = 1.6;
const MAX_SCENE_RADIUS = 9.5;

export const MOON_DISTANCE_KM = 384_400;

export function kmToSceneRadius(km) {
  const clamped = Math.min(Math.max(km, MIN_KM), MAX_KM);
  const t = (Math.log10(clamped) - Math.log10(MIN_KM)) / (Math.log10(MAX_KM) - Math.log10(MIN_KM));
  return MIN_SCENE_RADIUS + t * (MAX_SCENE_RADIUS - MIN_SCENE_RADIUS);
}

export function velocityToAnimSpeed(kph) {
  const MIN_KPH = 1000;
  const MAX_KPH = 170000;
  const clamped = Math.min(Math.max(kph, MIN_KPH), MAX_KPH);
  const t = (clamped - MIN_KPH) / (MAX_KPH - MIN_KPH);
  return 0.05 + t * 0.35; // fraction of the flyby path traveled per second
}

export function diameterToSceneSize(km) {
  const MIN_KM = 0.01;
  const MAX_KM = 35;
  const clamped = Math.min(Math.max(km, MIN_KM), MAX_KM);
  const t = (Math.log10(clamped) - Math.log10(MIN_KM)) / (Math.log10(MAX_KM) - Math.log10(MIN_KM));
  return 0.05 + t * 0.35;
}
