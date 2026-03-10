import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';
type Translations = { [key: string]: any };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: { en: Translations, hi: Translations };
  loadingTranslations: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = localStorage.getItem('app-language');
    return (storedLang === 'en' || storedLang === 'hi') ? storedLang : 'en';
  });
  const [translations, setTranslations] = useState<{ en: Translations, hi: Translations }>({ en: {}, hi: {} });
  const [loadingTranslations, setLoadingTranslations] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoadingTranslations(true);
        const [enResponse, hiResponse] = await Promise.all([
          fetch('/locales/en.json'),
          fetch('/locales/hi.json')
        ]);
        if (!enResponse.ok || !hiResponse.ok) {
            throw new Error('Failed to load translation files');
        }
        const enData = await enResponse.json();
        const hiData = await hiResponse.json();
        setTranslations({ en: enData, hi: hiData });
      } catch (error) {
        console.error("Could not load translations:", error);
      } finally {
        setLoadingTranslations(false);
      }
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const value = { language, setLanguage, translations, loadingTranslations };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};