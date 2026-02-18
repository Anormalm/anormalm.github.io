import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setDarkMode(stored === 'dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full border border-[var(--line)] bg-aurora">
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>
          <div>
            <div className="font-display text-lg tracking-tight">Anormalm</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
              Personal Node
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full border border-[var(--line)] px-3 py-2 text-xs uppercase tracking-[0.2em]"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full border border-[var(--line)] px-3 py-2 text-xs uppercase tracking-[0.2em]"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        <ul className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] md:flex">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/writings">Writings</Link></li>
          <li><Link to="/lab">Lab</Link></li>
          <li><Link to="/cv">CV</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full border border-[var(--line)] px-3 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </li>
        </ul>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--line)] px-6 pb-6 pt-4 md:hidden">
          <div className="grid gap-3 text-sm font-semibold uppercase tracking-[0.2em]">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
            <Link to="/writings" onClick={() => setMenuOpen(false)}>Writings</Link>
            <Link to="/lab" onClick={() => setMenuOpen(false)}>Lab</Link>
            <Link to="/cv" onClick={() => setMenuOpen(false)}>CV</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
