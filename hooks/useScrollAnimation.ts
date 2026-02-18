import { useEffect, useState, useCallback } from 'react';

type AnimationOptions = {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: string; // e.g., '100ms', '200ms'
};

export const useScrollAnimation = <T extends HTMLElement>(options: AnimationOptions = {}) => {
  const { threshold = 0.1, triggerOnce = true, delay = '0ms' } = options;
  const [element, setElement] = useState<T | null>(null);

  // A stable callback function to be used as the ref.
  // This will be called by React when the component mounts (with the node) and unmounts (with null).
  const callbackRef = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    // If there's no element, we don't need to do anything.
    if (!element) {
      return;
    }

    element.style.transitionDelay = delay;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          if (triggerOnce) {
            // Once the animation is triggered, we can stop observing.
            observer.disconnect();
          }
        } else {
          // If triggerOnce is false, we can reset the animation when it goes out of view.
          if (!triggerOnce) {
            element.classList.remove('is-visible');
          }
        }
      },
      {
        threshold,
      }
    );

    observer.observe(element);

    // Cleanup function to disconnect the observer when the component unmounts or the element changes.
    return () => {
      observer.disconnect();
    };
  }, [element, threshold, triggerOnce, delay]); // Re-run the effect if the element or any option changes.

  return callbackRef;
};
