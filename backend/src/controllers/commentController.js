// ai-newsbuzz-backend/src/controllers/commentController.js
const Comment = require("../models/Comment");
const News = require("../models/News");
const logger = require("../utils/logger");

// Create a comment
const createComment = async (req, res) => {
  const { newsId, text, parentCommentId } = req.body;
  const userId = req.user._id; // Get user ID from the authenticated user

  if (!newsId || !text) {
    return res.status(400).json({ message: "News ID and text are required" });
  }

  try {
    const comment = new Comment({
      news: newsId,
      user: userId,
      text: text,
    });

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      comment.parentComment = parentCommentId; // Set the parent comment
    }

    const savedComment = await comment.save();

    // If it's a reply, update the parent comment's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: savedComment._id },
      });
    }

    res.status(201).json(savedComment);
  } catch (error) {
    logger.error(`Error creating comment: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Get comments for a news item
const getCommentsByNewsId = async (req, res) => {
  const { newsId } = req.params;

  try {
    const comments = await Comment.find({ news: newsId })
      .populate("user", "username") // Populate user info
      .populate({
        path: "replies",
        populate: { path: "user", select: "username" }, // Populate replies' user info
      })
      .sort({ createdAt: 1 }); // Sort by creation date

    res.json(comments);
  } catch (error) {
    logger.error(`Error getting comments: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Like/unlike a comment
const likeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user has already liked or disliked
    const alreadyLiked = comment.likes.includes(userId);
    const alreadyDisliked = comment.dislikes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Remove dislike if present, then like
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
      comment.likes.push(userId);
    }

    await comment.save();
    res
      .status(200)
      .json({ likes: comment.likes.length, dislikes: comment.dislikes.length });
  } catch (error) {
    logger.error(`Error liking comment: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Dislike/undislike a comment
const dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const alreadyDisliked = comment.dislikes.includes(userId);
    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyDisliked) {
      // Remove dislike
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Remove like if present, then dislike
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      comment.dislikes.push(userId);
    }

    await comment.save();
    res
      .status(200)
      .json({ likes: comment.likes.length, dislikes: comment.dislikes.length });
  } catch (error) {
    logger.error(`Error disliking comment: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Flag a comment
const flagComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id; // Get user ID from the authenticated user

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user has already flagged
    if (comment.flags && comment.flags.includes(userId)) {
      // Unflag
      comment.flags = comment.flags.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Flag
      if (!comment.flags) comment.flags = [];
      comment.flags.push(userId);
    }

    await comment.save();
    res.status(200).json({ flags: comment.flags.length }); // Or return the comment
  } catch (error) {
    logger.error(`Error flagging comment: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createComment,
  getCommentsByNewsId,
  likeComment,
  dislikeComment,
  flagComment,
};
