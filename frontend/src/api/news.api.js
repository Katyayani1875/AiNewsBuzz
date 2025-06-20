import axios from "axios";

// Ensure you have this in your .env file at the root of your frontend project:
// VITE_API_URL=http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Fetches the main news feed.
 * By removing the topic query, it will now ask the backend for the most recent
 * articles across ALL topics.
 */
export const fetchNews = async () => {
  console.log("Attempting to fetch all recent news...");
  try {
    // **** THIS IS THE CHANGE ****
    // We are no longer sending ?topic=general. We are asking for the default feed.
    const response = await api.get(`/news`);
    console.log("News data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching news feed:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch news feed."
    );
  }
};

export const fetchArticleById = async (articleId) => {
  // A check to prevent API calls with an undefined ID, which TanStack Query might do on initial render
  if (!articleId) {
    throw new Error("An Article ID must be provided.");
  }

  console.log(`Fetching article with ID: ${articleId}`);
  try {
    const response = await api.get(`/news/${articleId}`);
    console.log("Single article data fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article by ID (${articleId}):`, error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch the article."
    );
  }
};
