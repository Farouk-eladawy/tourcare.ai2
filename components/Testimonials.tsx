import React from 'react';
import { TestimonialsContent } from '../types';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TestimonialsProps {
  content: TestimonialsContent;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  const sectionRef = useScrollAnimation<HTMLElement>();

  return (
    <section ref={sectionRef} data-section-id="testimonials" className="scroll-animate relative py-16 bg-brand-light-gray">
       <ParticlesBackground id="particles-testimonials" />
      <div className="relative container mx-auto px-6 text-center z-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">{content.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {content.items.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center border border-gray-100">
              {item.logoUrl && (
                <div className="mb-6 h-16 flex items-center justify-center">
                  <img 
                    src={item.logoUrl} 
                    alt={`${item.company} logo`} 
                    className="max-h-full max-w-[150px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              )}
              
              <p className="text-lg italic text-gray-700 mb-6 flex-grow">"{item.quote}"</p>
              
              <div className="mt-auto">
                <p className="font-bold text-gray-900 text-lg">{item.author}</p>
                <p className="text-brand-accent font-medium">{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
