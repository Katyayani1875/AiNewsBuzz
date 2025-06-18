// src/controllers/newsController.js

//this is fetching news from gnews and saving it to the database
const {
  fetchNewsFromGNews,
  saveNewsToDatabase,
} = require("../services/newsFetcher");
const News = require("../models/News");
const logger = require("../utils/logger");
const { createSummariesForNews } = require("./summaryController"); // It's in the same 'controllers' directory

const getNews = async (req, res) => {
  const { topic, language, country, limit } = req.query;

  try {
    const query = {};
    if (topic) query.topic = topic.toLowerCase(); // Ensure case-insensitive topic matching
    if (language) query.language = language;
    if (country) query.country = country;

    console.log("Query being used:", query); // Log the query object
    const news = await News.find(query)
      .sort({ publishedAt: -1 }) // Sort by most recent
      .limit(parseInt(limit) || 10); // Default to 10 items if limit is not provided
    console.log("Number of news articles found:", news.length); // Check how many articles are found
    res.json(news);
  } catch (error) {
    logger.error(`Error getting news: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const refreshNews = async (req, res) => {
  const topic = req.query.topic;
  const language = req.query.language || "en";
  const country = req.query.country || "us";
  const maxArticles = 10;

  try {
    // Fetch news from GNews
    const newsData = await fetchNewsFromGNews(
      topic ? topic.toLowerCase() : "general",
      language,
      country,
      maxArticles
    );
    const savedArticles = await saveNewsToDatabase(newsData); // Save articles and get the saved documents back

    // Now, iterate over the successfully saved articles to create summaries
    for (const newsItem of savedArticles) {
      await createSummariesForNews(newsItem._id); // Call the summary creation here.
    }

    res.status(200).json({ message: "News refreshed successfully" });
  } catch (error) {
    logger.error(`Error refreshing news: ${error.message}`);
    res.status(500).json({ message: "Failed to refresh news" });
  }
};

const getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id).populate("summaries");
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    res.json(newsItem);
  } catch (error) {
    logger.error(`Error getting news by ID: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const incrementClickCount = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    newsItem.clickCount += 1;
    await newsItem.save();
    res.status(200).json({
      message: "Click count incremented",
      clickCount: newsItem.clickCount,
    });
  } catch (error) {
    logger.error(`Error incrementing click count: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNews, refreshNews, getNewsById, incrementClickCount };
