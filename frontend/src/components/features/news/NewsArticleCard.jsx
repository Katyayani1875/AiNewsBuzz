// src/components/features/news/NewsArticleCard.jsx 
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
export const NewsArticleCard = ({ article, isHero = false }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };
  const imageUrl = article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';

  return (
    <Link
      to={`/news/article/${article._id}`}
      className="group relative flex flex-col w-full h-full bg-card rounded-xl border border-border transition-all duration-300 ease-in-out hover:shadow-xl hover:dark:shadow-primary/10 hover:shadow-slate-300/50 hover:-translate-y-1"
      aria-label={`Read more about ${article.title}`}
    >
      {/* --- IMAGE SECTION (No changes needed here) --- */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={imageUrl}
          alt={article.title || 'News article image'}
          className={`w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 z-0 ${isHero ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-video'}`}
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-bold text-primary mb-2 tracking-wide">
          {article.topic?.toUpperCase() || 'GENERAL'}
        </p>
        
        <h3 className={`font-extrabold text-foreground leading-tight transition-colors group-hover:text-primary ${isHero ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {article.title}
        </h3>
        <p className={`mt-3 text-muted-foreground flex-grow ${isHero ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {article.description}
        </p>
        <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary font-bold">
            <span>Read More</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};