export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Emotion {
  id: string;
  name: string;
  emoji: string;
  color: string;
  intensity: number; // 1-10
}

export interface CheckUp {
  id: string;
  userId: string;
  emotion: Emotion;
  note?: string;
  timestamp: string;
  mood: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
}

export interface Reminder {
  id: string;
  userId: string;
  enabled: boolean;
  time: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'custom';
  message: string;
}

export interface AnalyticsData {
  period: 'week' | 'month' | 'year';
  averageMood: number;
  averageEnergy: number;
  averageStress: number;
  emotionDistribution: { [emotionId: string]: number };
  trends: {
    date: string;
    mood: number;
    energy: number;
    stress: number;
  }[];
}

export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
}

export interface DeviceIntegration {
  id: string;
  name: string;
  type: 'apple_watch' | 'oura' | 'whoop' | 'fitbit';
  connected: boolean;
  lastSync: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'mindfulness' | 'exercise' | 'sleep' | 'nutrition' | 'social';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}
