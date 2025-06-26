const Comment = require('../models/Comment');
const News = require('../models/News');
const logger = require('../utils/logger');

// Helper function for recursive deletion
async function deleteReplies(commentId) {
    const replies = await Comment.find({ parentComment: commentId });
    for (const reply of replies) {
        await deleteReplies(reply._id);
        await Comment.findByIdAndDelete(reply._id);
    }
}

// Controller functions

/**
 * Get comments by news ID
 */
const getCommentsByNewsId = async (req, res) => {
    const { newsId } = req.params;
    try {
        const comments = await Comment.find({ news: newsId, parentComment: null })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'username profilePicture'
            })
            .populate({
                path: 'replies',
                populate: [
                    { path: 'user', select: 'username profilePicture' },
                    { path: 'replies', select: '_id' }
                ]
            });

        res.json(comments);
    } catch (error) {
        logger.error(`Error getting comments: ${error.message}`);
        res.status(500).json({ message: "Server error while fetching comments." });
    }
};

/**
 * Create a new comment
 */
const createComment = async (req, res) => {
    const { newsId, text, parentCommentId } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    try {
        const duplicateComment = await Comment.findOne({
            news: newsId,
            user: userId,
            text: text.trim(),
            parentComment: parentCommentId || null
        });

        if (duplicateComment) {
            return res.status(409).json({ message: "Duplicate comment detected" });
        }

        const newsArticle = await News.findById(newsId);
        if (!newsArticle) {
            return res.status(404).json({ message: "News article not found" });
        }

        const comment = new Comment({
            news: newsId,
            user: userId,
            text: text.trim(),
            parentComment: parentCommentId || null,
        });

        await comment.save();

        if (parentCommentId) {
            await Comment.findByIdAndUpdate(
                parentCommentId, 
                { $addToSet: { replies: comment._id } },
                { new: true }
            );
        }

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'username profilePicture');

        res.status(201).json(populatedComment);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Duplicate comment detected" });
        }
        logger.error(`Error creating comment: ${error.message}`);
        res.status(500).json({ message: "Server error while creating comment" });
    }
};

/**
 * Like/unlike a comment
 */
const likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const likeIndex = comment.likes.findIndex(id => id.equals(userId));
        if (likeIndex > -1) {
            comment.likes.splice(likeIndex, 1);
        } else {
            comment.likes.push(userId);
            const dislikeIndex = comment.dislikes.findIndex(id => id.equals(userId));
            if (dislikeIndex > -1) {
                comment.dislikes.splice(dislikeIndex, 1);
            }
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        logger.error(`Error liking comment: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Delete a comment
 */
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { _id: userId, isAdmin } = req.user;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!comment.user.equals(userId) && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }
        
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: comment._id }
            });
        }
        
        await deleteReplies(commentId);
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({ message: "Comment and replies deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting comment: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Dislike a comment (placeholder implementation)
 */
const dislikeComment = async (req, res) => {
    try {
        res.status(501).json({ message: 'Dislike functionality not implemented yet' });
    } catch (error) {
        logger.error(`Error disliking comment: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Flag a comment (placeholder implementation)
 */
const flagComment = async (req, res) => {
    try {
        res.status(501).json({ message: 'Flag functionality not implemented yet' });
    } catch (error) {
        logger.error(`Error flagging comment: ${error.message}`);
        res.status(500).json({ message: "Server error" });
    }
};

// Export all controller functions
module.exports = {
    getCommentsByNewsId,
    createComment,
    likeComment,
    dislikeComment,
    flagComment,
    deleteComment
};