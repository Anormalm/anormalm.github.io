import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';

const NAV_ITEMS = [
  ['Home', '/'],
  ['Projects', '/projects'],
  ['Writing', '/writings'],
  ['Lab', '/lab'],
  ['CV', '/cv'],
  ['Contact', '/contact'],
];

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    return true;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <nav className="site-nav sticky top-0 z-50 border-b border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-3.5 md:px-10 xl:px-14">
        <Link to="/" className="group navbar-mark-only" aria-label="Lifan Hu home">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark-core" />
          </div>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
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
          {NAV_ITEMS.map(([label, path], index) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path} className={`nav-link ${isActive ? 'nav-link-active' : ''}`}>
                <span className="nav-index">0{index + 1}</span>
                {label}
                {isActive && <Motion.span layoutId="active-nav" className="nav-active-line" />}
              </Link>
            );
          })}
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
              {NAV_ITEMS.map(([label, path], index) => {
                const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                  >
                    <span>0{index + 1}</span>
                    {label}
                  </Link>
                );
              })}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
