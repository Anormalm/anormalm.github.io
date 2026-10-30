// Language names are written in their own scripts. en/zh are authored on this site;
// other entries use Google's website translator, including IP-based selection.
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
];

export const translationUrl = (code, pathname = '/') => {
  const language = SITE_LANGUAGES.find((item) => item.code === code && !item.local);
  if (!language) return null;
  const path = pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/';
  const source = new URL('https://anormalm.com/translate/');
  const page = new URL(path, source);
  if (page.origin !== source.origin) return null;
  // Share only the public route and anchor, never arbitrary query parameters.
  page.search = '?lang=en';
  // The translation entry supports Google's proxy while the original pages
  // retain their stricter policy. A real index also avoids deep-link 404s.
  source.searchParams.set('redirect', `${page.pathname}${page.search}${page.hash}`);
  const target = new URL('https://translate.google.com/translate');
  target.searchParams.set('sl', 'en');
  target.searchParams.set('tl', code);
  target.searchParams.set('u', source.href);
  return target.href;
};
