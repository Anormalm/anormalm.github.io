import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const navClassName = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <nav className="site-nav sticky top-0 z-40 border-b border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 md:px-10">
        <Link to="/" className="group flex items-center gap-3" aria-label="Lifan Hu home">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark-core" />
          </div>
          <div>
            <div className="font-display text-base font-semibold tracking-tight md:text-lg">Lifan Hu</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--muted)] md:text-[10px]">
              ML Systems · Research
            </div>
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
          {NAV_ITEMS.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === '/'} className={navClassName}>
              {label}
            </NavLink>
          ))}
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

      {menuOpen && (
        <div className="border-t border-[var(--line)] px-5 pb-5 pt-3 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={() => setMenuOpen(false)}
                className={navClassName}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
