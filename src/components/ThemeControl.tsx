import React, { useEffect } from 'react';
import { useSessionStorage } from '../hooks/use-session-storage';

export type Theme = 'light' | 'dark';
export type AccentColor = 'blue' | 'purple' | 'emerald' | 'orange' | 'pink' | 'mint';
export type Density = 'compact' | 'comfortable' | 'spacious';

interface ThemeControlProps {
  className?: string;
}

export const ThemeControl: React.FC<ThemeControlProps> = ({ className = '' }) => {
  const [theme, setTheme] = useSessionStorage<Theme>('theme', 'light');
  const [accent, setAccent] = useSessionStorage<AccentColor>('accent', 'blue');
  const [density, setDensity] = useSessionStorage<Density>('density', 'comfortable');

  // Apply theme attributes to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-accent', accent);
    document.documentElement.setAttribute('data-density', density);
  }, [theme, accent, density]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const accentOptions: { value: AccentColor; label: string; emoji: string }[] = [
    { value: 'blue', label: 'Ocean Blue', emoji: '🔵' },
    { value: 'purple', label: 'Royal Purple', emoji: '🟣' },
    { value: 'emerald', label: 'Forest Emerald', emoji: '🟢' },
    { value: 'orange', label: 'Sunset Orange', emoji: '🟠' },
    { value: 'pink', label: 'Cherry Pink', emoji: '🌸' },
    { value: 'mint', label: 'Cool Mint', emoji: '💚' },
  ];

  const densityOptions: { value: Density; label: string; icon: string }[] = [
    { value: 'compact', label: 'Compact', icon: '📱' },
    { value: 'comfortable', label: 'Comfortable', icon: '💻' },
    { value: 'spacious', label: 'Spacious', icon: '🖥️' },
  ];

  return (
    <div className={`glass-nav flex items-center gap-6 ${className}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="btn btn-ghost btn-sm rounded-2xl"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="text-xl" role="img" aria-hidden="true">
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
      </button>

      {/* Accent Color Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-tertiary font-medium sr-only">Colors:</span>
        <div className="flex gap-2">
          {accentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setAccent(option.value)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                accent === option.value 
                  ? 'opacity-100 ring-2 ring-accent-color ring-offset-2 ring-offset-bg-elevated scale-110' 
                  : 'opacity-60 hover:opacity-90'
              }`}
              title={`Set ${option.label} accent color`}
              aria-label={`Set ${option.label} accent color`}
              aria-pressed={accent === option.value}
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {option.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Density Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-tertiary font-medium sr-only">Density:</span>
        <div className="flex gap-1">
          {densityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setDensity(option.value)}
              className={`btn btn-sm rounded-xl transition-all duration-300 ${
                density === option.value 
                  ? 'btn-primary shadow-lg' 
                  : 'btn-ghost opacity-60 hover:opacity-90'
              }`}
              title={`Set ${option.label} density`}
              aria-label={`Set ${option.label} density`}
              aria-pressed={density === option.value}
            >
              <span className="text-sm" role="img" aria-hidden="true">
                {option.icon}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
