// src/services/geminiCategorizationService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Or 'gemini-1.5-pro-latest' if you have access

const categorizeArticle = async (articleContent) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are a news categorization expert.  Given the following news article content, assign it to ONE of the following categories (only return the category name, no other text): Technology, Business, Sports, World, Politics, Science, Entertainment, Health, Other. If the article is unrelated to any of these, return "Other".\n\nArticle Content: ${articleContent}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = response.text().trim().toLowerCase(); // Clean up the response
    console.log("Gemini Category:", category); // Log for debugging
    return category;
  } catch (error) {
    logger.error(`Gemini Categorization Error: ${error.message}`);
    return null; // Or handle the error as appropriate
  }
};

module.exports = { categorizeArticle };
