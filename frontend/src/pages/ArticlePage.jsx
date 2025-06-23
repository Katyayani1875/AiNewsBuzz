// src/pages/ArticlePage.jsx (Fully Redesigned)
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticleById, triggerAndFetchSummaries } from '../api/news.api'; 
import { useAuthStore } from '../store/auth.store';
import { ArticlePageSkeleton } from './ArticlePageSkeleton';
import { CommentSection } from '../components/features/comments/CommentSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowUpRight, BookOpen } from 'lucide-react';

export const ArticlePage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();


  const { data: article, isLoading, isError, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
  });

  const summarizationMutation = useMutation({
    mutationFn: () => triggerAndFetchSummaries(id),
    onSuccess: (newSummaries) => {
      queryClient.setQueryData(['article', id], (oldData) => oldData ? { ...oldData, summaries: newSummaries } : oldData);
    },
    onError: (err) => console.error("On-demand summarization failed:", err.message)
  });

  useEffect(() => {
    if (article && !article.summaries.length && isLoggedIn && !summarizationMutation.isPending) {
      summarizationMutation.mutate();
    }
  }, [article, isLoggedIn, summarizationMutation]);

  if (isLoading) return <ArticlePageSkeleton />;
  if (isError) return (
      <div className="container mx-auto p-8 text-center text-destructive">
        <h2 className="text-2xl font-bold">Error Loading Article</h2>
        <p>{error.message}</p>
        <Link to="/news" className="mt-4 inline-block text-primary hover:underline">← Back to News</Link>
      </div>
  );

  const tldrSummary = article?.summaries.find(s => s.type === 'tldr');
  const bulletSummary = article?.summaries.find(s => s.type === 'bullets');
  const eli5Summary = article?.summaries.find(s => s.type === 'eli5');
  const isSummarizing = summarizationMutation.isPending;

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      {/* NEW: Two-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
        
        {/* --- Left Column: Main Article Content --- */}
        <div className="lg:col-span-2">
          <header className="mb-8">
            <p className="text-sm font-bold text-primary mb-3 tracking-wider">{article.topic?.toUpperCase() || 'GENERAL'}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
              {article.title}
            </h1>
            <p className="text-muted-foreground">
              From <span className="font-semibold text-foreground">{article.source.name}</span> • Published on {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>
          
          <div className="mb-8 rounded-xl overflow-hidden border border-border">
            <img src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'} alt={article.title} className="w-full h-auto object-cover" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
            <p className="lead text-xl">{article.description}</p>
            {/* You could render more article content here if your API provides it */}
          </div>
          
          <div className="text-center mt-12 mb-12">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105">
              Read Full Article <ArrowUpRight size={20} />
            </a>
          </div>
        </div>

        {/* --- Right Column: Sticky Sidebar for Insights & Comments --- */}
        <aside className="lg:col-span-1 lg:sticky top-24 h-fit">
          <div className="space-y-8">
            {/* AI Summaries Section */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                <BookOpen size={24} className="text-primary" /> AI-Powered Insights
              </h2>
              {isLoggedIn ? (
                <Tabs defaultValue="tldr" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary p-1 h-auto rounded-md">
                    <TabsTrigger value="tldr">TL;DR</TabsTrigger>
                    <TabsTrigger value="bullets">Key Points</TabsTrigger>
                    <TabsTrigger value="eli5">Simply</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tldr" className="mt-4 text-muted-foreground leading-relaxed min-h-[120px] p-2">
                    {isSummarizing && !tldrSummary ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><span>Generating summary...</span></div> : (tldrSummary?.content || "No summary available.")}
                    {tldrSummary?.sentiment && <p className={`mt-4 text-xs font-bold uppercase tracking-wider ${tldrSummary.sentiment === 'positive' ? 'text-green-500' : tldrSummary.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>Sentiment: {tldrSummary.sentiment}</p>}
                  </TabsContent>
                  <TabsContent value="bullets" className="mt-4 text-muted-foreground leading-relaxed min-h-[120px] whitespace-pre-line p-2">
                    {isSummarizing && !bulletSummary ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><span>Distilling key points...</span></div> : (bulletSummary?.content || "No key points available.")}
                  </TabsContent>
                  <TabsContent value="eli5" className="mt-4 text-muted-foreground leading-relaxed min-h-[120px] p-2">
                    {isSummarizing && !eli5Summary ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><span>Explaining simply...</span></div> : (eli5Summary?.content || "No simple explanation available.")}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-muted-foreground text-center py-8 bg-secondary rounded-md">
                  <p>Please <Link to="/login" className="text-primary font-bold hover:underline">log in</Link> to view AI insights.</p>
                </div>
              )}
            </div>
            
            {/* Comment Section now lives in the sidebar */}
            <CommentSection newsId={id} />
          </div>
        </aside>
      </div>
    </div>
  );
};