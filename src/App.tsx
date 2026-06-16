import { Routes, Route, Link } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import LoggedInPage from "./pages/LoggedIn";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.14 0.014 270)",
            color: "oklch(0.98 0.005 100)",
            border: "1px solid oklch(1 0 0 / 8%)",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/loggedin" element={<LoggedInPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
