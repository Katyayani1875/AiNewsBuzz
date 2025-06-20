// src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // The user who should receive the notification
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The user who triggered the notification (e.g., who liked or commented)
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // The type of notification
  type: {
    type: String,
    enum: ['like', 'comment', 'reply', 'admin_post'], // Add more types as needed
    required: true,
  },
  
  // The news article this notification is related to
  newsArticle: { type: mongoose.Schema.Types.ObjectId, ref: 'News' },
  
  // The specific comment this notification is related to (especially for replies)
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },

  // Has the user seen this notification yet?
  isRead: { type: Boolean, default: false },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);