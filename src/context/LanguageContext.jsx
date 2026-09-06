import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('site-language') === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    try {
      localStorage.setItem('site-language', language);
    } catch {
      // The language toggle still works when storage is unavailable.
    }
  }, [language]);

  const value = useMemo(() => ({
    language,
    isChinese: language === 'zh',
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
