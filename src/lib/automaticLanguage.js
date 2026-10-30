import { SITE_LANGUAGES, translationUrl } from '../data/siteLanguages.js';
import { languageForCountry } from './languageSuggestion.js';

export const LANGUAGE_CHOICE_KEY = 'anormalm-language-choice';
export const AUTO_LANGUAGE_KEY = 'anormalm-auto-language';
export const TRANSLATION_VISITED_KEY = 'anormalm-translation-visited';
const COUNTRY_ENDPOINT = 'https://api.country.is/';
const supported = (code) => SITE_LANGUAGES.some((item) => item.code === code);

export const readLanguageChoice = (search, storage) => {
  const requested = new URLSearchParams(search).get('lang');
  // Translator source URLs always carry lang=en, which prevents redirect loops.
  if (supported(requested)) return requested;
  try {
    const saved = storage?.getItem(LANGUAGE_CHOICE_KEY);
    if (supported(saved)) return saved;
    // Older versions saved English even when nobody selected it. Only Chinese
    // unambiguously represents a deliberate choice in that legacy storage.
    if (storage?.getItem('site-language') === 'zh') return 'zh';
  } catch { /* Storage is optional. */ }
  return null;
};

export const createIpLanguageResolver = ({ fetcher, storage, timeoutMs = 1800 }) => {
  let pending;
  return () => {
    if (pending) return pending;
    pending = (async () => {
      try {
        const cached = storage?.getItem(AUTO_LANGUAGE_KEY);
        if (supported(cached)) return cached;
      } catch { /* Storage is optional. */ }

      const controller = new AbortController();
      let timer;
      let code = 'en';
      try {
        const lookup = async () => {
          const response = await fetcher(COUNTRY_ENDPOINT, {
            cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer',
            signal: controller.signal,
          });
          if (!response.ok) throw new Error('Country lookup unavailable');
          const payload = await response.json();
          // Retain only the chosen language. Never store the IP, city, or coordinates.
          return languageForCountry(payload?.country).code;
        };
        code = await Promise.race([
          lookup(),
          new Promise((resolve) => {
            timer = setTimeout(() => { controller.abort(); resolve('en'); }, timeoutMs);
          }),
        ]);
      } catch { /* A blocked or failed lookup leaves the site usable in English. */ }
      finally { clearTimeout(timer); }

      try { storage?.setItem(AUTO_LANGUAGE_KEY, code); } catch { /* Memory fallback. */ }
      return code;
    })();
    return pending;
  };
};

export const translationDestination = (code, pathname, storage) => {
  const target = translationUrl(code, pathname);
  if (!target) return null;
  try {
    // Let Back return to the original site instead of immediately redirecting again.
    if (storage?.getItem(TRANSLATION_VISITED_KEY)) return null;
    storage?.setItem(TRANSLATION_VISITED_KEY, code);
  } catch {
    // Without session storage, keep an English fallback URL in the history entry.
  }
  return target;
};
