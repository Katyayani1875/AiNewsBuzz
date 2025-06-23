// src/pages/HomePage.jsx (Updated with Professional Refresh Button)

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { NewsFeed } from '../components/features/news/NewsFeed';
import { triggerLiveNewsRefresh } from '../api/news.api';
import { RefreshCw, Search, Sparkles, Globe, Briefcase, Landmark, Palette, Atom, Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast';

// The CategoryNav component remains unchanged and is correct.
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
    return (
        <nav className="mb-8 overflow-x-auto pb-2">
            <ul className="flex items-center gap-2 sm:gap-4">
                {categories.map((category) => (
                    <li key={category.name}>
                        <button
                            onClick={() => onSelectCategory(category.name)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${selectedCategory === category.name ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                        >
                            <category.icon size={16} />
                            {category.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};


export const HomePage = () => {
    // --- All existing state and logic is preserved ---
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

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <header className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Search input remains the same */}
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search stories..."
                        className="w-full bg-secondary text-foreground pl-10 pr-4 py-2 rounded-full border border-border focus:ring-2 focus:ring-ring focus:outline-none"
                    />
                </div>
                
                {/* 
                  *** THE REFRESH BUTTON STYLING FIX IS HERE ***
                */}
                <button 
                    onClick={() => refreshMutation.mutate()}
                    disabled={refreshMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto bg-card border border-border rounded-full text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
                    title="Check for new articles"
                >
                    {/* The icon now has a conditional class for the spinning animation */}
                    <RefreshCw size={16} className={refreshMutation.isPending ? 'animate-spin' : ''} />
                    
                    {/* The text changes based on the loading state */}
                    <span>
                        {refreshMutation.isPending ? 'Refreshing...' : 'Refresh'}
                    </span>
                </button>
            </header>
            
            <CategoryNav 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
            />

            <NewsFeed key={selectedCategory} topic={selectedCategory} layout="dashboard" />
        </div>
    );
};