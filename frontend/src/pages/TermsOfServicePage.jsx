// src/pages/TermsOfServicePage.jsx (New File)

import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

// A reusable component for styling sections to maintain consistency
const Section = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-border pt-4" style={{ fontFamily: 'Lora, serif' }}>
            {title}
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
            {children}
        </div>
    </section>
);

export const TermsOfServicePage = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service - AI NewsBuzz</title>
                <meta name="description" content="Read the Terms of Service for using the AI NewsBuzz platform." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background"
            >
                <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2" style={{ fontFamily: 'Lora, serif' }}>
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>

                    <div className="prose dark:prose-invert max-w-none pb-4">
                        <p className="lead">
                            Welcome to AI NewsBuzz! These Terms of Service ("Terms") govern your use of the AI NewsBuzz website, services, and applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
                        </p>

                        <Section title="1. Description of Service">
                            <p>
                                AI NewsBuzz is an intelligent news aggregation and analysis platform. The Service automatically fetches articles from third-party news sources and uses artificial intelligence (AI) to generate summaries, categorizations, and other analytical insights ("AI-Generated Content"). The Service also allows users to post comments and engage in discussions ("User-Generated Content").
                            </p>
                        </Section>

                        <Section title="2. User Accounts">
                            <p>
                                To access certain features, such as commenting, you must register for an account. You agree to provide accurate and complete information and to keep this information up to date. You are responsible for safeguarding your account password and for any activities or actions under your account. You must notify us immediately of any breach of security or unauthorized use of your account.
                            </p>
                        </Section>
                        
                        <Section title="3. User-Generated Content">
                            <p>
                                You are solely responsible for the content you post, including comments and replies. By posting User-Generated Content, you grant AI NewsBuzz a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.
                            </p>
                            <p>
                                You agree not to post content that is unlawful, defamatory, obscene, threatening, invasive of privacy, or otherwise objectionable. We reserve the right, but not the obligation, to remove or modify User-Generated Content for any reason.
                            </p>
                        </Section>

                        <Section title="4. Intellectual Property">
                            <p>
                                The Service itself, including our logo, branding, design, and original text, are the exclusive property of AI NewsBuzz. The news articles fetched from third-party sources are the property of their respective publishers, and we provide links back to the original source. The AI-Generated Content is a derivative work produced by our system.
                            </p>
                        </Section>

                        <Section title="5. Prohibited Activities">
                            <p>You agree not to engage in any of the following prohibited activities:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                                <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
                                <li>Uploading invalid data, viruses, worms, or other software agents through the Service.</li>
                                <li>Impersonating another person or otherwise misrepresenting your affiliation with a person or entity.</li>
                            </ul>
                        </Section>

                        <Section title="6. Disclaimers and Limitation of Liability">
                            <p>
                                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. The news articles and AI-Generated Content are for informational purposes only. We make no warranties regarding the accuracy, completeness, timeliness, or reliability of any content available through the Service. Your use of the Service is at your sole risk.
                            </p>
                            <p>
                                IN NO EVENT SHALL AI NEWSBUZZ BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                            </p>
                        </Section>

                        <Section title="7. Termination">
                            <p>
                                We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                            </p>
                        </Section>

                        <Section title="8. Governing Law">
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
                            </p>
                        </Section>

                        <Section title="9. Changes to Terms">
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                            </p>
                        </Section>

                    </div>
                </div>
            </motion.div>
        </>
    );
};