// src/models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  news: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Nested replies
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who disliked
  flags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Users who flagged (for moderation)
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);