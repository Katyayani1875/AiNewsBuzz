// src/components/features/profile/UserComment.jsx
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export const UserComment = ({ comment }) => {
  // Defensive check in case the populated news article was deleted
  if (!comment.news) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-gray-500 italic">Comment on an article that has since been removed.</p>
        <p className="text-gray-300 mt-2">"{comment.text}"</p>
      </div>
    );
  }

  return (
    <Link to={`/article/${comment.news._id}`} className="block">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors">
        <p className="text-sm text-gray-400">
          Commented on: <span className="font-bold text-gray-300">{comment.news.title}</span>
        </p>
        <p className="text-white text-lg mt-2">"{comment.text}"</p>
        <p className="text-xs text-gray-500 mt-3 text-right">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </p>
      </div>
    </Link>
  );
};