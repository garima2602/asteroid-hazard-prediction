import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#38bdf8", "#7dd3fc"];

export default function FeatureImportanceChart({ data }) {
  const chartData = [...data].sort((a, b) => a.importance - b.importance);

  return (
    <div style={{ height: Math.max(260, chartData.length * 34) }} className="w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <YAxis
            type="category"
            dataKey="label"
            width={190}
            tick={{ fontSize: 11, fill: "#cbd5e1" }}
          />
          <Tooltip
            contentStyle={{ background: "#0e1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            formatter={(v) => v.toFixed(3)}
          />
          <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
