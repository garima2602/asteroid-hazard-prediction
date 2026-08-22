import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Header from "../components/layout/Header.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ParameterSlider from "../components/predictor/ParameterSlider.jsx";
import PredictionResult from "../components/predictor/PredictionResult.jsx";
import { getFeatureRanges, postPrediction } from "../api/client.js";
import { FEATURE_CONFIG, stepFor } from "../lib/featureConfig.js";

const PRESETS = {
  "Typical NEO": null, // filled from ranges.mean once loaded
  "Large & Close (Chelyabinsk-class+)": {
    absolute_magnitude: 20.5,
    est_diameter_min_km: 0.9,
    est_diameter_max_km: 2.1,
    relative_velocity_kph: 70000,
    miss_distance_km: 250000,
    orbital_period_days: 650,
    semi_major_axis_au: 1.5,
    eccentricity: 0.55,
    inclination_deg: 12,
    min_orbit_intersection_au: 0.015,
  },
  "Small & Distant": {
    absolute_magnitude: 27,
    est_diameter_min_km: 0.03,
    est_diameter_max_km: 0.07,
    relative_velocity_kph: 25000,
    miss_distance_km: 55000000,
    orbital_period_days: 450,
    semi_major_axis_au: 1.1,
    eccentricity: 0.2,
    inclination_deg: 5,
    min_orbit_intersection_au: 0.25,
  },
};

export default function Predictor() {
  const [ranges, setRanges] = useState(null);
  const [values, setValues] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    getFeatureRanges()
      .then((data) => {
        setRanges(data);
        const initial = Object.fromEntries(
          Object.entries(data).map(([key, r]) => [key, r.mean]),
        );
        setValues(initial);
      })
      .catch(() => setError("ranges"));
  }, []);

  const runPrediction = useCallback((payload) => {
    setPending(true);
    postPrediction(payload)
      .then((data) => {
        setResult(data);
        setError(null);
      })
      .catch(() => setError("predict"))
      .finally(() => setPending(false));
  }, []);

  useEffect(() => {
    if (!values) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runPrediction(values), 250);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const groups = useMemo(() => {
    const map = {};
    for (const cfg of FEATURE_CONFIG) {
      map[cfg.group] = map[cfg.group] || [];
      map[cfg.group].push(cfg);
    }
    return map;
  }, []);

  const applyPreset = (name) => {
    if (!ranges) return;
    if (name === "Typical NEO") {
      setValues(Object.fromEntries(Object.entries(ranges).map(([key, r]) => [key, r.mean])));
    } else {
      setValues(PRESETS[name]);
    }
  };

  if (error === "ranges") {
    return (
      <div className="flex h-full flex-col">
        <Header title="Hazard Predictor" subtitle="Real-time potentially-hazardous-asteroid scoring" />
        <ErrorState />
      </div>
    );
  }

  if (!ranges || !values) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Hazard Predictor" subtitle="Real-time potentially-hazardous-asteroid scoring" />
        <Loader label="Loading model parameters..." />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Hazard Predictor"
        subtitle="Adjust an asteroid's physical and orbital parameters to see live hazard classification"
      />

      <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-brand-500/50 hover:text-brand-400"
              >
                {name}
              </button>
            ))}
          </div>

          {Object.entries(groups).map(([group, fields]) => (
            <Card key={group} title={group}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map((cfg) => {
                  const range = ranges[cfg.key];
                  return (
                    <ParameterSlider
                      key={cfg.key}
                      label={range.label}
                      unit={cfg.unit}
                      decimals={cfg.decimals}
                      min={range.min}
                      max={range.max}
                      step={stepFor(range)}
                      value={values[cfg.key]}
                      onChange={(v) =>
                        setValues((prev) => ({ ...prev, [cfg.key]: Number.isNaN(v) ? prev[cfg.key] : v }))
                      }
                    />
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card title="Prediction">
            {error === "predict" ? (
              <ErrorState message="Prediction request failed." />
            ) : (
              <PredictionResult result={result} pending={pending} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
