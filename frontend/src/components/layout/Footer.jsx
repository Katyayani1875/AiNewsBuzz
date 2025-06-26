// src/components/layout/Footer.jsx (Redesigned with Multi-Column Layout)

import { Link } from 'react-router-dom';

// A reusable component for the footer columns to keep the code clean
const FooterColumn = ({ title, links }) => (
    <div>
        <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{title}</h3>
        <ul className="mt-4 space-y-3">
            {links.map((link) => (
                <li key={link.name}>
                    <a href={link.href} target={link.isExternal ? "_blank" : "_self"} rel="noopener noreferrer" className="text-base text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export const Footer = () => {
    // Define the links for each column. This makes the JSX much cleaner.
    const builtWithLinks = [
        { name: 'React & Vite', href: 'https://react.dev' },
        { name: 'Node.js & Express', href: 'https://nodejs.org' },
        { name: 'MongoDB', href: 'https://mongodb.com' },
        { name: 'Google Gemini API', href: 'https://ai.google.dev' },
        { name: 'Tailwind CSS', href: 'https://tailwindcss.com' },
    ];

    const resourcesLinks = [
        { name: 'GNews API', href: 'https://gnews.io' },
        { name: 'TanStack Query', href: 'https://tanstack.com/query' },
        { name: 'Zustand', href: 'https://github.com/pmndrs/zustand' },
        { name: 'Socket.IO', href: 'https://socket.io' },
    ];

    const legalLinks = [
        { name: 'GitHub', href: 'https://github.com', isExternal: true }, 
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ];

    return (
        <footer className="bg-secondary/50 border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                
                {/* --- NEW MULTI-COLUMN LAYOUT --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    
                    {/* Column 1: About Section */}
                    <div className="col-span-2 lg:col-span-2">
                        <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                            About AI NewsBuzz
                        </h3>
                        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                            AI NewsBuzz is a proof-of-concept project designed to demonstrate a modern, full-stack application that leverages artificial intelligence to make global news more accessible and understandable.
                        </p>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Created by: <a href="#" className="font-semibold text-primary hover:underline">Katyayani Mishra</a> {/* Replace with your portfolio/linkedin link */}
                        </p>
                    </div>

                    {/* Other Columns */}
                    <FooterColumn title="Built With" links={builtWithLinks} />
                    <FooterColumn title="Key Resources" links={resourcesLinks} />
                    <FooterColumn title="Connect" links={legalLinks} />
                </div>

                {/* --- Bottom Copyright Bar --- */}
                <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} AI NewsBuzz. All Rights Reserved.</p>
                </div>

            </div>
        </footer>
    );
};