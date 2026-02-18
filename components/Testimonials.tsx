import React from 'react';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TestimonialsProps {
  content: {
    title: string;
    quote: string;
    author: string;
    company: string;
  };
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const quoteRef = useScrollAnimation<HTMLDivElement>({ delay: '150ms' });

  return (
    <section data-section-id="testimonials" className="relative py-16 bg-brand-light-gray">
       <ParticlesBackground id="particles-testimonials" />
      <div className="relative container mx-auto px-6 text-center z-20">
        <h2 ref={titleRef} className="scroll-animate text-3xl font-bold text-gray-900 mb-8">{content.title}</h2>
        <div ref={quoteRef} className="scroll-animate max-w-3xl mx-auto bg-brand-white p-8 rounded-lg border border-gray-200/80 shadow-lg">
          <p className="text-xl italic text-gray-700 mb-6">"{content.quote}"</p>
          <div>
            <p className="font-bold text-gray-900 text-lg">{content.author}</p>
            <p className="text-brand-accent">{content.company}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;