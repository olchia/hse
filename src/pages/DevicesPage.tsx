import React from 'react';
import { Navigate } from 'react-router-dom';
import { DeviceIntegrationComponent } from '../components/DeviceIntegration';
import { useAuth } from '../context/AuthContext';

export function DevicesPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <DeviceIntegrationComponent />
      </div>
    </div>
  );
}
