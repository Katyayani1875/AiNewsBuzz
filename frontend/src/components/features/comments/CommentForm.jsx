// src/components/features/comments/CommentForm.jsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';

export const CommentForm = ({ newsId, parentCommentId = null, onCommentPosted }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      // After success, invalidate the main comments query to refetch all comments
      // This is a simple and robust way to ensure the UI is up-to-date
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
      setText(''); // Clear the input
      if (onCommentPosted) {
        onCommentPosted(); // Callback to e.g., close the reply form
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    mutation.mutate({ newsId, text, parentCommentId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-4">
      <img 
        src={user?.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
        alt={user?.username} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={parentCommentId ? "Write a reply..." : "Join the discussion..."}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          rows="3"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-600"
          >
            {mutation.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
};