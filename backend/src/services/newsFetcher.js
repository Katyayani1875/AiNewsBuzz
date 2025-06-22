const axios = require("axios");
const News = require("../models/News");
const logger = require("../utils/logger");
const { categorizeArticle } = require("./geminiCategorizationService");
require("dotenv").config();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = "https://gnews.io/api/v4";

const fetchNewsFromGNews = async (
  topic,
  language = "en",
  country = "us",
  max = 10
) => {
  try {
    const params = {
      apikey: GNEWS_API_KEY,
      lang: language,
      country: country,
      max: max,
      topic: topic,
    };
    const response = await axios.get(`${BASE_URL}/top-headlines`, { params });
    return response.data?.articles || [];
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logger.error(`[GNEWS-FATAL] Invalid API Key. Please check your .env file. Status: ${error.response.status}`);
    } else if (error.response?.status === 429) {
      logger.warn(`[GNEWS-RATE-LIMIT] Rate limit hit for topic "${topic}". This will be handled by the cron schedule.`);
    } else {
      logger.error(`[GNEWS-FETCH-ERROR] for topic ${topic}: ${error.message}`);
    }
    return []; // Return empty array on any failure
  }
};

const saveNewsToDatabase = async (newsData, initialTopic = 'general') => {
  const savedArticles = [];
  for (const article of newsData) {
    try {
      const gnewsId = article.url;
      const existingNews = await News.findOne({ gnewsId });

      if (!existingNews) {
        let determinedTopic = initialTopic;
        if (article.content) {
          const geminiCategory = await categorizeArticle(article.content);
          if (geminiCategory && geminiCategory !== 'other') {
            determinedTopic = geminiCategory;
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
          publishedAt: new Date(article.publishedAt),
          topic: determinedTopic,
        });
        const savedArticle = await newsItem.save();
        logger.info(`Saved new article with topic "${determinedTopic}": ${article.title}`);
        savedArticles.push(savedArticle);
      }
    } catch (error) {
      logger.error(`[SAVE-DB-ERROR] Failed for article "${article.title}": ${error.message}`);
    }
  }
  return savedArticles;
};

module.exports = { fetchNewsFromGNews, saveNewsToDatabase };