
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  primarySoft: string;
  card: string;
  header: string;
  nav: string;
  input: string;
}

const lightTheme: ThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  text: '#0f172a',
  subtext: '#64748b',
  border: '#e2e8f0',
  primary: '#10b981',
  primarySoft: 'rgba(16, 185, 129, 0.1)',
  card: '#ffffff',
  header: '#ffffff',
  nav: 'rgba(255, 255, 255, 0.95)',
  input: '#f1f5f9',
};

const darkTheme: ThemeColors = {
  background: '#112117',
  surface: '#1a2e22',
  surfaceAlt: '#0d1a12',
  text: '#ffffff',
  subtext: '#888888',
  border: '#333333',
  primary: '#19e66b',
  primarySoft: 'rgba(25, 230, 107, 0.1)',
  card: '#1a2e22',
  header: 'rgba(26, 46, 34, 0.9)',
  nav: 'rgba(17, 33, 23, 0.95)',
  input: '#1a2e22',
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      const savedTheme = await StorageService.getItem('app-theme');
      if (!mounted) return;

      if (savedTheme === 'light' || savedTheme === 'dark') {
        setMode(savedTheme);
      }
    };

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      StorageService.setItem('app-theme', newMode);
      return newMode;
    });
  };

  const colors = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
