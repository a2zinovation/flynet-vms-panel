import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";
import { getAuthToken, getStoredUser, removeAuthToken, removeStoredUser } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();
      
      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Login result
   */
  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error in context:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
      removeStoredUser();
    }
  };

  /**
   * Update user data in context and storage
   * @param {Object} userData 
   */
  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      setStoredUser(userData);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
