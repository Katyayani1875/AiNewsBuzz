// ai-newsbuzz-backend/src/routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getMyProfile,
} = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getMyProfile);

module.exports = router;
