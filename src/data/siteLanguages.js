// All locales are stored with the website. Names retain their native scripts.
const LOCALES = { en: 'en-US', zh: 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', de: 'de-DE', es: 'es-ES', pt: 'pt-PT', it: 'it-IT', nl: 'nl-NL', sv: 'sv-SE', no: 'nb-NO', fi: 'fi-FI', pl: 'pl-PL', cs: 'cs-CZ', hu: 'hu-HU', ro: 'ro-RO', el: 'el-GR', tr: 'tr-TR', uk: 'uk-UA', ru: 'ru-RU', ar: 'ar-SA', he: 'he-IL', fa: 'fa-IR', hi: 'hi-IN', bn: 'bn-BD', ta: 'ta-IN', th: 'th-TH', vi: 'vi-VN', id: 'id-ID', ms: 'ms-MY' };
export const SITE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', local: true },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', local: true },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', direction: 'rtl' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', direction: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
].map((item) => ({ ...item, local: true, locale: LOCALES[item.code] }));

export const normalizeLanguageCode = (value) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replaceAll('_', '-').toLowerCase();
  const exact = SITE_LANGUAGES.find((item) => item.code.toLowerCase() === normalized || item.locale.toLowerCase() === normalized);
  if (exact) return exact.code;
  if (/^zh-(?:hant|tw|hk|mo)(?:-|$)/.test(normalized)) return 'zh-TW';
  if (/^zh-(?:hans|cn|sg)(?:-|$)/.test(normalized)) return 'zh';
  const base = normalized.split('-')[0];
  if (base === 'nb' || base === 'nn') return 'no';
  return SITE_LANGUAGES.find((item) => item.code === base)?.code || null;
};
