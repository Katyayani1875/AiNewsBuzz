// src/components/features/comments/Comment.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { likeComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { CommentForm } from './CommentForm'; // Import the new form

export const Comment = ({ comment, newsId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore();

  // Check if the current logged-in user has liked this comment
  const isLiked = user && comment.likes.includes(user.id);

  const likeMutation = useMutation({
    mutationFn: () => likeComment(comment._id),
    // Optimistic UI update for a snappy user experience
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments', newsId] });
      const previousComments = queryClient.getQueryData(['comments', newsId]);

      // Find the deeply nested comment/reply and update it
      const updateNestedComment = (comments, targetId) => {
        return comments.map(c => {
          if (c._id === targetId) {
            const alreadyLiked = c.likes.includes(user.id);
            const newLikes = alreadyLiked
              ? c.likes.filter(id => id !== user.id)
              : [...c.likes, user.id];
            return { ...c, likes: newLikes };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateNestedComment(c.replies, targetId) };
          }
          return c;
        });
      };

      queryClient.setQueryData(['comments', newsId], old => updateNestedComment(old, comment._id));
      return { previousComments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['comments', newsId], context.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
    },
  });

  return (
    <div className="flex items-start space-x-3 py-4">
      {/* User Avatar */}
      <Link to={`/user/${comment.user.username}`}>
        <img 
          src={comment.user.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
          alt={comment.user.username} 
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      
      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Link to={`/user/${comment.user.username}`} className="font-bold text-white hover:underline">
            {comment.user.username}
          </Link>
          <p className="text-xs text-gray-500">
            • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </p>
        </div>
        <p className="text-gray-300 mt-1">{comment.text}</p>
        
        {/* Action Buttons */}
        <div className="mt-2 flex items-center space-x-4">
          <button 
            onClick={() => isLoggedIn && likeMutation.mutate()}
            disabled={!isLoggedIn || likeMutation.isPending}
            className={`text-xs font-bold flex items-center gap-1 transition-colors ${isLiked ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
          >
            👍 Like ({comment.likes.length})
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-gray-400 hover:text-white"
          >
            Reply
          </button>
        </div>

        {/* Reply Form - shows conditionally */}
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm 
              newsId={newsId} 
              parentCommentId={comment._id} 
              onCommentPosted={() => setShowReplyForm(false)} 
            />
          </div>
        )}

        {/* Render Replies Recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-gray-800">
            {comment.replies.map(reply => (
              <Comment key={reply._id} comment={reply} newsId={newsId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};