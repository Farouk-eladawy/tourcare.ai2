import React from 'react';
import { CtaSectionContent } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface CtaSectionProps {
    content: CtaSectionContent;
    onBookConsultationClick: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ content, onBookConsultationClick }) => {
  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const subtitleRef = useScrollAnimation<HTMLParagraphElement>({ delay: '150ms' });
  const buttonRef = useScrollAnimation<HTMLButtonElement>({ delay: '300ms' });

  return (
    <section data-section-id="cta" className="py-16 bg-brand-light-gray">
      <div className="container mx-auto px-6 z-20 text-center">
        <h2 ref={titleRef} className="scroll-animate text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
        <p ref={subtitleRef} className="scroll-animate text-lg text-gray-600 max-w-2xl mx-auto mb-8">{content.subtitle}</p>
        <button ref={buttonRef} onClick={onBookConsultationClick} className="scroll-animate bg-brand-accent text-white font-bold px-8 py-3 rounded-md hover:bg-brand-accent-hover transition text-lg inline-block transform hover:scale-105 shadow-lg hover:shadow-xl">
          {content.cta}
        </button>
      </div>
    </section>
  );
};

export default CtaSection;