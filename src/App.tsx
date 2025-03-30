import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import Home from "./components/home";
import GuestManagement from "./pages/guest-management";
import TablePlanner from "./pages/table-planner";
import BudgetTracker from "./pages/budget-tracker";
import SettingsPage from "./pages/settings";
import GuestArea from "./pages/guest-area";
import LoginPage from "./pages/login";
import VendorManagement from "./pages/vendor-management";
import VendorComparison from "./pages/vendor-comparison";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { DeveloperPanel } from "./components/ui/developer-panel";
import ResponsiveLayout from "./components/layout/ResponsiveLayout";
import routes from "./lib/routes";
import { ToggleDeveloperMode } from "./components/ui/toggle-developer-mode";
import LandingPage from "./pages/landing/LandingPage";

function App() {
  const { isAuthenticated, user } = useAuth();
  const isGuest = user?.role === "guest";

  // Register service worker for PWA
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered: ", registration);
          })
          .catch((error) => {
            console.log("Service Worker registration failed: ", error);
          });
      });
    }
  }, []);

  return (
    <>
      {/* Tempo routes for storyboards */}
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

      <Routes>
        {/* Landing Page - public route */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Protected routes - wrapped in ResponsiveLayout */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ResponsiveLayout>
                {isGuest ? <Navigate to="/guest-area" replace /> : <Home />}
              </ResponsiveLayout>
            ) : (
              <Navigate to="/landing" replace />
            )
          }
        />

        <Route
          path="/guest-management"
          element={
            <ProtectedRoute requiredPermission="canViewGuests">
              <ResponsiveLayout>
                <GuestManagement />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/table-planner"
          element={
            <ProtectedRoute requiredPermission="canViewTables">
              <ResponsiveLayout>
                <TablePlanner />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/budget-tracker"
          element={
            <ProtectedRoute>
              <ResponsiveLayout>
                <BudgetTracker />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/timeline"
          element={
            <ProtectedRoute>
              <ResponsiveLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(
                    React.lazy(() => import("./pages/timeline")),
                  )}
                </React.Suspense>
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-management"
          element={
            <ProtectedRoute>
              <ResponsiveLayout>
                <VendorManagement />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-comparison"
          element={
            <ProtectedRoute>
              <ResponsiveLayout>
                <VendorComparison />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ResponsiveLayout>
                <SettingsPage />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guest-area"
          element={
            <ProtectedRoute>
              <ResponsiveLayout>
                <GuestArea />
              </ResponsiveLayout>
            </ProtectedRoute>
          }
        />

        {/* Add this before the catchall route for Tempo */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Developer Panel - only shown when developer mode is active */}
      <DeveloperPanel />
      
      {/* Always show the toggle button */}
      <ToggleDeveloperMode />
    </>
  );
}

export default App;
