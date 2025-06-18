// src/services/newsFetcher.js
const axios = require("axios");
const News = require("../models/News");
const logger = require("../utils/logger");
require("dotenv").config();
const { categorizeArticle } = require("./geminiCategorizationService"); // Import
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";
const DEFAULT_PARAMS = {
  apikey: GNEWS_API_KEY,
  lang: "en",
  country: "us",
};

const maxRequestsPerSecond = 0.2;

const fetchNewsFromGNews = async (
  topic,
  language = "en",
  country = "us",
  max = 1
) => {
  try {
    const params = {
      ...DEFAULT_PARAMS,
      topic: topic, // Add the topic
      lang: language,
      country: country,
      max: max,
    };

    const response = await axios.get(`${BASE_URL}/top-headlines`, { params });
    if (response.data && response.data.articles) {
      return response.data.articles;
    } else {
      logger.warn(
        `GNews API returned no articles for topic: ${topic}, language: ${language}, country: ${country}`
      );
      return [];
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      logger.warn(
        `GNews API rate limit exceeded for topic "${topic}". Retrying in 60 seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds
      return await fetchNewsFromGNews(topic, language, country, max); // Retry the same request
    }
    logger.error(
      `Error fetching news from GNews for topic ${topic}: ${error.message}`
    );
    return [];
  }
};

const saveNewsToDatabase = async (newsData) => {
  const savedArticles = []; // Store the saved articles to summarize

  for (const article of newsData) {
    try {
      // Check if the article already exists by gnewsId
      const gnewsId = article.guid || article.url;
      const existingNews = await News.findOne({ gnewsId });

      if (!existingNews) {
        let topic = article.topic ? article.topic.toLowerCase() : "general"; // Use API topic if available

        // Fallback to source.name if topic is missing or empty
        if ((!topic || topic === "general") && article.content) {
          // If no topic or is general, categorize with Gemini
          const geminiCategory = await categorizeArticle(article.content); // <--- Call Gemini
          if (geminiCategory) {
            topic = geminiCategory;
          }
        }

        const newsItem = new News({
          gnewsId,
          title: article.title,
          url: article.url,
          source: article.source,
          image: article.image,
          description: article.description,
          content: article.content,
          publishedAt: article.publishedAt,
          topic: topic, // Assign the determined topic
          language: article.language,
          country: article.country,
        });

        const savedArticle = await newsItem.save();
        logger.info(`News item saved: ${article.title}`);
        savedArticles.push(savedArticle); // Add to the array
      } else {
        logger.debug(`News item already exists: ${article.title}`);
      }
    } catch (error) {
      logger.error(`Error saving news item: ${error.message}`);
    }
  }
  return savedArticles; // Return the saved articles to refreshNews
};

module.exports = { fetchNewsFromGNews, saveNewsToDatabase };
