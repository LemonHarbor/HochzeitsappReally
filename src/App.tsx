import React, { useEffect } from "react";
import { DeveloperProvider } from "./lib/developer";
import { LanguageProvider } from "./lib/language";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/login";
import LandingPage from "./pages/landing/LandingPage";

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
      
      // Add click debugging
      document.addEventListener('click', (e) => {
        console.log('Click detected at:', e.clientX, e.clientY);
        console.log('Target:', e.target);
      }, true);
    };
    
    // Run immediately and then periodically to catch dynamically added elements
    removeEventBlockers();
    const interval = setInterval(removeEventBlockers, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
};

function App() {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  
  return (
    <Router>
      <LanguageProvider>
        <DeveloperProvider>
          <ClickInteractionFix />
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              isAuthenticated ? (
                <div className="p-8">
                  <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                  <p>Welcome to Lemon Vows! This is your dashboard.</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded"
                    onClick={() => {
                      localStorage.removeItem("authenticated");
                      window.location.href = "/landing";
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Navigate to="/landing" replace />
              )
            } />
          </Routes>
        </DeveloperProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
