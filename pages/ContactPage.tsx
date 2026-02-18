import React, { useState } from 'react';
import { ContactPageContent } from '../types';
import ParticlesBackground from '../components/ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ContactPage: React.FC<{ content: ContactPageContent }> = ({ content }) => {
    const [formState, setFormState] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        platforms: [] as string[],
        message: '',
    });
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const titleRef = useScrollAnimation<HTMLDivElement>();
    const sectionsRef = useScrollAnimation<HTMLDivElement>({ delay: '150ms' });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handlePlatformChange = (platform: string) => {
        setFormState(prev => {
            const newPlatforms = prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform];
            return { ...prev, platforms: newPlatforms };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        console.log("Form submitted:", formState);
        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            setIsSent(true);
        }, 2000);
    };

    const handleInstantChannelClick = (href: string) => {
        if (href === '#/ai-assistant-shortcut') {
            // This is a placeholder; a real implementation would need a global state/context to open the modal
            alert('Opening AI Assistant (placeholder action)');
        } else {
            window.open(href, '_blank');
        }
    };


    return (
        <section className="relative py-16 bg-brand-white">
            <ParticlesBackground id="particles-contact" />
            <div className="relative container mx-auto px-6 z-20">
                <div ref={titleRef} className="scroll-animate text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.pageTitle}</h1>
                    <p className="text-lg text-gray-700 whitespace-pre-line">{content.intro}</p>
                </div>

                <div ref={sectionsRef} className="scroll-animate grid lg:grid-cols-5 gap-12">
                    {/* Left Column with Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Why Contact */}
                        <div className="bg-brand-light-gray/50 p-6 rounded-lg border-l-4 border-brand-accent">
                            <h3 className="font-bold text-xl text-gray-900 mb-3">{content.whyContact.title}</h3>
                            <ul className="space-y-2">
                                {content.whyContact.reasons.map((reason, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-700">
                                        <span className="text-brand-accent mt-1">✓</span>
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Direct Contact */}
                        <div className="bg-brand-light-gray/50 p-6 rounded-lg border-l-4 border-brand-accent">
                             <h3 className="font-bold text-xl text-gray-900 mb-4">{content.directContact.title}</h3>
                             <div className="space-y-4">
                                {content.directContact.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="text-gray-500 text-sm">{item.label}</p>
                                            {item.href ? (
                                                <a href={item.href} className="font-semibold text-brand-blue hover:text-brand-accent">{item.value}</a>
                                            ) : (
                                                <p className="font-semibold text-gray-800">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                        {/* Instant Channels */}
                         <div className="bg-brand-light-gray/50 p-6 rounded-lg border-l-4 border-brand-accent">
                             <h3 className="font-bold text-xl text-gray-900 mb-4">{content.instantChannels.title}</h3>
                              <div className="space-y-3">
                                {content.instantChannels.items.map((item, i) => (
                                     <button key={i} onClick={() => handleInstantChannelClick(item.href)} className="w-full text-start flex items-center gap-4 p-3 rounded-md hover:bg-gray-200 transition">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="text-gray-500 text-sm">{item.label}</p>
                                            <p className="font-semibold text-brand-accent">{item.action}</p>
                                        </div>
                                    </button>
                                ))}
                              </div>
                         </div>
                    </div>

                    {/* Right Column with Form */}
                    <div className="lg:col-span-3 bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80">
                         <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.formSection.title}</h2>
                         <p className="text-gray-600 mb-6">{content.formSection.subtitle}</p>

                        {isSent ? (
                            <div className="text-center p-8 bg-green-100 border-l-4 border-green-500 rounded-md">
                                <h3 className="font-bold text-xl text-green-800">Message Sent!</h3>
                                <p className="text-green-700">Thank you. We'll be in touch shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <input type="text" name="companyName" placeholder={content.formSection.form.companyName} value={formState.companyName} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent" required />
                                    <input type="text" name="contactPerson" placeholder={content.formSection.form.contactPerson} value={formState.contactPerson} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent" required />
                                </div>
                                 <div className="grid sm:grid-cols-2 gap-5">
                                    <input type="email" name="email" placeholder={content.formSection.form.email} value={formState.email} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent" required />
                                    <input type="tel" name="phone" placeholder={content.formSection.form.phone} value={formState.phone} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{content.formSection.form.platforms}</label>
                                    <div className="flex flex-wrap gap-3">
                                        {content.formSection.form.platformOptions.map(opt => (
                                            <button type="button" key={opt} onClick={() => handlePlatformChange(opt)} className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 transition ${formState.platforms.includes(opt) ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 border-gray-300 hover:border-brand-accent/50'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea name="message" placeholder={content.formSection.form.message} rows={5} value={formState.message} onChange={handleInputChange} className="w-full bg-gray-100 border border-gray-300 rounded-md p-3 focus:ring-brand-accent focus:border-brand-accent" required></textarea>
                                
                                <div>
                                    <button type="submit" disabled={isSending} className="w-full bg-brand-accent text-white font-bold py-3 px-4 rounded-md hover:bg-brand-accent-hover transition disabled:bg-gray-400">
                                        {isSending ? content.formSection.form.sendingButton : content.formSection.form.submitButton}
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-3">{content.formSection.confirmation}</p>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
