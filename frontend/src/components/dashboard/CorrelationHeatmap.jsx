function colorFor(value) {
  // Diverging scale: negative -> blue, positive -> red, 0 -> neutral.
  const t = Math.max(-1, Math.min(1, value));
  if (t >= 0) {
    const alpha = t;
    return `rgba(239, 68, 68, ${0.12 + alpha * 0.75})`;
  }
  const alpha = -t;
  return `rgba(56, 189, 248, ${0.12 + alpha * 0.75})`;
}

export default function CorrelationHeatmap({ correlation }) {
  const { labels, matrix } = correlation;
  const short = labels.map((l) => l.replace(/\s*\(.*?\)/g, ""));

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-[2px] text-[10px]"
        style={{ gridTemplateColumns: `120px repeat(${labels.length}, minmax(46px, 1fr))` }}
      >
        <div />
        {short.map((l) => (
          <div key={l} className="flex items-end justify-center px-0.5 pb-1 text-center text-slate-400">
            <span className="line-clamp-2 leading-tight">{l}</span>
          </div>
        ))}
        {matrix.map((row, i) => (
          <ExplainedRow key={labels[i]} label={short[i]} row={row} />
        ))}
      </div>
    </div>
  );
}

function ExplainedRow({ label, row }) {
  return (
    <>
      <div className="flex items-center truncate pr-2 text-slate-400">{label}</div>
      {row.map((v, j) => (
        <div
          key={j}
          title={v.toFixed(2)}
          className="flex aspect-square items-center justify-center rounded-sm font-medium text-white/90"
          style={{ background: colorFor(v) }}
        >
          {v.toFixed(1)}
        </div>
      ))}
    </>
  );
}
