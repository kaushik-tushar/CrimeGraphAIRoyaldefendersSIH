import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout (layouts folder se import karein)
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EntityIntelligence from './pages/Entities/Entities';
import LinkAnalysis from './pages/LinkAnalysis';
import CaseManagement from './pages/Cases/Cases';
import AIIntelligence from './pages/Intelligence';
import CdrAnalysis from './pages/CdrAnalysis';
import DigitalEvidenceVault from './pages/Evidence';
import Reports from './pages/Reports';
import Timeline from './pages/Timeline';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import VehicleManagement from './pages/VehicleManagement'; // Agar pages mein hai toh

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="entities" element={<EntityIntelligence />} />
        <Route path="link-analysis" element={<LinkAnalysis />} />
        <Route path="cases" element={<CaseManagement />} />
        <Route path="intelligence" element={<AIIntelligence />} />
        <Route path="cdr-analysis" element={<CdrAnalysis />} />
        <Route path="evidence" element={<DigitalEvidenceVault />} />
        <Route path="reports" element={<Reports />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="usermanagement" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="vehicles" element={<VehicleManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}