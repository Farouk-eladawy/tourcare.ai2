import React from 'react';
import { ProductPageContent, Plan } from '../types';
import ParticlesBackground from './ParticlesBackground';
import CtaSection from './CtaSection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProductPricingCardProps {
    plan: Plan;
    onChoosePlan: (planName: string) => void;
    isFeatured?: boolean;
}

export const ProductPricingCard: React.FC<ProductPricingCardProps> = ({ plan, onChoosePlan, isFeatured }) => (
    <div className={`bg-brand-light-gray p-8 rounded-lg border-2 flex flex-col transition-all duration-300 ${isFeatured ? 'border-brand-accent scale-105 shadow-xl' : 'border-gray-200/80'}`}>
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
            className={`mt-auto w-full font-bold py-3 px-4 rounded-md transition ${isFeatured ? 'bg-brand-accent text-white hover:bg-brand-accent-hover' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
            {plan.cta}
        </button>
    </div>
);


interface ProductPageLayoutProps {
  content: ProductPageContent;
  onChoosePlan: (planName: string | null) => void;
}

const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({ content, onChoosePlan }) => {
  const heroRef = useScrollAnimation<HTMLElement>();
  const descriptionRef = useScrollAnimation<HTMLElement>();
  const benefitsRef = useScrollAnimation<HTMLElement>();
  const pricingRef = useScrollAnimation<HTMLElement>();
  
  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="scroll-animate relative py-20 md:py-28 text-center bg-gray-100">
        <ParticlesBackground id={`particles-${content.navTitle}-hero`} />
        <div className="absolute inset-0 bg-white/30 z-10"></div>
        <div className="relative container mx-auto px-6 z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section ref={descriptionRef} className="scroll-animate py-16 bg-brand-white">
         <div className="container mx-auto px-6 z-20">
             <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-brand-accent mb-4">{content.descriptionSection.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{content.descriptionSection.content}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.descriptionSection.features.map((feature, index) => (
                        <div key={index} className="bg-brand-light-gray/50 p-6 rounded-lg border-l-4 border-brand-accent flex items-start gap-4 transition-all duration-300 hover:bg-white h-full">
                            <div className="text-3xl flex-shrink-0 pt-1">{feature.icon}</div>
                            <p className="text-gray-700">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </section>
      
      {/* Benefits Section (Conditional) */}
      {content.benefits && (
        <section ref={benefitsRef} className="scroll-animate py-16 bg-brand-light-gray">
            <div className="container mx-auto px-6 z-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-brand-accent mb-4">{content.benefits.title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.benefits.features.map((feature, index) => (
                            <div key={index} className="bg-white/50 p-6 rounded-lg border-l-4 border-brand-accent flex items-start gap-4 transition-all duration-300 hover:bg-white h-full">
                                <div className="text-3xl flex-shrink-0 pt-1">{feature.icon}</div>
                                <p className="text-gray-700">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* Pricing Section (Conditional) */}
      {content.pricing && content.pricing.plans && content.pricing.plans.length > 0 && (
        <section ref={pricingRef} className="scroll-animate relative py-16 bg-brand-white">
            <ParticlesBackground id={`particles-${content.navTitle}-pricing`} />
            <div className="relative container mx-auto px-6 text-center z-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">{content.pricing.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {content.pricing.plans.map((plan, index) => (
                        <ProductPricingCard key={index} plan={plan} onChoosePlan={() => onChoosePlan(plan.name)} isFeatured={index === 1} />
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* CTA Section */}
      <CtaSection content={content.cta} onBookConsultationClick={() => onChoosePlan(null)} />
    </>
  );
};

export default ProductPageLayout;