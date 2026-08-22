import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar.jsx";
import Predictor from "./pages/Predictor.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Insights from "./pages/Insights.jsx";
import OrbitPage from "./pages/OrbitPage.jsx";

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-200">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Predictor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/orbit" element={<OrbitPage />} />
        </Routes>
      </main>
    </div>
  );
}
