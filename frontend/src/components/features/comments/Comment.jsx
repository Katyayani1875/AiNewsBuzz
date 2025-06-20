// src/components/features/comments/Comment.jsx
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const Comment = ({ comment }) => {
  return (
    <div className="flex items-start space-x-3 py-4">
      {/* User Avatar */}
      <Link to={`/user/${comment.user.username}`}>
        <img 
          src={comment.user.profilePicture?.url || 'https://i.imgur.com/V4Rcl9I.png'} 
          alt={comment.user.username} 
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>
      
      {/* Comment Content */}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Link to={`/user/${comment.user.username}`} className="font-bold text-white hover:underline">
            {comment.user.username}
          </Link>
          <p className="text-xs text-gray-500">
            • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </p>
        </div>
        <p className="text-gray-300 mt-1">{comment.text}</p>
        
        {/* We will add Like/Reply buttons here in the next step */}
        <div className="mt-2 flex items-center space-x-4">
          <button className="text-xs text-gray-400 hover:text-white">Like</button>
          <button className="text-xs text-gray-400 hover:text-white">Reply</button>
        </div>

        {/* This is where replies will be rendered */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-gray-800">
            {comment.replies.map(reply => (
              <Comment key={reply._id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};