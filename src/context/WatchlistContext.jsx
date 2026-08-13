import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { currentUser, promptLogin } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().watchlist) {
        setWatchlist(docSnap.data().watchlist);
      } else {
        setWatchlist([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateFirebase = async (newList) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), { watchlist: newList }, { merge: true });
    } catch (err) {
      console.error("Error updating watchlist in Firebase:", err);
    }
  };

  const addToWatchlist = (media) => {
    if (!currentUser) {
      promptLogin();
      return;
    }
    
    if (watchlist.find((item) => item.id === media.id && item.media_type === media.media_type)) {
      return;
    }
    const newList = [...watchlist, media];
    setWatchlist(newList);
    updateFirebase(newList);
  };

  const removeFromWatchlist = (id, media_type) => {
    if (!currentUser) return;
    const newList = watchlist.filter((item) => !(item.id === id && item.media_type === media_type));
    setWatchlist(newList);
    updateFirebase(newList);
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
