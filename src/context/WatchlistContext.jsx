import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const item = window.localStorage.getItem('feelflix-watchlist');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Error reading watchlist from local storage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('feelflix-watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error("Error saving watchlist to local storage:", error);
    }
  }, [watchlist]);

  const addToWatchlist = (media) => {
    setWatchlist((prev) => {
      if (prev.find((item) => item.id === media.id && item.media_type === media.media_type)) {
        return prev;
      }
      return [...prev, media];
    });
  };

  const removeFromWatchlist = (id, media_type) => {
    setWatchlist((prev) => prev.filter((item) => !(item.id === id && item.media_type === media_type)));
  };

  const isInWatchlist = (id, media_type) => {
    return watchlist.some((item) => item.id === id && item.media_type === media_type);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
