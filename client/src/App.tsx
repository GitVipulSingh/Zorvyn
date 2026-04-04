import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Activity } from "@/pages/Activity";
import { Goals } from "@/pages/Goals";
import { Insights } from "@/pages/Insights";
import { Profile } from "@/pages/Profile";
import { NotFound } from "@/pages/NotFound";
import { OnboardingModal, useOnboarding } from "@/components/OnboardingModal";

function AppContent() {
  const { show, complete } = useOnboarding();

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <AnimatePresence>
        {show && <OnboardingModal onComplete={complete} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
