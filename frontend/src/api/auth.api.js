import axios from "axios";

// src/api/auth.api.js
import axios from 'axios';

// Ensure you have this in your .env file at the root of your frontend project:
// VITE_API_URL=http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // Re-throw a more helpful error message for the UI
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};