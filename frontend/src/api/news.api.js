// src/api/news.api.js (FINAL, CORRECTED, AND SIMPLIFIED)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetches news for the main feed with pagination.
 */
export const fetchNews = async ({ pageParam = 0, queryKey }) => {
  const [_key, topic] = queryKey;
  const params = { limit: 9, offset: pageParam * 9 };
  if (topic && topic !== 'all') {
    params.topic = topic;
  }
  
  const response = await api.get('/news', { params });
  return {
    articles: response.data,
    nextPage: response.data.length === 9 ? pageParam + 1 : undefined,
  };
};

/**
 * Fetches a single, specific article by its ID.
 */
export const fetchArticleById = async (articleId) => {
  if (!articleId) throw new Error("Article ID is required.");
  
  const response = await api.get(`/news/${articleId}`);
  return response.data;
};

/**
 * Calls the on-demand summarization endpoint on the backend.
 */
export const triggerAndFetchSummaries = async (newsId) => {
  if (!newsId) throw new Error("News ID is required to trigger summarization.");

  try {
    const response = await api.post(`/summaries/generate/${newsId}`, {}, { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate AI insights.');
  }
};
export const triggerLiveNewsRefresh = async (topic) => {
  try {
    // We send the topic from the currently active tab on the frontend
    const params = { topic: topic === 'all' ? 'general' : topic };
    const response = await api.get('/news/live-refresh', { params });
    return response.data; // The backend will send a success message
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check for new news.');
  }
};
export const pollForSummaries = async (articleId) => {
    try {
        const response = await fetch(`/api/articles/${articleId}/summaries/status`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error polling for summaries:', error);
        throw error;
    }
};