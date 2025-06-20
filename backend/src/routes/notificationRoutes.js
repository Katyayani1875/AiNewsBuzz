// src/routes/notificationRoutes.js
const express = require('express');
const { getNotifications, markNotificationsAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for a user
router.get('/', verifyToken, getNotifications);

// @route   PUT /api/notifications/read
// @desc    Mark all of a user's notifications as read
router.put('/read', verifyToken, markNotificationsAsRead);

module.exports = router;