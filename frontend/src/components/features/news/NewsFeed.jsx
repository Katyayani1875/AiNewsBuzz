import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchNews } from "../../../api/news.api";
import { NewsArticleCard } from "./NewsArticleCard";
import { ArticleCardSkeleton } from "./ArticleCardSkeleton";

export const NewsFeed = () => {
  // useQuery handles fetching, caching, loading, and error states for us
  const {
    data: news,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["news", "all"], // A unique key for caching this general feed
    queryFn: fetchNews, // This calls your API function to get all recent news
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  // Handle the error state
  if (isError) {
    return (
      <div className="text-center py-10 text-red-400 bg-[#161B22] rounded-lg">
        <h3 className="text-xl font-bold mb-2">Oops! Something went wrong.</h3>
        <p>Could not load the news feed. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">
          Error: {error?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  // This is the container for our animated grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // This makes the cards appear one after another
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {isLoading
        ? // If loading, show 9 skeleton cards
          Array.from({ length: 9 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))
        : // Otherwise, show the real news cards
          news?.map((article) => (
            <NewsArticleCard key={article._id} article={article} />
          ))}
    </motion.div>
  );
};
