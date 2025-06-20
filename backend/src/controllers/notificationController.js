// src/controllers/notificationController.js
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

// Get all notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'username') // Show the sender's username
      .sort({ createdAt: -1 }); // Show newest first

    res.json(notifications);
  } catch (error) {
    logger.error(`Error getting notifications: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notifications as read
const markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    logger.error(`Error marking notifications as read: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotifications, markNotificationsAsRead };