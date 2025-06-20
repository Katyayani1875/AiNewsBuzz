// src/components/features/comments/CommentSection.jsx (Refined Version)
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCommentsByNewsId, postComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import io from 'socket.io-client';

// Helper to format dates (e.g., "5 minutes ago")
import { formatDistanceToNow } from 'date-fns';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

// A single comment component
const Comment = ({ comment }) => {
  return (
    <div className="flex items-start space-x-4 py-4">
      <img 
        src={comment.user.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
        alt={comment.user.username} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className="font-bold text-white">{comment.user.username}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </p>
        </div>
        <p className="text-gray-300 mt-1">{comment.text}</p>
        {/* TODO: Add Like/Reply buttons here */}
      </div>
    </div>
  );
};


export const CommentSection = ({ newsId }) => {
  const queryClient = useQueryClient();
  const { isLoggedIn, user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  // Fetch initial comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', newsId],
    queryFn: () => fetchCommentsByNewsId(newsId),
  });

  // Mutation for posting a new comment
  const postMutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      // No longer need to manually invalidate; Socket.IO will handle the update
      setNewComment('');
    },
  });

  // Real-time listener for new comments
  useEffect(() => {
    // Join a "room" specific to this news article
    socket.emit('join_article_room', newsId);

    const handleNewComment = (comment) => {
      if (comment.news === newsId) {
        queryClient.setQueryData(['comments', newsId], (oldData = []) => {
          // Avoid adding duplicates if the user's own comment arrives via socket
          if (oldData.some(c => c._id === comment._id)) {
            return oldData;
          }
          return [...oldData, comment];
        });
      }
    };

    socket.on('new_comment', handleNewComment);

    // Clean up when the component unmounts
    return () => {
      socket.emit('leave_article_room', newsId);
      socket.off('new_comment', handleNewComment);
    };
  }, [newsId, queryClient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    postMutation.mutate({ newsId, text: newComment });
  };

  return (
    <div className="mt-12 bg-[#161B22] border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Live Discussion ({comments?.length || 0})</h2>
      
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex items-start space-x-4 mb-8">
          <img 
            src={user.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
            alt={user.username} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion..."
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              rows="3"
            />
            <button
              type="submit"
              disabled={postMutation.isPending}
              className="mt-2 bg-cyan-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-600"
            >
              {postMutation.isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-4 border border-dashed border-gray-700 rounded-lg mb-8">
          <p className="text-gray-400">Please <a href="/login" className="text-cyan-400 hover:underline">log in</a> to join the discussion.</p>
        </div>
      )}

      <div className="space-y-4 divide-y divide-gray-800">
        {isLoading && <p className="text-gray-400">Loading comments...</p>}
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        ) : (
          !isLoading && <p className="text-gray-500 text-center py-4">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};