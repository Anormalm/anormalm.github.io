import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Writings from './pages/Writings';
import CV from './pages/CV';
import Contact from './pages/Contact';
import GNNMARLFraud from './pages/writings/GNNMARLFraud';
import Disenchantment from './pages/writings/Disenchantment';
import Fragments from './pages/writings/Fragments';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Matches loader timeout

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      {isLoading ? (
        <Loader />
      ) : (
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/writings" element={<Writings />} />
            <Route path="/cv" element={<CV />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/writings/GNNMARLFraud" element={<GNNMARLFraud />} /> 
            <Route path="/writings/Disenchantment" element={<Disenchantment />} />
            <Route path="/writings/Fragments" element={<Fragments />} />

          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
