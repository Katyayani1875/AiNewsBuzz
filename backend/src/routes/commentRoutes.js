// ai-newsbuzz-backend/src/routes/commentRoutes.js
const express = require("express");
const {
  createComment,
  getCommentsByNewsId,
  likeComment,
  dislikeComment,
  flagComment,
} = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/authMiddleware"); // Ensure authentication
const router = express.Router();

router.post("/", verifyToken, createComment); // Create a comment (requires auth)
router.get("/:newsId", getCommentsByNewsId); // Get comments for a news item
router.post("/like/:commentId", verifyToken, likeComment); // Like a comment (requires auth)
router.post("/dislike/:commentId", verifyToken, dislikeComment); // Dislike a comment (requires auth)
router.post("/flag/:commentId", verifyToken, flagComment); // Flag a comment (requires auth)

module.exports = router;
