// src/components/features/comments/CommentForm.jsx (FINAL, CORRECTED)
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';

export const CommentForm = ({ newsId, parentCommentId = null, onCommentPosted = () => {} }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  const postCommentMutation = useMutation({
    mutationFn: postComment,
    // ** THIS IS THE FIX **
    // This runs on success and provides INSTANT feedback to the user who posted.
    onSuccess: (newComment) => {
      queryClient.setQueryData(['comments', newsId], (oldData = []) => {
        // Helper to recursively find the parent and add the reply
        const addReply = (list, parentId, reply) => list.map(c => {
          if (c._id === parentId) {
            return { ...c, replies: [...(c.replies || []), reply] };
          }
          if (c.replies?.length > 0) {
            return { ...c, replies: addReply(c.replies, parentId, reply) };
          }
          return c;
        });

        if (newComment.parentComment) {
          // If it's a reply, add it to the correct parent in the cache
          return addReply(oldData, newComment.parentComment, newComment);
        } else {
          // If it's a top-level comment, add it to the end of the main list
          return [...oldData, newComment];
        }
      });
      setText('');
      onCommentPosted();
    },
    onError: (error) => {
      console.error("Failed to post comment:", error.message);
      // TODO: Show error toast
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    postCommentMutation.mutate({ newsId, text, parentCommentId });
  };
 return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3 w-full">
      <img src={user?.profilePicture?.url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username}`} alt={user?.username} className="w-9 h-9 rounded-full object-cover mt-1" />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={parentCommentId ? "Write a reply..." : "Join the discussion..."}
          className="w-full p-3 bg-secondary border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          rows="2"
        />
        <div className="flex justify-end mt-2">
          <button type="submit" disabled={postCommentMutation.isPending} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity text-sm disabled:opacity-50">
            {postCommentMutation.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
}