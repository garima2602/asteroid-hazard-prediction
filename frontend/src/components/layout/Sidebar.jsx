import { NavLink } from "react-router-dom";
import { Orbit, Gauge, LayoutDashboard, BarChart3, Telescope } from "lucide-react";

const links = [
  { to: "/", label: "Hazard Predictor", icon: Gauge, end: true },
  { to: "/dashboard", label: "EDA Dashboard", icon: LayoutDashboard },
  { to: "/insights", label: "Model Insights", icon: BarChart3 },
  { to: "/orbit", label: "Orbit Viewer", icon: Orbit },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-space-900/60 backdrop-blur">
      <div className="flex items-center gap-2 px-6 py-6">
        <Telescope className="h-7 w-7 text-brand-400" />
        <div>
          <p className="text-sm font-semibold tracking-wide text-white">Asteroid Hazard</p>
          <p className="text-xs text-slate-400">Prediction Console</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-500/15 text-brand-400 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.35)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
        <p className="text-slate-300">Data source</p>
        <p>NASA NEO dataset · 4,687 objects</p>
      </div>
    </aside>
  );
}
