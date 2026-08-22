// Display metadata for each model feature, keyed the same as the backend's
// FEATURE_KEYS. Order here controls the order fields render in the form.
export const FEATURE_CONFIG = [
  { key: "absolute_magnitude", unit: "H", decimals: 1, group: "Physical" },
  { key: "est_diameter_min_km", unit: "km", decimals: 3, group: "Physical" },
  { key: "est_diameter_max_km", unit: "km", decimals: 3, group: "Physical" },
  { key: "relative_velocity_kph", unit: "km/h", decimals: 0, group: "Approach" },
  { key: "miss_distance_km", unit: "km", decimals: 0, group: "Approach" },
  { key: "orbital_period_days", unit: "days", decimals: 1, group: "Orbit" },
  { key: "semi_major_axis_au", unit: "AU", decimals: 3, group: "Orbit" },
  { key: "eccentricity", unit: "", decimals: 3, group: "Orbit" },
  { key: "inclination_deg", unit: "°", decimals: 2, group: "Orbit" },
  { key: "min_orbit_intersection_au", unit: "AU", decimals: 4, group: "Orbit" },
];

export const FEATURE_KEYS = FEATURE_CONFIG.map((f) => f.key);

export function stepFor(range) {
  const span = range.max - range.min;
  const raw = span / 500;
  if (raw === 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  return Math.max(magnitude, 0.0001);
}
