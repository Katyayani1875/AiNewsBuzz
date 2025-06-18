// ai-newsbuzz-backend/src/routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', registerUser);   // User registration
router.post('/login', loginUser);  // User login
router.get('/profile', verifyToken, getUserProfile); // Get user profile (requires authentication)

module.exports = router;