// ai-newsbuzz-backend/src/routes/userRoutes.js
const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary"); // Import Cloudinary storage
const {
  updateUserProfile,
  getPublicProfile,
  getMyProfile,
  getUserComments,
  registerUser,
  loginUser,
   getUserLikedComments,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ storage }); // Configure multer

// User registration
router.post("/register", registerUser);
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
router.get('/:username/comments', getUserComments);
router.get('/:username/likes', getUserLikedComments);

module.exports = router;
