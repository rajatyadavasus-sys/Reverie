import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const WatchedContext = createContext();

export const WatchedProvider = ({ children }) => {
  const { currentUser, promptLogin } = useAuth();
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setWatched([]);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().watched) {
        setWatched(docSnap.data().watched);
      } else {
        setWatched([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateFirebase = async (newList) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), { watched: newList }, { merge: true });
    } catch (err) {
      console.error("Error updating watched list in Firebase:", err);
    }
  };

  const markWatched = (media) => {
    if (!currentUser) {
      promptLogin();
      return;
    }

    if (watched.find(i => i.id === media.id && i.media_type === media.media_type)) return;
    const newList = [...watched, { ...media, watchedAt: new Date().toISOString() }];
    setWatched(newList);
    updateFirebase(newList);
  };

  const unmarkWatched = (id, media_type) => {
    if (!currentUser) return;
    const newList = watched.filter(i => !(i.id === id && i.media_type === media_type));
    setWatched(newList);
    updateFirebase(newList);
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
