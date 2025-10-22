import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { deviceAPI } from '../services/api';
import { DeviceIntegration } from '../types';
import { Apple, Watch, Heart, Zap, Smartphone, Plus, AlertCircle } from 'lucide-react';

export function DeviceIntegrationComponent() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<DeviceIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);


  const loadDevices = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await deviceAPI.getDevices(user.id);
      setDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDevices();
    }
  }, [user, loadDevices]);

  const handleConnectDevice = async (type: DeviceIntegration['type']) => {
    if (!user) return;
    
    try {
      const device = await deviceAPI.connectDevice(user.id, {
        name: getDeviceName(type),
        type,
        connected: true,
      });
      setDevices(prev => [...prev, device]);
      setShowAddDevice(false);
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  };

  const getDeviceName = (type: DeviceIntegration['type']) => {
    const names = {
      apple_watch: 'Apple Watch',
      oura: 'Oura Ring',
      whoop: 'Whoop Strap',
      fitbit: 'Fitbit',
    };
    return names[type];
  };

  const getDeviceIcon = (type: DeviceIntegration['type']) => {
    switch (type) {
      case 'apple_watch':
        return <Apple className="w-6 h-6" />;
      case 'oura':
        return <Heart className="w-6 h-6" />;
      case 'whoop':
        return <Zap className="w-6 h-6" />;
      case 'fitbit':
        return <Watch className="w-6 h-6" />;
      default:
        return <Smartphone className="w-6 h-6" />;
    }
  };

  const getDeviceColor = (type: DeviceIntegration['type']) => {
    switch (type) {
      case 'apple_watch':
        return 'text-gray-600 bg-gray-100';
      case 'oura':
        return 'text-purple-600 bg-purple-100';
      case 'whoop':
        return 'text-orange-600 bg-orange-100';
      case 'fitbit':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600 dark:text-sage-400">Загрузка устройств...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-50">
            Устройства
          </h2>
          <p className="text-sage-600 dark:text-sage-400">
            Подключите носимые устройства для автоматического отслеживания
          </p>
        </div>
        <button
          onClick={() => setShowAddDevice(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить устройство
        </button>
      </div>

      {/* Список устройств */}
      {devices.length === 0 ? (
        <div className="card text-center">
          <div className="w-16 h-16 bg-sage-100 dark:bg-sage-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-sage-400" />
          </div>
          <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50 mb-2">
            Нет подключённых устройств
          </h3>
          <p className="text-sage-600 dark:text-sage-400 mb-4">
            Подключите носимое устройство для автоматического отслеживания вашего состояния
          </p>
          <button
            onClick={() => setShowAddDevice(true)}
            className="btn-primary"
          >
            Подключить устройство
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${getDeviceColor(device.type)}`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sage-900 dark:text-sage-50">
                      {device.name}
                    </h3>
                    <p className="text-sm text-sage-600 dark:text-sage-400">
                      {device.connected ? 'Подключено' : 'Отключено'}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-600 dark:text-sage-400">Статус:</span>
                  <span className={device.connected ? 'text-green-600' : 'text-gray-500'}>
                    {device.connected ? 'Активно' : 'Неактивно'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600 dark:text-sage-400">Последняя синхронизация:</span>
                  <span className="text-sage-900 dark:text-sage-50">
                    {new Date(device.lastSync).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно добавления устройства */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-sage-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-50">
                Подключить устройство
              </h3>
              <button
                onClick={() => setShowAddDevice(false)}
                className="text-sage-400 hover:text-sage-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {(['apple_watch', 'oura', 'whoop', 'fitbit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleConnectDevice(type)}
                  className="w-full p-4 rounded-lg border border-sage-200 dark:border-sage-700 hover:border-sage-300 dark:hover:border-sage-600 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getDeviceColor(type)}`}>
                      {getDeviceIcon(type)}
                    </div>
                    <div>
                      <div className="font-medium text-sage-900 dark:text-sage-50">
                        {getDeviceName(type)}
                      </div>
                      <div className="text-sm text-sage-600 dark:text-sage-400">
                        {type === 'apple_watch' && 'Отслеживание активности и пульса'}
                        {type === 'oura' && 'Мониторинг сна и восстановления'}
                        {type === 'whoop' && 'Анализ нагрузки и восстановления'}
                        {type === 'fitbit' && 'Фитнес-трекер и мониторинг здоровья'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Примечание:</strong> Интеграция с устройствами находится в разработке. 
                  Данные будут синхронизироваться автоматически после подключения.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
