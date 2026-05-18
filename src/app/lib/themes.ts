// src/app/lib/themes.ts

export type ThemeType = 'cool' | 'cool-professional';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  border: string;
  text: string;
  textSecondary: string;
}

export const themes: Record<ThemeType, Theme> = {
  'cool': {
    name: 'Cool',
    primary: '#00ffff',
    secondary: '#0088cc',
    accent: '#ffffff',
    background: 'rgba(0, 20, 30, 0.95)',
    cardBg: 'rgba(0, 40, 60, 0.8)',
    border: 'rgba(0, 255, 255, 0.3)',
    text: '#ffffff',
    textSecondary: '#88ccff'
  },
  'cool-professional': {
    name: 'Cool Professional',
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#f8fafc',
    background: 'rgba(15, 23, 42, 0.95)',
    cardBg: 'rgba(30, 41, 59, 0.9)',
    border: 'rgba(37, 99, 235, 0.4)',
    text: '#f8fafc',
    textSecondary: '#cbd5e1'
  }
};

export const getTheme = (themeType: ThemeType): Theme => {
  return themes[themeType];
};

export const toggleTheme = (currentTheme: ThemeType): ThemeType => {
  return currentTheme === 'cool' ? 'cool-professional' : 'cool';
};

// Theme-aware colors for sections
export const getSectionColors = (themeType: ThemeType) => {
  if (themeType === 'cool') {
    return {
      portal: '#00ffff',
      nexus: '#ff00ff',
      games: '#ffff00',
      dashboard: '#ff4400',
      professional: '#0088ff'
    };
  } else {
    return {
      portal: '#3b82f6',
      nexus: '#8b5cf6',
      games: '#10b981',
      dashboard: '#f59e0b',
      professional: '#2563eb'
    };
  }
};