// src/api/notification.api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchNotifications = async () => {
  const response = await api.get('/notifications', { headers: getAuthHeaders() });
  return response.data;
};

export const markNotificationsAsRead = async () => {
  const response = await api.put('/notifications/read', {}, { headers: getAuthHeaders() });
  return response.data;
};