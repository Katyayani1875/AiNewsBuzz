// src/components/features/comments/CommentSection.jsx
import { useQuery } from '@tanstack/react-query';
import { fetchCommentsByNewsId } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm'; // Import the form
import { Link } from 'react-router-dom';

export const CommentSection = ({ newsId }) => {
  const { isLoggedIn } = useAuthStore();

  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['comments', newsId],
    queryFn: () => fetchCommentsByNewsId(newsId),
    enabled: !!newsId,
  });

  return (
    <div className="mt-12 bg-[#161B22] border border-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Live Discussion ({comments?.length || 0})</h2>
      
      {isLoggedIn ? (
        // Use the reusable form for top-level comments
        <div className="mb-8">
          <CommentForm newsId={newsId} />
        </div>
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
            // We only render top-level comments here. Replies are rendered recursively.
            // **CRUCIAL: Pass the newsId prop down to each Comment**
            !comment.parentComment && <Comment key={comment._id} comment={comment} newsId={newsId} />
          ))
        ) : (
          !isLoading && <p className="text-gray-500 text-center py-4">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};