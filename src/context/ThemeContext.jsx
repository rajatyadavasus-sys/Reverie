import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('reverie-theme') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('reverie-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themes = [
    { id: 'default', name: 'Midnight Purple', sub: 'Deep & mysterious', color: '#aa3bff' },
    { id: 'ocean', name: 'Oceanic Blue', sub: 'Deep sea calm', color: '#0ea5e9' },
    { id: 'synthwave', name: 'Neon Synthwave', sub: 'Retro future vibes', color: '#f9a8d4' },
    { id: 'noir', name: 'Cinema Noir', sub: 'Classic monochrome', color: '#ffffff' },
    { id: 'toxic', name: 'Toxic Glow', sub: 'Intense green neon', color: '#4ade80' },
    { id: 'rust', name: 'Cosmic Rust', sub: 'Warm outer space', color: '#f97316' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
