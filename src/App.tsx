import React, { useEffect } from "react";
import { LanguageProvider } from "./lib/language";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import LandingPage from "./pages/landing/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import JGADashboard from "./pages/jga/JGADashboard";
import WeddingHomepageDashboard from "./pages/wedding-homepage/WeddingHomepageDashboard";
import TestingDashboard from "./pages/testing/TestingDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Fix for click interaction issues
const ClickInteractionFix = () => {
  useEffect(() => {
    // Remove any potential event blockers
    const removeEventBlockers = () => {
      // Find and remove any overlay elements that might block clicks
      const overlays = document.querySelectorAll('.overlay, .modal-backdrop, [style*="position: fixed"]');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement) {
          overlay.style.pointerEvents = 'none';
        }
      });
      
      // Ensure body and html have proper event handling
      document.body.style.pointerEvents = 'auto';
      document.documentElement.style.pointerEvents = 'auto';
    };
    
    // Run immediately and then periodically to catch dynamically added elements
    removeEventBlockers();
    const interval = setInterval(removeEventBlockers, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
};

function App() {
  return (
    <LanguageProvider>
      <ClickInteractionFix />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage register />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/jga/*" element={
          <ProtectedRoute>
            <JGADashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/wedding-homepage/*" element={
          <ProtectedRoute>
            <WeddingHomepageDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/testing/*" element={
          <ProtectedRoute>
            <TestingDashboard />
          </ProtectedRoute>
        } />
        
        {/* Default routes */}
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
