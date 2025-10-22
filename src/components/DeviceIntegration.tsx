import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { deviceAPI } from '../services/api';
import { DeviceIntegration } from '../types';
import { Apple, Watch, Heart, Zap, Smartphone, Plus, AlertCircle, Trash2, X } from 'lucide-react';

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

  const handleDeleteDevice = async (deviceId: string) => {
    if (!user) return;
    
    try {
      await deviceAPI.deleteDevice(user.id, deviceId);
      setDevices(prev => prev.filter(device => device.id !== deviceId));
    } catch (error) {
      console.error('Error deleting device:', error);
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
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
      case 'oura':
        return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30';
      case 'whoop':
        return 'text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30';
      case 'fitbit':
        return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="card text-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-dark-300">Загрузка устройств...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark-50">
            Устройства
          </h2>
          <p className="text-dark-300">
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
          <div className="w-16 h-16 bg-dark-800 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-semibold text-dark-50 mb-2">
            Нет подключённых устройств
          </h3>
          <p className="text-dark-300 mb-4">
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
                    <h3 className="font-semibold text-dark-50">
                      {device.name}
                    </h3>
                    <p className="text-sm text-dark-300">
                      {device.connected ? 'Подключено' : 'Отключено'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Удалить устройство"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-300">Статус:</span>
                  <span className={device.connected ? 'text-green-400' : 'text-gray-400'}>
                    {device.connected ? 'Активно' : 'Неактивно'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-300">Последняя синхронизация:</span>
                  <span className="text-dark-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-2xl p-8 w-full max-w-lg border border-dark-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-dark-50">
                Подключить устройство
              </h3>
              <button
                onClick={() => setShowAddDevice(false)}
                className="p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {(['apple_watch', 'oura', 'whoop', 'fitbit'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleConnectDevice(type)}
                  className="w-full p-6 rounded-2xl border-2 border-dark-600 hover:border-primary-400 bg-gradient-to-br from-dark-800 to-dark-900 hover:from-dark-700 hover:to-dark-800 transition-all duration-300 hover:shadow-lg text-left"
                >
                  <div className="flex items-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 ${getDeviceColor(type)}`}>
                      {getDeviceIcon(type)}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-dark-50 mb-1">
                        {getDeviceName(type)}
                      </div>
                      <div className="text-sm text-dark-300">
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
            
            <div className="mt-8 p-4 bg-blue-900/30 rounded-2xl border border-blue-800/50">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-blue-400 mr-3 mt-0.5" />
                <div className="text-sm text-blue-300">
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
