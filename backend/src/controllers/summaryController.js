// src/controllers/summaryController.js (FINAL, CORRECTED EXPORTS)
const { generateTldrSummary, generateELI5, generateBulletPoints, analyzeSentiment, categorizeArticle } = require("../services/geminiService");
const News = require("../models/News");
const Summary = require("../models/Summary");
const logger = require("../utils/logger");

const isPaywalled = (text) => !text || text.toLowerCase().includes('subscribe to read');

const createSummary = async (newsId, type, content, sentiment = null) => {
  const summary = new Summary({ news: newsId, type, content, sentiment });
  await summary.save();
  await News.findByIdAndUpdate(newsId, { $push: { summaries: summary._id } });
};

// This is the main processing logic used by both the cron job and the on-demand endpoint.
const processArticleAI = async (newsItemId) => {
  const newsItem = await News.findById(newsItemId);
  if (!newsItem || newsItem.isProcessed) {
    if (newsItem) { // If it exists but was already processed, just ensure the flag is set.
        newsItem.isProcessed = true;
        await newsItem.save();
    }
    return;
  }
  
  logger.info(`[AI-PROCESS] Starting tasks for article: ${newsItem._id}`);
  try {
    if (newsItem.content) {
      const preciseTopic = await categorizeArticle(newsItem.content);
      if (preciseTopic) newsItem.topic = preciseTopic;
    }
    
    if (!isPaywalled(newsItem.content)) {
      const [tldr, bullets, eli5] = await Promise.all([
        generateTldrSummary(newsItem.content),
        generateBulletPoints(newsItem.content),
        generateELI5(newsItem.content),
      ]);
      if (tldr) {
        const sentiment = await analyzeSentiment(tldr);
        await createSummary(newsItem._id, "tldr", tldr, sentiment);
      }
      if (bullets) await createSummary(newsItem._id, "bullets", bullets);
      if (eli5) await createSummary(newsItem._id, "eli5", eli5);
    }
    
    newsItem.isProcessed = true;
    await newsItem.save();
    logger.info(`[AI-PROCESS] Finished tasks for article: ${newsItem._id}`);
  } catch (error) {
    logger.error(`[AI-PROCESS-FATAL] Error for article ${newsItem._id}: ${error.message}`);
  }
};

// This is the controller function for the API endpoint.
const generateAndGetSummaries = async (req, res) => {
  const { newsId } = req.params;
  try {
    let newsItem = await News.findById(newsId);
    if (!newsItem) return res.status(404).json({ message: "Article not found." });

    // If summaries don't exist yet, process the article now.
    if (newsItem.summaries.length === 0) {
      await processArticleAI(newsId);
    }
    
    const updatedNewsItem = await News.findById(newsId).populate("summaries");
    res.json(updatedNewsItem.summaries);
  } catch (error) {
    logger.error(`On-demand summary failed for ${newsId}: ${error.message}`);
    res.status(500).json({ message: "Failed to generate summaries." });
  }
};

// ** THE FIX IS HERE: Only export the functions that are actually used elsewhere **
module.exports = {
  processArticleAI, // Used by server.js
  generateAndGetSummaries, // Used by summaryRoutes.js
};