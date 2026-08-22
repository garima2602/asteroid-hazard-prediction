import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Header from "../components/layout/Header.jsx";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import StatTile from "../components/common/StatTile.jsx";
import ConfusionMatrix from "../components/insights/ConfusionMatrix.jsx";
import RocChart from "../components/insights/RocChart.jsx";
import FeatureImportanceChart from "../components/insights/FeatureImportanceChart.jsx";
import { getMetrics, getFeatureImportance } from "../api/client.js";

export default function Insights() {
  const [metrics, setMetrics] = useState(null);
  const [importance, setImportance] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getMetrics(), getFeatureImportance()])
      .then(([m, i]) => {
        setMetrics(m);
        setImportance(i);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Model Insights" subtitle="Performance and explainability for the hazard classifier" />
        <ErrorState />
      </div>
    );
  }

  if (!metrics || !importance) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Model Insights" subtitle="Performance and explainability for the hazard classifier" />
        <Loader label="Loading model metrics..." />
      </div>
    );
  }

  const top = importance[0];

  return (
    <div className="flex h-full flex-col">
      <Header title="Model Insights" subtitle={`${metrics.modelType} · trained on ${metrics.trainSize.toLocaleString()} objects, tested on ${metrics.testSize.toLocaleString()}`} />

      <div className="space-y-5 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <StatTile label="Accuracy" value={`${(metrics.accuracy * 100).toFixed(1)}%`} />
          <StatTile label="Precision" value={`${(metrics.precision * 100).toFixed(1)}%`} />
          <StatTile label="Recall" value={`${(metrics.recall * 100).toFixed(1)}%`} />
          <StatTile label="F1 Score" value={`${(metrics.f1 * 100).toFixed(1)}%`} />
          <StatTile label="ROC-AUC" value={metrics.rocAuc.toFixed(3)} accent="text-brand-400" />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-brand-500/25 bg-brand-500/10 px-4 py-3 text-sm text-slate-300">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
          <p>
            <span className="font-semibold text-white">{top.label}</span> dominates the model's decisions — this
            matches NASA's official Potentially Hazardous Asteroid criteria, which flag objects with a Minimum
            Orbit Intersection Distance under 0.05 AU and an absolute magnitude brighter than 22. The classifier
            has effectively rediscovered that rule from data alone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card title="ROC Curve" description="Tradeoff between true and false positive rate">
            <RocChart points={metrics.rocCurve} rocAuc={metrics.rocAuc} />
          </Card>
          <Card title="Confusion Matrix" description="Predictions vs. actual labels on the held-out test set">
            <ConfusionMatrix matrix={metrics.confusionMatrix} />
          </Card>
        </div>

        <Card title="Feature Importance" description="Which inputs drive the hazard classification most">
          <FeatureImportanceChart data={importance} />
        </Card>
      </div>
    </div>
  );
}
