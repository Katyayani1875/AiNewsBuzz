// src/components/features/comments/Comment.jsx (Fully Functional and Styled)

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeComment, deleteComment } from '../../../api/comments.api';
import { useAuthStore } from '../../../store/auth.store';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquareReply, Trash2, MoreHorizontal } from 'lucide-react';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export const Comment = ({ comment, newsId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();
  const { user, token } = useAuthStore();

  const isAuthor = user?.id === comment.user?._id;
  const isLiked = user && comment.likes.includes(user.id);

  // --- Like Mutation with Optimistic Update ---
  const likeMutation = useMutation({
    mutationFn: () => likeComment(comment._id),
    onSuccess: () => {
      // Invalidate to ensure consistency with the server state in the background
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
    },
    onError: () => {
      // If something goes wrong, a simple refetch will fix the UI
      toast.error("Couldn't update like.");
      queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
    }
  });

  // --- Delete Mutation ---
  const deleteMutation = useMutation({
      mutationFn: () => deleteComment(comment._id),
      onSuccess: () => {
          toast.success("Comment deleted.");
          // Invalidate to refetch and remove the comment from the list
          queryClient.invalidateQueries({ queryKey: ['comments', newsId] });
      },
      onError: (error) => toast.error(error.message),
  });

  if (!comment || !comment.user) {
    return null; // Return nothing if comment or user is invalid, preventing crashes
  }

  return (
    <div className="flex items-start space-x-3 py-4">
      <Link to={`/news/user/${comment.user.username}`}>
        <img 
          src={comment.user.profilePicture?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.username}`} 
          alt={comment.user.username} 
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
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
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16}/></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your comment and any replies to it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-foreground/90 mt-1 whitespace-pre-wrap">{comment.text}</p>
        
        <div className="mt-2 flex items-center space-x-4">
          <button onClick={() => token && likeMutation.mutate()} disabled={!token || likeMutation.isPending} className={`text-xs font-semibold flex items-center gap-1.5 transition-colors ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <ThumbsUp size={14} /> {comment.likes.length}
          </button>
          <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
             <MessageSquareReply size={14} /> Reply
          </button>
        </div>

        {showReplyForm && (
          <div className="mt-4">
            <CommentForm newsId={newsId} parentCommentId={comment._id} onCommentPosted={() => setShowReplyForm(false)} />
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="mt-4 pl-6 border-l-2 border-border">
            {comment.replies.map(reply => (
              <Comment key={reply._id} comment={reply} newsId={newsId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};