import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, History, BarChart3, Settings, LogOut, Menu, X, Smartphone, Lightbulb, Calendar } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Чек-ап', href: '/checkup', icon: Heart },
    { name: 'История', href: '/history', icon: History },
    { name: 'Аналитика', href: '/analytics', icon: BarChart3 },
    { name: 'Устройства', href: '/devices', icon: Smartphone },
    { name: 'Рекомендации', href: '/recommendations', icon: Lightbulb },
    { name: 'Календарь', href: '/calendar', icon: Calendar },
    { name: 'Настройки', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full bg-dark-800 shadow-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mr-3 flex items-center justify-center shadow-lg">
                    <span className="text-lg">🌱</span>
                  </div>
                  <span className="font-bold text-dark-50 text-lg">EmoTrack</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-600 text-white'
                          : 'text-dark-300 hover:bg-dark-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-dark-700">
                <button
                  onClick={logout}
                  className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Десктопная навигация */}
      <div className="hidden lg:block">
        <div className="fixed top-0 left-0 w-64 h-full bg-dark-800 shadow-2xl border-r border-dark-700">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mr-4 flex items-center justify-center shadow-lg">
                <span className="text-xl">🌱</span>
              </div>
              <div>
                <div className="font-bold text-dark-50 text-xl">EmoTrack</div>
                <div className="text-sm text-dark-300">Эмоциональный трекер</div>
              </div>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                        : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-sage-200 dark:border-sage-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-medium text-sage-900 dark:text-sage-50">{user.name}</div>
                  <div className="text-sm text-sage-600 dark:text-sage-400">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="lg:ml-64">
        {/* Мобильный хедер */}
        <div className="lg:hidden bg-dark-800 shadow-2xl border-b border-dark-700">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 rounded-xl hover:bg-dark-700 transition-colors"
            >
              <Menu className="w-6 h-6 text-dark-300" />
            </button>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mr-3 flex items-center justify-center shadow-lg">
                <span className="text-lg">🌱</span>
              </div>
              <span className="font-bold text-dark-50 text-lg">EmoTrack</span>
            </div>
          </div>
        </div>

        {/* Контент страницы */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
