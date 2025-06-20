// ai-newsbuzz-backend/src/controllers/commentController.js
const Comment = require("../models/Comment");
const News = require("../models/News");
const Notification = require("../models/Notification"); // <-- IMPORT Notification model
const { getIoInstance } = require("../socket"); // <-- UPDATED: Import from socket.js
const logger = require("../utils/logger");

// Create a comment
const createComment = async (req, res) => {
  const { newsId, text, parentCommentId } = req.body;
  const userId = req.user._id; // Get user ID from the authenticated user

  console.log("--- [START] Create Comment ---");
  console.log(`User [${userId}] is commenting on News [${newsId}]`);
  if (parentCommentId) {
    console.log(`This is a REPLY to Parent Comment [${parentCommentId}]`);
  }

  try {
    const newsArticle = await News.findById(newsId);
    if (!newsArticle) {
      console.log(`[ERROR] News article with ID [${newsId}] not found.`);
      return res.status(404).json({ message: "News article not found" });
    }

    const comment = new Comment({
      news: newsId,
      user: userId,
      text: text,
      parentComment: parentCommentId || null,
    });

    const savedComment = await comment.save();
    console.log(`[SUCCESS] Comment saved to DB with ID [${savedComment._id}]`);

    // --- NOTIFICATION LOGIC ---
    const io = getIoInstance();

    // Check if it's a reply to trigger notification logic
    if (parentCommentId) {
      console.log("[INFO] Entering notification logic for a reply.");

      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        console.log(
          `[ERROR] Parent comment [${parentCommentId}] not found during notification check.`
        );
        // Note: The reply is already saved, we just can't create a notification.
        // This is okay to proceed from, but good to log.
      } else {
        console.log(
          `[INFO] Parent comment found. Recipient should be [${parentComment.user}]`
        );

        // IMPORTANT CHECK: Don't notify if a user replies to their own comment
        if (parentComment.user.toString() !== userId.toString()) {
          console.log(
            "[INFO] Sender and recipient are different. Creating notification..."
          );

          const notification = new Notification({
            recipient: parentComment.user,
            sender: userId,
            type: "reply",
            newsArticle: newsId,
            comment: parentCommentId,
          });

          await notification.save();
          console.log(
            `[SUCCESS] Notification saved to DB with ID [${notification._id}] for user [${notification.recipient}]`
          );

          // Emit the real-time event
          io.to(parentComment.user.toString()).emit(
            "new_notification",
            notification
          );
          console.log(
            `[SOCKET.IO] Emitting 'new_notification' to room [${parentComment.user.toString()}]`
          );
        } else {
          console.log(
            "[INFO] User is replying to their own comment. No notification will be sent."
          );
        }
      }

      // Update the parent comment's replies array
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: savedComment._id },
      });
    }

    console.log("--- [END] Create Comment ---");
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("--- [FATAL ERROR] in createComment ---", error);
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
