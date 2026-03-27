// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Goes up one folder from 'lib' to find the 'locales' folder in your root
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      hi: hi,
      mr: mr
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;