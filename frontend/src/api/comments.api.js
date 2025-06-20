import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// We need a way to add the auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // We'll store the token in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCommentsByNewsId = async (newsId) => {
  const response = await api.get(`/comments/${newsId}`);
  return response.data;
};

export const postComment = async ({ newsId, text, parentCommentId }) => {
  const response = await api.post(
    "/comments",
    { newsId, text, parentCommentId },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
