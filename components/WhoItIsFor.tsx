import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface WhoItIsForProps {
  content: {
    title: string;
    focus: string;
    points: string[];
  };
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const WhoItIsFor: React.FC<WhoItIsForProps> = ({ content }) => {
  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const focusRef = useScrollAnimation<HTMLParagraphElement>({ delay: '150ms' });
  const listRef = useScrollAnimation<HTMLDivElement>({ delay: '300ms' });

  return (
    <section data-section-id="who-it-is-for" className="py-16 bg-brand-light-gray">
      <div className="container mx-auto px-6 text-center">
        <h2 ref={titleRef} className="scroll-animate text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
        <p ref={focusRef} className="scroll-animate text-xl text-brand-accent mb-8 font-semibold">{content.focus}</p>
        <div ref={listRef} className="scroll-animate max-w-3xl mx-auto text-start bg-white/50 backdrop-blur-sm p-8 rounded-lg border border-gray-200/80">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {content.points.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhoItIsFor;