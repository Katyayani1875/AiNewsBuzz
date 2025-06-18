// src/services/cohereService.js
const { CohereClientV2 } = require("cohere-ai"); // <-- Import the V2 Client
const logger = require("../utils/logger");
require("dotenv").config();

// Initialize the Cohere V2 client
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY, // <-- Pass the API key here
});

/**
 * Summarizes text using the Cohere V2 Chat API.
 */
const summarizeText = async (text) => {
  try {
    const response = await cohere.chat({
      model: "command-r", // Or 'command-r-plus'
      message: `Summarize the following news article concisely, in a TL;DR format:\n\n---\n\n${text}`,
    });

    if (response && response.message && response.message.content) {
      // The response.message.content is an array of content blocks. We need to find the text.
      const textBlock = response.message.content.find(
        (block) => block.type === "text"
      );
      if (textBlock) {
        return textBlock.text.trim();
      }
    }

    logger.warn(
      "Cohere summarization (V2) failed to produce a valid summary:",
      response
    );
    return null;
  } catch (error) {
    logger.error(`Cohere summarization (V2) error: ${error.message}`);
    return null;
  }
};

/**
 * Classifies the sentiment of a given text using the Cohere V2 Chat API.
 */
const classifySentiment = async (text) => {
  try {
    const response = await cohere.chat({
      model: "command-r", // Or 'command-r-plus'
      message: `Analyze the sentiment of the following text. Respond with only one of these words: "positive", "negative", or "neutral".\n\nText: "${text}"`,
      temperature: 0, // Set temperature to 0 for more deterministic, factual classification
    });

    if (response && response.message && response.message.content) {
      const textBlock = response.message.content.find(
        (block) => block.type === "text"
      );
      if (textBlock) {
        const sentiment = textBlock.text.trim().toLowerCase();
        // Validate the response to ensure it's one of the expected values
        if (["positive", "negative", "neutral"].includes(sentiment)) {
          return sentiment;
        }
      }
    }

    logger.warn(
      "Cohere sentiment classification (V2) failed to produce a valid sentiment:",
      response
    );
    return null;
  } catch (error) {
    logger.error(
      `Cohere sentiment classification (V2) error: ${error.message}`
    );
    return null;
  }
};

module.exports = { summarizeText, classifySentiment };
