import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FiGlobe, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import LanguagePicker from './LanguagePicker';
import { useLanguage } from '../context/LanguageContext';

const NAV_ITEMS = [
  ['Home', '首页', '/'],
  ['Projects', '项目', '/projects'],
  ['Writing', '文章', '/writings'],
  ['Lab', '实验室', '/lab'],
  ['CV', '履历', '/cv'],
  ['Contact', '联系', '/contact'],
];

const Navbar = () => {
  const location = useLocation();
  const { isChinese, language, t } = useLanguage();
  const languageLabel = isChinese ? '中文' : language === 'zh-TW' ? '繁中' : language.toUpperCase();
  const openLanguages = () => window.dispatchEvent(new Event('anormalm:languages'));
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') !== 'light';
    } catch {
      return true;
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    } catch {
      // The visual theme still works when storage is unavailable.
    }
  }, [darkMode]);

  return (
    <nav className="site-nav sticky top-0 z-50 border-b border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-3.5 md:px-10 xl:px-14">
        <Link
          to="/"
          className="group navbar-mark-only"
          aria-label={isChinese ? '胡立凡首页' : 'Lifan Hu home'}
          title={isChinese ? '按 / 打开命令面板' : t('Press / for commands')}
        >
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark-core" />
          </div>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={openLanguages} className="language-toggle" aria-haspopup="dialog" aria-label={isChinese ? '选择语言' : 'Choose a language'}>
            <FiGlobe aria-hidden="true" /> <span translate="no">{languageLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            className="icon-button"
            aria-label={darkMode ? 'Use light theme' : 'Use dark theme'}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="icon-button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(([label, labelZh, path], index) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path} className={`nav-link ${isActive ? 'nav-link-active' : ''}`}>
                <span className="nav-index">0{index + 1}</span>
                {isChinese ? labelZh : label}
                {isActive && <Motion.span layoutId="active-nav" className="nav-active-line" />}
              </Link>
            );
          })}
          <button type="button" onClick={openLanguages} className="language-toggle ml-2" aria-haspopup="dialog" aria-label={isChinese ? '选择语言' : 'Choose a language'}>
            <FiGlobe aria-hidden="true" /> <span translate="no">{languageLabel}</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            className="icon-button ml-2"
            aria-label={darkMode ? 'Use light theme' : 'Use dark theme'}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-nav-wrap md:hidden"
          >
            <div className="grid grid-cols-2 gap-2 px-5 pb-6 pt-4">
              {NAV_ITEMS.map(([label, labelZh, path], index) => {
                const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                  >
                    <span>0{index + 1}</span>
                    {isChinese ? labelZh : label}
                  </Link>
                );
              })}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
      <LanguagePicker />
    </nav>
  );
};

export default Navbar;
