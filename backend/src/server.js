// src/server.js 
console.log("--- DEPLOYMENT v-FIXED: Simplified socket architecture ---");
require("dotenv").config();
require("./models/User");
require("./models/News");
require("./models/Summary");
require("./models/Comment");
require("./models/Notification");
require("./models/Channel");

const { server } = require("./app");
const { initializeSocket } = require("./socket"); 
const logger = require("./utils/logger");
const cron = require("node-cron");
const News = require("./models/News");
const { fetchNewsFromGNews, saveNewsToDatabase } = require("./services/newsFetcher");
initializeSocket(server);
const PORT = process.env.PORT || 5000;

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

const runAIProcessingQueue = async () => {
  logger.info("--- [CRON JOB 2: AI QUEUE] Checking for articles to process... ---");
  try {
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
cron.schedule("0 */2 * * *", runNewsIngestion);
// --- SERVER START ---
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info("Background jobs for news ingestion and AI processing are scheduled.");
});