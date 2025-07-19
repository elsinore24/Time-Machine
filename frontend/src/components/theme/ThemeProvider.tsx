// Theme provider for managing era-based visual theming
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  // Automatically detect theme from route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/1980s')) {
      setCurrentTheme('1980s');
    } else if (path.includes('/1990s')) {
      setCurrentTheme('1990s');
    } else if (path.includes('/2000s')) {
      setCurrentTheme('2000s');
    } else {
      setCurrentTheme('default');
    }
  }, [location.pathname]);

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
    const themeClasses = ['theme-1980s', 'theme-1990s', 'theme-2000s'];
    themeClasses.forEach(themeClass => {
      body.classList.remove(themeClass);
      app?.classList.remove(themeClass);
      removeThemeFromComponents(themeClass);
    });

    // Add new theme class
    if (currentTheme !== 'default') {
      const themeClass = `theme-${currentTheme}`;
      body.classList.add(themeClass);
      app?.classList.add(themeClass);
      
      // Apply theme to all themed components
      applyThemeToComponents(themeClass);
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