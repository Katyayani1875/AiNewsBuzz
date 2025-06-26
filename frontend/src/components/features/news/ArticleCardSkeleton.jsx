// src/components/features/news/ArticleCardSkeleton.jsx (Fully Redesigned)
export const ArticleCardSkeleton = ({ isHero = false }) => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
      <div className={`bg-secondary ${isHero ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-video'}`}></div>
      <div className="p-5 md:p-6">
        <div className="h-4 w-1/4 bg-secondary rounded mb-3"></div>
        <div className={`h-6 w-full bg-secondary rounded mb-2 ${isHero ? 'md:h-8' : ''}`}></div>
        <div className={`h-6 w-3/4 bg-secondary rounded ${isHero ? 'md:h-8' : ''}`}></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-secondary rounded"></div>
          <div className="h-4 w-full bg-secondary rounded"></div>
          <div className={`h-4 w-2/3 bg-secondary rounded ${isHero ? '' : 'hidden'}`}></div>
        </div>
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="h-4 w-1/3 bg-secondary rounded"></div>
        </div>
      </div>
    </div>
  );
};