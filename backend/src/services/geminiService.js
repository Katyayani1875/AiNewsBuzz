// src/services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  logger.error("FATAL: GEMINI_API_KEY is missing from .env file.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generateText = async (prompt, temperature = 0.5) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, generationConfig: { temperature } });
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    logger.error(`[GEMINI-SERVICE-ERROR] ${error.message}`);
    return null;
  }
};

const generateTldrSummary = (text) => generateText(`Provide a TL;DR summary for this: ${text}`);
const generateELI5 = (text) => generateText(`Explain this simply: ${text}`);
const generateBulletPoints = (text) => generateText(`Summarize this in bullet points: ${text}`);
const analyzeSentiment = async (text) => {
  const prompt = `Analyze sentiment. Respond only with "positive", "negative", or "neutral". Text: "${text}"`;
  const sentiment = await generateText(prompt, 0);
  return ["positive", "negative", "neutral"].includes(sentiment) ? sentiment : "neutral";
};
const categorizeArticle = async (text) => {
  const prompt = `Categorize this article into one: technology, business, sports, world, politics, science, entertainment, health. Respond with only the category name. Content: ${text}`;
  const category = await generateText(prompt, 0);
  const validCategories = ["technology", "business", "sports", "world", "politics", "science", "entertainment", "health"];
  return validCategories.includes(category) ? category : 'general';
};

module.exports = {
  generateTldrSummary,
  generateELI5,
  generateBulletPoints,
  analyzeSentiment,
  categorizeArticle,
};