import React from 'react';
import { TermsOfServiceContent } from '../types';
import ParticlesBackground from '../components/ParticlesBackground';

// Helper function to find and link email addresses
const linkifyEmails = (text: string) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    return text.split(emailRegex).map((part, index) => {
        if (emailRegex.test(part)) {
            return <a key={index} href={`mailto:${part}`} className="text-brand-accent hover:underline">{part}</a>;
        }
        return part;
    });
};

const TermsOfServicePage: React.FC<{ content: TermsOfServiceContent }> = ({ content }) => {
    return (
        <section className="relative py-16 bg-brand-light-gray">
            <ParticlesBackground id="particles-terms" />
            <div className="relative container mx-auto px-6 z-10">
                <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-lg border border-gray-200/80">
                    <header className="text-center pb-8 border-b border-gray-200">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{content.pageTitle}</h1>
                        <p className="mt-2 text-gray-500">{content.lastUpdated}</p>
                    </header>
                    <div className="prose prose-lg max-w-none mt-8 text-gray-700">
                        {content.sections.map((section, index) => (
                            <div key={index} className={section.title ? "mb-8" : "mb-4"}>
                                {section.title && <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>}
                                {Array.isArray(section.content) ? (
                                    <ul className="list-disc space-y-2 pl-6">
                                        {section.content.map((item, i) => (
                                            <li key={i}>{linkifyEmails(item)}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="whitespace-pre-line">{linkifyEmails(section.content)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TermsOfServicePage;