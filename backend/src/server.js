// src/server.js (FINAL, ROLLING UPDATE STRATEGY)
require("dotenv").config();
require("./models/User");
require("./models/News");
require("./models/Summary");

const { server } = require("./app");
const logger = require("./utils/logger");
const cron = require("node-cron");
const { fetchNewsFromGNews, saveNewsToDatabase } = require("./services/newsFetcher");
const { createSummariesForNews } = require("./controllers/summaryController");

const PORT = process.env.PORT || 5000;

const runNewsUpdateCycle = async () => {
  logger.info("--- [CRON JOB STARTED] --- Running rolling news update cycle.");
  
  const topicsToRefresh = [
    "world",
    "business",
    "technology",
    "sports",
    "science",
    "entertainment",
    "health",
    "general" ,
  ];

  const maxArticlesPerTopic = 10; 

  for (const topic of topicsToRefresh) {
    try {
      logger.info(`[CRON] Fetching top headlines for topic: ${topic}`);
      const newsData = await fetchNewsFromGNews(
        topic,
        'en',
        'us',
        maxArticlesPerTopic
      );

      if (newsData.length > 0) {
        const savedArticles = await saveNewsToDatabase(newsData, topic); 
        logger.info(`[CRON] Saved ${savedArticles.length} genuinely new articles for topic: ${topic}`);

        // Asynchronously fire off summarization tasks
        for (const newsItem of savedArticles) {
          createSummariesForNews(newsItem._id).catch(err => {
            logger.error(`[CRON-SUMMARY-ERROR] Failed for article ${newsItem._id}: ${err.message}`);
          });
        }
      } else {
        logger.info(`[CRON] GNews returned no articles for topic: ${topic}`);
      }
    } catch (error) {
      logger.error(`[CRON-FATAL] Error processing topic "${topic}": ${error.message}`);
    }
  }
  logger.info("--- [CRON JOB FINISHED] ---");
};
cron.schedule("0 */2 * * *", runNewsUpdateCycle);
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});