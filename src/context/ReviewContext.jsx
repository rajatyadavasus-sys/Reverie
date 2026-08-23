import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const { currentUser, promptLogin } = useAuth();
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

  const addReview = async (review) => {
    if (!currentUser) {
      promptLogin();
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
    setReviews(newList); // Optimistic UI update

    try {
      // 1. Update personal list
      await setDoc(doc(db, 'users', currentUser.uid), { reviews: newList }, { merge: true });
      
      // 2. Add to global_reviews collection
      const globalReviewId = `${newReview.media_type}_${newReview.id}_${currentUser.uid}`;
      await setDoc(doc(db, 'global_reviews', globalReviewId), {
        ...newReview,
        authorName: currentUser.displayName || 'Reverie User',
        photoURL: currentUser.photoURL || null,
        authorUid: currentUser.uid,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error updating reviews in Firebase:", err);
    }
  };

  const removeReview = async (id, media_type) => {
    if (!currentUser) return;
    const newList = reviews.filter(r => !(r.id === id && r.media_type === media_type));
    setReviews(newList); // Optimistic UI update
    
    try {
      await setDoc(doc(db, 'users', currentUser.uid), { reviews: newList }, { merge: true });
      const globalReviewId = `${media_type}_${id}_${currentUser.uid}`;
      await deleteDoc(doc(db, 'global_reviews', globalReviewId));
    } catch (err) {
      console.error("Error removing review from Firebase:", err);
    }
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
