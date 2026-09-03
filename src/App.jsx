import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import Navbar from './components/Navbar';
import DebugHud from './components/DebugHud';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Writings from './pages/Writings';
import CV from './pages/CV';
import Contact from './pages/Contact';
import Lab from './pages/Lab';
import Node from './pages/Node';

const getAmbientMode = (hour) => {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const PAGE_TITLES = {
  '/': 'Lifan Hu | ML Systems & Research',
  '/projects': 'Projects | Lifan Hu',
  '/writings': 'Writing | Lifan Hu',
  '/lab': 'Interactive Lab | Lifan Hu',
  '/cv': 'CV | Lifan Hu',
  '/contact': 'Contact | Lifan Hu',
  '/node': 'Node | Lifan Hu',
};

const KONAMI_PATTERN = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a', 'b', 'a'];

function AppShell() {
  const location = useLocation();
  const [ambientMode, setAmbientMode] = useState(() => getAmbientMode(new Date().getHours()));
  const [overclockMode, setOverclockMode] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    document.title = PAGE_TITLES[location.pathname] ?? 'Lifan Hu | ML Systems & Research';
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
      <Navbar />
      <AnimatePresence mode="wait">
        <Motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/node" element={<Node />} />
            <Route path="/writings/*" element={<Navigate to="/writings" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Motion.main>
      </AnimatePresence>
      <DebugHud ambientMode={ambientMode} />
    </>
  );
}

function App() {
  return (
    <div className="app-shell min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-500">
      <Router>
        <AppShell />
      </Router>
    </div>
  );
}

export default App;
