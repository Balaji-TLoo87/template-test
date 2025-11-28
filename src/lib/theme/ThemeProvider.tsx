'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import EventBus from '../eventbus/EventBus';
import type { AppEvent } from '../eventbus/types';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }

    // Subscribe to theme change events
    const eventBus = EventBus.getInstance();
    const unsubscribe = eventBus.subscribe(
      'THEME_CHANGE',
      (payload: { theme: Theme }) => {
        setTheme(payload.theme);
        applyTheme(payload.theme);
        localStorage.setItem('theme', payload.theme);
      }
    );

    return unsubscribe;
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const eventBus = EventBus.getInstance();
    eventBus.emit<AppEvent>({
      type: 'THEME_CHANGE',
      payload: { theme: newTheme },
      timestamp: Date.now(),
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
