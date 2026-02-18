import React, { useState, useMemo } from 'react';
import { FaqSectionContent } from '../types';
import ParticlesBackground from './ParticlesBackground';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FaqSection: React.FC<{ content: FaqSectionContent }> = ({ content }) => {
  const [activeCategory, setActiveCategory] = useState<string>(content.allCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const titleRef = useScrollAnimation<HTMLDivElement>();
  const controlsRef = useScrollAnimation<HTMLDivElement>({ delay: '150ms' });
  const listRef = useScrollAnimation<HTMLDivElement>({ delay: '300ms' });

  const filteredCategories = useMemo(() => {
    if (!searchTerm && activeCategory === content.allCategories) {
      return content.categories;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    
    return content.categories
      .filter(category => activeCategory === content.allCategories || category.title === activeCategory)
      .map(category => {
        const filteredItems = category.items.filter(item =>
          item.q.toLowerCase().includes(lowercasedFilter) ||
          item.a.toLowerCase().includes(lowercasedFilter)
        );
        return { ...category, items: filteredItems };
      })
      .filter(category => category.items.length > 0);
  }, [searchTerm, activeCategory, content.categories, content.allCategories]);
  
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) {
      return <span>{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-brand-accent/30 text-gray-900 px-1 rounded-sm">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const toggleAccordion = (question: string) => {
    setOpenAccordion(prev => (prev === question ? null : question));
  };

  return (
    <section id="faq" className="relative py-16 bg-brand-white">
      <ParticlesBackground id="particles-faq" />
      <div className="relative container mx-auto px-6 z-20">
        <div ref={titleRef} className="scroll-animate text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.pageTitle}</h2>
        </div>

        {/* Search and Filter Controls */}
        <div ref={controlsRef} className="scroll-animate my-8 max-w-4xl mx-auto">
            <input
                type="search"
                placeholder={content.searchPlaceholder}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-md p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition shadow-lg"
            />
             <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button
                    onClick={() => setActiveCategory(content.allCategories)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition ${activeCategory === content.allCategories ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    {content.allCategories}
                </button>
                {content.categories.map(cat => (
                    <button
                        key={cat.title}
                        onClick={() => setActiveCategory(cat.title)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition flex items-center gap-2 ${activeCategory === cat.title ? 'bg-brand-accent text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                       <span>{cat.icon}</span> {cat.title}
                    </button>
                ))}
            </div>
        </div>

        {/* Accordion List */}
        <div ref={listRef} className="scroll-animate max-w-4xl mx-auto space-y-6">
          {filteredCategories.map(category => (
            <div key={category.title}>
                <h3 className="text-2xl font-bold text-brand-accent mt-8 mb-4 flex items-center gap-3">
                   <span>{category.icon}</span> {category.title}
                </h3>
                <div className="space-y-2">
                {category.items.map(item => (
                    <div key={item.q} className="bg-white border-l-4 border-brand-accent/50 rounded-lg overflow-hidden transition-all duration-300 shadow-sm">
                    <button
                        onClick={() => toggleAccordion(item.q)}
                        className="w-full flex justify-between items-center text-start p-5 font-semibold text-gray-800 hover:bg-gray-50"
                        aria-expanded={openAccordion === item.q}
                    >
                        <span>{highlightText(item.q, searchTerm)}</span>
                        <span className={`transform transition-transform duration-300 ${openAccordion === item.q ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </span>
                    </button>
                    <div className={`grid transition-all duration-500 ease-in-out ${openAccordion === item.q ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                             <div className="p-5 pt-0 text-gray-600">
                                {highlightText(item.a, searchTerm)}
                             </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
             <div className="text-center py-10 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-lg">No results found for "{searchTerm}"</p>
                <p className="text-gray-500">Try searching for something else or clearing the filter.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;