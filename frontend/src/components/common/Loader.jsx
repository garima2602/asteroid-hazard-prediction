import { LoaderCircle } from "lucide-react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-slate-400">
      <LoaderCircle className="h-6 w-6 animate-spin text-brand-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
