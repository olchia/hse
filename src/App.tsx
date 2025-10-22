import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CheckUpPage } from './pages/CheckUpPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DevicesPage } from './pages/DevicesPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  useEffect(() => {
    // Устанавливаем тёмную тему по умолчанию
    const root = window.document.documentElement;
    root.classList.add('dark');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/checkup" replace />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/checkup" element={<CheckUpPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/devices" element={<DevicesPage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
