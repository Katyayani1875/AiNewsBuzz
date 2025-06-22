// src/routes/summaryRoutes.js (FINAL, CORRECTED)
const express = require('express');
// ** THE FIX IS HERE: Only import the function this route needs. **
const { generateAndGetSummaries } = require('../controllers/summaryController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// This endpoint is for on-demand, "Just-In-Time" summary generation.
// It correctly uses the generateAndGetSummaries controller function.
router.post('/generate/:newsId', verifyToken, generateAndGetSummaries);

module.exports = router;