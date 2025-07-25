import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get stored language from localStorage or use browser language
const storedLanguage = localStorage.getItem('i18nextLng');
const browserLanguage = navigator.language.split('-')[0];
const defaultLanguage = storedLanguage || browserLanguage || 'en';

// Set RTL direction if needed
document.dir = defaultLanguage === 'ar' ? 'rtl' : 'ltr';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr', 'ar'],
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Only debug in development
    lng: defaultLanguage,
    detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage'],
    },
    backend: {
        loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: {
        escapeValue: false, // React already safe from XSS
    },
  });

export default i18n;

