// src/pages/HomePage.jsx (FINAL HYBRID VERSION)
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { NewsFeed } from '../components/features/news/NewsFeed';
import { CategoryNav } from '../components/features/news/CategoryNav';
import { triggerLiveNewsRefresh } from '../api/news.api'; // <-- IMPORT THE LIVE TRIGGER
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  // This mutation handles the live refresh button click
  const refreshMutation = useMutation({
    mutationFn: () => triggerLiveNewsRefresh(selectedCategory),
    onSuccess: (data) => {
      toast.success(data.message || "Feed is up to date!");
      // After the backend has fetched and saved the new live articles,
      // we invalidate our local cache to force a refetch from our DB.
      queryClient.invalidateQueries({ queryKey: ['news', selectedCategory] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Top Stories</h1>
          <p className="text-gray-400 mt-1">The latest news, intelligently curated for you.</p>
        </div>
        
        <button 
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:animate-spin"
          title="Check for new articles"
        >
          <RefreshCw size={20} />
        </button>
      </header>
      
      <CategoryNav 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      <NewsFeed key={selectedCategory} topic={selectedCategory} />
    </div>
  );
};