// src/pages/PrivacyPolicyPage.jsx (Corrected JSX Syntax)

import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; // Keep this import for the contact link

// A reusable component for styling sections to maintain consistency
const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border" style={{ fontFamily: 'Lora, serif' }}>
            {title}
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
            {children}
        </div>
    </section>
);

export const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - AI NewsBuzz</title>
                <meta name="description" content="Our commitment to your privacy. Learn how AI NewsBuzz collects, uses, and protects your data." />
            </Helmet>
            
            <div className="bg-secondary/50 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto max-w-4xl px-4 py-12 md:py-20"
                >
                    <div className="p-8 md:p-12 rounded-lg border border-border">
                        <header className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2"style={{ fontFamily: 'Lora, serif' }}>
                                Privacy Policy
                            </h1>
                            <p className="text-muted-foreground">
                                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </header>

                        <div className="prose dark:prose-invert max-w-none">
                            <p className="lead text-lg text-foreground/90 mb-10">
                                Welcome to AI NewsBuzz. Your privacy is a top priority for us. This Privacy Policy outlines the types of information we collect, how it is used, and the steps we take to safeguard your data when you use our services.
                            </p>

                            <Section title="1. Information We Collect">
                                <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
                                <h3 className="text-lg font-semibold text-foreground mt-4 !mb-2">A. Information You Provide to Us</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Account Information:</strong> When you register, we collect your username, email address, and a hashed version of your password.</li>
                                    <li><strong>Profile Information:</strong> You may optionally provide additional information such as a bio, location, website, and a profile picture.</li>
                                    <li><strong>User Content:</strong> We collect any comments, replies, or other content you post on the platform.</li>
                                </ul>
                                <h3 className="text-lg font-semibold text-foreground mt-6 !mb-2">B. Information We Collect Automatically</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Usage Data:</strong> We may collect data about how you interact with our service, such as which articles you view or which features you use.</li>
                                    <li><strong>Device Information:</strong> We collect standard log information, including your IP address and browser type, for security and analytical purposes.</li>
                                    <li><strong>Location Information:</strong> With your explicit permission, we access your approximate location solely to provide localized features like the weather widget. This location data is not stored.</li>
                                </ul>
                            </Section>

                            <Section title="2. How We Use Your Information">
                                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Operate and maintain the AI NewsBuzz service.</li>
                                    <li>To create and manage your account and personalize your experience.</li>
                                    <li>To enable user-to-user interactions, such as comments and notifications.</li>
                                    <li>To communicate with you about your account or service updates.</li>
                                    <li>To monitor usage and analyze trends to improve our product.</li>
                                </ul>
                            </Section>
                            
                            <Section title="3. Disclosure of Your Information">
                                <p>We are committed to not selling your personal data. We may share information under the following limited circumstances:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Third-Party Service Providers:</strong> We share necessary data with third parties that perform services on our behalf, such as Google's Gemini API for content analysis and Cloudinary for image hosting. These providers are obligated to protect your data.</li>
                                    <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation.</li>
                                </ul>
                            </Section>

                            <Section title="4. Data Security">
                                <p>
                                    We implement a variety of security measures to maintain the safety of your personal information. Your account is protected by a password, and we encourage you to take steps to keep your personal information safe by choosing a strong password and logging out after use.
                                </p>
                            </Section>

                             {/* The old location of the broken code is now fixed */}
                            <Section title="5. Your Rights Regarding Your Information">
                                <p>
                                    You have the right to review, change, or terminate your account at any time. You can review or change the information in your account settings or by contacting us. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.
                                </p>
                            </Section>

                            <Section title="6. Contact Us">
                                <p>
                                    If you have any questions, concerns, or comments about our Privacy Policy, please feel free to contact us at: <a href="mailto:mishrakatyayani391@gmail.com" className="text-primary font-semibold hover:underline">privacy@ainewsbuzz.com</a>.
                                </p>
                            </Section>

                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};