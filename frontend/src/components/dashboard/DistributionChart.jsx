import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function DistributionChart({ distribution }) {
  const edges = distribution.hazardous.binEdges;
  const data = edges.slice(0, -1).map((edge, i) => ({
    bin: `${formatNum(edge)}`,
    "Non-Hazardous": distribution.nonHazardous.counts[i],
    Hazardous: distribution.hazardous.counts[i],
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="bin" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={2} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{ background: "#0e1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            labelStyle={{ color: "#e2e4f3" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Non-Hazardous" stackId="a" fill="#38bdf8" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Hazardous" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatNum(n) {
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  if (Math.abs(n) < 1) return n.toFixed(3);
  return n.toFixed(1);
}
