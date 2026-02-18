import { useState, useEffect, useCallback } from 'react';
import { Language, Direction, Content } from '../types';
import { getContent, content as allContent } from '../data/localization';

const availableLangs = Object.keys(allContent) as Language[];

export const useLocalization = () => {
  const getInitialLang = (): Language => {
    const storedLang = localStorage.getItem('tourcare_lang');
    if (storedLang && availableLangs.includes(storedLang as Language)) {
      return storedLang as Language;
    }

    const browserLang = navigator.language.split('-')[0];
    if (availableLangs.includes(browserLang as Language)) {
      return browserLang as Language;
    }
    
    return 'en';
  };

  const [lang, setLang] = useState<Language>(getInitialLang);
  const [dir, setDir] = useState<Direction>(lang === 'ar' ? 'rtl' : 'ltr');
  const [content, setContent] = useState<Content>(getContent(lang));

  useEffect(() => {
    localStorage.setItem('tourcare_lang', lang);
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    setDir(newDir);
    setContent(getContent(lang));
    document.documentElement.lang = lang;
    document.documentElement.dir = newDir;
  }, [lang]);

  const changeLanguage = useCallback((newLang: Language) => {
    if (availableLangs.includes(newLang)) {
      setLang(newLang);
    }
  }, []);

  return { lang, dir, content, changeLanguage, availableLangs };
};