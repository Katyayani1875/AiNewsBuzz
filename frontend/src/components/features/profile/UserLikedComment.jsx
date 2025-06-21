// src/components/features/profile/UserLikedComment.jsx
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const UserLikedComment = ({ comment }) => {
  if (!comment.news || !comment.user) {
    return null; // Don't render if data is incomplete
  }

  return (
    <Link to={`/article/${comment.news._id}?commentId=${comment._id}`} className="block">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors">
        <p className="text-sm text-gray-400">
          Liked a comment by <span className="font-bold text-gray-300">{comment.user.username}</span> on: <span className="font-bold text-gray-300">{comment.news.title}</span>
        </p>
        <p className="text-white text-lg mt-2 italic">"{comment.text}"</p>
        <p className="text-xs text-gray-500 mt-3 text-right">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
};