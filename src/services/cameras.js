// src/services/cameras.js
// Camera API service layer

import apiFetch from './api';

export const cameraService = {
  /**
   * Get all cameras with optional filters
   * @param {Object} params - Query parameters (page, per_page, search, status, etc.)
   * @returns {Promise} Camera list with pagination
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/cameras${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiFetch(endpoint, {
      method: 'GET',
    });
    
    // Handle standardized response: { status: 'success', data: { data: [...], total, ... }, message: '...' }
    return response.data || response;
  },

  /**
   * Get a single camera by ID
   * @param {number} id - Camera ID
   * @returns {Promise} Camera details
   */
  getById: async (id) => {
    const response = await apiFetch(`/cameras/${id}`, {
      method: 'GET',
    });
    return response.data || response;
  },

  /**
   * Get camera stream URL (HLS endpoint)
   * @param {number} id - Camera ID
   * @returns {Promise} Stream URL
   */
  getStreamUrl: async (id) => {
    const response = await apiFetch(`/cameras/${id}/stream`, {
      method: 'GET',
    });
    return response.data || response;
  },

  /**
   * Create a new camera
   * @param {Object} cameraData - Camera data
   * @returns {Promise} Created camera
   */
  create: async (cameraData) => {
    return await apiFetch('/cameras', {
      method: 'POST',
      body: cameraData,
    });
  },

  /**
   * Update an existing camera
   * @param {number} id - Camera ID
   * @param {Object} cameraData - Updated camera data
   * @returns {Promise} Updated camera
   */
  update: async (id, cameraData) => {
    return await apiFetch(`/cameras/${id}`, {
      method: 'PUT',
      body: cameraData,
    });
  },

  /**
   * Update camera comments only
   * @param {number} id - Camera ID
   * @param {string} comments - New comments text
   * @returns {Promise} Updated camera
   */
  updateComments: async (id, comments) => {
    return await apiFetch(`/cameras/${id}/comments`, {
      method: 'PATCH',
      body: { comments },
    });
  },

  /**
   * Migrate camera to another server
   * @param {number} id - Camera ID
   * @param {string} server - Target server name
   * @returns {Promise} Updated camera
   */
  migrateServer: async (id, server) => {
    return await apiFetch(`/cameras/${id}/migrate-server`, {
      method: 'PATCH',
      body: { server },
    });
  },

  /**
   * Delete a camera
   * @param {number} id - Camera ID
   * @returns {Promise} Deletion confirmation
   */
  delete: async (id) => {
    return await apiFetch(`/cameras/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get camera statistics
   * @returns {Promise} Camera statistics (total, online, offline, unstable)
   */
  getStats: async () => {
    return await apiFetch('/cameras/stats', {
      method: 'GET',
    });
  },

  /**
   * Test camera connection
   * @param {Object} connectionData - Camera connection details
   * @returns {Promise} Connection test result
   */
  testConnection: async (connectionData) => {
    return await apiFetch('/cameras/test-connection', {
      method: 'POST',
      body: connectionData,
    });
  },

  /**
   * Get camera manufacturers/templates
   * @returns {Promise} List of manufacturers
   */
  getManufacturers: async () => {
    return await apiFetch('/cameras/manufacturers', {
      method: 'GET',
    });
  },
};

export default cameraService;
