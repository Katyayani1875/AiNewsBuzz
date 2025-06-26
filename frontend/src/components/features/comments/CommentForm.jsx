// src/components/features/comments/CommentForm.jsx

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- THEME-AWARE AVATAR COMPONENT ---
const UserAvatar = ({ user }) => {
  if (user?.profilePicture?.url) {
    return (
      <img
        src={user.profilePicture.url}
        alt={user.username}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {user?.username?.charAt(0).toUpperCase() || 'U'}
    </div>
  );
};

export const CommentForm = ({ 
  newsId, 
  parentCommentId = null, 
  onCommentPosted = () => {} 
}) => {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const MAX_CHARS = 300;

  const { mutate, isPending } = useMutation({
    mutationFn: (commentData) => postComment(commentData),
    onSuccess: () => {
      setText('');
      setIsFocused(false);
      onCommentPosted();
      toast.success(parentCommentId ? 'Reply posted!' : 'Comment posted!');
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
    },
    onError: () => {
      toast.error(parentCommentId ? 'Failed to post reply' : 'Failed to post comment');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isPending || !token) return;
    mutate({ newsId, text, parentCommentId });
  };
  
  const handleCancel = () => {
    setText('');
    setIsFocused(false);
    onCommentPosted();
  };

  if (!user) return null;

  const showActions = isFocused || text.length > 0;
  const charsLeft = MAX_CHARS - text.length;

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-4 w-full">
      <UserAvatar user={user} />
      <div className="flex-1">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={parentCommentId ? "Write a reply..." : "Join the discussion..."}
            className={`w-full p-3 bg-transparent text-foreground rounded-lg text-sm transition-all duration-200 resize-none 
                        border border-transparent focus:border-border focus:bg-secondary focus:outline-none`}
            style={{ borderBottom: '1px solid var(--border)', borderRadius: '8px 8px 0 0' }}
            rows={isFocused ? 3 : 1}
            disabled={isPending}
            maxLength={MAX_CHARS}
          />
        </div>

        {/* =================================================================== */}
        {/* === START: SMOOTHER ANIMATED ACTION BAR === */}
        {/* =================================================================== */}
        <div className="relative h-10">
          <AnimatePresence>
            {showActions && (
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top" // Use origin-top for the scale animation
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }} // Use a direct ease-out for a snappy feel
              >
                <div className="flex justify-between items-center pt-2">
                    <span className={`text-xs font-medium ${charsLeft < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {charsLeft}
                    </span>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={isPending}>
                        Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={!text.trim() || isPending || charsLeft < 0}>
                        {isPending ? 'Posting...' : (parentCommentId ? 'Post Reply' : 'Post Comment')}
                        </Button>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* =================================================================== */}
        {/* === END: SMOOTHER ANIMATED ACTION BAR === */}
        {/* =================================================================== */}
      </div>
    </form>
  );
};