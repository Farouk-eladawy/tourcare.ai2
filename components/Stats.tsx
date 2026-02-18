import React, { useState, useEffect, useRef } from 'react';
import { StatsContent, Stat } from '../types';

const StatCounter: React.FC<{ stat: Stat; index: number }> = ({ stat, index }) => {
    const isAnimatable = /^\d+[^\d]*$/.test(stat.value);
    const [displayValue, setDisplayValue] = useState(isAnimatable ? '0' : stat.value);
    
    const target = isAnimatable ? parseInt(stat.value, 10) : 0;
    const suffix = isAnimatable ? stat.value.substring(String(target).length) : '';

    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    entry.target.classList.add('is-visible');
                    observer.disconnect();
                }
            },
            {
                threshold: 0.5,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            currentRef.style.transitionDelay = `${index * 100}ms`;
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [index]);

    useEffect(() => {
        if (!isVisible || !isAnimatable) {
            return;
        }

        let start = 0;
        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const counter = () => {
            frame++;
            const progress = frame / totalFrames;
            const currentCount = Math.round(target * progress);

            if (currentCount >= target) {
                setDisplayValue(String(target));
                return;
            }

            setDisplayValue(String(currentCount));
            requestAnimationFrame(counter);
        };
        
        requestAnimationFrame(counter);

    }, [isVisible, isAnimatable, target]);

    return (
        <div ref={ref} className="scroll-animate text-center">
            <p className="text-5xl md:text-6xl font-extrabold text-brand-accent whitespace-nowrap">
                {displayValue}{suffix}
            </p>
            <p className="text-lg text-gray-600 mt-2">{stat.label}</p>
        </div>
    );
};


const Stats: React.FC<{ content: StatsContent }> = ({ content }) => {
  return (
    <section data-section-id="stats" className="py-16 bg-brand-light-gray">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.stats.map((stat, index) => (
            <StatCounter key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;