import React from 'react';
import { WorkflowContent } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const WorkflowStep: React.FC<{ step: WorkflowContent['steps'][0], delay: string }> = ({ step, delay }) => {
    const ref = useScrollAnimation<HTMLDivElement>({ delay });
    return (
        <div ref={ref} className="scroll-animate relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-brand-accent flex items-center justify-center text-3xl mb-4 shadow-md">
                {step.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
        </div>
    );
};

const Workflow: React.FC<{ content: WorkflowContent }> = ({ content }) => {
  const titleRef = useScrollAnimation<HTMLHeadingElement>();
  const lineRef = useScrollAnimation<HTMLDivElement>({ delay: '200ms' });

  return (
    <section id="workflow" data-section-id="workflow" className="py-16 bg-brand-light-gray">
      <div className="container mx-auto px-6 text-center">
        <h2 ref={titleRef} className="scroll-animate text-3xl font-bold text-gray-900 mb-12">{content.title}</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-8 text-center relative">
          {/* Connecting Line */}
          <div ref={lineRef} className="scroll-animate hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-accent/30 transform -translate-y-8"></div>
          
          {content.steps.map((step, index) => (
            <WorkflowStep key={index} step={step} delay={`${200 + index * 150}ms`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;