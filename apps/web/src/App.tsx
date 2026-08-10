import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SplashGate } from "@/components/SplashGate";
import { HomePage } from "@/features/home/HomePage";
import { LinesPage } from "@/features/lines/LinesPage";
import { LineDetailPage } from "@/features/lines/LineDetailPage";
import { StopsPage } from "@/features/stops/StopsPage";
import { StopDetailPage } from "@/features/stops/StopDetailPage";
import { SchedulePage } from "@/features/schedule/SchedulePage";
import { PlannerPage } from "@/features/planner/PlannerPage";
import { MapPage } from "@/features/map/MapPage";
import { TermsPage } from "@/features/terms/TermsPage";
import { InstallPage } from "@/features/install/InstallPage";

export function App() {
  return (
    <Layout>
      <SplashGate />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lines" element={<LinesPage />} />
        <Route path="/lines/:id" element={<LineDetailPage />} />
        <Route path="/stops" element={<StopsPage />} />
        <Route path="/stops/:id" element={<StopDetailPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/install" element={<InstallPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
