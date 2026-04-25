import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';

import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Clients = lazy(() => import('./pages/Clients'));
const Services = lazy(() => import('./pages/Services'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Tickets = lazy(() => import('./pages/Tickets'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner /></div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="services" element={<Services />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="analytics" element={<div className="p-8 text-gray-400 text-center">Analytics Module – Coming Soon</div>} />
              <Route path="settings" element={<div className="p-8 text-gray-400 text-center">Settings Module – Coming Soon</div>} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
