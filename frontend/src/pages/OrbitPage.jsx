import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import Header from "../components/layout/Header.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import ParameterSlider from "../components/predictor/ParameterSlider.jsx";
import OrbitScene from "../components/orbit/OrbitScene.jsx";
import { getFeatureRanges } from "../api/client.js";
import { stepFor } from "../lib/featureConfig.js";
import { MOON_DISTANCE_KM } from "../lib/orbitScale.js";

export default function OrbitPage() {
  const [ranges, setRanges] = useState(null);
  const [error, setError] = useState(false);
  const [missDistanceKm, setMissDistanceKm] = useState(null);
  const [velocityKph, setVelocityKph] = useState(null);
  const [diameterKm, setDiameterKm] = useState(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    getFeatureRanges()
      .then((data) => {
        setRanges(data);
        setMissDistanceKm(data.miss_distance_km.mean);
        setVelocityKph(data.relative_velocity_kph.mean);
        setDiameterKm(data.est_diameter_max_km.mean);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Orbit Viewer" subtitle="Conceptual close-approach visualization" />
        <ErrorState />
      </div>
    );
  }

  if (!ranges) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Orbit Viewer" subtitle="Conceptual close-approach visualization" />
        <Loader label="Loading orbital parameters..." />
      </div>
    );
  }

  const lunarMultiple = (missDistanceKm / MOON_DISTANCE_KM).toFixed(2);

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Orbit Viewer"
        subtitle="A conceptual, log-scaled visualization of an asteroid's closest approach to Earth — not to true scale"
      />

      <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-6 lg:grid-cols-[1fr_340px]">
        <Card className="flex flex-col overflow-hidden p-0">
          <div className="h-[520px] w-full">
            <OrbitScene
              missDistanceKm={missDistanceKm}
              velocityKph={velocityKph}
              diameterKm={diameterKm}
              playing={playing}
            />
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-xs text-slate-400">
            <span>
              Miss distance ≈ <span className="text-white">{lunarMultiple}×</span> the Earth-Moon distance
            </span>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 hover:text-brand-400"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Approach Parameters">
            <div className="space-y-5">
              <ParameterSlider
                label="Miss Distance"
                unit="km"
                decimals={0}
                min={ranges.miss_distance_km.min}
                max={ranges.miss_distance_km.max}
                step={stepFor(ranges.miss_distance_km)}
                value={missDistanceKm}
                onChange={setMissDistanceKm}
              />
              <ParameterSlider
                label="Relative Velocity"
                unit="km/h"
                decimals={0}
                min={ranges.relative_velocity_kph.min}
                max={ranges.relative_velocity_kph.max}
                step={stepFor(ranges.relative_velocity_kph)}
                value={velocityKph}
                onChange={setVelocityKph}
              />
              <ParameterSlider
                label="Estimated Diameter"
                unit="km"
                decimals={3}
                min={ranges.est_diameter_max_km.min}
                max={ranges.est_diameter_max_km.max}
                step={stepFor(ranges.est_diameter_max_km)}
                value={diameterKm}
                onChange={setDiameterKm}
              />
            </div>
          </Card>

          <Card title="Reading the Scene" className="text-xs leading-relaxed text-slate-400">
            <ul className="list-inside list-disc space-y-1.5">
              <li>Distances are log-scaled so both Earth and multi-million-km approaches fit in view.</li>
              <li>The dashed ring marks the Moon's average orbital distance (384,400 km) for scale.</li>
              <li>The orange dot marks the point of closest approach along the flyby path.</li>
              <li>Drag to orbit the camera, scroll to zoom.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
