// src/services/api.js
// Base API configuration and utilities

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Set the authentication token in localStorage
 */
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Get the stored user data from localStorage
 */
export const getStoredUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Set the user data in localStorage
 */
export const setStoredUser = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

/**
 * Remove the user data from localStorage
 */
export const removeStoredUser = () => {
  localStorage.removeItem('user_data');
};

/**
 * Base fetch wrapper with authentication and error handling
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // If body is an object, stringify it
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    
    // Parse response
    const data = await response.json();

    // Handle unauthorized
    if (response.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      removeStoredUser();
      window.location.href = '/';
      throw new Error('Unauthorized - Please login again');
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default apiFetch;
