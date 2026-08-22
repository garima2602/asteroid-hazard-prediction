import { ShieldAlert, ShieldCheck, ShieldQuestion, Skull } from "lucide-react";

const RISK_STYLES = {
  Low: { icon: ShieldCheck, classes: "bg-hazard-low/15 text-hazard-low border-hazard-low/40" },
  Moderate: {
    icon: ShieldQuestion,
    classes: "bg-hazard-moderate/15 text-hazard-moderate border-hazard-moderate/40",
  },
  High: { icon: ShieldAlert, classes: "bg-hazard-high/15 text-hazard-high border-hazard-high/40" },
  Critical: { icon: Skull, classes: "bg-hazard-critical/15 text-hazard-critical border-hazard-critical/40" },
};

export default function RiskBadge({ level, size = "md" }) {
  const style = RISK_STYLES[level] ?? RISK_STYLES.Low;
  const Icon = style.icon;
  const sizeClasses = size === "lg" ? "px-4 py-2 text-base gap-2" : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${style.classes} ${sizeClasses}`}
    >
      <Icon className={size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"} />
      {level}
    </span>
  );
}
