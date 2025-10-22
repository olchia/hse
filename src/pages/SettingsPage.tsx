import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react';

export function SettingsPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-dark-50 mb-2">
            Настройки
          </h1>
          <p className="text-dark-300">
            Управляйте своим аккаунтом и настройками приложения
          </p>
        </div>

        <div className="space-y-6">
          {/* Профиль */}
          <div className="card">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 mr-3 text-dark-300" />
              <h2 className="text-lg font-semibold text-dark-50">
                Профиль
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  value={user.name}
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Уведомления */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 mr-3 text-dark-300" />
              <h2 className="text-lg font-semibold text-dark-50">
                Уведомления
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-dark-50">
                    Напоминания о чек-апах
                  </div>
                  <div className="text-sm text-dark-300">
                    Получайте напоминания о необходимости отметить своё состояние
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>


          {/* Помощь */}
          <div className="card">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-5 h-5 mr-3 text-dark-300" />
              <h2 className="text-lg font-semibold text-dark-50">
                Помощь и поддержка
              </h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-dark-700 transition-colors">
                <div className="font-medium text-dark-50">
                  Как использовать EmoTrack
                </div>
                <div className="text-sm text-dark-300">
                  Руководство по использованию приложения
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-dark-700 transition-colors">
                <div className="font-medium text-dark-50">
                  Связаться с поддержкой
                </div>
                <div className="text-sm text-dark-300">
                  Получить помощь от команды EmoTrack
                </div>
              </button>
            </div>
          </div>

          {/* Выход */}
          <div className="card">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
