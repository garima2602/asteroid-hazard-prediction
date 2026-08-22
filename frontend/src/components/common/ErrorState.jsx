import { AlertTriangle } from "lucide-react";

export default function ErrorState({ message = "Couldn't reach the API." }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center text-slate-400">
      <AlertTriangle className="h-6 w-6 text-hazard-high" />
      <p className="text-sm">{message}</p>
      <p className="text-xs text-slate-500">
        Make sure the FastAPI backend is running on <code className="text-slate-400">localhost:8000</code>.
      </p>
    </div>
  );
}
