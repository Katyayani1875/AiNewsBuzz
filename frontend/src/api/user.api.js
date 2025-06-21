// src/api/user.api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetches a user's public profile for viewing
export const fetchUserProfile = async (username) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Fetching profile for ${username} failed.`, error.response?.data);
    throw new Error(error.response?.data?.message || 'Could not load profile.');
  }
};

// Updates the logged-in user's profile (text and/or image)
export const updateUserProfile = async (formData) => {
  try {
    // When sending a file, the Content-Type header is set automatically by the browser
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    };
    const response = await api.put(`/users/me`, formData, { headers });
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Updating profile failed.`, error.response?.data);
    throw new Error(error.response?.data?.message || 'Could not update profile.');
  }
};