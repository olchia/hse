import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { AnalyticsData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Heart, Zap, AlertTriangle } from 'lucide-react';

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const loadAnalytics = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await analyticsAPI.getAnalytics(user.id, period);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, period]);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, period, loadAnalytics]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return period === 'week' 
      ? date.toLocaleDateString('ru-RU', { weekday: 'short' })
      : period === 'month'
      ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      : date.toLocaleDateString('ru-RU', { month: 'short' });
  };

  const getEmotionName = (emotionId: string) => {
    const emotions: { [key: string]: string } = {
      '1': 'Радость',
      '2': 'Спокойствие',
      '3': 'Грусть',
      '4': 'Тревога',
      '5': 'Злость',
      '6': 'Усталость',
      '7': 'Энергия',
      '8': 'Любовь',
    };
    return emotions[emotionId] || 'Неизвестно';
  };

  const getEmotionColor = (emotionId: string) => {
    const colors: { [key: string]: string } = {
      '1': '#fbbf24',
      '2': '#10b981',
      '3': '#3b82f6',
      '4': '#f59e0b',
      '5': '#ef4444',
      '6': '#8b5cf6',
      '7': '#f59e0b',
      '8': '#ec4899',
    };
    return colors[emotionId] || '#6b7280';
  };

  const pieData = analytics ? Object.entries(analytics.emotionDistribution).map(([emotionId, count]) => ({
    name: getEmotionName(emotionId),
    value: count,
    color: getEmotionColor(emotionId),
  })) : [];

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600 dark:text-sage-400">Загрузка аналитики...</p>
      </div>
    );
  }

  if (!analytics || analytics.trends.length === 0) {
    return (
      <div className="card text-center">
        <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-full mx-auto mb-4 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-sage-400" />
        </div>
        <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50 mb-2">
          Недостаточно данных
        </h3>
        <p className="text-sage-600 dark:text-sage-400">
          Создайте несколько чек-апов, чтобы увидеть аналитику
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Период */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-sage-900 dark:text-sage-50">
            Аналитика
          </h2>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-sage-600 text-white'
                    : 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-sage-700'
                }`}
              >
                {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Средние показатели */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-sage-900 dark:text-sage-50 mb-1">
            {analytics.averageMood.toFixed(1)}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">Среднее настроение</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-sage-900 dark:text-sage-50 mb-1">
            {analytics.averageEnergy.toFixed(1)}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">Средняя энергия</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-sage-900 dark:text-sage-50 mb-1">
            {analytics.averageStress.toFixed(1)}
          </div>
          <div className="text-sm text-sage-600 dark:text-sage-400">Средний стресс</div>
        </div>
      </div>

      {/* График трендов */}
      <div className="card">
        <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50 mb-4">
          Динамика показателей
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Настроение"
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Энергия"
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Стресс"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Распределение эмоций */}
      {pieData.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50 mb-4">
            Распределение эмоций
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {if (typeof percent !== 'number') return name; return `${name} ${(percent * 100).toFixed(0)}%`;}}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
