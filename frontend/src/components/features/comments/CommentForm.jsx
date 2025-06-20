import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';

export const CommentForm = ({ newsId, parentCommentId = null, onCommentPosted = () => {} }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  const mutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      // After a comment is posted, we tell TanStack Query that the data for
      // this article's comments is now stale and needs to be refetched.
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
      setText(''); // Clear the input field
      onCommentPosted(); // Call the callback (e.g., to close the reply form)
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // The payload passed to the mutation. This is where parentCommentId is crucial.
    mutation.mutate({ newsId, text, parentCommentId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-4 w-full">
      <img 
        src={user?.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
        alt={user?.username || 'user'} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={parentCommentId ? "Write your reply..." : "Join the discussion..."}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          rows="3"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
};