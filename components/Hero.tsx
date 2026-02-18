import React from 'react';
import BackgroundVideo from './BackgroundVideo'; // Import the new component
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface HeroProps {
  content: {
    headline: string;
    secondaryText: string;
    ctaTrial: string;
    ctaDemo: string;
    ctaIntro: string;
  };
  onWatchIntroClick: () => void;
  onBookConsultationClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ content, onWatchIntroClick, onBookConsultationClick }) => {
  const videoUrl = "https://res.cloudinary.com/dqlurfwet/video/upload/v1760746163/Video_Object_Remover-1759694458000_ti1x77.mp4";
  
  const headlineRef = useScrollAnimation<HTMLHeadingElement>();
  const textRef = useScrollAnimation<HTMLParagraphElement>({ delay: '150ms' });
  const buttonsRef = useScrollAnimation<HTMLDivElement>({ delay: '300ms' });

  return (
    <section data-section-id="hero" className="relative py-20 md:py-32 text-center overflow-hidden">
      <BackgroundVideo src={videoUrl} />
      <div className="absolute inset-0 bg-white/50 z-10"></div>
      <div className="relative container mx-auto px-6 z-20">
        <h2 ref={headlineRef} className="scroll-animate text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4" style={{textShadow: '0px 1px 3px rgba(0,0,0,0.1)'}}>
          {content.headline}
        </h2>
        <p ref={textRef} className="scroll-animate text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          {content.secondaryText}
        </p>
        <div ref={buttonsRef} className="scroll-animate flex justify-center items-center gap-4 flex-wrap">
          <button onClick={onBookConsultationClick} className="bg-brand-accent text-white font-bold px-8 py-3 rounded-md hover:bg-brand-accent-hover transition text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            {content.ctaTrial}
          </button>
          <button onClick={onWatchIntroClick} className="flex items-center gap-2 border-2 border-brand-accent text-brand-accent font-bold px-8 py-3 rounded-md hover:bg-brand-accent hover:text-white transition text-lg bg-white/50 backdrop-blur-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            {content.ctaIntro}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;