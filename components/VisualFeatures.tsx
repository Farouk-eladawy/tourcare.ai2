import React from 'react';
import { VisualFeaturesContent } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const VisualFeature: React.FC<{ feature: VisualFeaturesContent['features'][0], index: number }> = ({ feature, index }) => {
    const ref = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });
    return (
        <div ref={ref} className="scroll-animate grid md:grid-cols-2 gap-10 items-center">
            <div className={`order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                {feature.image.endsWith('.mp4') ? (
                  <video
                    src={feature.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata" // Lazy load video metadata
                    className="rounded-lg shadow-xl w-full h-auto border-4 border-gray-200"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy" // Lazy load image
                    className="rounded-lg shadow-xl w-full h-auto border-4 border-gray-200"
                  />
                )}
            </div>
            <div className={`order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
            </div>
        </div>
    );
};


const VisualFeatures: React.FC<{ content: VisualFeaturesContent }> = ({ content }) => {
  const titleRef = useScrollAnimation<HTMLDivElement>();
  return (
    <section id="features" data-section-id="features" className="py-16 bg-brand-white">
      <div className="container mx-auto px-6">
        <div ref={titleRef} className="scroll-animate text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
        </div>
        <div className="space-y-16">
          {content.features.map((feature, index) => (
            <VisualFeature key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisualFeatures;