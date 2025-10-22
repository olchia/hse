import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/checkup" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm mode="register" onToggleMode={() => {}} />
      </div>
    </div>
  );
}
