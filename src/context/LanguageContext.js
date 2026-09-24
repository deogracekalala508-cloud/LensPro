'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../lib/i18n';

// Helper to resolve dot notation or key
function createTranslationFunction(lang) {
  const dict = translations[lang] || translations.fr;

  const tFunc = (key, fallback = '') => {
    if (!key) return fallback;
    const parts = key.split('.');
    let result = dict;
    for (const part of parts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        return fallback || key;
      }
    }
    return typeof result === 'string' ? result : fallback || key;
  };

  // Attach dict properties directly to tFunc for property access (e.g. t.nav.home)
  Object.assign(tFunc, dict);
  return tFunc;
}

const defaultContext = {
  language: 'fr',
  setLanguage: () => {},
  t: createTranslationFunction('fr')
};

const LanguageContext = createContext(defaultContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lenspro_lang') : null;
    if (storedLang && translations[storedLang]) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lenspro_lang', lang);
      }
    }
  };

  const t = createTranslationFunction(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context || defaultContext;
};
