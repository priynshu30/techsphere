import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Subscriptions from './pages/Subscriptions';
import Tickets from './pages/Tickets';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
