// src/components/features/comments/Comment.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeComment, deleteComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquareReply, Trash2, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

// Avatar Component
const UserAvatar = ({ user }) => {
  if (user?.profilePicture?.url) {
    return (
      <img 
        src={user.profilePicture.url} 
        alt={user.username} 
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
      {user?.username?.charAt(0).toUpperCase() || 'U'}
    </div>
  );
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ open, onOpenChange, onConfirm, isPending }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md m-4 bg-popover text-popover-foreground rounded-2xl border border-border shadow-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Are you absolutely sure?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete your comment and any replies to it.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Comment = ({ comment, newsId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();

  const isAuthor = user?.id === comment?.user?._id;
  const isLiked = user && comment?.likes?.includes(user.id);

  // --- Like Mutation with Optimistic Update ---
  const likeMutation = useMutation({
    mutationFn: () => likeComment(comment._id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments', newsId] });
      
      const previousComments = queryClient.getQueryData(['comments', newsId]);

      // Optimistic update function
      const updateCommentLikes = (comments) => 
        comments.map(c => {
          if (c._id === comment._id) {
            return {
              ...c,
              likes: isLiked 
                ? c.likes.filter(id => id !== user.id) 
                : [...c.likes, user.id]
            };
          }
          if (c.replies?.length > 0) {
            return { ...c, replies: updateCommentLikes(c.replies) };
          }
          return c;
        });

      queryClient.setQueryData(['comments', newsId], updateCommentLikes);

      return { previousComments };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['comments', newsId], context.previousComments);
      toast.error("Couldn't update like.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
    }
  });

  // --- Delete Mutation ---
  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(comment._id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['comments', newsId] });
      const previousComments = queryClient.getQueryData(['comments', newsId]);

      // Optimistic delete function
      const removeComment = (comments) => 
        comments.filter(c => c._id !== comment._id)
          .map(c => ({
            ...c,
            replies: c.replies ? removeComment(c.replies) : []
          }));

      queryClient.setQueryData(['comments', newsId], removeComment);

      return { previousComments };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['comments', newsId], context.previousComments);
      toast.error(err.message || "Failed to delete comment.");
    },
    onSuccess: () => {
      toast.success("Comment deleted.");
      setIsDeleteDialogOpen(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
    }
  });

  if (!comment || !comment.user) {
    return null;
  }

  return (
    <>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
      />
      
      <div className="flex items-start space-x-3 py-4">
        <Link to={`/news/user/${comment.user.username}`}>
          <UserAvatar user={comment.user} />
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <Link to={`/news/user/${comment.user.username}`} className="font-semibold text-foreground hover:underline text-sm">
                {comment.user.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full data-[state=open]:bg-accent">
                    <MoreHorizontal size={16}/>
                  </Button>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  <DropdownMenuContent 
                    align="end" 
                    asChild
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1, ease: 'easeOut' }}
                      className="bg-popover/80 backdrop-blur-md border-border/20"
                    >
                      <DropdownMenuItem 
                        onSelect={() => setIsDeleteDialogOpen(true)} 
                        className="text-destructive focus:bg-destructive/20 focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </motion.div>
                  </DropdownMenuContent>
                </AnimatePresence>
              </DropdownMenu>
            )}
          </div>
          <p className="text-foreground/90 mt-1 whitespace-pre-wrap">{comment.text}</p>
          
          <div className="mt-2 flex items-center space-x-4">
            <button 
              onClick={() => token && likeMutation.mutate()} 
              disabled={!token || likeMutation.isPending} 
              className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} /> {comment?.likes?.length || 0}
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)} 
              className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              disabled={!token}
            >
              <MessageSquareReply size={14} /> Reply
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-4">
              <CommentForm 
                newsId={newsId} 
                parentCommentId={comment._id} 
                onCommentPosted={() => {
                  setShowReplyForm(false);
                  queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
                }} 
              />
            </div>
          )}

          {comment?.replies?.length > 0 && (
            <div className="mt-4 pl-6 border-l-2 border-border">
              {comment.replies.map(reply => (
                <Comment 
                  key={reply._id} 
                  comment={reply} 
                  newsId={newsId} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};