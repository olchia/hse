import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkUpAPI } from '../services/api';
import { CheckUp } from '../types';
import { Calendar, Search } from 'lucide-react';

export function CheckUpHistory() {
  const { user } = useAuth();
  const [checkUps, setCheckUps] = useState<CheckUp[]>([]);
  const [filteredCheckUps, setFilteredCheckUps] = useState<CheckUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const loadCheckUps = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await checkUpAPI.getCheckUps(user.id);
      setCheckUps(data);
    } catch (error) {
      console.error('Error loading check-ups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const filterAndSortCheckUps = useCallback(() => {
    let filtered = [...checkUps];

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(checkUp =>
        checkUp.emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkUp.note?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по эмоции
    if (filterEmotion !== 'all') {
      filtered = filtered.filter(checkUp => checkUp.emotion.id === filterEmotion);
    }

    // Сортировка
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortBy === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    setFilteredCheckUps(filtered);
  }, [checkUps, searchTerm, filterEmotion, sortBy]);

  useEffect(() => {
    if (user) {
      loadCheckUps();
    }
  }, [user, loadCheckUps]);

  useEffect(() => {
    filterAndSortCheckUps();
  }, [filterAndSortCheckUps]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-500';
    if (mood >= 6) return 'text-yellow-500';
    if (mood >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return 'text-blue-500';
    if (energy >= 6) return 'text-cyan-500';
    if (energy >= 4) return 'text-purple-500';
    return 'text-gray-500';
  };

  const getStressColor = (stress: number) => {
    if (stress <= 3) return 'text-green-500';
    if (stress <= 5) return 'text-yellow-500';
    if (stress <= 7) return 'text-orange-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600 dark:text-sage-400">Загрузка истории...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Фильтры и поиск */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-400" />
            <input
              type="text"
              placeholder="Поиск по эмоциям или заметкам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
              className="input w-auto"
            >
              <option value="all">Все эмоции</option>
              <option value="1">Радость</option>
              <option value="2">Спокойствие</option>
              <option value="3">Грусть</option>
              <option value="4">Тревога</option>
              <option value="5">Злость</option>
              <option value="6">Усталость</option>
              <option value="7">Энергия</option>
              <option value="8">Любовь</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="input w-auto"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список чек-апов */}
      {filteredCheckUps.length === 0 ? (
        <div className="card text-center">
          <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-sage-400" />
          </div>
          <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50 mb-2">
            История пуста
          </h3>
          <p className="text-sage-600 dark:text-sage-400">
            {searchTerm || filterEmotion !== 'all' 
              ? 'Попробуйте изменить фильтры' 
              : 'Создайте свой первый чек-ап'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCheckUps.map((checkUp) => (
            <div key={checkUp.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{checkUp.emotion.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-sage-900 dark:text-sage-50">
                      {checkUp.emotion.name}
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400">
                      {formatDate(checkUp.timestamp)}
                    </p>
                  </div>
                </div>
              </div>

              {checkUp.note && (
                <p className="text-sage-700 dark:text-sage-300 mb-4 italic">
                  "{checkUp.note}"
                </p>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className={`font-semibold ${getMoodColor(checkUp.mood)}`}>
                    {checkUp.mood}/10
                  </div>
                  <div className="text-sage-600 dark:text-sage-400">Настроение</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getEnergyColor(checkUp.energy)}`}>
                    {checkUp.energy}/10
                  </div>
                  <div className="text-sage-600 dark:text-sage-400">Энергия</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getStressColor(checkUp.stress)}`}>
                    {checkUp.stress}/10
                  </div>
                  <div className="text-sage-600 dark:text-sage-400">Стресс</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
