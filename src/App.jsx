import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import AmbientField from './components/AmbientField';
import DebugHud from './components/DebugHud';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Writings from './pages/Writings';
import CV from './pages/CV';
import Contact from './pages/Contact';
import Lab from './pages/Lab';
import Privacy from './pages/Privacy';
import Node from './pages/Node';
import GNNMARLFraud from './pages/writings/GNNMARLFraud';
import Disenchantment from './pages/writings/Disenchantment';
import Fragments from './pages/writings/Fragments';

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
  '/privacy': 'Privacy | Lifan Hu',
  '/node': 'Node | Lifan Hu',
};

const KONAMI_PATTERN = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a', 'b', 'a'];

function AppShell() {
  const location = useLocation();
  const [ambientMode, setAmbientMode] = useState(() => getAmbientMode(new Date().getHours()));
  const [overclockMode, setOverclockMode] = useState(false);
  const [glitchMode, setGlitchMode] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.22 });

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
      <AmbientField />
      <Motion.div className="scroll-progress" style={{ scaleX: progressScale }} aria-hidden="true" />
      <Navbar />
      <AnimatePresence mode="wait">
        <Motion.main
          key={location.pathname}
          className="route-stage"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24, filter: reduceMotion ? 'none' : 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -18, filter: reduceMotion ? 'none' : 'blur(6px)' }}
          transition={{ duration: reduceMotion ? 0.01 : 0.52, ease: [0.22, 1, 0.36, 1] }}
        >
          <Motion.div
            className="route-curtain"
            initial={{ scaleY: reduceMotion ? 0 : 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.62, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/node" element={<Node />} />
            <Route path="/writings/GNNMARLFraud" element={<GNNMARLFraud />} />
            <Route path="/writings/Disenchantment" element={<Disenchantment />} />
            <Route path="/writings/Fragments" element={<Fragments />} />
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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="app-shell min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-500">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="site-loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <Motion.div key="site" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <Router>
              <AppShell />
            </Router>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
