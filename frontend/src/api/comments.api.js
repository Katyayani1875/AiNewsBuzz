import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("AUTH_TOKEN_MISSING: User must be logged in.");
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCommentsByNewsId = async (newsId) => {
  try {
    const response = await api.get(`/comments/${newsId}`);
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Fetching comments failed for newsId ${newsId}`, error.response?.data);
    throw new Error(error.response?.data?.message || 'Could not load comments.');
  }
};

export const postComment = async ({ newsId, text, parentCommentId = null }) => {
  const payload = {
    newsId,
    text,
    // Ensure parentCommentId is either a valid string or null, never undefined.
    parentCommentId: parentCommentId || null,
  };

  console.log("Submitting to POST /comments with payload:", payload);

  try {
    const response = await api.post('/comments', payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Posting comment failed. Status: ${error.response?.status}`, error.response?.data);
    throw new Error(error.response?.data?.message || 'Could not post your comment.');
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await api.post(`/comments/like/${commentId}`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Liking comment ${commentId} failed.`, error.response?.data);
    throw new Error(error.response?.data?.message || 'Could not complete action.');
  }
};


// You will also need a dislike function
export const dislikeComment = async (commentId) => {
  try {
    const response = await api.post(`/comments/dislike/${commentId}`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Failed to dislike comment ${commentId}`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Could not complete action.');
  }
}