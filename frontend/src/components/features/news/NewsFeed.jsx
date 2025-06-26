// src/components/features/news/NewsFeed.jsx (FINAL, CORRECTED AND OPTIMIZED)
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchNews } from '../../../api/news.api'; // <-- CORRECTED IMPORT
import { NewsArticleCard } from './NewsArticleCard';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export const NewsFeed = ({ topic }) => {
  const { ref, inView } = useInView({ threshold: 0.5 });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['news', topic],
    queryFn: fetchNews, // <-- CORRECTLY USES THE SINGLE FUNCTION
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    
    // This configuration provides the "live + cached" feel automatically
    staleTime: 1000 * 60 * 2, // Data is fresh for 2 mins; avoids refetch on quick navigation
    refetchOnWindowFocus: true, // Auto-refreshes with latest news when user returns
  });

  // Effect for triggering infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Render Skeletons on initial load
  if (status === 'pending') {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => <ArticleCardSkeleton key={index} />)}
        </div>
    );
  }

  // Render an error message if the fetch fails
  if (status === 'error') {
    return (
      <div className="text-center py-10 text-red-400 bg-[#161B22] rounded-lg">
        <h3 className="text-xl font-bold mb-2">Oops! Something went wrong.</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.articles.map((article) => (
              <NewsArticleCard key={article._id} article={article} />
            ))}
          </Fragment>
        ))}
      </motion.div>

      <div className="flex justify-center mt-12 h-10">
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="bg-cyan-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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