// src/controllers/commentController.js (DEFINITIVE, FULLY CORRECTED VERSION)

const Comment = require('../models/Comment');
const News = require('../models/News');
const Notification = require('../models/Notification'); // Keep for future use
const logger = require('../utils/logger');

// --- Internal Helper Function for Deletion ---
// This function recursively finds and deletes all replies to a given comment.
async function deleteReplies(commentId) {
    const replies = await Comment.find({ parentComment: commentId });
    for (const reply of replies) {
        // Recurse for nested replies
        await deleteReplies(reply._id);
        // Delete the reply itself
        await Comment.findByIdAndDelete(reply._id);
    }
}


// --- Exported Controller Functions ---

/**
 * Fetches all comments for a given news article, deeply populating user info.
 */
exports.getCommentsByNewsId = async (req, res) => {
    const { newsId } = req.params;
    try {
        const comments = await Comment.find({ news: newsId, parentComment: null })
            .sort({ createdAt: -1 }) // Show newest top-level comments first
            .populate({
                path: 'user',
                select: 'username profilePicture',
            })
            .populate({
                path: 'replies',
                populate: {
                    path: 'user',
                    select: 'username profilePicture',
                    // This can be nested further if you have multiple levels of replies
                    populate: {
                        path: 'replies',
                        populate: {
                           path: 'user',
                           select: 'username profilePicture',
                        }
                    }
                }
            });
        res.json(comments);
    } catch (error) {
        logger.error(`Error getting comments: ${error.message}`);
        res.status(500).json({ message: "Server error while fetching comments." });
    }
};

/**
 * Creates a new comment or a reply and returns the newly created, populated comment.
 */
exports.createComment = async (req, res) => {
    const { newsId, text, parentCommentId } = req.body;
    const userId = req.user._id;

    try {
        const newsArticle = await News.findById(newsId);
        if (!newsArticle) {
            return res.status(404).json({ message: "News article not found" });
        }

        const comment = new Comment({
            news: newsId,
            user: userId,
            text: text,
            parentComment: parentCommentId || null,
        });
        await comment.save();

        if (parentCommentId) {
            await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: comment._id } });
            // TODO: Implement notification logic here
        }

        // CRITICAL: Populate the new comment with user data before sending it back.
        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'username profilePicture');

        // TODO: Implement real-time Socket.IO emission
        // const io = req.app.get('io');
        // io.to(newsId).emit('new_comment', populatedComment);

        res.status(201).json(populatedComment);
    } catch (error) {
        logger.error(`Error creating comment: ${error.message}`);
        res.status(500).json({ message: "Server error while creating comment" });
    }
};

/**
 * Toggles a like on a comment and returns the fully updated comment object.
 */
exports.likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const likeIndex = comment.likes.indexOf(userId);
        if (likeIndex > -1) {
            // User has already liked, so unlike
            comment.likes.splice(likeIndex, 1);
        } else {
            // User has not liked, so add like
            comment.likes.push(userId);
        }
        await comment.save();

        // Send back the fully populated comment so the UI can update the like count
        const populatedComment = await Comment.findById(commentId)
            .populate('user', 'username profilePicture'); // Populate necessary fields

        res.status(200).json(populatedComment);
    } catch (error) {
        logger.error(`Error liking comment: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Deletes a comment and all its nested replies.
 */
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { _id: userId, isAdmin } = req.user;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check for authorization
        if (comment.user.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({ message: "User not authorized to delete this comment" });
        }
        
        // If it's a reply, remove its reference from the parent
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id }
            });
        }
        
        // Recursively delete all children
        await deleteReplies(commentId);
        
        // Delete the main comment itself
        await Comment.findByIdAndDelete(commentId);

        // TODO: Implement real-time Socket.IO emission
        // const io = req.app.get('io');
        // io.to(comment.news.toString()).emit('comment_deleted', { commentId });

        res.status(200).json({ message: "Comment and all replies deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting comment: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

// These can be implemented later with similar logic if needed
exports.dislikeComment = async (req, res) => {
    res.status(501).json({ message: 'Dislike functionality not implemented.' });
};
exports.flagComment = async (req, res) => {
    res.status(501).json({ message: 'Flag functionality not implemented.' });
};