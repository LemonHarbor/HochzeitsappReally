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

      <ResponsiveLayout>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {isGuest ? <Navigate to="/guest-area" replace /> : <Home />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/guest-management"
            element={
              <ProtectedRoute requiredPermission="canViewGuests">
                <GuestManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/table-planner"
            element={
              <ProtectedRoute requiredPermission="canViewTables">
                <TablePlanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget-tracker"
            element={
              <ProtectedRoute>
                <BudgetTracker />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <React.Suspense fallback={<div>Loading...</div>}>
                  {React.createElement(
                    React.lazy(() => import("./pages/timeline")),
                  )}
                </React.Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-management"
            element={
              <ProtectedRoute>
                <VendorManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-comparison"
            element={
              <ProtectedRoute>
                <VendorComparison />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guest-area"
            element={
              <ProtectedRoute>
                <GuestArea />
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
      </ResponsiveLayout>

      {/* Developer Panel - always shown */}
      <DeveloperPanel />
    </>
  );
}

export default App;
