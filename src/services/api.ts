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
      userId,
      lastSync: new Date().toISOString(),
    };
    
    const devices = JSON.parse(localStorage.getItem('emotrack-devices') || '[]');
    devices.push(newDevice);
    localStorage.setItem('emotrack-devices', JSON.stringify(devices));
    
    return newDevice;
  },

  // Удалить устройство
  deleteDevice: async (userId: string, deviceId: string): Promise<void> => {
    const devices = JSON.parse(localStorage.getItem('emotrack-devices') || '[]');
    const filteredDevices = devices.filter((d: DeviceIntegration) => d.id !== deviceId);
    localStorage.setItem('emotrack-devices', JSON.stringify(filteredDevices));
  },
};

// API функции для рекомендаций
export const recommendationAPI = {
  // Получить рекомендации
  getRecommendations: async (userId: string): Promise<Recommendation[]> => {
    // Mock рекомендации на основе последних чек-апов
    const checkUps = await checkUpAPI.getCheckUpsByPeriod(userId, 7);
    const recommendations: Recommendation[] = [];
    
    // Всегда показываем базовые рекомендации
    const baseRecommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Утренняя медитация',
        description: 'Начните день с 5-минутной медитации для настройки на позитивный лад',
        category: 'mindfulness',
        priority: 'high',
        completed: false,
      },
      {
        id: '2',
        title: 'Прогулка на свежем воздухе',
        description: '15-минутная прогулка поможет повысить уровень энергии и улучшить настроение',
        category: 'exercise',
        priority: 'medium',
        completed: false,
      },
      {
        id: '3',
        title: 'Правильное питание',
        description: 'Съешьте порцию овощей и фруктов для поддержания энергии в течение дня',
        category: 'nutrition',
        priority: 'medium',
        completed: false,
      },
      {
        id: '4',
        title: 'Качественный сон',
        description: 'Ложитесь спать в одно и то же время для лучшего восстановления',
        category: 'sleep',
        priority: 'high',
        completed: false,
      },
      {
        id: '5',
        title: 'Общение с близкими',
        description: 'Позвоните или встретьтесь с друзьями для поддержания социальных связей',
        category: 'social',
        priority: 'low',
        completed: false,
      },
      {
        id: '6',
        title: 'Дыхательные упражнения',
        description: 'Попробуйте технику 4-7-8 для снижения стресса и тревожности',
        category: 'mindfulness',
        priority: 'medium',
        completed: false,
      },
      {
        id: '7',
        title: 'Физическая активность',
        description: 'Выполните 20-минутную зарядку или йогу для поддержания тонуса',
        category: 'exercise',
        priority: 'medium',
        completed: false,
      },
      {
        id: '8',
        title: 'Время для себя',
        description: 'Выделите 30 минут на любимое хобби или просто отдых',
        category: 'mindfulness',
        priority: 'low',
        completed: false,
      }
    ];
    
    // Добавляем персонализированные рекомендации на основе чек-апов
    if (checkUps.length > 0) {
      const lastCheckUp = checkUps[checkUps.length - 1];
      
      if (lastCheckUp.mood < 5) {
        baseRecommendations.push({
          id: '9',
          title: 'Медитация для поднятия настроения',
          description: 'Попробуйте 10-минутную медитацию для улучшения эмоционального состояния',
          category: 'mindfulness',
          priority: 'high',
          completed: false,
        });
      }
      
      if (lastCheckUp.energy < 5) {
        baseRecommendations.push({
          id: '10',
          title: 'Энергетическая зарядка',
          description: 'Выполните быстрые упражнения для повышения уровня энергии',
          category: 'exercise',
          priority: 'high',
          completed: false,
        });
      }
      
      if (lastCheckUp.stress > 7) {
        baseRecommendations.push({
          id: '11',
          title: 'Техники релаксации',
          description: 'Попробуйте прогрессивную мышечную релаксацию для снятия напряжения',
          category: 'mindfulness',
          priority: 'high',
          completed: false,
        });
      }
    }
    
    return baseRecommendations;
  },
};
