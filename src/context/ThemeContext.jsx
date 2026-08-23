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
    { id: 'default', name: 'Midnight Purple', sub: 'Deep & mysterious', color: '#aa3bff' },
    { id: 'crimson', name: 'Cinematic Crimson', sub: 'Dark theater vibes', color: '#f43f5e' },
    { id: 'emerald', name: 'Obsidian Emerald', sub: 'Matrix inspired', color: '#10b981' },
    { id: 'gold', name: 'Golden Hour', sub: 'Warm & premium', color: '#eab308' },
    { id: 'ocean', name: 'Oceanic Blue', sub: 'Deep sea calm', color: '#0ea5e9' },
    { id: 'cyberpunk', name: 'Cyberpunk Pink', sub: 'Neon night city', color: '#ec4899' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
