// src/pages/ArticlePage.jsx (FINAL, CORRECTED VARIABLE NAMES)

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticleById, triggerAndFetchSummaries } from '../api/news.api'; 
import { useAuthStore } from '../store/auth.store';
import { ArticlePageSkeleton } from './ArticlePageSkeleton';
import { CommentSection } from '../components/features/comments/CommentSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

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
      queryClient.setQueryData(['article', id], (oldData) => {
        if (!oldData) return;
        return { ...oldData, summaries: newSummaries };
      });
    },
    onError: (error) => {
      console.error("On-demand summarization failed:", error.message);
    }
  });

  useEffect(() => {
    if (article && article.summaries.length === 0 && isLoggedIn && !summarizationMutation.isPending) {
      summarizationMutation.mutate();
    }
  }, [article, isLoggedIn, summarizationMutation]);

  if (isLoading) return <ArticlePageSkeleton />;
  if (isError) return (
      <div className="container mx-auto p-8 text-center text-red-400">
        <h2 className="text-2xl font-bold">Error Loading Article</h2>
        <p>{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">← Back to Home</Link>
      </div>
  );

  // These are the correct variable names
  const tldrSummary = article?.summaries.find(s => s.type === 'tldr');
  const bulletSummary = article?.summaries.find(s => s.type === 'bullets');
  const eli5Summary = article?.summaries.find(s => s.type === 'eli5'); // Correctly named

  const isSummarizing = summarizationMutation.isPending;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      {/* ... Header and Image JSX ... */}
      <div className="mb-6">
        <p className="text-cyan-400 font-semibold mb-2 tracking-wider">{article.topic?.toUpperCase() || 'GENERAL'}</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
        <p className="text-gray-400">From <span className="font-semibold text-gray-300">{article.source.name}</span> • Published on {new Date(article.publishedAt).toLocaleDateString()}</p>
      </div>
      <img src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop'} alt={article.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-lg" />
      
      {/* AI Summaries Section */}
      <div className="bg-[#161B22] p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">AI-Powered Insights</h2>
        {isLoggedIn ? (
          <Tabs defaultValue="tldr" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900 p-1 h-auto rounded-lg">
              <TabsTrigger value="tldr">TL;DR</TabsTrigger>
              <TabsTrigger value="bullets">Key Points</TabsTrigger>
              <TabsTrigger value="eli5">Explain Simply</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tldr" className="mt-4 text-gray-300 leading-relaxed min-h-[100px] p-2">
              {isSummarizing && !tldrSummary ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><span>Generating summary...</span></div> : (tldrSummary?.content || "No TL;DR summary available.")}
              {tldrSummary?.sentiment && <p className={`mt-4 text-sm font-bold ${tldrSummary.sentiment === 'positive' ? 'text-green-400' : 'text-red-400'}`}>Sentiment: {tldrSummary.sentiment}</p>}
            </TabsContent>
            <TabsContent value="bullets" className="mt-4 text-gray-300 leading-relaxed min-h-[100px] whitespace-pre-line p-2">
              {isSummarizing && !bulletSummary ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><span>Distilling key points...</span></div> : (bulletSummary?.content || "No Key Points available.")}
            </TabsContent>
            
            {/* **** THIS IS THE FIX **** */}
            <TabsContent value="eli5" className="mt-4 text-gray-300 leading-relaxed min-h-[100px] p-2">
              {isSummarizing && !eli5Summary ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" /><span>Explaining it simply...</span></div> : (eli5Summary?.content || "No Simple Explanation available.")}
            </TabsContent>

          </Tabs>
        ) : (
          <p className="text-gray-400 text-center py-4">Please <Link to="/login" className="text-cyan-400 font-bold hover:underline">log in</Link> to view AI-powered insights.</p>
        )}
      </div>
      
      <div className="text-center mt-8">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-cyan-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-transform transform hover:scale-105">
          Read Full Article at {article.source.name}
        </a>
      </div>
      <CommentSection newsId={id} />
    </div>
  );
};