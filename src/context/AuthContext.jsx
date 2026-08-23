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
      // Import updateProfile dynamically or make sure it's at the top
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(auth.currentUser, {
        displayName: newName
      });
      // Update local state to reflect immediately
      setCurrentUser({ ...auth.currentUser, displayName: newName });
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
