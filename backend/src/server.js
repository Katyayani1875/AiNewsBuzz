// src/server.js
require("dotenv").config();
// Register Summary model before News to fix population error
require("./models/Summary");
const { app, server } = require("./app"); // Import server instead of app
const logger = require("./utils/logger");
const cron = require("node-cron"); // <--- Add this line
const { refreshNews } = require("./controllers/newsController"); // Import refreshNews

const PORT = process.env.PORT || 5000;

// Cron job to refresh news daily at midnight UTC
cron.schedule("0 0 * * *", async () => {
  // Runs daily at midnight UTC
  logger.info("Running news refresh cron job...");
  try {
    // Call the refreshNews controller directly and pass the topic 'general'
    await refreshNews(
      { query: { topic: "general" } }, // Pass mock request with topic
      {
        status: (code) => ({
          json: (message) =>
            logger.info(
              `Cron job finished with status: ${code}, message: ${JSON.stringify(
                message
              )}`
            ),
        }),
        json: (message) =>
          logger.info(`Cron job finished, message: ${JSON.stringify(message)}`),
      }
    );
  } catch (error) {
    logger.error("Error during cron job:", error);
  }
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
