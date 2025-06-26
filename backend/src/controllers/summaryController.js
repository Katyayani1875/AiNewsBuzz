// src/controllers/summaryController.js (Definitive Version)
const News = require("../models/News");
const Summary = require("../models/Summary");
const logger = require("../utils/logger");
const { generateAllInsights } = require("../services/geminiService");

// Internal helper function for creating and saving summaries
const createSummary = async (newsId, type, content, sentiment = null) => {
    const summary = new Summary({ 
        news: newsId, 
        type, 
        content, 
        ...(sentiment && { sentiment }) 
    });
    await summary.save();
    await News.findByIdAndUpdate(newsId, { 
        $push: { summaries: summary._id },
        $set: { lastProcessedAt: new Date() } // Track processing time
    });
    return summary;
};

/**
 * Main processing logic for article AI analysis
 * @param {string} articleId - MongoDB article ID
 * @param {boolean} forceRefresh - Whether to reprocess even if already processed
 */
const processArticleAI = async (articleId, forceRefresh = false) => {
    try {
        const newsItem = await News.findById(articleId);
        if (!newsItem) {
            logger.warn(`[AI-PROCESS] Article ${articleId} not found`);
            return { success: false, message: "Article not found" };
        }

        // Skip if already processed unless forced
        if (newsItem.isProcessed && !forceRefresh) {
            logger.info(`[AI-PROCESS] Article ${articleId} already processed, skipping`);
            return { success: true, skipped: true };
        }

        logger.info(`[AI-PROCESS] Starting AI analysis for: ${newsItem.title.substring(0, 50)}...`);

        // Get all insights in single API call
        const insights = await generateAllInsights(
            newsItem.title,
            newsItem.content,
            newsItem.source?.name || "Unknown source"
        );

        if (!insights) {
            throw new Error("No insights generated");
        }

        // Update news item with insights
        const updates = {
            topic: insights.category?.toLowerCase() || newsItem.topic,
            isProcessed: true,
            ...(insights.reliability && { reliability: insights.reliability })
        };

        // Create summaries in parallel
        const summaryPromises = [];
        if (insights.tldr) {
            summaryPromises.push(
                createSummary(newsItem._id, "tldr", insights.tldr, insights.sentiment)
            );
        }
        if (insights.bullets) {
            summaryPromises.push(
                createSummary(newsItem._id, "bullets", insights.bullets)
            );
        }
        if (insights.eli5) {
            summaryPromises.push(
                createSummary(newsItem._id, "eli5", insights.eli5)
            );
        }

        await Promise.all([
            News.findByIdAndUpdate(articleId, updates),
            ...summaryPromises
        ]);

        logger.info(`[AI-PROCESS] Completed AI analysis for: ${articleId}`);
        return { success: true, summaries: summaryPromises.length };
    } catch (error) {
        logger.error(`[AI-PROCESS] Failed for ${articleId}: ${error.message}`);
        await News.findByIdAndUpdate(articleId, { 
            processingError: error.message.substring(0, 200) 
        });
        return { success: false, error: error.message };
    }
};

/**
 * API endpoint controller for generating and fetching summaries
 */
const generateAndGetSummaries = async (req, res) => {
    const { newsId } = req.params;
    const { refresh = false } = req.query;

    try {
        const newsItem = await News.findById(newsId);
        if (!newsItem) {
            return res.status(404).json({ 
                success: false,
                message: "Article not found" 
            });
        }

        // Process if no summaries exist or refresh requested
        if (newsItem.summaries.length === 0 || refresh) {
            const processResult = await processArticleAI(newsId, refresh);
            if (!processResult.success) {
                return res.status(500).json({ 
                    success: false,
                    message: processResult.error || "Failed to generate summaries"
                });
            }
        }

        // Return complete article data with populated summaries
        const result = await News.findById(newsId)
            .populate("summaries")
            .select("-content -__v"); // Exclude large/unnecessary fields

        res.json({
            success: true,
            data: {
                summaries: result.summaries,
                reliability: result.reliability,
                topic: result.topic,
                lastProcessedAt: result.lastProcessedAt
            }
        });

    } catch (error) {
        logger.error(`[API] Summary generation failed for ${newsId}: ${error.message}`);
        res.status(500).json({ 
            success: false,
            message: "Internal server error during summary generation"
        });
    }
};

module.exports = {
    processArticleAI,
    generateAndGetSummaries
};