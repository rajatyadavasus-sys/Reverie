import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

// Review shape:
// { id, media_type, title, poster_path, tag, opinion, createdAt }

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    try {
      const item = window.localStorage.getItem('feelflix-reviews');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('feelflix-reviews', JSON.stringify(reviews));
    } catch (err) {
      console.error(err);
    }
  }, [reviews]);

  const addReview = (review) => {
    setReviews(prev => {
      // Replace existing review for same title
      const filtered = prev.filter(
        r => !(r.id === review.id && r.media_type === review.media_type)
      );
      return [{ ...review, createdAt: new Date().toISOString() }, ...filtered];
    });
  };

  const removeReview = (id, media_type) => {
    setReviews(prev => prev.filter(r => !(r.id === id && r.media_type === media_type)));
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
