// src/pages/ArticlePage.jsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticleById } from "../api/news.api";
import { ArticlePageSkeleton } from "./ArticlePageSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // From shadcn/ui

export const ArticlePage = () => {
  const { id } = useParams(); // Get the article ID from the URL (e.g., /article/12345)

  const {
    data: article,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["article", id], // Unique query key for this specific article
    queryFn: () => fetchArticleById(id),
    enabled: !!id, // TanStack Query feature: only run the query if `id` is not null/undefined
  });

  if (isLoading) {
    return <ArticlePageSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 text-center text-red-400">
        <h2 className="text-2xl font-bold">Error Loading Article</h2>
        <p>{error.message}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  // Robustly find the summaries. If a summary doesn't exist, it will be `undefined`.
  const tldrSummary = article?.summaries.find((s) => s.type === "tldr");
  const bulletSummary = article?.summaries.find((s) => s.type === "bullets");
  const eli5Summary = article?.summaries.find((s) => s.type === "eli5");

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      {/* Header Section */}
      <div className="mb-6">
        <p className="text-cyan-400 font-semibold mb-2 tracking-wider">
          {article.topic?.toUpperCase() || "GENERAL"}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-gray-400">
          From{" "}
          <span className="font-semibold text-gray-300">
            {article.source.name}
          </span>{" "}
          • Published on {new Date(article.publishedAt).toLocaleDateString()}
        </p>
      </div>

      <img
        src={article.image}
        alt={article.title}
        className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8 shadow-lg"
      />

      {/* AI Summaries Section */}
      <div className="bg-[#161B22] p-6 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">
          AI-Powered Insights
        </h2>
        <Tabs defaultValue="tldr" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 p-1 h-auto rounded-lg">
            <TabsTrigger value="tldr">TL;DR</TabsTrigger>
            <TabsTrigger value="bullets">Key Points</TabsTrigger>
            <TabsTrigger value="eli5">Explain Simply</TabsTrigger>
          </TabsList>

          <TabsContent
            value="tldr"
            className="mt-4 text-gray-300 leading-relaxed min-h-[100px] p-2"
          >
            {tldrSummary ? (
              <div>
                <p>{tldrSummary.content}</p>
                {tldrSummary.sentiment && (
                  <p
                    className={`mt-4 text-sm font-bold ${
                      tldrSummary.sentiment === "positive"
                        ? "text-green-400"
                        : tldrSummary.sentiment === "negative"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    Sentiment:{" "}
                    {tldrSummary.sentiment.charAt(0).toUpperCase() +
                      tldrSummary.sentiment.slice(1)}
                  </p>
                )}
              </div>
            ) : (
              "No TL;DR summary available for this article."
            )}
          </TabsContent>

          <TabsContent
            value="bullets"
            className="mt-4 text-gray-300 leading-relaxed min-h-[100px] whitespace-pre-line p-2"
          >
            {bulletSummary?.content ||
              "No key points summary available for this article."}
          </TabsContent>

          <TabsContent
            value="eli5"
            className="mt-4 text-gray-300 leading-relaxed min-h-[100px] p-2"
          >
            {eli5Summary?.content ||
              "No simple explanation available for this article."}
          </TabsContent>
        </Tabs>
      </div>

      {/* Read Full Article Button */}
      <div className="text-center mt-8">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-cyan-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-cyan-400 transition-transform transform hover:scale-105"
        >
          Read Full Article at {article.source.name}
        </a>
      </div>
    </div>
  );
};
