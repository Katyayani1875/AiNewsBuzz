// src/api/news.api.js (FINAL, with Topic & Pagination Logic)
import axios from 'axios';

// Ensure you have this in your .env file at the root of your frontend project:
// VITE_API_URL=http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// /**
//  * Fetches news with optional topic and pagination support for TanStack Query's useInfiniteQuery.
//  * @param {object} params - The query parameters passed from useInfiniteQuery.
//  * @param {number} [params.pageParam=0] - The page number we want to fetch, starts at 0.
//  * @param {string} [params.topic='all'] - The topic to filter by. 'all' fetches from all topics.
//  */
// export const fetchNews = async ({ pageParam = 0, topic = 'all' }) => {
//   const limit = 9; // Set how many articles to fetch per page/request.
//   const offset = pageParam * limit; // Calculate the number of articles to skip.

//   // Use URLSearchParams for a clean and safe way to build query strings.
//   const queryParams = new URLSearchParams({
//     limit: limit.toString(),
//     offset: offset.toString(),
//   });

//   // Only add the 'topic' parameter to the URL if it's not the default 'all'.
//   if (topic && topic.toLowerCase() !== 'all') {
//     queryParams.append('topic', topic.toLowerCase());
//   }

//   const queryString = queryParams.toString();
//   console.log(`Attempting to fetch news with query: /news?${queryString}`);

  // try {
//     const response = await api.get(`/news?${queryString}`);
    
//     // For useInfiniteQuery to work, our function must return an object that includes
//     // the fetched data and information about the next page.
//     return {
//       articles: response.data,
//       // If the number of articles returned is equal to our limit, it's likely there's a next page.
//       // We return the *next* page number (pageParam + 1).
//       // If not, we return `undefined` to tell TanStack Query there are no more pages.
//       nextPage: response.data.length === limit ? pageParam + 1 : undefined,
//     };
//   } catch (error) {
//     console.error(`API_ERROR: Fetching news failed for topic "${topic}"`, error.response?.data);
//     throw new Error(error.response?.data?.message || 'Failed to fetch news feed.');
//   }
// };

export const fetchCachedNews = async ({ pageParam = 0, topic = 'all' }) => {
  const limit = 9;
  const offset = pageParam * limit;
  const queryParams = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });

  if (topic && topic.toLowerCase() !== 'all') {
    queryParams.append('topic', topic.toLowerCase());
  }

  const response = await api.get(`/news?${queryParams.toString()}`);
  return {
    articles: response.data,
    nextPage: response.data.length === limit ? pageParam + 1 : undefined,
  };
};
export const fetchLiveNews = async (topic = 'all') => {
  const queryParams = new URLSearchParams();
   if (topic && topic.toLowerCase() !== 'all') {
    queryParams.append('topic', topic.toLowerCase());
  }
  // The backend will handle fetching, categorizing, and saving.
  // We only care if it succeeds or fails.
  await api.get(`/news/refresh?${queryParams.toString()}`);
  return true; // Return true on success
};

/**
 * Fetches a single article by its unique ID.
 * @param {string} articleId - The MongoDB _id of the article.
 */
export const fetchArticleById = async (articleId) => {
  if (!articleId) {
    throw new Error("An Article ID must be provided.");
  }
  
  try {
    const response = await api.get(`/news/${articleId}`);
    return response.data;
  } catch (error) {
    console.error(`API_ERROR: Fetching article by ID (${articleId}) failed.`, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch the article.');
  }
};