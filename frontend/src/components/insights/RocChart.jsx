import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

export default function RocChart({ points, rocAuc }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={points} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="fpr"
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            label={{ value: "False Positive Rate", position: "insideBottom", offset: -2, fontSize: 11, fill: "#94a3b8" }}
          />
          <YAxis
            dataKey="tpr"
            type="number"
            domain={[0, 1]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
          />
          <Tooltip
            contentStyle={{ background: "#0e1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            formatter={(v) => v.toFixed(3)}
          />
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#475569" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="tpr" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-1 text-center text-xs text-slate-400">AUC = {rocAuc.toFixed(3)}</p>
    </div>
  );
}
