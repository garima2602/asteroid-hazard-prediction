export default function ConfusionMatrix({ matrix }) {
  const [[tn, fp], [fn, tp]] = matrix;
  const total = tn + fp + fn + tp;

  const cells = [
    { label: "True Negative", value: tn, tone: "bg-brand-500/20 text-brand-300 border-brand-500/30" },
    { label: "False Positive", value: fp, tone: "bg-hazard-moderate/20 text-hazard-moderate border-hazard-moderate/30" },
    { label: "False Negative", value: fn, tone: "bg-hazard-moderate/20 text-hazard-moderate border-hazard-moderate/30" },
    { label: "True Positive", value: tp, tone: "bg-hazard-critical/20 text-hazard-critical border-hazard-critical/30" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((c) => (
          <div key={c.label} className={`rounded-lg border px-4 py-4 text-center ${c.tone}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide opacity-80">{c.label}</p>
            <p className="text-[11px] opacity-60">{((c.value / total) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between px-1 text-[11px] text-slate-500">
        <span>Predicted →</span>
        <span>Non-Hazardous | Hazardous</span>
      </div>
    </div>
  );
}
