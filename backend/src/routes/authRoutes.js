// ai-newsbuzz-backend/src/routes/authRoutes.js
const express = require("express");
const {
  forgotPassword,validateResetToken, resetPassword,
  registerUser,
  loginUser,
  getMyProfile,  googleAuth,
} = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.get("/profile", verifyToken, getMyProfile);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', validateResetToken);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
