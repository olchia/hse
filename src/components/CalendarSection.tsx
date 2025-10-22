import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  attendees?: number;
  type: 'work' | 'personal' | 'social' | 'health' | 'other';
  stressLevel?: number; // 1-10
  moodImpact?: number; // 1-10
}

export function CalendarSection() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({});

  const loadEvents = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Mock данные для демонстрации
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Важная встреча',
          start: new Date().toISOString(),
          end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          location: 'Офис',
          attendees: 5,
          type: 'work',
          stressLevel: 8,
          moodImpact: 6,
        },
        {
          id: '2',
          title: 'Тренировка',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          type: 'health',
          stressLevel: 3,
          moodImpact: 9,
        },
        {
          id: '3',
          title: 'Встреча с друзьями',
          start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          location: 'Кафе',
          attendees: 3,
          type: 'social',
          stressLevel: 2,
          moodImpact: 10,
        },
      ];
      
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user, loadEvents]);


  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end || newEvent.start,
      location: newEvent.location,
      attendees: newEvent.attendees,
      type: newEvent.type || 'other',
      stressLevel: newEvent.stressLevel,
      moodImpact: newEvent.moodImpact,
    };
    
    setEvents(prev => [...prev, event]);
    setNewEvent({});
    setShowAddEvent(false);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'work':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'personal':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'social':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'health':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getEventTypeName = (type: CalendarEvent['type']) => {
    const names = {
      work: 'Работа',
      personal: 'Личное',
      social: 'Социальное',
      health: 'Здоровье',
      other: 'Другое',
    };
    return names[type];
  };

  const getStressColor = (level: number) => {
    if (level >= 8) return 'text-red-500';
    if (level >= 6) return 'text-orange-500';
    if (level >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getMoodColor = (level: number) => {
    if (level >= 8) return 'text-green-500';
    if (level >= 6) return 'text-blue-500';
    if (level >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600 dark:text-sage-400">Загрузка событий...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-50">
            Календарь событий
          </h2>
          <p className="text-sage-600 dark:text-sage-400">
            Анализируйте влияние событий на ваше эмоциональное состояние
          </p>
        </div>
        <button
          onClick={() => setShowAddEvent(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить событие
        </button>
      </div>

      {/* События */}
      {events.length === 0 ? (
        <div className="card text-center">
          <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-sage-400" />
          </div>
          <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50 mb-2">
            Нет событий
          </h3>
          <p className="text-sage-600 dark:text-sage-400 mb-4">
            Добавьте события, чтобы анализировать их влияние на ваше состояние
          </p>
          <button
            onClick={() => setShowAddEvent(true)}
            className="btn-primary"
          >
            Добавить событие
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getEventTypeColor(event.type)}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sage-900 dark:text-sage-50 mb-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-sage-600 dark:text-sage-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendees} чел.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                    {getEventTypeName(event.type)}
                  </span>
                </div>
              </div>

              {/* Анализ влияния */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sage-600 dark:text-sage-400">Уровень стресса:</span>
                    <span className={`font-semibold ${getStressColor(event.stressLevel || 0)}`}>
                      {event.stressLevel || 0}/10
                    </span>
                  </div>
                  <div className="w-full bg-sage-200 dark:bg-sage-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (event.stressLevel || 0) >= 8 ? 'bg-red-500' :
                        (event.stressLevel || 0) >= 6 ? 'bg-orange-500' :
                        (event.stressLevel || 0) >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(event.stressLevel || 0) * 10}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sage-600 dark:text-sage-400">Влияние на настроение:</span>
                    <span className={`font-semibold ${getMoodColor(event.moodImpact || 0)}`}>
                      {event.moodImpact || 0}/10
                    </span>
                  </div>
                  <div className="w-full bg-sage-200 dark:bg-sage-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (event.moodImpact || 0) >= 8 ? 'bg-green-500' :
                        (event.moodImpact || 0) >= 6 ? 'bg-blue-500' :
                        (event.moodImpact || 0) >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(event.moodImpact || 0) * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления события */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-sage-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50">
                Добавить событие
              </h3>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-sage-400 hover:text-sage-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Название события
                </label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                  placeholder="Введите название события"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Начало
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.start || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, start: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Конец
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.end || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, end: e.target.value }))}
                    className="input"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                  Тип события
                </label>
                <select
                  value={newEvent.type || 'other'}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                  className="input"
                >
                  <option value="work">Работа</option>
                  <option value="personal">Личное</option>
                  <option value="social">Социальное</option>
                  <option value="health">Здоровье</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Уровень стресса (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newEvent.stressLevel || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, stressLevel: Number(e.target.value) }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-300 mb-2">
                    Влияние на настроение (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newEvent.moodImpact || ''}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, moodImpact: Number(e.target.value) }))}
                    className="input"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.start}
                className="btn-primary w-full"
              >
                Добавить событие
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
