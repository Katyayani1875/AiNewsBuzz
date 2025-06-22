// src/server.js (FINAL, "SMART QUEUE" ARCHITECTURE)

require("dotenv").config();

// It's a Mongoose best practice to require all models at the entry point of your application.
// This ensures they are all registered with Mongoose before any part of your app tries to use them.
require("./models/User");
require("./models/News");
require("./models/Summary");
require("./models/Comment");
require("./models/Notification");
require("./models/Channel");

const { server } = require("./app");
const logger = require("./utils/logger");
const cron = require("node-cron");
const News = require("./models/News");
const { fetchNewsFromGNews, saveNewsToDatabase } = require("./services/newsFetcher");
// const { processArticleAI } = require("./controllers/summaryController"); // We need the main processing function

const PORT = process.env.PORT || 5000;

// --- JOB 1: News Ingestion ---
// This job's only responsibility is to fetch raw news and save it to the DB queue.
// It runs infrequently to respect the news API's rate limits.
const runNewsIngestion = async () => {
  logger.info("--- [CRON JOB 1: INGESTION] Starting scheduled news fetch cycle. ---");
  const topicsToRefresh = ["world", "business", "technology", "sports", "science", "entertainment", "health"];
  
  for (const topic of topicsToRefresh) {
    try {
      const newsData = await fetchNewsFromGNews({ topic, max: 5 }); // Fetch a small batch per topic
      if (newsData && newsData.length > 0) {
        await saveNewsToDatabase(newsData, topic);
      }
    } catch (error) {
      logger.error(`[CRON INGESTION] Failed to process topic "${topic}": ${error.message}`);
    }
  }
  logger.info("--- [CRON JOB 1: INGESTION] Finished news fetch cycle. ---");
};

// --- JOB 2: AI Processing Queue ---
// This job runs very frequently but processes only ONE article at a time.
// This is the definitive solution to avoid Gemini's "requests per minute" rate limit.
const runAIProcessingQueue = async () => {
  logger.info("--- [CRON JOB 2: AI QUEUE] Checking for articles to process... ---");
  try {
    // Find just one article that has not been processed yet.
    const articleToProcess = await News.findOne({ isProcessed: false });

    if (articleToProcess) {
      logger.info(`[AI QUEUE] Found article to process: ${articleToProcess._id}. Starting AI tasks...`);
      // This single function will handle recategorization and all summary generation.
      await processArticleAI(articleToProcess._id);
    } else {
      logger.info("[AI QUEUE] No articles in the queue to process.");
    }
  } catch (error) {
    logger.error(`[AI QUEUE] A fatal error occurred during processing: ${error.message}`);
  }
};

// --- CRON SCHEDULES ---

// Schedule the Ingestion job to run at the top of every 2nd hour.
// This is a safe frequency for the GNews free tier.
cron.schedule("0 */2 * * *", runNewsIngestion);

// Schedule the AI Processing job to run every 30 seconds.
// This ensures a steady, slow, and reliable processing of the queue.
// cron.schedule("*/30 * * * * *", runAIProcessingQueue);

// --- SERVER START ---
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info("Background jobs for news ingestion and AI processing are scheduled.");

  // To test immediately without waiting for the schedule, uncomment the following block.
  // This will run the ingestion job once right after the server starts.
  /*
  (async () => {
    logger.info("Running initial news ingestion cycle on server start for testing...");
    await runNewsIngestion();
  })();
  */
});