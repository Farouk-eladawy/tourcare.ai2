import React, { useState, useRef, useEffect, FC } from 'react';
import { Language, HeaderContent, NavDropdown as NavDropdownType, User } from '../types';

interface HeaderProps {
  content: HeaderContent;
  lang: Language;
  availableLangs: Language[];
  changeLanguage: (lang: Language) => void;
  onAuthClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

// Self-contained Dropdown component for Products (Desktop)
const NavDropdown: FC<{ item: NavDropdownType }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-brand-accent transition flex items-center gap-1 font-semibold"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {item.title}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full ltr:left-0 rtl:right-0 mt-3 w-64 bg-white rounded-md shadow-lg border border-gray-200/80 p-2 z-20">
          {item.items.map((subItem) => (
            <a
              key={subItem.href}
              href={subItem.href}
              onClick={() => setIsOpen(false)}
              className="block p-3 rounded-md hover:bg-brand-light-gray"
            >
              <p className="font-semibold text-gray-800">{subItem.text}</p>
              <p className="text-sm text-gray-500">{subItem.description}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// Language Switcher Dropdown
const LanguageSwitcher: FC<{ currentLang: Language; availableLangs: Language[]; onChange: (lang: Language) => void; }> = ({ currentLang, availableLangs, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
         <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-brand-accent transition flex items-center gap-1 font-semibold"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a8 8 0 015.407 13.543l1.821 1.822a.5.5 0 01-.353.853h-3.32a.5.5 0 01-.48-.636l.707-1.768A6 6 0 1010 4z" />
                    <path d="M10.5 5a.5.5 0 00-1 0v4.879l-1.854-.463a.5.5 0 00-.592.592l2.5 1a.5.5 0 00.48-.013l3.5-2a.5.5 0 00-.217-.925L10.5 7.88V5z" />
                </svg>
                <span className="uppercase">{currentLang}</span>
            </button>
            {isOpen && (
                <div className="absolute top-full ltr:right-0 rtl:left-0 mt-3 w-32 bg-white rounded-md shadow-lg border border-gray-200/80 p-1 z-20">
                    {availableLangs.map(langCode => (
                        <button
                            key={langCode}
                            onClick={() => { onChange(langCode); setIsOpen(false); }}
                            className={`w-full text-start p-2 rounded-md hover:bg-brand-light-gray font-semibold ${langCode === currentLang ? 'text-brand-accent' : 'text-gray-800'}`}
                        >
                            {langCode.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Mobile Menu Component
const MobileMenu: FC<{
  isOpen: boolean;
  onClose: () => void;
  content: HeaderContent;
  lang: Language;
  onAuthClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}> = ({ isOpen, onClose, content, lang, onAuthClick, currentUser, onLogout }) => {
  const handleAuthClick = () => {
    onClose();
    onAuthClick();
  };

  const handleLogoutClick = () => {
    onClose();
    onLogout();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Menu Panel */}
      <div
        className={`absolute top-0 h-full w-full max-w-sm bg-brand-white shadow-xl transition-transform duration-300 ease-in-out ${
          lang === 'ar'
            ? `left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `right-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <a href="#/" onClick={onClose} className="block" aria-label="TourCare.ai Home">
              <img
                src="https://res.cloudinary.com/dqlurfwet/image/upload/v1760801741/20251018_1834_%D8%AA%D9%83%D8%A8%D9%8A%D8%B1_%D9%84%D9%88%D8%AC%D9%88_TourCare.AI_remix_01k7vz6rjze1gbrer8wx1eke0k_qgdxxq.png"
                alt="TourCare.ai logo"
                style={{ height: 'var(--logo-height)' }}
                className="object-contain max-w-[200px]"
              />
            </a>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav className="flex-grow p-6 space-y-4 overflow-y-auto">
            {content.navItems.map((item, index) => {
              if (item.type === 'link') {
                return (
                  <a key={index} href={item.href} onClick={onClose} className="block text-lg font-semibold text-gray-700 hover:text-brand-accent transition py-2">
                    {item.text}
                  </a>
                );
              }
              if (item.type === 'dropdown') {
                return (
                  <div key={index} className="py-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <div className="space-y-2 ltr:pl-4 rtl:pr-4 border-l-2 border-brand-accent/20 ltr:border-l-2 rtl:border-r-2">
                      {item.items.map(subItem => (
                        <a key={subItem.href} href={subItem.href} onClick={onClose} className="block text-gray-600 hover:text-brand-accent transition py-1">
                          {subItem.text}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })}
             {currentUser?.fields.isAdmin && (
                <a href="#/admin" onClick={onClose} className="block text-lg font-semibold text-gray-700 hover:text-brand-accent transition py-2 border-t mt-4 pt-4">
                    {content.adminDashboard}
                </a>
             )}
          </nav>
          <div className="p-6 border-t border-gray-200 mt-auto">
            {currentUser ? (
                <div className="text-center">
                    <p className="font-semibold text-gray-800 mb-4">{content.welcome.replace('{{name}}', currentUser.fields.name)}</p>
                    <button onClick={handleLogoutClick} className="w-full bg-gray-600 text-white font-bold px-5 py-3 rounded-md hover:bg-gray-700 transition">
                        {content.logout}
                    </button>
                </div>
            ) : (
                <button onClick={handleAuthClick} className="w-full bg-brand-accent text-white font-bold px-5 py-3 rounded-md hover:bg-brand-accent-hover transition">
                    {content.login}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ content, lang, availableLangs, changeLanguage, onAuthClick, currentUser, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Smart scroll logic
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & past top
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 10);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const headerClasses = `
    fixed top-0 w-full z-40 transition-all duration-300 ease-in-out transform
    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    ${isScrolled
      ? 'bg-brand-white/90 backdrop-blur-lg border-b border-gray-200/80 shadow-md py-2' 
      : 'bg-transparent border-b-transparent py-4'
    }
  `;

  return (
    <>
      <header id="main-header" className={headerClasses}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <a href="#/" className="block z-10" aria-label="TourCare.ai Home">
              <img 
                src="https://res.cloudinary.com/dqlurfwet/image/upload/v1760801741/20251018_1834_%D8%AA%D9%83%D8%A8%D9%8A%D8%B1_%D9%84%D9%88%D8%AC%D9%88_TourCare.AI_remix_01k7vz6rjze1gbrer8wx1eke0k_qgdxxq.png" 
                alt="TourCare.ai logo" 
                style={{ height: isScrolled ? 'calc(var(--logo-height) * 0.8)' : 'var(--logo-height)', transition: 'height 0.3s ease' }}
                className="object-contain"
              />
            </a>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {content.navItems.map((item, index) => {
              if (item.type === 'link') {
                return <a key={index} href={item.href} className="text-gray-700 hover:text-brand-accent transition font-semibold">{item.text}</a>;
              }
              if (item.type === 'dropdown') {
                return <NavDropdown key={index} item={item} />;
              }
              return null;
            })}
             {currentUser?.fields.isAdmin && (
                <a href="#/admin" className="text-gray-700 hover:text-brand-accent transition font-semibold">{content.adminDashboard}</a>
             )}
          </nav>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher currentLang={lang} availableLangs={availableLangs} onChange={changeLanguage} />
             <div className="hidden sm:flex items-center space-x-4">
                {currentUser ? (
                    <>
                        <span className="font-semibold text-gray-700 hidden lg:block">{content.welcome.replace('{{name}}', currentUser.fields.name.split(' ')[0])}</span>
                        <button onClick={onLogout} className="bg-gray-600 text-white font-bold px-5 py-2 rounded-md hover:bg-gray-700 transition">
                            {content.logout}
                        </button>
                    </>
                ) : (
                    <button onClick={onAuthClick} className="bg-brand-accent text-white font-bold px-5 py-2 rounded-md hover:bg-brand-accent-hover transition">
                        {content.login}
                    </button>
                )}
            </div>
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-700 hover:text-brand-accent z-10" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        content={content}
        lang={lang}
        onAuthClick={onAuthClick}
        currentUser={currentUser}
        onLogout={onLogout}
      />
    </>
  );
};

export default Header;
