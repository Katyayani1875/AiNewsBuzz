import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // <-- IMPORT Link

export const NewsArticleCard = ({ article }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Wrap the entire card in a Link component that navigates to the detail page
  return (
    <Link to={`/article/${article._id}`} className="block h-full">
      <motion.div
        variants={cardVariants}
        className="bg-[#161B22] border border-gray-800 rounded-lg overflow-hidden
                   h-full flex flex-col hover:border-cyan-400 transition-all duration-300 group cursor-pointer"
      >
        {/* Image Container */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Content Container */}
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-wider uppercase">
            {article.topic?.toUpperCase() || article.source.name}
          </p>
          <h3 className="font-bold text-lg text-gray-100 mb-2 group-hover:text-white transition-colors flex-grow">
            {article.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mt-auto">
            {article.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};
