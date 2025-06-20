import { NewsFeed } from "../components/features/news/NewsFeed";

export const HomePage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Top Stories
        </h2>
        <p className="text-gray-400">
          The latest news, intelligently curated for you.
        </p>
      </div>

      {/* This component now handles all the logic */}
      <NewsFeed />
    </div>
  );
};
