import React from 'react';
import { Navigate } from 'react-router-dom';
import { CheckUpHistory } from '../components/CheckUpHistory';
import { useAuth } from '../context/AuthContext';

export function HistoryPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-dark-50 mb-3">
            История состояний
          </h1>
          <p className="text-dark-300 text-xl">
            Просматривайте и анализируйте свои эмоциональные состояния
          </p>
        </div>
        <CheckUpHistory />
      </div>
    </div>
  );
}
