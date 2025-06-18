// src/models/Summary.js
const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  type: { // 'tldr', 'bullets', 'eli5'
    type: String,
    enum: ['tldr', 'bullets', 'eli5', 'translation'],
    required: true,
  },
  content: { type: String, required: true },
  sentiment: { type: String }, // e.g., 'positive', 'negative', 'neutral' from Cohere
  audioUrl: String,  // URL to the audio file from Google TTS
  language: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Summary', summarySchema);