// src/components/features/comments/CommentSection.jsx (Fully Functional and Styled)

import { useQuery } from '@tanstack/react-query';
import { fetchCommentsByNewsId } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export const CommentSection = ({ newsId }) => {
  const { isLoggedIn } = useAuthStore();

  const { data: comments, isLoading, isError, error } = useQuery({
    queryKey: ['comments', newsId],
    queryFn: () => fetchCommentsByNewsId(newsId),
    enabled: !!newsId, // Only run the query if newsId exists
    staleTime: 1000 * 60, // Comments are fresh for 1 minute
  });

  // Filter for top-level comments only for the initial render loop
  const topLevelComments = comments?.filter(c => !c.parentComment) || [];

  return (
    // The entire section is styled as a single "card" for a cohesive look
    <div className="bg-card border border-border rounded-xl p-6 mt-12">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageSquare size={24} className="text-primary" /> Live Discussion ({topLevelComments.length})
      </h2>
      
      {isLoggedIn ? (
        <div className="mb-8 border-b border-border pb-8">
          <CommentForm newsId={newsId} />
        </div>
      ) : (
        <div className="text-center p-4 bg-secondary rounded-md mb-8">
          <p className="text-muted-foreground text-sm">
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link> or <Link to="/register" className="text-primary font-semibold hover:underline">sign up</Link> to join the discussion.
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
        
        {comments && topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <Comment key={comment._id} comment={comment} newsId={newsId} />
          ))
        ) : (
          !isLoading && !isError && <p className="text-muted-foreground text-center py-8">Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};