import React from 'react';
import ParticlesBackground from './ParticlesBackground';
import { Plan } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface PricingProps {
  content: {
    title: string;
    plans: Plan[];
    retainer: string;
  };
  onChoosePlan: (planName: string) => void;
}

const PricingCard: React.FC<{ plan: Plan, index: number, onChoosePlan: (planName: string) => void }> = ({ plan, index, onChoosePlan }) => {
    const ref = useScrollAnimation<HTMLDivElement>({ delay: `${100 + index * 150}ms` });
    return (
        <div ref={ref} className={`scroll-animate bg-brand-light-gray p-8 rounded-lg border-2 flex flex-col transition-all duration-300 ${index === 1 ? 'border-brand-accent scale-105 shadow-xl' : 'border-gray-200/80'}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
            <p className="text-4xl font-extrabold text-brand-accent mb-6">{plan.price}</p>
            <ul className="text-gray-600 space-y-3 text-start mb-8 flex-grow">
                {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                        <span className="text-brand-accent me-2 mt-1">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                onClick={() => onChoosePlan(plan.name)}
                className={`mt-auto w-full font-bold py-3 px-4 rounded-md transition ${index === 1 ? 'bg-brand-accent text-white hover:bg-brand-accent-hover' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                {plan.cta}
            </button>
        </div>
    );
}


const Pricing: React.FC<PricingProps> = ({ content, onChoosePlan }) => {
  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const retainerRef = useScrollAnimation<HTMLParagraphElement>({ delay: '600ms' });

  return (
    <section id="pricing" className="relative py-16 bg-brand-white">
       <ParticlesBackground id="particles-pricing" />
      <div className="relative container mx-auto px-6 text-center z-20">
        <h2 ref={titleRef} className="scroll-animate text-3xl font-bold text-gray-900 mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {content.plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} onChoosePlan={onChoosePlan} />
          ))}
        </div>
        <p ref={retainerRef} className="scroll-animate mt-12 text-gray-500">{content.retainer}</p>
      </div>
    </section>
  );
};

export default Pricing;