// src/routes/commentRoutes.js
const express = require("express");
const {
  createComment,
  getCommentsByNewsId,
  likeComment,
  dislikeComment,
  flagComment,
  deleteComment, 
} = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", verifyToken, createComment);
router.get("/:newsId", getCommentsByNewsId);
router.post("/like/:commentId", verifyToken, likeComment);
router.post("/dislike/:commentId", verifyToken, dislikeComment);
router.post("/flag/:commentId", verifyToken, flagComment);
router.delete("/:commentId", verifyToken, deleteComment);

module.exports = router;