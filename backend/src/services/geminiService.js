// src/services/geminiService.js (Definitive Version)
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");
require("dotenv").config();

// Configuration - Use separate keys for different usage tiers if available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ANALYSIS_API_KEY = process.env.GEMINI_ANALYSIS_API_KEY || GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";
const VALID_CATEGORIES = ["technology", "business", "sports", "world", "politics", "science", "entertainment", "health"];
const VALID_SENTIMENTS = ["positive", "negative", "neutral"];

if (!GEMINI_API_KEY) {
  logger.error("FATAL: GEMINI_API_KEY is missing from .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const genAIAnalysis = new GoogleGenerativeAI(GEMINI_ANALYSIS_API_KEY);

/**
 * Primary function for generating all article insights in a single API call
 */
const generateAllInsights = async (articleTitle, articleContent, articleSource) => {
    const model = genAIAnalysis.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3 // Slightly more deterministic than default
        },
    });

    const prompt = `
    You are a professional news analyst. Analyze this article and respond with valid JSON containing:
    {
        "category": "One of: Technology, Business, Sports, World, Politics, Science, Entertainment, Health",
        "sentiment": "positive/negative/neutral",
        "tldr": "One paragraph summary",
        "bullets": "Key points (each on new line starting with '-')",
        "eli5": "Simple explanation",
        "reliability": {
            "score": 0-100,
            "rating": "High/Medium/Low",
            "reason": "Brief explanation"
        }
    }

    ARTICLE DETAILS:
    Source: "${articleSource}"
    Title: "${articleTitle}"
    Content: "${articleContent.substring(0, 5000)}" [truncated if too long]
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        let insights = JSON.parse(responseText);

        // Validate and normalize the response
        insights = {
            category: VALID_CATEGORIES.includes(insights.category?.toLowerCase()) 
                ? insights.category.toLowerCase() 
                : 'general',
            sentiment: VALID_SENTIMENTS.includes(insights.sentiment?.toLowerCase())
                ? insights.sentiment.toLowerCase()
                : 'neutral',
            tldr: insights.tldr || "No summary available",
            bullets: insights.bullets || "- No key points generated",
            eli5: insights.eli5 || "Could not generate simple explanation",
            reliability: {
                score: Math.min(100, Math.max(0, parseInt(insights.reliability?.score) || 50)),
                rating: ["High","Medium","Low"].includes(insights.reliability?.rating)
                    ? insights.reliability.rating
                    : "Medium",
                reason: insights.reliability?.reason || "No reliability analysis provided"
            }
        };

        logger.info(`Generated insights for: ${articleTitle.substring(0, 50)}...`);
        return insights;
    } catch (error) {
        logger.error(`Analysis failed for "${articleTitle}": ${error.message}`);
        
        // Fallback to individual API calls if batch fails
        logger.warn("Attempting fallback to individual analysis...");
        return await generateInsightsFallback(articleTitle, articleContent, articleSource);
    }
};

/**
 * Fallback mechanism if the primary batch analysis fails
 */
const generateInsightsFallback = async (title, content, source) => {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        // Parallelize independent requests
        const [category, sentiment, tldr, bullets, eli5] = await Promise.all([
            model.generateContent(`Categorize this in one word: ${title}`).then(r => r.response.text()),
            model.generateContent(`Analyze sentiment (positive/negative/neutral): ${content.substring(0, 1000)}`).then(r => r.response.text()),
            model.generateContent(`TL;DR summary: ${content.substring(0, 3000)}`).then(r => r.response.text()),
            model.generateContent(`Key bullet points (start each with -): ${content.substring(0, 3000)}`).then(r => r.response.text()),
            model.generateContent(`Explain simply: ${title}. ${content.substring(0, 2000)}`).then(r => r.response.text())
        ]);

        // Reliability analysis requires more careful handling
        const reliabilityPrompt = `Rate reliability (0-100) of this ${source} article: ${title}\n\n${content.substring(0, 2000)}`;
        const reliabilityAnalysis = await model.generateContent(reliabilityPrompt);
        const reliabilityText = reliabilityAnalysis.response.text();
        const reliabilityScore = parseInt(reliabilityText) || 50;
        
        return {
            category: VALID_CATEGORIES.includes(category.toLowerCase()) ? category.toLowerCase() : 'general',
            sentiment: VALID_SENTIMENTS.includes(sentiment.toLowerCase()) ? sentiment.toLowerCase() : 'neutral',
            tldr: tldr.trim(),
            bullets: bullets.trim(),
            eli5: eli5.trim(),
            reliability: {
                score: reliabilityScore,
                rating: reliabilityScore > 75 ? "High" : reliabilityScore < 40 ? "Low" : "Medium",
                reason: `Analyzed by fallback method with score ${reliabilityScore}`
            }
        };
    } catch (fallbackError) {
        logger.error(`Fallback analysis failed: ${fallbackError.message}`);
        return null;
    }
};

module.exports = {
    generateAllInsights
};