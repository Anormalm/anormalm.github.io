import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center transition-colors duration-500">
      <div className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
        Anormalm
      </div>
      <ul className="flex gap-6 text-gray-700 dark:text-gray-200 font-medium text-base items-center">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/writings">Writings</Link></li>
        <li><Link to="/cv">CV</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {darkMode ? '☀ Light' : '🌙 Dark'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
