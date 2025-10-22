import React from 'react';
import { Navigate } from 'react-router-dom';
import { CheckUpForm } from '../components/CheckUpForm';
import { useAuth } from '../context/AuthContext';

export function CheckUpPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <CheckUpForm />
      </div>
    </div>
  );
}
