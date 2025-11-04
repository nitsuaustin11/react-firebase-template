import { createContext, useContext, useState, useEffect } from 'react';
import { readDocument, updateDocument } from '../services/firebaseService';
import { useAuth } from './AuthContext';

const UserContext = createContext();

/**
 * UserContext Provider
 * Manages user profile data and app-level state
 */
export function UserProvider({ children }) {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile when currentUser changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await readDocument('users', currentUser.uid);

        if (result.success) {
          setUserProfile(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [currentUser]);

  /**
   * Updates user profile in state and database
   */
  const updateUserProfile = async (updates) => {
    if (!currentUser) {
      return { success: false, error: 'No user logged in' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateDocument('users', currentUser.uid, updates);

      if (result.success) {
        setUserProfile(prev => ({ ...prev, ...updates }));
      } else {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMsg = 'Failed to update profile';
      console.error(errorMsg, err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes user profile from database
   */
  const refreshUserProfile = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const result = await readDocument('users', currentUser.uid);
      if (result.success) {
        setUserProfile(result.data);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears user profile (used on logout)
   */
  const clearUserProfile = () => {
    setUserProfile(null);
    setError(null);
  };

  const value = {
    userProfile,
    loading,
    error,
    updateUserProfile,
    refreshUserProfile,
    clearUserProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Custom hook to use UserContext
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
