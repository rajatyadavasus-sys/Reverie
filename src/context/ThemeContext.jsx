import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('reverie-theme') || 'default';
  });

  useEffect(() => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('reverie-theme', theme);
  }, [theme]);

  const themes = [
    { id: 'default', name: 'Midnight Purple', color: '#aa3bff' },
    { id: 'crimson', name: 'Cinematic Crimson', color: '#f43f5e' },
    { id: 'emerald', name: 'Obsidian Emerald', color: '#10b981' },
    { id: 'gold', name: 'Golden Hour', color: '#eab308' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
