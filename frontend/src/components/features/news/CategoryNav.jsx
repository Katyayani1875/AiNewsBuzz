// src/components/features/news/CategoryNav.jsx
const categories = [
  'all', 'world', 'business', 'technology', 'sports', 'science', 'entertainment', 'health'
];

export const CategoryNav = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-8 border-b border-gray-800">
      <nav className="-mb-px flex space-x-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                selectedCategory === category
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              }
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );
};