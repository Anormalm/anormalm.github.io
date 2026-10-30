import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SITE_LANGUAGES, normalizeLanguageCode } from '../data/siteLanguages';
import { createIpLanguageResolver, LANGUAGE_CHOICE_KEY, readLanguageChoice } from '../lib/automaticLanguage';
import { loadLocale } from '../i18n/localeLoader';
import { activateLocale, translate } from '../i18n/translator';

const LanguageContext = createContext(null);
const storage = (name) => { try { return window[name]; } catch { return null; } };
let resolveIpLanguage;
const detectLanguage = () => {
  resolveIpLanguage ||= createIpLanguageResolver({ fetcher: window.fetch.bind(window), storage: storage('sessionStorage') });
  return resolveIpLanguage();
};

export const LanguageProvider = ({ children }) => {
  const [initialChoice] = useState(() => readLanguageChoice(window.location.search, storage('localStorage')));
  const [language, setCurrentLanguage] = useState('en');
  const [languageReady, setLanguageReady] = useState(false);
  const [languageLoading, setLanguageLoading] = useState(false);
  const [languageError, setLanguageError] = useState(false);
  const manualChoice = useRef(initialChoice);
  const choosingLanguage = useRef(false);
  const request = useRef(0);

  const applyLanguage = useCallback(async (next, manual = false) => {
    const code = normalizeLanguageCode(next);
    if (!code) return false;
    const currentRequest = ++request.current;
    if (manual) {
      manualChoice.current = code;
      try {
        storage('localStorage')?.setItem(LANGUAGE_CHOICE_KEY, code);
        storage('localStorage')?.removeItem('site-language');
      } catch { /* Selection works without storage. */ }
    }
    setLanguageLoading(true);
    setLanguageError(false);
    try {
      const pack = await loadLocale(code);
      if (currentRequest !== request.current) return false;
      activateLocale(code, pack);
      setCurrentLanguage(code);
      setLanguageReady(true);
      setLanguageLoading(false);
      return true;
    } catch {
      if (currentRequest === request.current) {
        setLanguageReady(true);
        setLanguageLoading(false);
        setLanguageError(true);
      }
      return false;
    }
  }, []);
  const setLanguage = useCallback((next) => applyLanguage(next, true), [applyLanguage]);

  useEffect(() => {
    let active = true;
    const pauseWhileChoosing = () => {
      choosingLanguage.current = true;
      request.current += 1;
      setLanguageLoading(false);
      setLanguageReady(true);
    };
    const readHistory = () => {
      const requested = normalizeLanguageCode(new URLSearchParams(window.location.search).get('lang'));
      if (requested) setLanguage(requested);
    };
    window.addEventListener('anormalm:languages', pauseWhileChoosing);
    window.addEventListener('popstate', readHistory);
    Promise.resolve(initialChoice || detectLanguage()).then((code) => {
      if (active && !choosingLanguage.current && manualChoice.current === initialChoice) applyLanguage(code);
    });
    return () => {
      active = false;
      window.removeEventListener('anormalm:languages', pauseWhileChoosing);
      window.removeEventListener('popstate', readHistory);
    };
  }, [initialChoice, applyLanguage, setLanguage]);

  const option = SITE_LANGUAGES.find((item) => item.code === language) || SITE_LANGUAGES[0];
  useEffect(() => {
    document.documentElement.lang = option.locale;
    document.documentElement.dir = option.direction || 'ltr';
    if (!languageReady) return;
    const page = new URL(window.location.href);
    page.searchParams.set('lang', option.locale);
    window.history.replaceState(window.history.state, '', page);
  }, [option, languageReady]);

  const value = useMemo(() => ({
    language, locale: option.locale, isChinese: language === 'zh',
    isMultilingual: language !== 'en' && language !== 'zh',
    languageLoading, languageError, languageReady, setLanguage, t: translate,
    toggleLanguage: () => setLanguage(language === 'zh' ? 'en' : 'zh'),
  }), [language, option.locale, languageLoading, languageError, languageReady, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
