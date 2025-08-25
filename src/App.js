import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';

// Components
import Layout from './components/Layout';
import Loading from './components/Loading';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MatchResults from './pages/MatchResults';
import TeamStats from './pages/TeamStats';
import TeacherStats from './pages/TeacherStats';
import Analytics from './pages/Analytics';
import ResultsInput from './pages/ResultsInput';
import TeamSheets from './pages/TeamSheets';
import KitMarks from './pages/KitMarks';
import PEGroups from './pages/PEGroups';
import SwimmingRecords from './pages/SwimmingRecords';
import AthleticsRecords from './pages/AthleticsRecords';
import Camera from './pages/Camera';
import Admin from './pages/Admin';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/match-results" element={<MatchResults />} />
        <Route path="/team-stats" element={<TeamStats />} />
        <Route path="/teacher-stats" element={<TeacherStats />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/results-input" element={<ResultsInput />} />
        <Route path="/team-sheets" element={<TeamSheets />} />
        <Route path="/kit-marks" element={<KitMarks />} />
        <Route path="/pe-groups" element={<PEGroups />} />
        <Route path="/swimming-records" element={<SwimmingRecords />} />
        <Route path="/athletics-records" element={<AthleticsRecords />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
