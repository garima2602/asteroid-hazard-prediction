import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ClassBalanceChart({ classCounts }) {
  const total = classCounts.hazardous + classCounts.nonHazardous;
  const data = [
    { name: "Non-Hazardous", value: classCounts.nonHazardous, color: "#38bdf8" },
    { name: "Hazardous", value: classCounts.hazardous, color: "#ef4444" },
  ];

  return (
    <div className="flex items-center gap-6">
      <div className="h-52 w-52 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0e1226", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
              formatter={(value) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <div>
              <p className="text-sm font-medium text-white">{d.name}</p>
              <p className="text-xs text-slate-400">
                {d.value.toLocaleString()} objects · {((d.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
        <p className="pt-1 text-xs text-slate-500">
          Class imbalance ratio ≈ {(classCounts.nonHazardous / classCounts.hazardous).toFixed(1)}:1
        </p>
      </div>
    </div>
  );
}
