// ai-newsbuzz-backend/src/routes/userRoutes.js
const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary"); // Import Cloudinary storage
const {
  updateUserProfile,
  getPublicProfile,
  getMyProfile,
  registerUser,
  loginUser,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ storage }); // Configure multer

// User registration
router.post("/", registerUser);
// User login
router.post("/login", loginUser);

// GET my profile (the logged-in user)
router.get("/me", verifyToken, getMyProfile);

// UPDATE my profile
router.put(
  "/me",
  verifyToken,
  upload.single("profilePicture"),
  updateUserProfile
);

// GET a public user profile by username
router.get("/:username", getPublicProfile);

module.exports = router;
