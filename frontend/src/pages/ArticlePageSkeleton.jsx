// src/pages/ArticlePageSkeleton.jsx

export const ArticlePageSkeleton = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl animate-pulse">
      {/* Title & Meta Skeleton */}
      <div className="h-6 bg-slate-700 rounded-md w-1/4 mb-4"></div>
      <div className="h-10 bg-slate-600 rounded-md w-full mb-2"></div>
      <div className="h-10 bg-slate-600 rounded-md w-3/4 mb-6"></div>
      <div className="h-6 bg-slate-700 rounded-md w-1/2 mb-8"></div>

      {/* Image Skeleton */}
      <div className="w-full aspect-video bg-slate-700 rounded-lg mb-8"></div>

      {/* Tabs and Content Skeleton */}
      <div className="bg-[#161B22] border border-gray-800 rounded-lg p-6">
        <div className="h-8 bg-slate-600 rounded-md w-1/3 mb-6"></div>
        {/* Tabs Skeleton */}
        <div className="flex space-x-1 border-b border-slate-700 mb-4">
          <div className="h-10 bg-slate-700 rounded-t-lg w-28 py-2 px-4"></div>
          <div className="h-10 bg-slate-600 rounded-t-lg w-28 py-2 px-4"></div>
          <div className="h-10 bg-slate-600 rounded-t-lg w-28 py-2 px-4"></div>
        </div>

        {/* Summary Content Skeleton */}
        <div className="space-y-3 mt-6">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-11/12"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );
};
