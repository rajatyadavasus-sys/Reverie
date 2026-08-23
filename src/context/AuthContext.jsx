import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import AuthModal from '../components/auth/AuthModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const updateUsername = async (newName) => {
    if (!auth.currentUser) return;
    try {
      const { updateProfile } = await import('firebase/auth');
      const { collection, query, where, getDocs, writeBatch, doc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');

      const trimmedName = newName.trim();

      // 1. Update Firebase Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: trimmedName
      });
      
      // 2. Update all global_reviews authored by this user
      const batch = writeBatch(db);
      const q = query(collection(db, 'global_reviews'), where('authorUid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((document) => {
        batch.update(document.ref, { authorName: trimmedName });
      });

      // Execute batch
      await batch.commit();

      // 3. Update local state immediately
      setCurrentUser({ ...auth.currentUser, displayName: trimmedName });
    } catch (error) {
      console.error("Failed to update username:", error);
      throw error;
    }
  };

  // Call this anywhere in the app to open the beautiful auth modal
  const promptLogin = useCallback(() => {
    setShowModal(true);
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginWithGoogle, promptLogin, logout, updateUsername }}>
      {!loading && children}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
