// src/pages/HomePage.jsx

import { useState, useRef, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { NewsFeed } from '../components/features/news/NewsFeed';
import { triggerLiveNewsRefresh } from '../api/news.api';
import { 
    RefreshCw, Sparkles, Globe, Briefcase, Landmark, Palette, Atom, Trophy, Calendar,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// ===================================================================
// === START: NEW PROFESSIONAL CATEGORY NAVIGATOR (NO PLUGINS) ===
// ===================================================================
const CategoryNav = ({ selectedCategory, onSelectCategory }) => {
    const categories = [
        { name: 'all', label: 'Top Stories', icon: Sparkles },
        { name: 'world', label: 'World', icon: Globe },
        { name: 'business', label: 'Business', icon: Briefcase },
        { name: 'politics', label: 'Politics', icon: Landmark },
        { name: 'entertainment', label: 'Entertainment', icon: Palette },
        { name: 'science', label: 'Science', icon: Atom },
        { name: 'sports', label: 'Sports', icon: Trophy },
    ];

    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkForScrollability = () => {
        const el = scrollContainerRef.current;
        if (el) {
            const hasSpaceOnLeft = el.scrollLeft > 1;
            const hasSpaceOnRight = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
            setCanScrollLeft(hasSpaceOnLeft);
            setCanScrollRight(hasSpaceOnRight);
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            checkForScrollability();
            el.addEventListener('scroll', checkForScrollability, { passive: true });
            window.addEventListener('resize', checkForScrollability);

            return () => {
                el.removeEventListener('scroll', checkForScrollability);
                window.removeEventListener('resize', checkForScrollability);
            };
        }
    }, [categories]);

    const handleScroll = (direction) => {
        const el = scrollContainerRef.current;
        if (el) {
            const scrollAmount = el.clientWidth * 0.8;
            el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    
    return (
        <div className="relative mb-8">
            {/* Left Scroll Button and Fade */}
            <motion.div
                initial={false}
                animate={{ opacity: canScrollLeft ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background to-transparent pr-10 pointer-events-none"
            >
                <button
                    onClick={() => handleScroll('left')}
                    className="p-1 rounded-full bg-secondary/80 text-secondary-foreground shadow-md hover:bg-accent pointer-events-auto"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} />
                </button>
            </motion.div>

            {/* Main Scrolling Container with our new class */}
            <nav ref={scrollContainerRef} className="overflow-x-auto pb-2 scrollbar-hide">
                <ul className="relative flex items-center gap-2 sm:gap-4 whitespace-nowrap py-2">
                    {categories.map((category) => (
                        <li key={category.name} className="relative">
                            <button
                                onClick={() => onSelectCategory(category.name)}
                                className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors`}
                            >
                                <category.icon size={16} className={selectedCategory === category.name ? 'text-primary-foreground' : 'text-muted-foreground'} />
                                <span className={selectedCategory === category.name ? 'text-primary-foreground' : 'text-foreground'}>
                                    {category.label}
                                </span>
                            </button>
                            {selectedCategory === category.name && (
                                <motion.div
                                    className="absolute inset-0 bg-primary rounded-full"
                                    layoutId="activeCategory"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Right Scroll Button and Fade */}
            <motion.div
                initial={false}
                animate={{ opacity: canScrollRight ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-background to-transparent pl-10 pointer-events-none"
            >
                <button
                    onClick={() => handleScroll('right')}
                    className="p-1 rounded-full bg-secondary/80 text-secondary-foreground shadow-md hover:bg-accent pointer-events-auto"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} />
                </button>
            </motion.div>
        </div>
    );
};
// ===================================================================
// === END: NEW PROFESSIONAL CATEGORY NAVIGATOR ===
// ===================================================================


export const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const queryClient = useQueryClient();

    const refreshMutation = useMutation({
        mutationFn: () => triggerLiveNewsRefresh(selectedCategory),
        onSuccess: (data) => {
            toast.success(data.message || "Feed is up to date!");
            queryClient.invalidateQueries({ queryKey: ['news', selectedCategory] });
        },
        onError: (error) => toast.error(error.message),
    });

    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            <header className="mb-8 bg-card border border-border/80 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">Top Headlines</h1>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar size={14} />
                        <span>{today}</span>
                    </p>
                </div>
                
                <div className="flex-shrink-0">
                    <motion.button 
                        onClick={() => refreshMutation.mutate()}
                        disabled={refreshMutation.isPending}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-muted-foreground transition-colors bg-background/50 border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                        title="Check for new articles"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw size={16} className={refreshMutation.isPending ? 'animate-spin' : ''} />
                        <span className="text-sm font-semibold">
                            {refreshMutation.isPending ? 'Refreshing...' : 'Refresh'}
                        </span>
                    </motion.button>
                </div>
            </header>
            
            <CategoryNav 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
            />

            <NewsFeed key={selectedCategory} topic={selectedCategory} layout="dashboard" />
        </div>
    );
};