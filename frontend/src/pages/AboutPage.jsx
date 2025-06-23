// src/pages/AboutPage.jsx (New File)

import { motion } from 'framer-motion';
import { Cpu, Newspaper, Bot } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-card border border-border rounded-xl p-6 text-center">
    <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl px-4 py-12 md:py-20"
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-4">
          About AI NewsBuzz
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to cut through the noise. AI NewsBuzz leverages state-of-the-art artificial intelligence to deliver news that's not just fast, but also insightful and easy to understand.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Newspaper}
            title="Automated Fetching"
            description="Our system constantly scans global news sources, identifying and fetching the most relevant and recent articles across a variety of topics."
          />
          <FeatureCard
            icon={Cpu}
            title="AI Analysis"
            description="Each article is sent to a powerful Generative AI which analyzes the content, assigns a precise category, and extracts key information."
          />
          <FeatureCard
            icon={Bot}
            title="Intelligent Summaries"
            description="The AI generates multiple summaries for every story—a TL;DR, key bullet points, and a simple explanation—so you can grasp the news in seconds."
          />
        </div>
      </section>

      <section>
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6">
            Beyond the news, AI NewsBuzz is a place for discussion. Sign up to comment on articles, reply to others, and engage with a community passionate about the future.
          </p>
          <a
            href="/register"
            className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-md hover:opacity-90 transition-opacity"
          >
            Get Started for Free
          </a>
        </div>
      </section>
    </motion.div>
  );
};