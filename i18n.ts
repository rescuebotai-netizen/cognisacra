import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './translations';

// Construct resources object from our translations dictionary
const resources: Record<string, { translation: Record<string, string> }> = {};

// We support en (English), pt (Portuguese), es (Spanish), fr (French), ar (Arabic), sw (Swahili, Kiswahili)
const supportedLanguages = ['en', 'pt', 'es', 'fr', 'ar', 'sw'];

supportedLanguages.forEach(lang => {
  resources[lang] = {
    translation: translations[lang] || {}
  };
});

// Since English uses the key strings themselves, fallback translation is handled natively
resources['en'] = {
  translation: {}
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
