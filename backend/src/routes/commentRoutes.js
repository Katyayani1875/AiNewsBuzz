const express = require("express");
const commentController = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Create a new comment
router.post("/", verifyToken, commentController.createComment);

// Get comments for a news article
router.get("/:newsId", commentController.getCommentsByNewsId);

// Like a comment
router.post("/like/:commentId", verifyToken, commentController.likeComment);

// Dislike a comment
router.post("/dislike/:commentId", verifyToken, commentController.dislikeComment);

// Flag a comment
router.post("/flag/:commentId", verifyToken, commentController.flagComment);

// Delete a comment
router.delete("/:commentId", verifyToken, commentController.deleteComment);

module.exports = router;