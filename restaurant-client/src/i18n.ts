// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import az from './locales/az.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      az: { translation: az },
      en: { translation: en }
    },
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  });

export default i18n;
