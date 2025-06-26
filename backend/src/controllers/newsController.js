// src/controllers/newsController.js (FINAL, DEFINITIVE, AND COMPLETE)

const News = require("../models/News");
const logger = require("../utils/logger");
const { fetchNewsFromGNews, saveNewsToDatabase } = require("../services/newsFetcher");
const { processArticleAI } = require("./summaryController");
/**
 * Fetches news for the main feed, with correct filtering and pagination.
 */
const getNews = async (req, res) => {
  const { topic, limit, offset } = req.query;
  try {
    const query = {};
    if (topic && topic.toLowerCase() !== 'all') {
      query.topic = topic.toLowerCase();
    }
    const news = await News.find(query)
      .sort({ publishedAt: -1, _id: -1 })
      .skip(parseInt(offset) || 0)
      .limit(parseInt(limit) || 9);
    res.json(news);
  } catch (error) {
    logger.error(`[GET_NEWS_ERROR] ${error.message}`);
    res.status(500).json({ message: "Server error while fetching news." });
  }
};

/**
 * Fetches a single article by its ID for the detail page.
 */
const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id).populate("summaries");
    if (!newsItem) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(newsItem);
  } catch (error) {
    logger.error(`Error in getNewsById for ID ${req.params.id}: ${error.message}`);
    res.status(500).json({ message: "Server error while fetching article." });
  }
};
const fetchLiveNewsForTopic = async (req, res) => {
  // Use 'general' as a default if no topic is specified by the button
  const topic = req.query.topic || 'general';
  
  logger.info(`[LIVE-FETCH] Received on-demand request for topic: ${topic}`);
  try {
    const newsData = await fetchNewsFromGNews({ topic: topic.toLowerCase(), max: 10 });

    if (newsData.length === 0) {
      return res.status(200).json({ message: "Feed is up to date. No new articles found." });
    }

    const savedArticleIds = await saveNewsToDatabase(newsData, topic.toLowerCase());
    logger.info(`[LIVE-FETCH] Saved ${savedArticleIds.length} new live articles.`);
    
    // Asynchronously fire off the AI processing for only the new articles
    for (const articleId of savedArticleIds) {
      processArticleAI(articleId).catch(err => logger.error(`[LIVE-FETCH-AI-ERROR] for ${articleId}: ${err.message}`));
    }

    if (savedArticleIds.length > 0) {
        res.status(200).json({ message: `Found and added ${savedArticleIds.length} new stories!` });
    } else {
        res.status(200).json({ message: "Feed is up to date." });
    }
  } catch (error) {
    logger.error(`[LIVE-FETCH-ERROR] for topic "${topic}": ${error.message}`);
    res.status(500).json({ message: "Failed to fetch live news." });
  }
};
/**
 * --- THIS IS THE MISSING FUNCTION DEFINITION ---
 * Increments the click count for a given article.
 */
const incrementClickCount = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    newsItem.clickCount += 1;
    await newsItem.save();
    res.status(200).json({ message: "Click count incremented", clickCount: newsItem.clickCount });
  } catch (error) {
    logger.error(`Error incrementing click count: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// We now export all the functions that are actually used by newsRoutes.js
module.exports = { 
    getNews, 
    getNewsById, 
     fetchLiveNewsForTopic, 
    incrementClickCount 
};