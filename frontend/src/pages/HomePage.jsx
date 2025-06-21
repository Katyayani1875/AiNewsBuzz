// 
// src/pages/HomePage.jsx (FINAL, NO CHANGES NEEDED)
import { useState } from 'react';
import { NewsFeed } from '../components/features/news/NewsFeed';
import { CategoryNav } from '../components/features/news/CategoryNav';

export const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Top Stories</h1>
        <p className="text-gray-400 mt-1">The latest news, intelligently curated and categorized for you.</p>
      </header>
      
      <CategoryNav 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      <NewsFeed key={selectedCategory} topic={selectedCategory} />
    </div>
  );
};