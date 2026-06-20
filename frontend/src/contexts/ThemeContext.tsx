import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../styles/theme';
import { StorageService } from '../storage/StorageService';

type ThemeType = typeof lightTheme;

interface ThemeContextData {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@FitTrack:themePreference';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      const savedTheme = await StorageService.getItem<'light' | 'dark'>(THEME_STORAGE_KEY);
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }
    };
    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newThemeState = !isDarkMode;
    setIsDarkMode(newThemeState);
    await StorageService.setItem(THEME_STORAGE_KEY, newThemeState ? 'dark' : 'light');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};