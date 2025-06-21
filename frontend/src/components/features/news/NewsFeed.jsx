import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchCachedNews, fetchLiveNews } from '../../../api/news.api'; // Import both functions
import { NewsArticleCard } from './NewsArticleCard';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const NewsFeed = ({ topic }) => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  // --- HOOK 1: For displaying cached data ---
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['news', topic], // The key identifies this specific feed
    queryFn: ({ pageParam }) => fetchCachedNews({ pageParam, topic }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // --- HOOK 2: For triggering a live refresh ---
  const refreshMutation = useMutation({
    mutationFn: () => fetchLiveNews(topic),
    onSuccess: () => {
      // When the live refresh on the backend is complete,
      // invalidate our local cache to pull in the new articles.
      queryClient.invalidateQueries({ queryKey: ['news', topic] });
    },
  }); 

  // Automatically trigger a live refresh when the component first mounts
  // or when the topic changes.
  useEffect(() => {
    refreshMutation.mutate();
  }, [topic]); // Dependency array ensures it runs when the topic changes

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Combine articles from all pages and remove duplicates
  const allArticles = data?.pages.flatMap((page) => page.articles) || [];
  const uniqueArticles = Array.from(
    new Map(allArticles.map((article) => [article._id, article])).values()
  );

  // The rest of the component handles rendering based on the state
  if (status === 'pending') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return <div className="text-center text-red-400">Error: {error.message}</div>;
  }

  return (
    <div>
      {/* Optional: Show a subtle "refreshing" indicator */}
      {refreshMutation.isPending && (
        <div className="text-center text-sm text-cyan-400 mb-4 animate-pulse">
          Checking for new stories...
        </div>
      )}

      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {uniqueArticles.map((article) => (
          <NewsArticleCard key={article._id} article={article} />
        ))}
      </motion.div>

      <div className="text-center mt-12 h-10">
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="bg-cyan-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More News'
            : 'Nothing more to load'}
        </button>
      </div>
    </div>
  );
};
