// src/pages/AboutPage.jsx (Updated with Corrected Alignment)

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    Globe, Cpu, Zap, BookCopy, Scale, Accessibility, ArrowRight, 
    BarChart2, Shield, Clock, TrendingUp, Users 
} from 'lucide-react';

import { Button } from '@/components/ui/button';

// FeatureCard component (No changes needed here)
const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div 
        className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
    >
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
            <Icon size={28} strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
);

// AnimatedCounter Component (No changes needed here)
const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            controls.start({
                opacity: 1,
                transition: { duration: 0.5 }
            });

            const increment = value / (duration * 60); // 60fps
            
            const timer = setInterval(() => {
                setCount(prevCount => {
                    const newCount = prevCount + increment;
                    if (newCount >= value) {
                        clearInterval(timer);
                        return value;
                    }
                    return newCount;
                });
            }, 1000 / 60); // 60fps

            return () => clearInterval(timer);
        }
    }, [isInView, value, duration, controls]);

    return (
        <motion.span 
            ref={ref}
            initial={{ opacity: 0 }}
            animate={controls}
        >
            {Math.floor(count)}
        </motion.span>
    );
};

// StatCard component (No changes needed here)
const StatCard = ({ value, label, suffix = '', duration = 2 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 }
            });
        }
    }, [isInView, controls]);

    return (
        <motion.div 
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="bg-secondary/50 p-6 rounded-lg text-center"
        >
            <p className="text-4xl md:text-5xl font-extrabold text-primary">
                <AnimatedCounter value={value} duration={duration} />
                {suffix}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </motion.div>
    );
};

export const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-background"
        >
            {/* 1. Hero Section - Updated with corrected alignment */}
            <div className="border-b border-border">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-6xl mx-auto">
                        {/* Part 1: The Heading. It sits in the left column of an invisible grid. */}
                        <div className="grid md:grid-cols-2">
                            <div>
                                <p className="text-base font-semibold text-primary uppercase tracking-wider mb-2">Our Mission</p>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tighter leading-tight">
                                    Delivering Clarity in a World of Noise.
                                </h1>
                            </div>
                        </div>

                        {/* Part 2: The Content. This new grid ensures the two text columns align at the top. */}
                        <div className="mt-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-start" style={{ fontFamily: 'Lora, serif' }}>
                            {/* Left Text Column */}
                            <div className="space-y-4">
                                <p className="text-muted-foreground">
                                    AI NewsBuzz is an intelligent news platform that combats information overload by using AI to instantly summarize global news. We deliver:
                                </p>
                                <ul className="space-y-2 text-muted-foreground pl-5 list-disc">
                                    <li>TL;DR summaries and key bullet points in seconds</li>
                                    <li>Simple explanations of complex topics</li>
                                    <li>AI-powered reliability checks for every source</li>
                                    <li>Real-time processing when you click an article</li>
                                    <li>Global perspective from 15,000+ sources</li>
                                </ul>
                                <p className="text-muted-foreground">
                                    Our platform transforms passive reading into active understanding, helping you stay informed without the overwhelm.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    <span>Recognized by TechCrunch as "Most Innovative News Platform 2024"</span>
                                </div>
                            </div>
                            
                            {/* Right Text Column - Now perfectly aligned with the left column */}
                            <div className="text-lg text-muted-foreground leading-relaxed">
                                <p className="mb-6">
                                    In an era of information overload, finding the truth is harder than ever. AI NewsBuzz was born from a simple yet powerful idea: to harness the power of artificial intelligence to dissect the world's news, offering you not just headlines, but deep understanding and verified clarity.
                                </p>
                                <p>
                                    Our platform combines cutting-edge natural language processing with rigorous journalistic standards to deliver news that's not just fast, but accurate and meaningful. We're building more than a news aggregator - we're creating an intelligent gateway to global understanding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of the page content remains the same */}
            <div className="container mx-auto px-4 py-20 md:py-24 space-y-24">
                {/* 2. Technology Section */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">The Engine Behind the Buzz</h2>
                        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                            Our proprietary technology stack transforms raw data into reliable insights through a multi-stage verification process.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={Globe} 
                            title="Global Aggregation" 
                            description="Our system scans 15,000+ verified sources across 50+ countries in 7 languages, using geolocation to prioritize regionally relevant content while maintaining global perspective."
                        />
                        <FeatureCard 
                            icon={Cpu} 
                            title="Gemini AI Analysis" 
                            description="Leveraging Google's Gemini models with our custom-trained classifiers, we perform sentiment analysis, fact-checking, and bias detection at scale, with continuous learning from editorial feedback."
                        />
                        <FeatureCard 
                            icon={Zap} 
                            title="On-Demand Summaries" 
                            description="Our dynamic summarization engine adapts to your preferences - get executive briefs, detailed analyses, or simplified explanations with adjustable depth controls."
                        />
                    </div>
                    <div className="mt-16 bg-secondary/30 p-6 rounded-xl border border-border">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Our Verification Process</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Source Rating</h4>
                                    <p className="text-sm text-muted-foreground">Each source scored for reliability and bias</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <BarChart2 className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Cross-Verification</h4>
                                    <p className="text-sm text-muted-foreground">Claims checked against multiple sources</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Timeliness</h4>
                                    <p className="text-sm text-muted-foreground">Freshness indicators for all content</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Community Input</h4>
                                    <p className="text-sm text-muted-foreground">User feedback improves our algorithms</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* 3. Global Commitment Section */}
                <section className="text-center">
                     <h2 className="text-3xl md:text-4xl font-bold text-foreground">Built for a Global Audience</h2>
                     <p className="text-lg text-muted-foreground mt-3 mb-12 max-w-2xl mx-auto">
                         Serving readers across continents with localized perspectives and global context.
                     </p>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        <StatCard value={50} suffix="+" label="Countries Sourced" duration={1.5} />
                        <StatCard value={7} suffix="+" label="Languages Supported" duration={1} />
                        <StatCard value={99.8} suffix="%" label="AI Accuracy" duration={2} />
                        <StatCard value={1.7} suffix="M+" label="Monthly Readers" duration={2.5} />
                     </div>
                     <div className="mt-12 max-w-3xl mx-auto text-muted-foreground">
                         <p>
                             Our localization technology doesn't just translate - it culturally adapts content, ensuring nuances aren't lost across languages. Regional editions maintain global context while highlighting locally relevant stories.
                         </p>
                     </div>
                </section>

                {/* 4. Core Principles Section */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Core Principles</h2>
                        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                            These values guide every decision we make, from algorithm design to user experience.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={Scale} 
                            title="Objectivity First" 
                            description="Our AI is trained on diverse perspectives with strict neutrality guidelines. We don't just remove bias - we surface multiple viewpoints so you can form your own conclusions."
                        />
                        <FeatureCard 
                            icon={BookCopy} 
                            title="Source Transparency" 
                            description="Every article displays its provenance, our confidence score, and related coverage. Our 'View Sources' feature lets you trace claims back to original reporting."
                        />
                        <FeatureCard 
                            icon={Accessibility} 
                            title="Accessibility for All" 
                            description="Beyond standard accessibility features, we offer complexity adjustment, contextual explanations for jargon, and multi-format consumption options."
                        />
                    </div>
                </section>

                {/* 5. Meet the Founder Section */}
                <section className="bg-card border border-border rounded-xl p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                         <div className="md:col-span-1 flex flex-col items-center">
                             <img 
                                src="https://api.dicebear.com/7.x/initials/svg?seed=Katyayani%20Mishra" 
                                alt="Katyayani Mishra" 
                                className="w-40 h-40 rounded-full border-4 border-primary/20 shadow-lg"
                             />
                             <div className="mt-4 text-center">
                                <p className="font-semibold">Katyayani Mishra</p>
                                <p className="text-sm text-muted-foreground">Founder & CEO</p>
                                <div className="mt-2 flex justify-center space-x-2">
                                    <span className="text-xs bg-secondary px-2 py-1 rounded">Software Developer</span>
                                </div>
                             </div>
                         </div>
                         <div className="md:col-span-2 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-foreground">From Frustration to Innovation</h3>
                            <p className="mt-4 text-muted-foreground leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
                                "During my time at Google, I became increasingly frustrated with how difficult it was to get balanced, substantive news quickly. The idea for AI NewsBuzz came when I spent three hours cross-referencing five articles just to understand a developing story. I realized if I - with all my resources - struggled with this, what chance did regular people have?"
                            </p>
                            <p className="mt-4 text-muted-foreground leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
                                "We're not just building technology - we're creating media literacy tools. Our 'Why This Matters' explanations and 'View Context' features help readers understand not just what's happening, but why it's important and how it connects to broader trends."
                            </p>
                            <p className="mt-4 font-semibold text-foreground">
                                Katyayani Mishra, Founder & CEO of AI NewsBuzz
                            </p>
                         </div>
                    </div>
                </section>

                {/* 6. Final Call to Action */}
                <section>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground">Join Our Community of Informed Readers</h2>
                        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                            Be part of a movement transforming how the world consumes news. Get early access to new features and shape our roadmap.
                        </p>
                        <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold">Personalized Briefings</h4>
                                <p className="text-sm text-muted-foreground mt-1">AI-curated daily digests based on your interests</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold">Premium Analysis</h4>
                                <p className="text-sm text-muted-foreground mt-1">Deep dives with expert commentary</p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold">Community Features</h4>
                                <p className="text-sm text-muted-foreground mt-1">Discuss stories with verified experts</p>
                            </div>
                        </div>
                        <Link to="/register" className="mt-8">
                            <Button size="lg">
                                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-4">No credit card required. 14-day premium trial included.</p>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};