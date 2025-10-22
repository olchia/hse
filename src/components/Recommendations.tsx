import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI } from '../services/api';
import { Recommendation } from '../types';
import { Lightbulb, Heart, Dumbbell, Moon, Apple, Users, Check, Star, Clock } from 'lucide-react';

export function RecommendationsComponent() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');


  const loadRecommendations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await recommendationAPI.getRecommendations(user.id);
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, loadRecommendations]);

  const handleCompleteRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'mindfulness':
        return <Heart className="w-5 h-5" />;
      case 'exercise':
        return <Dumbbell className="w-5 h-5" />;
      case 'sleep':
        return <Moon className="w-5 h-5" />;
      case 'nutrition':
        return <Apple className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: Recommendation['category']) => {
    switch (category) {
      case 'mindfulness':
        return 'text-pink-600 bg-pink-100 dark:bg-pink-900/20';
      case 'exercise':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'sleep':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'nutrition':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'social':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getCategoryName = (category: Recommendation['category']) => {
    const names = {
      mindfulness: 'Осознанность',
      exercise: 'Физическая активность',
      sleep: 'Сон',
      nutrition: 'Питание',
      social: 'Социальные связи',
    };
    return names[category];
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Все', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'mindfulness', name: 'Осознанность', icon: <Heart className="w-4 h-4" /> },
    { id: 'exercise', name: 'Активность', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'sleep', name: 'Сон', icon: <Moon className="w-4 h-4" /> },
    { id: 'nutrition', name: 'Питание', icon: <Apple className="w-4 h-4" /> },
    { id: 'social', name: 'Социальное', icon: <Users className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600 dark:text-sage-400">Загрузка рекомендаций...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-dark-50 mb-2">
          Персональные рекомендации
        </h2>
        <p className="text-dark-300">
          Рекомендации дня на основе вашего эмоционального состояния
        </p>
      </div>

      {/* Фильтры категорий */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            }`}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Рекомендации */}
      {filteredRecommendations.length === 0 ? (
        <div className="card text-center">
          <div className="w-16 h-16 bg-dark-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Star className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-semibold text-dark-50 mb-2">
            Нет рекомендаций
          </h3>
          <p className="text-dark-300">
            {selectedCategory === 'all' 
              ? 'Создайте несколько чек-апов, чтобы получить персональные рекомендации'
              : 'Попробуйте другую категорию'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecommendations.map((recommendation) => (
            <div 
              key={recommendation.id} 
              className={`card transition-all duration-200 ${
                recommendation.completed 
                  ? 'opacity-60 bg-dark-800' 
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getCategoryColor(recommendation.category)}`}>
                    {getCategoryIcon(recommendation.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-dark-50">
                        {recommendation.title}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(recommendation.priority)}`} />
                    </div>
                    <p className="text-sm text-dark-300">
                      {getCategoryName(recommendation.category)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCompleteRecommendation(recommendation.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    recommendation.completed
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                  }`}
                >
                  {recommendation.completed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-dark-300 mb-4">
                {recommendation.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    recommendation.priority === 'high' ? 'bg-red-900/20 text-red-400' :
                    recommendation.priority === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                    'bg-green-900/20 text-green-400'
                  }`}>
                    {recommendation.priority === 'high' ? 'Высокий приоритет' :
                     recommendation.priority === 'medium' ? 'Средний приоритет' :
                     'Низкий приоритет'}
                  </span>
                </div>
                {recommendation.completed && (
                  <span className="text-sm text-green-400 font-medium">
                    Выполнено
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Статистика */}
      {recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-50 mb-4">
            Ваш прогресс
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-dark-50">
                {recommendations.length}
              </div>
              <div className="text-sm text-dark-300">Всего рекомендаций</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {recommendations.filter(r => r.completed).length}
              </div>
              <div className="text-sm text-dark-300">Выполнено</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((recommendations.filter(r => r.completed).length / recommendations.length) * 100) || 0}%
              </div>
              <div className="text-sm text-dark-300">Прогресс</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {recommendations.filter(r => r.priority === 'high').length}
              </div>
              <div className="text-sm text-dark-300">Важных</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
