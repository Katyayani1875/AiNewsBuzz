// src/controllers/summaryController.js

// **** CORRECTED IMPORT PATHS ****
const { summarizeText } = require("../services/cohereService");
const {
  generateELI5,
  generateBulletPoints,
  analyzeSentimentWithGemini,
} = require("../services/geminiService"); // Assuming you added sentiment analysis here
const News = require("../models/News");
const Summary = require("../models/Summary");
const logger = require("../utils/logger");

const createSummariesForNews = async (newsItemId) => {
  // This log is already working, which is good.
  console.log(
    `--- [START] Processing summaries for News ID: ${newsItemId} ---`
  );

  try {
    const newsItem = await News.findById(newsItemId);
    if (!newsItem || !newsItem.content) {
      logger.warn(
        `News item not found or missing content for ID: ${newsItemId}`
      );
      return;
    }

    // Log the content being sent to the APIs for verification
    // console.log(`Article Content to Summarize: "${newsItem.content.substring(0, 100)}..."`);

    const articleText = newsItem.content;

    // --- LOGGING STEP 1: Test Cohere ---
    const tldrSummary = await summarizeText(articleText); // Corrected from cohereSummarize
    console.log(`[DEBUG] Cohere TLDR Result for ${newsItemId}:`, tldrSummary); // <-- ADDED LOG

    let sentiment = null;
    if (tldrSummary) {
      // --- LOGGING STEP 2: Test Gemini Sentiment ---
      sentiment = await analyzeSentimentWithGemini(tldrSummary);
      console.log(
        `[DEBUG] Gemini Sentiment Result for ${newsItemId}:`,
        sentiment
      ); // <-- ADDED LOG
    }

    // --- LOGGING STEP 3: Test Gemini Bullets ---
    const bulletSummary = await generateBulletPoints(articleText);
    console.log(
      `[DEBUG] Gemini Bullets Result for ${newsItemId}:`,
      bulletSummary
    ); // <-- ADDED LOG

    // --- LOGGING STEP 4: Test Gemini ELI5 ---
    const eli5Summary = await generateELI5(articleText);
    console.log(`[DEBUG] Gemini ELI5 Result for ${newsItemId}:`, eli5Summary); // <-- ADDED LOG

    // Store summaries
    if (tldrSummary) {
      await createSummary(newsItemId, "tldr", tldrSummary, sentiment);
    }
    if (bulletSummary) {
      await createSummary(newsItemId, "bullets", bulletSummary);
    }
    if (eli5Summary) {
      await createSummary(newsItemId, "eli5", eli5Summary);
    }

    console.log(`--- [END] Finished processing for News ID: ${newsItemId} ---`);
  } catch (error) {
    logger.error(
      `Error in createSummariesForNews for ID ${newsItemId}: ${error.message}`
    );
  }
};

// The createSummary function remains the same, but no longer needs the generateAudio call
const createSummary = async (
  newsId,
  type,
  content,
  sentiment = null,
  language = "en"
) => {
  try {
    const summary = new Summary({
      news: newsId,
      type: type,
      content: content,
      sentiment: sentiment,
      language: language,
    });

    const savedSummary = await summary.save();
    await News.findByIdAndUpdate(
      newsId,
      { $push: { summaries: savedSummary._id } },
      { new: true }
    );

    console.log(
      `✅ SUCCESS: Saved '${type}' summary to DB for News ID: ${newsId}`
    );
    logger.info(`Summary of type ${type} created for news item ${newsId}`);
  } catch (error) {
    console.error(
      `❌ ERROR: Failed to save '${type}' summary to DB for News ID: ${newsId}`,
      error
    );
    logger.error(`Error creating summary in DB: ${error.message}`);
  }
};

const getSummariesForNews = async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const newsItem = await News.findById(newsId).populate("summaries");
    if (!newsItem) {
      return res.status(404).json({ message: "News item not found" });
    }
    res.json(newsItem.summaries);
  } catch (error) {
    logger.error(`Error fetching summaries: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createSummariesForNews, getSummariesForNews };
