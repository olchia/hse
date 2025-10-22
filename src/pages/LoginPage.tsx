import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (user) {
    return <Navigate to="/checkup" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm mode={mode} onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')} />
      </div>
    </div>
  );
}
