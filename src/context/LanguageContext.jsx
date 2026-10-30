import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested === 'en' || requested === 'zh') return requested;
    try {
      return localStorage.getItem('site-language') === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    const pageUrl = new URL(window.location.href);
    if (pageUrl.searchParams.has('lang') && pageUrl.searchParams.get('lang') !== language) {
      pageUrl.searchParams.set('lang', language);
      window.history.replaceState(window.history.state, '', pageUrl);
    }
    try {
      localStorage.setItem('site-language', language);
    } catch {
      // The language toggle still works when storage is unavailable.
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    isChinese: language === 'zh',
    setLanguage: (next) => { if (next === 'en' || next === 'zh') setLanguage(next); },
    toggleLanguage: () => setLanguage((current) => (current === 'zh' ? 'en' : 'zh')),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

// This small context intentionally exports both the provider and its hook.
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
};
