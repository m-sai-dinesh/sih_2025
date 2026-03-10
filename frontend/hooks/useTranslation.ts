import { useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }

    const { language, setLanguage, translations, loadingTranslations } = context;

    // Helper to access nested keys like 'a.b.c'
    const getNestedTranslation = (lang: 'en' | 'hi', key: string): string | undefined => {
        if (!translations[lang]) return undefined;
        return key.split('.').reduce((obj: any, k: string) => {
            return obj && obj[k];
        }, translations[lang]);
    };

    const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
        if (loadingTranslations) {
            return ''; // Return empty string while loading to avoid showing keys
        }

        let translation = getNestedTranslation(language, key);

        if (!translation) {
            // Fallback to English if translation is missing in the current language
            translation = getNestedTranslation('en', key);
        }

        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }

        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation!.replace(`{${placeholder}}`, String(replacements[placeholder]));
            });
        }
        
        return translation;
    }, [language, translations, loadingTranslations]);

    return { t, setLanguage, language, loadingTranslations };
};