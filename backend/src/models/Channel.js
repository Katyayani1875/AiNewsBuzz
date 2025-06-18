// src/models/Channel.js
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'technology', 'sports'
  description: String,
});

module.exports = mongoose.model('Channel', channelSchema);