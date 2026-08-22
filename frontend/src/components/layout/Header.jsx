export default function Header({ title, subtitle }) {
  return (
    <header className="border-b border-white/10 bg-space-900/40 px-8 py-5 backdrop-blur">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </header>
  );
}
