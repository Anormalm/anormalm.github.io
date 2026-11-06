import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import AmbientField from './components/AmbientField';
import DebugHud from './components/DebugHud';
import SignalCursor from './components/SignalCursor';
import RouteSignal from './components/RouteSignal';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';
import PageMetadata from './components/PageMetadata';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { recordVisitorSignal } from './lib/visitorSignals';
import { normalizePath, pageForPath } from './data/pages';

const Projects = lazy(() => import('./pages/Projects'));
const Writings = lazy(() => import('./pages/Writings'));
const CV = lazy(() => import('./pages/CV'));
const Contact = lazy(() => import('./pages/Contact'));
const Lab = lazy(() => import('./pages/Lab'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Node = lazy(() => import('./pages/Node'));
const Visitors = lazy(() => import('./pages/Visitors'));
const NotFound = lazy(() => import('./pages/NotFound'));

const getAmbientMode = (hour) => {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const KONAMI_PATTERN = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a', 'b', 'a'];

function AppShell() {
  const location = useLocation();
  const { isChinese, locale, languageReady, t } = useLanguage();
  const navigate = useNavigate();
  const [ambientMode, setAmbientMode] = useState(() => getAmbientMode(new Date().getHours()));
  const [overclockMode, setOverclockMode] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.22 });

  useEffect(() => {
    recordVisitorSignal();
  }, [location.pathname]);

  useEffect(() => {
    const path = normalizePath(location.pathname);
    const parameters = new URLSearchParams(location.search);
    let changed = path !== location.pathname;
    if (languageReady && parameters.get('lang') !== locale) {
      parameters.set('lang', locale);
      changed = true;
    }
    if (changed) navigate({ pathname: path, search: parameters.toString(), hash: location.hash }, { replace: true });
  }, [locale, languageReady, location.pathname, location.search, location.hash, navigate]);

  useEffect(() => {
    setAmbientMode(getAmbientMode(new Date().getHours()));
    const timer = setInterval(() => {
      setAmbientMode(getAmbientMode(new Date().getHours()));
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.ambient = ambientMode;
  }, [ambientMode]);

  useEffect(() => {
    document.documentElement.dataset.overclock = overclockMode ? 'on' : 'off';
  }, [overclockMode]);

  useEffect(() => {
    document.documentElement.dataset.glitch = glitchMode ? 'on' : 'off';
  }, [glitchMode]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [location.pathname, reduceMotion]);

  useEffect(() => {
    const buffer = [];
    const normalize = (key) => {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey === 'arrowup') return 'up';
      if (normalizedKey === 'arrowdown') return 'down';
      if (normalizedKey === 'arrowleft') return 'left';
      if (normalizedKey === 'arrowright') return 'right';
      if (normalizedKey === 'a' || normalizedKey === 'b') return normalizedKey;
      return '';
    };

    const onKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'g') {
        setGlitchMode((previous) => !previous);
        return;
      }

      const token = normalize(event.key);
      if (!token) return;

      buffer.push(token);
      if (buffer.length > KONAMI_PATTERN.length) buffer.shift();
      if (buffer.join('|') === KONAMI_PATTERN.join('|')) {
        setOverclockMode((previous) => !previous);
        buffer.length = 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <PageMetadata />
      <AmbientField />
      <Motion.div className="scroll-progress" style={{ scaleX: progressScale }} aria-hidden="true" />
      <Navbar />
      <RouteSignal key={`route-signal-${location.pathname}`} pathname={location.pathname} />
      <AnimatePresence mode="wait">
        <Motion.main
          key={location.pathname}
          className="route-stage"
          initial={false}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -18, filter: reduceMotion ? 'none' : 'blur(6px)' }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="section" aria-busy="true"><p>{t(isChinese ? pageForPath(location.pathname).titleZh : pageForPath(location.pathname).title)}</p></div>}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/writings" element={<Writings />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/node" element={<Node />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/writings/*" element={<Navigate to="/writings" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Motion.main>
      </AnimatePresence>
      <CommandPalette onToggleGlitch={() => setGlitchMode((previous) => !previous)} />
      <SignalCursor />
      <DebugHud ambientMode={ambientMode} />
    </>
  );
}

function App() {
  return (
    <div className="app-shell min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-500">
      <LanguageProvider>
        <Router>
          <AppShell />
        </Router>
      </LanguageProvider>
    </div>
  );
}

export default App;
