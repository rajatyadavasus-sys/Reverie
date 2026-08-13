import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const ReviewContext = createContext();

// Review shape:
// { id, media_type, title, poster_path, tag, opinion, createdAt }

export const ReviewProvider = ({ children }) => {
  const { currentUser, loginWithGoogle } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().reviews) {
        setReviews(docSnap.data().reviews);
      } else {
        setReviews([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const updateFirebase = async (newList) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), { reviews: newList }, { merge: true });
    } catch (err) {
      console.error("Error updating reviews in Firebase:", err);
    }
  };

  const addReview = (review) => {
    if (!currentUser) {
      alert("Please Sign In to save reviews!");
      loginWithGoogle();
      return;
    }

    const newReview = {
      ...review,
      createdAt: new Date().toISOString()
    };

    const filtered = reviews.filter(
      r => !(r.id === newReview.id && r.media_type === newReview.media_type)
    );
    
    const newList = [newReview, ...filtered];
    setReviews(newList);
    updateFirebase(newList);
  };

  const removeReview = (id, media_type) => {
    if (!currentUser) return;
    const newList = reviews.filter(r => !(r.id === id && r.media_type === media_type));
    setReviews(newList);
    updateFirebase(newList);
  };

  const getReview = (id, media_type) =>
    reviews.find(r => r.id === id && r.media_type === media_type) || null;

  return (
    <ReviewContext.Provider value={{ reviews, addReview, removeReview, getReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);
