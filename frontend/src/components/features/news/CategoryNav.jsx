// src/components/features/news/CategoryNav.jsx (Fully Redesigned)

import { Sparkles, Globe, Briefcase, Landmark, Palette, Atom, Trophy, HeartPulse } from 'lucide-react';

const categories = [
  { name: 'all', label: 'Top Stories', icon: Sparkles },
  { name: 'world', label: 'World', icon: Globe },
  { name: 'business', label: 'Business', icon: Briefcase },
  { name: 'politics', label: 'Politics', icon: Landmark },
  { name: 'entertainment', label: 'Entertainment', icon: Palette },
  { name: 'science', label: 'Science', icon: Atom },
  { name: 'sports', label: 'Sports', icon: Trophy },
  { name: 'health', label: 'Health', icon: HeartPulse },
];

export const CategoryNav = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-8 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <nav className="flex items-center gap-2 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
              selectedCategory === category.name
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground' 
            }`}
          >
            <category.icon size={16} />
            {category.label}
          </button>
        ))}
      </nav>
    </div>
  );
};