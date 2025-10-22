import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkUpAPI, EMOTIONS } from '../services/api';
import { CheckUp } from '../types';
import { Heart, Zap, AlertTriangle, Save } from 'lucide-react';

export function CheckUpForm() {
  const { user } = useAuth();
  const [selectedEmotion, setSelectedEmotion] = useState<typeof EMOTIONS[0] | null>(null);
  const [note, setNote] = useState('');
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion || !user) return;

    setIsSubmitting(true);
    try {
      const checkUp: Omit<CheckUp, 'id'> = {
        userId: user.id,
        emotion: selectedEmotion,
        note,
        timestamp: new Date().toISOString(),
        mood,
        energy,
        stress,
      };

      await checkUpAPI.saveCheckUp(checkUp);
      setIsSubmitted(true);
      
      // Сброс формы через 2 секунды
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedEmotion(null);
        setNote('');
        setMood(5);
        setEnergy(5);
        setStress(5);
      }, 2000);
    } catch (error) {
      console.error('Error saving check-up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="card text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="text-xl font-semibold text-sage-900 dark:text-sage-50 mb-2">
          Чек-ап сохранён!
        </h3>
        <p className="text-sage-600 dark:text-sage-400">
          Спасибо за то, что поделились своими эмоциями
        </p>
      </div>
    );
  }

  return (
    <div className="emotion-card">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
          <span className="text-4xl">💭</span>
        </div>
        <h2 className="text-4xl font-bold text-dark-50 mb-4">
          Как вы себя чувствуете?
        </h2>
        <p className="text-dark-300 text-xl">
          Выберите эмоцию и оцените своё состояние
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Выбор эмоции */}
        <div>
          <label className="block text-2xl font-bold text-dark-100 mb-8">
            Выберите эмоцию
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                type="button"
                onClick={() => setSelectedEmotion(emotion)}
                className={`emotion-button ${
                  selectedEmotion?.id === emotion.id ? 'selected' : ''
                }`}
              >
                <div className="emotion-icon">{emotion.emoji}</div>
                <div className="emotion-name">{emotion.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Оценки состояния */}
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-red-900/30 to-pink-900/30 rounded-2xl p-6 border border-red-800/50">
            <label className="flex items-center text-xl font-bold text-dark-100 mb-4">
              <Heart className="w-6 h-6 mr-4 text-red-400" />
              Настроение: {mood}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-4 bg-gradient-to-r from-red-800 to-pink-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-800/50">
            <label className="flex items-center text-xl font-bold text-dark-100 mb-4">
              <Zap className="w-6 h-6 mr-4 text-yellow-400" />
              Энергия: {energy}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-4 bg-gradient-to-r from-yellow-800 to-orange-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl p-6 border border-orange-800/50">
            <label className="flex items-center text-xl font-bold text-dark-100 mb-4">
              <AlertTriangle className="w-6 h-6 mr-4 text-orange-400" />
              Стресс: {stress}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full h-4 bg-gradient-to-r from-orange-800 to-red-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Заметка */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-800/50">
          <label className="block text-xl font-bold text-dark-100 mb-4">
            💭 Мысль дня (необязательно)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input min-h-[120px] resize-none bg-dark-800/50 border-dark-600 text-dark-100 placeholder-dark-400"
            placeholder="Поделитесь своими мыслями, что вас беспокоит или радует..."
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={!selectedEmotion || isSubmitting}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-6 rounded-2xl font-bold text-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-8 h-8 mr-4" />
              Сохранить чек-ап
            </>
          )}
        </button>
      </form>
    </div>
  );
}
