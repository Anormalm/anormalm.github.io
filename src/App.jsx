import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import DebugHud from './components/DebugHud';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Writings from './pages/Writings';
import CV from './pages/CV';
import Contact from './pages/Contact';
import Lab from './pages/Lab';
import GNNMARLFraud from './pages/writings/GNNMARLFraud';
import Disenchantment from './pages/writings/Disenchantment';
import Fragments from './pages/writings/Fragments';

const getAmbientMode = (hour) => {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

function AppShell() {
  const location = useLocation();
  const [ambientMode, setAmbientMode] = useState(() => getAmbientMode(new Date().getHours()));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const updateAmbientMode = () => {
      setAmbientMode(getAmbientMode(new Date().getHours()));
    };

    updateAmbientMode();
    const timer = setInterval(updateAmbientMode, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.ambient = ambientMode;
  }, [ambientMode]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/writings/GNNMARLFraud" element={<GNNMARLFraud />} />
            <Route path="/writings/Disenchantment" element={<Disenchantment />} />
            <Route path="/writings/Fragments" element={<Fragments />} />
          </Routes>
        </Motion.main>
      </AnimatePresence>
      <DebugHud ambientMode={ambientMode} />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Matches loader timeout

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[var(--paper)] text-[var(--ink)]">
      {isLoading ? (
        <Loader />
      ) : (
        <Router>
          <AppShell />
        </Router>
      )}
    </div>
  );
}

export default App;
