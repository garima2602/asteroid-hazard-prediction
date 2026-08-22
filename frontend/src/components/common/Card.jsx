export default function Card({ title, description, className = "", children, actions }) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-space-850/60 p-5 shadow-lg shadow-black/20 ${className}`}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
