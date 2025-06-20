export const ArticleCardSkeleton = () => {
  return (
    <div className="bg-[#161B22] border border-gray-800 rounded-lg p-4 animate-pulse">
      {/* Image Placeholder */}
      <div className="h-40 bg-slate-700 rounded-md mb-4"></div>
      {/* Source Name Placeholder */}
      <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
      {/* Title Placeholder */}
      <div className="h-6 bg-slate-600 rounded w-full mb-3"></div>
      {/* Description Placeholder */}
      <div className="h-4 bg-slate-700 rounded w-full mb-1"></div>
      <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    </div>
  );
};
