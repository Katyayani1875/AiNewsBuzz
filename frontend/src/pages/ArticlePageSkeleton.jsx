// src/pages/ArticlePageSkeleton.jsx (Updated to match final layout)
export const ArticlePageSkeleton = () => {
    return (
        <div className="container mx-auto max-w-7xl p-4 md:p-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
                
                {/* Left Column Skeleton */}
                <div className="lg:col-span-2">
                    <div className="h-5 bg-secondary rounded-md w-1/4 mb-4"></div>
                    <div className="h-10 bg-secondary rounded-md w-full mb-3"></div>
                    <div className="h-10 bg-secondary rounded-md w-5/6 mb-6"></div>
                    <div className="h-6 bg-secondary rounded-md w-1/2 mb-8"></div>
                    
                    <div className="w-full aspect-video bg-secondary rounded-xl mb-8"></div>
                    
                    <div className="space-y-3">
                        <div className="h-6 bg-secondary rounded w-full"></div>
                        <div className="h-6 bg-secondary rounded w-full"></div>
                        <div className="h-6 bg-secondary rounded w-3/4"></div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <aside className="lg:col-span-1 lg:sticky top-24 h-fit space-y-8 mt-8 lg:mt-0">
                    {/* Skeleton for AI Insights Panel */}
                    <div className="bg-card p-6 rounded-xl border border-border">
                        <div className="h-8 bg-secondary rounded w-3/4 mb-6"></div>
                        {/* Tabs Skeleton */}
                        <div className="h-10 bg-secondary rounded-md mb-4"></div>
                        {/* Summary Content Skeleton */}
                        <div className="space-y-2 mt-6 min-h-[150px]">
                            <div className="h-4 bg-secondary rounded w-full"></div>
                            <div className="h-4 bg-secondary rounded w-11/12"></div>
                            <div className="h-4 bg-secondary rounded w-full"></div>
                            <div className="h-4 bg-secondary rounded w-4/5"></div>
                        </div>
                    </div>
                    
                    {/* Skeleton for Comment Section */}
                    <div className="bg-card p-6 rounded-xl border border-border">
                        <div className="h-8 bg-secondary rounded w-2/3 mb-6"></div>
                        <div className="h-24 bg-secondary rounded w-full"></div>
                    </div>
                </aside>
            </div>
        </div>
    );
};