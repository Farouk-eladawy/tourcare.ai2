import React, { useState, useEffect, useRef } from 'react';
import { TestimonialsContent } from '../types';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TestimonialsProps {
  content: TestimonialsContent;
}

const Testimonials: React.FC<TestimonialsProps> = ({ content }) => {
  const sectionRef = useScrollAnimation<HTMLElement>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalItems = content.items.length;

  // Auto-play logic
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, totalItems]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section ref={sectionRef} data-section-id="testimonials" className="scroll-animate relative py-20 bg-brand-light-gray overflow-hidden">
       <ParticlesBackground id="particles-testimonials" />
      <div className="relative container mx-auto px-6 z-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{content.title}</h2>
        
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slider Area */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100 min-h-[350px] md:min-h-[300px]">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(${content.items.length === 0 ? 0 : -(currentIndex * 100)}%)` }}
            >
              {content.items.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8 md:p-12 flex flex-col items-center justify-center text-center h-full">
                   {item.logoUrl && (
                    <div className="mb-6 h-16 flex items-center justify-center">
                      <img 
                        src={item.logoUrl} 
                        alt={`${item.company} logo`} 
                        className="max-h-full max-w-[180px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  )}
                  
                  <blockquote className="text-xl md:text-2xl italic text-gray-700 mb-8 leading-relaxed relative">
                    <span className="text-6xl text-brand-accent/20 absolute -top-8 -left-4 font-serif">"</span>
                    {item.quote}
                    <span className="text-6xl text-brand-accent/20 absolute -bottom-12 -right-4 font-serif">"</span>
                  </blockquote>
                  
                  <div className="mt-auto">
                    <p className="font-bold text-gray-900 text-lg">{item.author}</p>
                    <p className="text-brand-accent font-medium">{item.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={goToPrev}
            className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 bg-white text-gray-700 hover:text-brand-accent p-3 rounded-full shadow-lg border border-gray-100 transition-all hover:scale-110 z-30 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={goToNext}
            className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 bg-white text-gray-700 hover:text-brand-accent p-3 rounded-full shadow-lg border border-gray-100 transition-all hover:scale-110 z-30 focus:outline-none"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {content.items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-brand-accent w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
