// src/services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("../utils/logger");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_SENTIMENT_API_KEY = process.env.GEMINI_SENTIMENT_API_KEY; // Get the new key
const MODEL_NAME = "gemini-1.5-flash"; // Using the latest flash model

// This instance is for general purpose generation (ELI5, Bullets)
const genAIGeneral = new GoogleGenerativeAI(GEMINI_API_KEY);

// This instance is ONLY for sentiment analysis, using the separate key
const genAISentiment = new GoogleGenerativeAI(GEMINI_SENTIMENT_API_KEY);

const generateTextWithGemini = async (prompt) => {
  try {
    const model = genAIGeneral.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    logger.error(`Gemini General API Error: ${error.message}`);
    return null;
  }
};

const generateELI5 = async (text) => {
  const prompt = `Explain the following news article simply, as if for a 5-year-old:\n\n---\n\n${text}`;
  return await generateTextWithGemini(prompt);
};

const generateBulletPoints = async (text) => {
  const prompt = `Summarize the key points of the following news article in a bulleted list:\n\n---\n\n${text}`;
  return await generateTextWithGemini(prompt);
};

const translateText = async (text, targetLanguage = "es") => {
  const prompt = `Translate the following text to ${targetLanguage}:\n\n---\n\n${text}`;
  return await generateTextWithGemini(prompt);
};

// **** NEW FUNCTION FOR SENTIMENT ANALYSIS ****
const analyzeSentimentWithGemini = async (text) => {
  try {
    const model = genAISentiment.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: { temperature: 0 }, // Set temperature to 0 for deterministic classification
    });

    const prompt = `Analyze the sentiment of the following text. Respond with only ONE of these words: "positive", "negative", or "neutral".\n\nText: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text().trim().toLowerCase();

    // Validate the response to ensure it's one of the expected values
    if (["positive", "negative", "neutral"].includes(sentiment)) {
      console.log(`Gemini Sentiment Analysis Result: ${sentiment}`); // For debugging
      return sentiment;
    }

    logger.warn("Gemini sentiment analysis failed to produce a valid sentiment:", sentiment);
    return "neutral"; // Fallback to neutral if the response is not as expected
  } catch (error) {
    logger.error(`Gemini Sentiment API Error: ${error.message}`);
    return null;
  }
};

module.exports = {
  generateELI5,
  generateBulletPoints,
  translateText,
  analyzeSentimentWithGemini, // Export the new function
};
