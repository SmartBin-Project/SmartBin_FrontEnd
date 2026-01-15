import { createI18n } from 'vue-i18n';

// 1. Import split files
import { clientEn, clientKh } from '@/locales/client';
import { adminEn, adminKh } from '@/locales/admin';

// 2. Define Schema (Combines keys from both)
type ClientSchema = typeof clientEn;
type AdminSchema = typeof adminEn;

// The UI interface now extends both schemas automatically
export interface MessageSchema {
  ui: ClientSchema & AdminSchema;
}

// 3. Define the dictionary
const messages = {
  en: {
    ui: {
      ...clientEn,
      ...adminEn
    }
  },
  kh: {
    ui: {
      ...clientKh,
      ...adminKh
    }
  }
};

// 4. Create i18n instance
const i18n = createI18n<{ message: MessageSchema }, 'en' | 'kh'>({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;