import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SITE_LANGUAGES } from '../data/siteLanguages';
import { createIpLanguageResolver, LANGUAGE_CHOICE_KEY, readLanguageChoice, TRANSLATION_VISITED_KEY, translationDestination } from '../lib/automaticLanguage';

const LanguageContext = createContext(null);
const storage = (name) => {
  try { return window[name]; } catch { return null; }
};
let resolveIpLanguage;
const detectLanguage = () => {
  // Share an in-flight lookup across React Strict Mode's effect remount.
  resolveIpLanguage ||= createIpLanguageResolver({ fetcher: window.fetch.bind(window), storage: storage('sessionStorage') });
  return resolveIpLanguage();
};

export const LanguageProvider = ({ children }) => {
  const [initialChoice] = useState(() => readLanguageChoice(window.location.search, storage('localStorage')));
  const [language, setCurrentLanguage] = useState(initialChoice === 'zh' ? 'zh' : 'en');
  const manualChoice = useRef(initialChoice);
  const choosingLanguage = useRef(false);

  const setLanguage = useCallback((next) => {
    const option = SITE_LANGUAGES.find((item) => item.code === next);
    if (!option) return;
    manualChoice.current = next;
    try {
      storage('localStorage')?.setItem(LANGUAGE_CHOICE_KEY, next);
      storage('localStorage')?.removeItem('site-language');
      if (!option.local) storage('sessionStorage')?.setItem(TRANSLATION_VISITED_KEY, next);
    } catch { /* Manual selection still works without storage. */ }
    if (option.local) setCurrentLanguage(next);
  }, []);

  useEffect(() => {
    let active = true;
    const pauseWhileChoosing = () => { choosingLanguage.current = true; };
    window.addEventListener('anormalm:languages', pauseWhileChoosing);

    // Google translates the English source itself. Never run another redirect
    // from inside its translated copy, even if it rewrites our query string.
    if (!window.location.hostname.endsWith('.translate.goog')) {
      Promise.resolve(initialChoice || detectLanguage()).then((code) => {
        if (!active || choosingLanguage.current || manualChoice.current !== initialChoice) return;
        if (code === 'en' || code === 'zh') {
          setCurrentLanguage(code);
          return;
        }
        const target = translationDestination(code, window.location.pathname + window.location.hash, storage('sessionStorage'));
        if (!target) return;
        // Back must work even in browsers that block session storage.
        const fallback = new URL(window.location.href);
        fallback.searchParams.set('lang', 'en');
        window.history.replaceState(window.history.state, '', fallback);
        window.location.assign(target);
      });
    }

    return () => {
      active = false;
      window.removeEventListener('anormalm:languages', pauseWhileChoosing);
    };
  }, [initialChoice]);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    const pageUrl = new URL(window.location.href);
    if (pageUrl.searchParams.has('lang') && pageUrl.searchParams.get('lang') !== language) {
      pageUrl.searchParams.set('lang', language);
      window.history.replaceState(window.history.state, '', pageUrl);
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    isChinese: language === 'zh',
    setLanguage,
    toggleLanguage: () => setLanguage(language === 'zh' ? 'en' : 'zh'),
  }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// This small context intentionally exports both the provider and its hook.
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
