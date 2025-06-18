// src/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  gnewsId: { type: String, unique: true, required: true },  // Unique ID from GNews
  title: { type: String, required: true },
  url: { type: String, required: true },
  source: {
    name: String,
    url: String,
  },
  image: String,
  description: String,
  content: String, // Full content from GNews (if available)
  publishedAt: Date,
  topic: String, // e.g., 'technology', 'sports'
  language: String,
  country: String,
  summaries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Summary' }], // Reference to Summary model
  clickCount: { type: Number, default: 0 },  // Track how many times the full article was viewed
}, {
  timestamps: true,
});

module.exports = mongoose.model('News', newsSchema);