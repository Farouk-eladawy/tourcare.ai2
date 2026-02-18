import React from 'react';
import { TestimonialsContent } from '../types';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TestimonialsProps {
  content: TestimonialsContent;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  const sectionRef = useScrollAnimation<HTMLElement>();

  // Helper function to render a single list of testimonial cards
  const renderTestimonialCards = () => (
    <>
      {content.items.map((item, index) => (
        <li
          key={index}
          className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center border border-gray-100 flex-shrink-0 w-80 md:w-96 mx-4"
        >
          {item.logoUrl && (
            <div className="mb-4 h-12 flex items-center justify-center">
              <img
                src={item.logoUrl}
                alt={`${item.company} logo`}
                className="max-h-full max-w-[120px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          )}

          <p className="text-base italic text-gray-700 mb-4 flex-grow">"{item.quote}"</p>

          <div className="mt-auto">
            <p className="font-bold text-gray-900 text-sm">{item.author}</p>
            <p className="text-brand-accent text-xs font-medium">{item.company}</p>
          </div>
        </li>
      ))}
    </>
  );

  return (
    <section ref={sectionRef} data-section-id="testimonials" className="scroll-animate relative py-16 bg-brand-light-gray overflow-hidden">
      <ParticlesBackground id="particles-testimonials" />
      
      <div className="relative container mx-auto px-6 text-center z-20 mb-10">
        <h2 className="text-3xl font-bold text-gray-900">{content.title}</h2>
      </div>

      <div
        className="w-full inline-flex flex-nowrap overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)',
        }}
      >
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-scroll">
          {renderTestimonialCards()}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-scroll" aria-hidden="true">
          {renderTestimonialCards()}
        </ul>
      </div>
    </section>
  );
};

export default Testimonials;
