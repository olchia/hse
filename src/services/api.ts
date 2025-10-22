import { CheckUp, Emotion, Reminder, AnalyticsData, DeviceIntegration, Recommendation } from '../types';

// Mock данные для эмоций
export const EMOTIONS: Emotion[] = [
  { id: '1', name: 'Радость', emoji: '😊', color: '#fbbf24', intensity: 8 },
  { id: '2', name: 'Спокойствие', emoji: '😌', color: '#10b981', intensity: 7 },
  { id: '3', name: 'Грусть', emoji: '😢', color: '#3b82f6', intensity: 4 },
  { id: '4', name: 'Тревога', emoji: '😰', color: '#f59e0b', intensity: 3 },
  { id: '5', name: 'Злость', emoji: '😠', color: '#ef4444', intensity: 2 },
  { id: '6', name: 'Усталость', emoji: '😴', color: '#8b5cf6', intensity: 3 },
  { id: '7', name: 'Энергия', emoji: '⚡', color: '#f59e0b', intensity: 9 },
  { id: '8', name: 'Любовь', emoji: '❤️', color: '#ec4899', intensity: 10 },
];

// API функции для работы с чек-апами
export const checkUpAPI = {
  // Сохранить чек-ап
  saveCheckUp: async (checkUp: Omit<CheckUp, 'id'>): Promise<CheckUp> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Имитация задержки
    
    const newCheckUp: CheckUp = {
      ...checkUp,
      id: Date.now().toString(),
    };
    
    const checkUps = JSON.parse(localStorage.getItem('emotrack-checkups') || '[]');
    checkUps.push(newCheckUp);
    localStorage.setItem('emotrack-checkups', JSON.stringify(checkUps));
    
    return newCheckUp;
  },

  // Получить чек-апы пользователя
  getCheckUps: async (userId: string): Promise<CheckUp[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const checkUps = JSON.parse(localStorage.getItem('emotrack-checkups') || '[]');
    return checkUps.filter((c: CheckUp) => c.userId === userId);
  },

  // Получить чек-апы за период
  getCheckUpsByPeriod: async (userId: string, days: number): Promise<CheckUp[]> => {
    const checkUps = await checkUpAPI.getCheckUps(userId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return checkUps.filter((c: CheckUp) => new Date(c.timestamp) >= cutoffDate);
  },
};

// API функции для аналитики
export const analyticsAPI = {
  // Получить аналитику за период
  getAnalytics: async (userId: string, period: 'week' | 'month' | 'year'): Promise<AnalyticsData> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const checkUps = await checkUpAPI.getCheckUpsByPeriod(userId, days);
    
    if (checkUps.length === 0) {
      return {
        period,
        averageMood: 0,
        averageEnergy: 0,
        averageStress: 0,
        emotionDistribution: {},
        trends: [],
      };
    }
    
    const averageMood = checkUps.reduce((sum, c) => sum + c.mood, 0) / checkUps.length;
    const averageEnergy = checkUps.reduce((sum, c) => sum + c.energy, 0) / checkUps.length;
    const averageStress = checkUps.reduce((sum, c) => sum + c.stress, 0) / checkUps.length;
    
    const emotionDistribution: { [emotionId: string]: number } = {};
    checkUps.forEach(c => {
      emotionDistribution[c.emotion.id] = (emotionDistribution[c.emotion.id] || 0) + 1;
    });
    
    const trends = checkUps.map(c => ({
      date: c.timestamp,
      mood: c.mood,
      energy: c.energy,
      stress: c.stress,
    }));
    
    return {
      period,
      averageMood,
      averageEnergy,
      averageStress,
      emotionDistribution,
      trends,
    };
  },
};

// API функции для напоминаний
export const reminderAPI = {
  // Получить напоминания пользователя
  getReminders: async (userId: string): Promise<Reminder[]> => {
    const reminders = JSON.parse(localStorage.getItem('emotrack-reminders') || '[]');
    return reminders.filter((r: Reminder) => r.userId === userId);
  },

  // Сохранить напоминание
  saveReminder: async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    
    const reminders = JSON.parse(localStorage.getItem('emotrack-reminders') || '[]');
    reminders.push(newReminder);
    localStorage.setItem('emotrack-reminders', JSON.stringify(reminders));
    
    return newReminder;
  },

  // Обновить напоминание
  updateReminder: async (id: string, updates: Partial<Reminder>): Promise<Reminder> => {
    const reminders = JSON.parse(localStorage.getItem('emotrack-reminders') || '[]');
    const index = reminders.findIndex((r: Reminder) => r.id === id);
    
    if (index !== -1) {
      reminders[index] = { ...reminders[index], ...updates };
      localStorage.setItem('emotrack-reminders', JSON.stringify(reminders));
      return reminders[index];
    }
    
    throw new Error('Reminder not found');
  },
};

// API функции для интеграций с устройствами
export const deviceAPI = {
  // Получить подключённые устройства
  getDevices: async (userId: string): Promise<DeviceIntegration[]> => {
    const devices = JSON.parse(localStorage.getItem('emotrack-devices') || '[]');
    return devices.filter((d: DeviceIntegration) => d.id.includes(userId));
  },

  // Подключить устройство
  connectDevice: async (userId: string, device: Omit<DeviceIntegration, 'id' | 'userId' | 'lastSync'>): Promise<DeviceIntegration> => {
    const newDevice: DeviceIntegration = {
      ...device,
      id: `${userId}-${device.type}-${Date.now()}`,
      lastSync: new Date().toISOString(),
    };
    
    const devices = JSON.parse(localStorage.getItem('emotrack-devices') || '[]');
    devices.push(newDevice);
    localStorage.setItem('emotrack-devices', JSON.stringify(devices));
    
    return newDevice;
  },
};

// API функции для рекомендаций
export const recommendationAPI = {
  // Получить рекомендации
  getRecommendations: async (userId: string): Promise<Recommendation[]> => {
    // Mock рекомендации на основе последних чек-апов
    const checkUps = await checkUpAPI.getCheckUpsByPeriod(userId, 7);
    const recommendations: Recommendation[] = [];
    
    if (checkUps.length > 0) {
      const lastCheckUp = checkUps[checkUps.length - 1];
      
      if (lastCheckUp.mood < 5) {
        recommendations.push({
          id: '1',
          title: 'Медитация для поднятия настроения',
          description: 'Попробуйте 10-минутную медитацию для улучшения эмоционального состояния',
          category: 'mindfulness',
          priority: 'high',
          completed: false,
        });
      }
      
      if (lastCheckUp.energy < 5) {
        recommendations.push({
          id: '2',
          title: 'Прогулка на свежем воздухе',
          description: '15-минутная прогулка поможет повысить уровень энергии',
          category: 'exercise',
          priority: 'medium',
          completed: false,
        });
      }
      
      if (lastCheckUp.stress > 7) {
        recommendations.push({
          id: '3',
          title: 'Дыхательные упражнения',
          description: 'Попробуйте технику 4-7-8 для снижения стресса',
          category: 'mindfulness',
          priority: 'high',
          completed: false,
        });
      }
    }
    
    return recommendations;
  },
};
