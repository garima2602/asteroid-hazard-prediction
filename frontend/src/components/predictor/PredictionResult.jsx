import RiskBadge from "../common/RiskBadge.jsx";

export default function PredictionResult({ result, pending }) {
  if (!result) return null;

  const pct = Math.round(result.probability * 100);

  return (
    <div className={`transition-opacity ${pending ? "opacity-60" : "opacity-100"}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Hazard Probability</p>
          <p className="mt-1 text-4xl font-bold text-white">{pct}%</p>
        </div>
        <RiskBadge level={result.riskLevel} size="lg" />
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: result.riskColor }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-400">
        Classified as{" "}
        <span className="font-semibold text-white">
          {result.hazardous ? "Potentially Hazardous" : "Not Hazardous"}
        </span>{" "}
        by the model (threshold 50%).
      </p>

      {result.topContributors?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Top Contributing Factors</p>
          <ul className="space-y-1.5">
            {result.topContributors.map((c) => (
              <li key={c.feature} className="flex items-center gap-2 text-xs">
                <span className="w-40 shrink-0 truncate text-slate-400">{c.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <span
                    className="block h-full rounded-full bg-brand-500"
                    style={{
                      width: `${Math.min(100, (c.importance / (result.topContributors[0].importance || 1)) * 100)}%`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
