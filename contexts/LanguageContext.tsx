
import React, { createContext, useState, useContext, useCallback, useRef, ReactNode } from 'react';
import { translateText } from '../services/geminiService';
import { translations } from '../translations';
import i18n from '../i18n';

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
    translate: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState('en');
    const translationCache = useRef<Map<string, string>>(new Map());

    const translate = useCallback(async (text: string): Promise<string> => {
        if (language === 'en' || !text) {
            return text;
        }

        // 1. Check static dictionary first for instant, reliable translation
        const staticTranslation = translations[language]?.[text];
        if (staticTranslation) {
            return staticTranslation;
        }

        // 2. If not in dictionary, proceed with AI translation and caching
        const cacheKey = `${language}:${text}`;
        if (translationCache.current.has(cacheKey)) {
            return translationCache.current.get(cacheKey)!;
        }

        try {
            const translated = await translateText(text, language);
            translationCache.current.set(cacheKey, translated);
            return translated;
        } catch (error) {
            console.error('Translation failed:', error);
            return text; // Fallback to original text
        }
    }, [language]);
    
    React.useEffect(() => {
        i18n.changeLanguage(language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);
    
    const setLanguage = (lang: string) => {
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
