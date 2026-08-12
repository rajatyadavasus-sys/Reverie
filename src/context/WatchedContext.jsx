import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchedContext = createContext();

export const WatchedProvider = ({ children }) => {
  const [watched, setWatched] = useState(() => {
    try {
      const item = window.localStorage.getItem('feelflix-watched');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('feelflix-watched', JSON.stringify(watched));
    } catch (err) {
      console.error(err);
    }
  }, [watched]);

  const markWatched = (media) => {
    setWatched(prev => {
      if (prev.find(i => i.id === media.id && i.media_type === media.media_type)) return prev;
      return [...prev, { ...media, watchedAt: new Date().toISOString() }];
    });
  };

  const unmarkWatched = (id, media_type) => {
    setWatched(prev => prev.filter(i => !(i.id === id && i.media_type === media_type)));
  };

  const isWatched = (id, media_type) =>
    watched.some(i => i.id === id && i.media_type === media_type);

  return (
    <WatchedContext.Provider value={{ watched, markWatched, unmarkWatched, isWatched }}>
      {children}
    </WatchedContext.Provider>
  );
};

export const useWatched = () => useContext(WatchedContext);
