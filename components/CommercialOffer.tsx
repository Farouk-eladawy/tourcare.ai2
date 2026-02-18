import React from 'react';
import { CommercialOfferContent } from '../types';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const CommercialOffer: React.FC<{ content: CommercialOfferContent }> = ({ content }) => {
    const titleRef = useScrollAnimation<HTMLDivElement>();
    const whoWeAreRef = useScrollAnimation<HTMLDivElement>({ delay: '150ms' });
    const visionRef = useScrollAnimation<HTMLDivElement>({ delay: '150ms' });
    const whatWeOfferRef = useScrollAnimation<HTMLDivElement>({ delay: '150ms' });

    return (
        <section id="about-us" className="relative py-16 bg-brand-white">
            <ParticlesBackground id="particles-about" />
            <div className="relative container mx-auto px-6 z-20">
                
                {/* Main Title */}
                <div ref={titleRef} className="scroll-animate text-center max-w-4xl mx-auto mb-12">
                    <h2 className="text-4xl font-bold text-gray-900">{content.mainTitle}</h2>
                </div>

                {/* Who We Are Section */}
                <div ref={whoWeAreRef} className="scroll-animate max-w-4xl mx-auto text-center mb-16 bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{content.whoWeAre.description}</p>
                </div>

                {/* Vision Section */}
                <div ref={visionRef} className="scroll-animate max-w-4xl mx-auto text-center mb-16 bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80">
                     <h3 className="text-3xl font-bold text-brand-accent mb-4">{content.vision.title}</h3>
                     <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{content.vision.description}</p>
                </div>

                {/* What We Offer Section */}
                <div ref={whatWeOfferRef} className="scroll-animate max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-brand-accent mb-4">{content.whatWeOffer.title}</h3>
                        <p className="text-gray-600">{content.whatWeOffer.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.whatWeOffer.features.map((feature, index) => (
                            <div key={index} className="bg-brand-light-gray/50 backdrop-blur-sm p-6 rounded-lg border-l-4 border-brand-accent flex items-start gap-4 transition-all duration-300 hover:bg-white h-full">
                                <div className="text-3xl flex-shrink-0 pt-1">{feature.icon}</div>
                                <p className="text-gray-700">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CommercialOffer;