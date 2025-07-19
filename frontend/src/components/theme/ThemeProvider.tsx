// Theme provider for managing 1980s visual theming
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void;
  isThemeActive: (theme: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  const isThemeActive = (theme: string) => {
    return currentTheme === theme;
  };

  // Apply theme classes to body and app elements
  useEffect(() => {
    const body = document.body;
    const app = document.querySelector('.App');

    // Remove existing theme classes
    body.classList.remove('theme-1980s');
    app?.classList.remove('theme-1980s');

    // Add new theme class
    if (currentTheme === '1980s') {
      body.classList.add('theme-1980s');
      app?.classList.add('theme-1980s');
      
      // Apply theme to all themed components
      applyThemeToComponents('theme-1980s');
    } else {
      // Remove theme from all components
      removeThemeFromComponents('theme-1980s');
    }
  }, [currentTheme]);

  const applyThemeToComponents = (themeClass: string) => {
    const selectors = [
      '.app-header',
      '.app-title',
      '.era-selector',
      '.era-dropdown',
      '.message-bubble.user',
      '.message-bubble.ai',
      '.chat-input',
      '.send-button',
      '.connection-status.connected',
      '.connection-status.disconnected',
      '.connection-status.checking',
      '.typing-dots',
      '.messages-container',
      '.app-main'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.classList.add(themeClass);
      });
    });
  };

  const removeThemeFromComponents = (themeClass: string) => {
    const elementsWithTheme = document.querySelectorAll(`.${themeClass}`);
    elementsWithTheme.forEach(element => {
      element.classList.remove(themeClass);
    });
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    isThemeActive
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;