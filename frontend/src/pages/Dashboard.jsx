import { useEffect, useState } from "react";
import Header from "../components/layout/Header.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import StatTile from "../components/common/StatTile.jsx";
import ClassBalanceChart from "../components/dashboard/ClassBalanceChart.jsx";
import DistributionChart from "../components/dashboard/DistributionChart.jsx";
import CorrelationHeatmap from "../components/dashboard/CorrelationHeatmap.jsx";
import { getEda } from "../api/client.js";
import { FEATURE_KEYS } from "../lib/featureConfig.js";

export default function Dashboard() {
  const [eda, setEda] = useState(null);
  const [error, setError] = useState(false);
  const [feature, setFeature] = useState(FEATURE_KEYS[0]);

  useEffect(() => {
    getEda()
      .then(setEda)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <Header title="EDA Dashboard" subtitle="Distributions and correlations across the NASA NEO dataset" />
        <ErrorState />
      </div>
    );
  }

  if (!eda) {
    return (
      <div className="flex h-full flex-col">
        <Header title="EDA Dashboard" subtitle="Distributions and correlations across the NASA NEO dataset" />
        <Loader label="Loading dataset statistics..." />
      </div>
    );
  }

  const distribution = eda.distributions[feature];

  return (
    <div className="flex h-full flex-col">
      <Header title="EDA Dashboard" subtitle="Distributions and correlations across the NASA NEO dataset" />

      <div className="space-y-5 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Total Objects" value={eda.rowCount.toLocaleString()} />
          <StatTile label="Hazardous" value={eda.classCounts.hazardous.toLocaleString()} accent="text-hazard-critical" />
          <StatTile
            label="Non-Hazardous"
            value={eda.classCounts.nonHazardous.toLocaleString()}
            accent="text-brand-400"
          />
          <StatTile
            label="Hazardous Share"
            value={`${((eda.classCounts.hazardous / eda.rowCount) * 100).toFixed(1)}%`}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card title="Class Balance" description="Hazardous vs. non-hazardous objects in the dataset">
            <ClassBalanceChart classCounts={eda.classCounts} />
          </Card>

          <Card
            title="Feature Distribution"
            description="Histogram split by hazard classification"
            actions={
              <select
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 focus:border-brand-500 focus:outline-none"
              >
                {FEATURE_KEYS.map((key) => (
                  <option key={key} value={key} className="bg-space-900">
                    {eda.distributions[key].label}
                  </option>
                ))}
              </select>
            }
          >
            <DistributionChart distribution={distribution} />
          </Card>
        </div>

        <Card
          title="Feature Correlation Matrix"
          description="Pearson correlation between orbital and physical features"
        >
          <CorrelationHeatmap correlation={eda.correlation} />
        </Card>
      </div>
    </div>
  );
}
