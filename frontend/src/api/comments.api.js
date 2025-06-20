// src/api/comments.api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// A helper function to get the auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCommentsByNewsId = async (newsId) => {
  const response = await api.get(`/comments/${newsId}`);
  return response.data;
};

// This function handles both top-level comments and replies
export const postComment = async ({ newsId, text, parentCommentId = null }) => {
  const response = await api.post('/comments', 
    { newsId, text, parentCommentId }, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// We will add like/dislike functions here later