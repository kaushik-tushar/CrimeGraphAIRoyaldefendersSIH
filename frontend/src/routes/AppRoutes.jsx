import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts & Page Components
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Cases from '../pages/Cases';
import CaseDetail from '../pages/CaseDetail';
import Entities from '../pages/Entities/Entities';           // Added Entity List Page
import EntityDetails from '../pages/Entities/EntityDetails'; // Added Entity Details Page
import LinkAnalysis from '../pages/LinkAnalysis';
import EvidenceChain from '../pages/EvidenceChain';
import TowerDumpCDR from '../pages/TowerDumpCDR';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

/**
 * ProtectedRoute Component
 * Restricts access to authenticated law enforcement personnel and handles RBAC.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span>AUTHENTICATING SECURE SESSION...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * AppRoutes Component
 * Central router configuration for the intelligence platform.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Route */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated Application Shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default Route Redirect */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Overview */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Case Management */}
        <Route path="cases" element={<Cases />} />
        <Route path="cases/:caseId" element={<CaseDetail />} />

        {/* Entity Intelligence (Added) */}
        <Route path="entities" element={<Entities />} />
        <Route path="entities/:id" element={<EntityDetails />} />

        {/* Investigative Analytics */}
        <Route path="link-analysis" element={<LinkAnalysis />} />
        <Route path="cdr-analysis" element={<TowerDumpCDR />} />

        {/* Chain of Custody & Digital Forensic Ledger */}
        <Route path="evidence" element={<EvidenceChain />} />

        {/* System & Access Settings (Admin Restricted) */}
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}