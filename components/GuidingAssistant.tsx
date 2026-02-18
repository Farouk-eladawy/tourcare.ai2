import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';

interface GuidingAssistantProps {
  onOpenAssistant: () => void;
  lang: Language;
  currentRoute: string;
}

// SVG Icon Component, customizable via CSS variables from index.html
const BotIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI Assistant Bot" style={{ width: '100%', height: '100%' }}>
        <path d="M40 26C40 33.732 32.8366 40 24 40C15.1634 40 8 33.732 8 26" fill="rgba(0,0,0,0.1)" />
        <rect x="8" y="14" width="32" height="24" rx="16" fill="var(--bot-color-primary)" />
        <rect x="12" y="18" width="24" height="12" rx="6" fill="#000000" />
        <circle cx="19" cy="24" r="3.5" fill="var(--bot-color-secondary)" />
        <circle cx="19" cy="24" r="2" fill="var(--bot-color-eye-glow)" />
        <circle cx="29" cy="24" r="3.5" fill="var(--bot-color-secondary)" />
        <circle cx="29" cy="24" r="2" fill="var(--bot-color-eye-glow)" />
        <line x1="24" y1="14" x2="24" y2="10" stroke="var(--bot-color-primary)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="8" r="2.5" fill="var(--bot-color-secondary)" />
        <circle cx="24" cy="8" r="1" fill="var(--bot-color-eye-glow)" />
    </svg>
);

const sectionMessages: Record<string, { [key in Language]: string }> = {
    'hero': { en: "Welcome! Let's explore how we can automate your business.", ar: "أهلاً بك! دعنا نستكشف كيف يمكننا أتمتة أعمالك.", de: "Welcome! Let's explore how we can automate your business.", es: "Welcome! Let's explore how we can automate your business." },
    'stats': { en: "See the impact! We deliver measurable results for your business.", ar: "شاهد التأثير! نقدم نتائج قابلة للقياس لعملك.", de: "See the impact! We deliver measurable results for your business.", es: "See the impact! We deliver measurable results for your business." },
    'who-it-is-for': { en: "Is this for you? Absolutely, if you're a growth-focused operator.", ar: "هل هذا لك؟ بالطبع، إذا كنت تركز على النمو.", de: "Is this for you? Absolutely, if you're a growth-focused operator.", es: "Is this for you? Absolutely, if you're a growth-focused operator." },
    'workflow': { en: "Our process is simple, powerful, and transparent.", ar: "عمليتنا بسيطة، قوية، وشفافة.", de: "Our process is simple, powerful, and transparent.", es: "Our process is simple, powerful, and transparent." },
    'features': { en: "Check out our core features designed to save you time.", ar: "اطلع على ميزاتنا الأساسية المصممة لتوفير وقتك.", de: "Check out our core features designed to save you time.", es: "Check out our core features designed to save you time." },
    'cta': { en: "Ready to start? Let's book a free consultation.", ar: "هل أنت مستعد للبدء؟ لنتحدث في استشارة مجانية.", de: "Ready to start? Let's book a free consultation.", es: "Ready to start? Let's book a free consultation." },
    'testimonials': { en: "Don't just take our word for it, see what our partners say.", ar: "لا تأخذ كلمتنا فقط، انظر ماذا يقول شركاؤنا.", de: "Don't just take our word for it, see what our partners say.", es: "Don't just take our word for it, see what our partners say." },
};


const GuidingAssistant: React.FC<GuidingAssistantProps> = ({ onOpenAssistant, lang, currentRoute }) => {
  const isHomePage = currentRoute === '#/' || currentRoute === '';
  const botRef = useRef<HTMLDivElement>(null);

  // --- State for positioning and interaction ---
  const [position, setPosition] = useState({ top: window.innerHeight - 100, left: 24 });
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState(sectionMessages['hero'][lang]);
  const [showMessage, setShowMessage] = useState(false);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- State and Refs for Drag Functionality ---
  const [isDragging, setIsDragging] = useState(false);
  const [isManuallyPositioned, setIsManuallyPositioned] = useState(false);
  const dragStartData = useRef({ startX: 0, startY: 0, elementX: 0, elementY: 0 });
  const wasDragged = useRef(false);

  // --- Drag Handlers (with useCallback for performance) ---
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!botRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStartData.current.startX;
    const dy = clientY - dragStartData.current.startY;
    
    // Set wasDragged flag if moved beyond a small threshold
    if (!wasDragged.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        wasDragged.current = true;
    }

    let newX = dragStartData.current.elementX + dx;
    let newY = dragStartData.current.elementY + dy;
    
    // Clamp to viewport
    const { offsetWidth, offsetHeight } = botRef.current;
    newX = Math.max(0, Math.min(newX, window.innerWidth - offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - offsetHeight));

    setPosition({ top: newY, left: newX });
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('touchend', handleDragEnd);
  }, [handleDragMove]);

  const handleDragStart = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    if (!botRef.current) return;

    wasDragged.current = false;
    e.stopPropagation();

    setIsManuallyPositioned(true);
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.nativeEvent.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.nativeEvent.touches[0].clientY : e.clientY;
    
    const rect = botRef.current.getBoundingClientRect();

    dragStartData.current = {
        startX: clientX,
        startY: clientY,
        elementX: rect.left,
        elementY: rect.top, 
    };
    
    document.body.style.cursor = 'grabbing';
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);
  }, [handleDragMove, handleDragEnd]);


  const handleClick = () => {
    if (wasDragged.current) return;
    onOpenAssistant();
  };

  // Effect for visibility and initial positioning
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    
    if (!isManuallyPositioned && !isHomePage) {
      const botSize = 72;
      setPosition({
        top: window.innerHeight - botSize - 24,
        left: window.innerWidth - botSize - 24
      });
    }

    return () => clearTimeout(timer);
  }, [currentRoute, isManuallyPositioned, isHomePage]);

  // Effect for dynamic guiding behavior on the homepage
  useEffect(() => {
    if (!isHomePage || isManuallyPositioned) {
      return;
    }

    const headerEl = document.getElementById('main-header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 0;
    const botSizeStr = getComputedStyle(document.documentElement).getPropertyValue('--bot-size').trim().replace('px', '');
    const botSize = parseInt(botSizeStr, 10) || 72;

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntry = entries.find(entry => entry.isIntersecting);
            if (visibleEntry) {
                const sectionId = visibleEntry.target.getAttribute('data-section-id');
                const rect = visibleEntry.intersectionRect; 
                
                if (sectionId && sectionMessages[sectionId]) {
                    const windowWidth = window.innerWidth;
                    const leftPosition = windowWidth > 768 ? 48 : 16;
                    const newTop = rect.top + rect.height / 2;
                    const minTop = headerHeight + (botSize / 2) + 16;
                    const finalTop = Math.max(newTop, minTop);

                    setPosition({
                        top: finalTop,
                        left: leftPosition,
                    });
                    
                    setMessage(sectionMessages[sectionId][lang]);
                    setShowMessage(true);
                    
                    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
                    bubbleTimeoutRef.current = setTimeout(() => setShowMessage(false), 5000);
                }
            }
        },
        { rootMargin: '-30% 0px -30% 0px', threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(sec => observer.observe(sec));
    
    const entryTimeout = setTimeout(() => {
        setShowMessage(true);
        bubbleTimeoutRef.current = setTimeout(() => setShowMessage(false), 5000);
    }, 1500);

    return () => {
        sections.forEach(sec => observer.unobserve(sec));
        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
        clearTimeout(entryTimeout);
    };
  }, [isHomePage, isManuallyPositioned, lang]);

  // Effect for handling language change in messages
  useEffect(() => {
    const currentMessageKey = Object.keys(sectionMessages).find(key => 
      Object.values(sectionMessages[key]).includes(message)
    );
    if (currentMessageKey) {
      setMessage(sectionMessages[currentMessageKey][lang]);
    }
  }, [lang, message]);

  return (
    <div 
      ref={botRef}
      className={`fixed z-40 group transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
      style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'all 0.3s ease-in-out, opacity 0.3s ease-in-out',
      }}
    >
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="bg-brand-blue p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
          style={{ width: 'var(--bot-size)', height: 'var(--bot-size)' }}
          role="button"
          aria-label="Open AI Assistant"
        >
          <BotIcon />
        </button>

        {isHomePage && !isManuallyPositioned && (
          <div className={`
            absolute bottom-1/2 left-full ml-4 transform translate-y-1/2 
            w-64 p-4 bg-brand-blue text-white text-base font-semibold rounded-lg shadow-xl 
            transition-all duration-500 ease-out origin-left
            ${showMessage ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}
          `}>
            {message}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-blue transform rotate-45"></div>
          </div>
        )}

        {!isHomePage && (
           <div className="absolute bottom-1/2 right-full mr-4 transform translate-y-1/2 px-3 py-1.5 bg-brand-blue text-white text-sm font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {lang === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
            <div className="absolute top-1/2 left-full -translate-y-1/2 w-2 h-2 bg-brand-blue transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidingAssistant;