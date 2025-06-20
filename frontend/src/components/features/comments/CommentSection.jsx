// src/components/features/comments/CommentSection.jsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCommentsByNewsId, postComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { Comment } from './Comment';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export const CommentSection = ({ newsId }) => {
  const queryClient = useQueryClient();
  const { isLoggedIn, user } = useAuthStore();
  const [newComment, setNewComment] = useState('');

  // Fetch initial comments using TanStack Query
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['comments', newsId],
    queryFn: () => fetchCommentsByNewsId(newsId),
    enabled: !!newsId,
  });

  // Mutation for posting a new comment
  const postMutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      // The comment appears instantly via Socket.IO, so we don't strictly need to invalidate.
      // However, invalidating ensures data consistency if the socket fails.
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
      setNewComment('');
    },
  });

  // Real-time listener using useEffect
  useEffect(() => {
    // 1. Join a "room" specific to this news article on the backend
    if (newsId) {
      socket.emit('join_article_room', newsId);
    }

    // 2. Define the handler for receiving a new comment
    const handleNewComment = (commentData) => {
      // Check if the comment belongs to the current article
      if (commentData.news === newsId) {
        // Use queryClient to optimistically update the comments list
        queryClient.setQueryData(['comments', newsId], (oldData = []) => {
          // Avoid adding duplicates if the user's own comment arrives via socket
          if (oldData.some(c => c._id === commentData._id)) {
            return oldData;
          }
          return [...oldData, commentData];
        });
      }
    };

    // 3. Listen for the 'new_comment' event from the server
    socket.on('new_comment', handleNewComment);

    // 4. Clean up when the component unmounts
    return () => {
      if (newsId) {
        socket.emit('leave_article_room', newsId);
      }
      socket.off('new_comment', handleNewComment);
    };
  }, [newsId, queryClient]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn) return;
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
          <p className="text-gray-400">Please <Link to="/login" className="text-cyan-400 hover:underline">log in</Link> or <Link to="/register" className="text-cyan-400 hover:underline">sign up</Link> to join the discussion.</p>
        </div>
      )}

      <div className="space-y-4 divide-y divide-gray-800">
        {isLoading && <p className="text-gray-400 animate-pulse">Loading comments...</p>}
        {isError && <p className="text-red-400">Failed to load comments.</p>}
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            // We only render top-level comments here. Replies are rendered recursively inside the Comment component.
            !comment.parentComment && <Comment key={comment._id} comment={comment} />
          ))
        ) : (
          !isLoading && <p className="text-gray-500 text-center py-4">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};