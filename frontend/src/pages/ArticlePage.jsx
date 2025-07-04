import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fetchArticleById, triggerAndFetchSummaries } from '../api/news.api';
import { useAuthStore } from '../store/auth.store';
import { ArticlePageSkeleton } from './ArticlePageSkeleton';
import { CommentSection } from '../components/features/comments/CommentSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BookOpen, Wand2, Lightbulb, CheckCircle, BrainCircuit, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

// --- SUB-COMPONENTS FOR AI INSIGHTS ---
const GeneratingInsightsLoader = () => {
    const loadingSteps = ["Analyzing content...", "Identifying entities...", "Crafting summary...", "Finalizing insights..."];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % loadingSteps.length);
        }, 1500);
        return () => clearInterval(interval);
    }, [loadingSteps.length]);

    return (
        <div className="p-2 space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse">
                <Wand2 className="text-primary" size={20} />
                <span className="font-semibold">{loadingSteps[currentStep]}</span>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-secondary rounded w-full"></div>
                <div className="h-4 bg-secondary rounded w-5/6"></div>
                <div className="h-4 bg-secondary rounded w-full"></div>
            </div>
        </div>
    );
};

const TldrContent = ({ summary }) => {
    if (!summary?.content) return <p className="text-center text-muted-foreground p-4">No summary available.</p>;
    return (
        <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-base text-foreground/90 italic">"{summary.content}"</p>
            {summary.sentiment && (
                <div className={`mt-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${summary.sentiment === 'positive' ? 'text-green-500' : summary.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
                    <span>Sentiment:</span>
                    <span>{summary.sentiment}</span>
                </div>
            )}
        </div>
    );
};

const KeyPointsContent = ({ summary }) => {
    const points = summary?.content?.split('\n').filter(p => p.trim().length > 1) || [];
    if (points.length === 0) return <p className="text-center text-muted-foreground p-4">No key points available.</p>;
    return (
        <ul className="space-y-3">
            {points.map((point, index) => (
                <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.15 }}
                    className="flex items-start gap-3"
                >
                    <CheckCircle className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
                    <span className="text-foreground/90">{point.replace(/^-/, '').trim()}</span>
                </motion.li>
            ))}
        </ul>
    );
};

const Eli5Content = ({ summary }) => {
    if (!summary?.content) return <p className="text-center text-muted-foreground p-4">No simple explanation available.</p>;
    return (
        <div className="p-4 bg-blue-500/10 dark:bg-blue-900/20 rounded-lg flex items-start gap-4 border-l-4 border-blue-500">
            <Lightbulb className="text-blue-500 w-8 h-8 flex-shrink-0 mt-1" />
            <div>
                <h4 className="font-bold text-blue-800 dark:text-blue-300">In Simple Terms...</h4>
                <p className="mt-1 text-foreground/80">{summary.content}</p>
            </div>
        </div>
    );
};

const ReliabilityCheck = ({ reliability, isLoading }) => {
    if (isLoading) {
        return (
            <div className="mt-6 p-4 bg-secondary rounded-lg animate-pulse">
                <div className="h-6 w-1/2 bg-muted rounded"></div>
                <div className="h-4 mt-2 w-full bg-muted rounded"></div>
            </div>
        );
    }
    
    if (!reliability || !reliability.rating) {
        return null;
    }

    const config = {
        'High': { icon: ShieldCheck, color: 'text-green-500', text: 'High Reliability' },
        'Medium': { icon: ShieldAlert, color: 'text-yellow-500', text: 'Medium Reliability' },
        'Low': { icon: ShieldAlert, color: 'text-red-500', text: 'Low Reliability' },
        'Unverified': { icon: ShieldQuestion, color: 'text-muted-foreground', text: 'Unverified' },
    };

    const current = config[reliability.rating] || config['Unverified'];
    const Icon = current.icon;

    return (
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
            <div className={`flex items-center gap-3 font-bold ${current.color}`}>
                <Icon size={24} />
                <span className="text-lg">{current.text}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground lg:pl-10">
                <span className="font-semibold">AI Analysis:</span> {reliability.reason}
            </p>
        </div>
    );
};

// --- MAIN ARTICLE PAGE COMPONENT ---
export const ArticlePage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { isLoggedIn } = useAuthStore();

    const queryKey = ['article', id];

    const { 
        data: article, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: queryKey,
        queryFn: () => fetchArticleById(id),
        enabled: !!id,
    });

    const summarizationMutation = useMutation({
        mutationFn: () => triggerAndFetchSummaries(id),
        onSuccess: () => {
            toast.success("AI insights generated!");
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (err) => {
            console.error("Summarization failed:", err);
            toast.error("Could not generate AI insights.");
        }
    });

    useEffect(() => {
        if (article && (!article.summaries || article.summaries.length === 0) && isLoggedIn && !summarizationMutation.isPending) {
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
    
    if (!article) return <div className="text-center p-10">Article not found.</div>;

    const isSummarizing = summarizationMutation.isPending || 
                     (isLoggedIn && (!article.summaries || article.summaries.length === 0));

    const tldrSummary = article.summaries?.find(s => s.type === 'tldr');
    const bulletSummary = article.summaries?.find(s => s.type === 'bullets');
    const eli5Summary = article.summaries?.find(s => s.type === 'eli5');

    return (
        <div className="container mx-auto max-w-7xl p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
                {/* Left Column: Main Article Content */}
                <div className="lg:col-span-2">
                    <header className="mb-8">
                        <p className="text-sm font-bold text-primary mb-3 tracking-wider">
                            {article.topic?.toUpperCase() || 'GENERAL'}
                        </p>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                            {article.title}
                        </h1>
                        <p className="text-muted-foreground">
                            From <span className="font-semibold text-foreground">{article.source.name}</span> • Published on {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <ReliabilityCheck 
                            reliability={article.reliability} 
                            isLoading={isSummarizing && !article.reliability?.rating} 
                        />
                    </header>

                    <div className="mb-8 rounded-xl overflow-hidden border border-border">
                        <img 
                            src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070'} 
                            alt={article.title} 
                            className="w-full h-auto object-cover" 
                        />
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
                        <p className="lead text-xl">{article.description}</p>
                    </div>
                    <div className="text-center mt-12 mb-12">
                        <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105"
                        >
                            Read Full Article <ArrowUpRight size={20} />
                        </a>
                    </div>
                </div>

                {/* Right Column: Sticky Sidebar */}
                <aside className="lg:col-span-1 lg:sticky top-24 h-fit">
                    <div className="space-y-8">
                        <div className="bg-card p-6 rounded-xl border border-border">
                            <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-3">
                                <BrainCircuit size={24} className="text-primary" /> AI-Powered Insights
                            </h2>
                            {isLoggedIn ? (
                                <Tabs defaultValue="tldr" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-secondary p-1 h-auto rounded-md">
                                        <TabsTrigger value="tldr">TL;DR</TabsTrigger>
                                        <TabsTrigger value="bullets">Key Points</TabsTrigger>
                                        <TabsTrigger value="eli5">Simply</TabsTrigger>
                                    </TabsList>
                                    <div className="mt-4 min-h-[180px]">
                                        <TabsContent value="tldr">
                                            {isSummarizing ? (
                                                <GeneratingInsightsLoader />
                                            ) : (
                                                <TldrContent summary={tldrSummary} />
                                            )}
                                        </TabsContent>
                                        <TabsContent value="bullets">
                                            {isSummarizing ? (
                                                <GeneratingInsightsLoader />
                                            ) : (
                                                <KeyPointsContent summary={bulletSummary} />
                                            )}
                                        </TabsContent>
                                        <TabsContent value="eli5">
                                            {isSummarizing ? (
                                                <GeneratingInsightsLoader />
                                            ) : (
                                                <Eli5Content summary={eli5Summary} />
                                            )}
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            ) : (
                                <div className="text-muted-foreground text-center py-8 bg-secondary rounded-md">
                                    <p>Please <Link to="/login" className="text-primary font-bold hover:underline">log in</Link> to view AI insights.</p>
                                </div>
                            )}
                        </div>
                        <CommentSection newsId={id} />
                    </div>
                </aside>
            </div>
        </div>
    );
};