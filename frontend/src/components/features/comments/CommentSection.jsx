// src/components/features/comments/CommentSection.jsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCommentsByNewsId } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CommentSection = ({ newsId }) => {
  const { isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();
  const [uniqueComments, setUniqueComments] = useState([]);

  const { data: comments, isLoading, isError, error } = useQuery({
    queryKey: ['comments', newsId],
    queryFn: () => fetchCommentsByNewsId(newsId),
    enabled: !!newsId,
    staleTime: 1000 * 60,
  });

  // Deduplication effect
  useEffect(() => {
    if (comments) {
      const seen = new Set();
      const filteredComments = comments.filter(comment => {
        const duplicate = seen.has(comment._id);
        seen.add(comment._id);
        return !duplicate;
      });
      setUniqueComments(filteredComments);
    }
  }, [comments]);

  // Filter for top-level comments only using the deduplicated list
  const topLevelComments = uniqueComments?.filter(c => !c.parentComment) || [];

  // Force refresh comments if we suspect duplicates
  const refreshComments = () => {
    queryClient.invalidateQueries(['comments', newsId]);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" /> 
          Live Discussion ({topLevelComments.length})
        </h2>
        <button 
          onClick={refreshComments}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Refresh
        </button>
      </div>
      
      {isLoggedIn ? (
        <div className="mb-8 border-b border-border pb-8">
          <CommentForm newsId={newsId} onSuccess={refreshComments} />
        </div>
      ) : (
        <div className="text-center p-4 bg-secondary rounded-md mb-8">
          <p className="text-muted-foreground text-sm">
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> or{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">sign up</Link> to join the discussion.
          </p>
        </div>
      )}

      <div className="space-y-2 divide-y divide-border">
        {isLoading && (
          <p className="text-muted-foreground text-center py-4">Loading comments...</p>
        )}
        {isError && (
          <div className="text-destructive text-center py-4">
            <p>Failed to load comments.</p>
            <p className="text-xs">{error.message}</p>
          </div>
        )}
        
        {uniqueComments && topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <Comment 
              key={`${comment._id}-${comment.createdAt}`} 
              comment={comment} 
              newsId={newsId} 
            />
          ))
        ) : (
          !isLoading && !isError && (
            <p className="text-muted-foreground text-center py-8">
              Be the first to share your thoughts!
            </p>
          )
        )}
      </div>
    </div>
  );
};