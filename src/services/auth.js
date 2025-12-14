// src/services/auth.js
// Authentication service for Laravel backend

import apiFetch, { setAuthToken, removeAuthToken, setStoredUser, removeStoredUser } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_WWW_BASE_URL || 'http://api.pinkdreams.store/api';

export const authService = {
  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} Login response with token and user data
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Handle standardized API response: { status: 'success', message: '...', data: { token, ...user }, code: 200 }
      const isSuccess = data.status === 'success' || response.ok;
      const userData = data.data || {};
      const token = userData.token || data.token;
      const message = data.message || 'Login successful';

      if (!isSuccess) {
        return { 
          success: false, 
          message: data.message || 'Invalid credentials' 
        };
      }

      if (!token) {
        return { 
          success: false, 
          message: 'No authentication token received' 
        };
      }

      // Store token and user data
      setAuthToken(token);
      
      // Store user data without the token field
      const { token: _, ...userWithoutToken } = userData;
      setStoredUser(userWithoutToken);

      return {
        success: true,
        token: token,
        user: userData,
        message: message,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please try again.' 
      };
    }
  },

  /**
   * Logout current user
   * @returns {Promise} Logout response
   */
  logout: async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiFetch('/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      removeAuthToken();
      removeStoredUser();
    }
  },

  /**
   * Request password reset
   * @param {string} email 
   * @returns {Promise} Password reset response
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      // Handle standardized response: { status: 'success|error', message: '...', code: 200|422 }
      const isSuccess = data.status === 'success' || response.ok;

      if (!isSuccess) {
        return { 
          success: false, 
          message: data.message || 'Failed to send reset email' 
        };
      }

      return {
        success: true,
        message: data.message || 'Password reset email sent successfully',
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please try again.' 
      };
    }
  },

  /**
   * Login with QR code
   * @param {string} qrToken 
   * @returns {Promise} Login response
   */
  loginWithQR: async (qrToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/qr-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ qr_token: qrToken }),
      });

      const data = await response.json();
      
      // Handle standardized response
      const isSuccess = data.status === 'success' || response.ok;
      const userData = data.data || {};
      const token = userData.token || data.token;

      if (!isSuccess) {
        return { 
          success: false, 
          message: data.message || 'QR login failed' 
        };
      }

      // Store token and user data
      if (token) {
        setAuthToken(token);
      }
      if (userData) {
        const { token: _, ...userWithoutToken } = userData;
        setStoredUser(userWithoutToken);
      }

      return {
        success: true,
        token: token,
        user: userData,
      };
    } catch (error) {
      console.error('QR login error:', error);
      return { 
        success: false, 
        message: error.message || 'Network error. Please try again.' 
      };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    const response = await apiFetch('/profile', {
      method: 'GET',
    });
    
    // Handle standardized response: { status: 'success', data: {...}, message: '...' }
    // Return the data object directly so consuming components get clean data
    return response.data || response;
  },

  /**
   * Update user profile
   * @param {Object} profileData 
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    const response = await apiFetch('/profile', {
      method: 'PUT',
      body: profileData,
    });
    
    // Handle standardized response
    return response.data || response;
  },
};
