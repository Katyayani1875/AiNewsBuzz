// src/routes/newsRoutes.js
const express = require('express');
const { getNews, getNewsById, fetchLiveNewsForTopic, incrementClickCount } = require('../controllers/newsController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');  // Import middleware

const router = express.Router();

router.get('/', getNews);                // Get news (with optional topic, language, country)
router.get('/live-refresh', fetchLiveNewsForTopic);     // Refresh news (manually or via cron)
router.get('/:id', getNewsById);          // Get a specific news item by ID
router.put('/click/:id', incrementClickCount);   // Increment click count for a news article

module.exports = router;