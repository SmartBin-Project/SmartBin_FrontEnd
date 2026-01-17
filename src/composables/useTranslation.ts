import { useI18n } from 'vue-i18n';
import type { LocalizedString } from '@/types/bin';

export function useTranslation() {
  // 1. Get the current locale from vue-i18n
  const { locale } = useI18n();

  // 2. Define the helper with Types
  // We accept 'LocalizedString' or 'string' (legacy support)
  const translateDB = (data: LocalizedString | string | undefined): string => {
    if (!data) return '';

    // If data is just a simple string (legacy data), return it as-is
    if (typeof data === 'string') return data;

    // Check if the current locale exists in the object (e.g., data['kh'])
    // 'as keyof LocalizedString' tells TS that 'locale.value' is a valid key
    const currentLangKey = locale.value as keyof LocalizedString;

    return data[currentLangKey] || data.en || 'N/A';
  };

  return { translateDB, locale };
}