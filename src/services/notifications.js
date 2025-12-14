// src/services/notifications.js
// Notification service for VMS

import apiFetch from './api';

export const notificationService = {
  /**
   * Get user notifications with filters
   * @param {Object} params - Query parameters (status, type, search, per_page, page)
   * @returns {Promise} Paginated notifications with unread count
   */
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiFetch(endpoint, {
      method: 'GET',
    });
    
    return response.data || response;
  },

  /**
   * Get single notification by ID
   * @param {number} id - Notification ID
   * @returns {Promise} Notification details
   */
  getById: async (id) => {
    const response = await apiFetch(`/notifications/${id}`, {
      method: 'GET',
    });
    return response.data || response;
  },

  /**
   * Get unread notification count
   * @returns {Promise} Unread count
   */
  getUnreadCount: async () => {
    const response = await apiFetch('/notifications/unread-count', {
      method: 'GET',
    });
    return response.data || response;
  },

  /**
   * Mark notification(s) as read
   * @param {number|Array} idOrIds - Single ID or array of IDs
   * @returns {Promise} Success response
   */
  markAsRead: async (idOrIds) => {
    const body = Array.isArray(idOrIds) 
      ? { ids: idOrIds } 
      : { id: idOrIds };
    
    const response = await apiFetch('/notifications/mark-read', {
      method: 'POST',
      body,
    });
    return response.data || response;
  },

  /**
   * Mark notification(s) as unread
   * @param {number|Array} idOrIds - Single ID or array of IDs
   * @returns {Promise} Success response
   */
  markAsUnread: async (idOrIds) => {
    const body = Array.isArray(idOrIds) 
      ? { ids: idOrIds } 
      : { id: idOrIds };
    
    const response = await apiFetch('/notifications/mark-unread', {
      method: 'POST',
      body,
    });
    return response.data || response;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Success response with count
   */
  markAllAsRead: async () => {
    const response = await apiFetch('/notifications/mark-all-read', {
      method: 'POST',
    });
    return response.data || response;
  },

  /**
   * Delete notification(s)
   * @param {number|Array} idOrIds - Single ID or array of IDs
   * @returns {Promise} Success response
   */
  delete: async (idOrIds) => {
    const body = Array.isArray(idOrIds) 
      ? { ids: idOrIds } 
      : { id: idOrIds };
    
    const response = await apiFetch('/notifications/delete', {
      method: 'POST',
      body,
    });
    return response.data || response;
  },

  /**
   * Delete all read notifications
   * @returns {Promise} Success response with count
   */
  deleteAllRead: async () => {
    const response = await apiFetch('/notifications/delete-all-read', {
      method: 'POST',
    });
    return response.data || response;
  },

  /**
   * Send notification (Business Admin only)
   * @param {Object} notificationData - Notification data
   * @returns {Promise} Success response
   */
  send: async (notificationData) => {
    const response = await apiFetch('/notifications/send', {
      method: 'POST',
      body: notificationData,
    });
    return response.data || response;
  },

  /**
   * Get users list for notification recipients (Business Admin only)
   * @returns {Promise} List of users
   */
  getUsersForNotification: async () => {
    const response = await apiFetch('/notifications/users', {
      method: 'GET',
    });
    return response.data || response;
  },

  /**
   * Get sent message history (Business Admin only)
   * @param {Object} params - Query parameters (search, recipient_type, per_page, page)
   * @returns {Promise} Paginated sent messages
   */
  getSentMessages: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/notifications/sent${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiFetch(endpoint, {
      method: 'GET',
    });
    
    return response.data || response;
  },

  /**
   * Get sent message by ID (Business Admin only)
   * @param {number} id - Sent message ID
   * @returns {Promise} Sent message details
   */
  getSentMessageById: async (id) => {
    const response = await apiFetch(`/notifications/sent/${id}`, {
      method: 'GET',
    });
    return response.data || response;
  },

  /**
   * Delete sent message (Super Admin only)
   * @param {number} id - Sent message ID
   * @returns {Promise} Success response
   */
  deleteSentMessage: async (id) => {
    const response = await apiFetch('/notifications/sent/delete', {
      method: 'POST',
      body: { id },
    });
    return response.data || response;
  },
};

export default notificationService;
