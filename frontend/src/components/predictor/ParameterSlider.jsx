export default function ParameterSlider({ label, unit, value, min, max, step, decimals, onChange }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={Number.isFinite(value) ? +value.toFixed(decimals) : ""}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-24 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-right text-sm text-white focus:border-brand-500 focus:outline-none"
          />
          {unit && <span className="text-xs text-slate-500">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="mt-1 flex justify-between text-[11px] text-slate-600">
        <span>{min.toFixed(decimals)}</span>
        <span>{max.toFixed(decimals)}</span>
      </div>
    </div>
  );
}
