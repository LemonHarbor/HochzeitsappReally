import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import LandingPage from './pages/landing/LandingPage';
import DashboardPage from './pages/DashboardPage';
import JGADashboard from './pages/jga/JGADashboard';
import WeddingHomepageDashboard from './pages/wedding-homepage/WeddingHomepageDashboard';
import TestingDashboard from './pages/testing/TestingDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ClickInteractionFix } from './components/ui/ClickInteractionFix';

function App() {
  return (
    <>
      <ClickInteractionFix />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage register={true} />} />
        
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
    </>
  );
}

export default App;
