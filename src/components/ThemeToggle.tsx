import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useLocalStorage';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme.mode === 'light' ? (
        <Moon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
      ) : (
        <Sun className="w-5 h-5 text-sage-600 dark:text-sage-400" />
      )}
    </button>
  );
}
