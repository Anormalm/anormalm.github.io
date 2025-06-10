import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 space-y-10"
    >
      {/* Hero Section */}
      <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight leading-snug drop-shadow">
        Hello, I’m <span className="text-indigo-600 dark:text-indigo-400">Anormalm</span>
      </h1>

      {/* Typing Effect Tagline */}
      <p className="text-lg md:text-xl font-light text-gray-700 dark:text-gray-300 max-w-2xl mb-4">
        <Typewriter
          words={[
            'A developer.',
            'A writer.',
            'A digital guy.',
            'A creative technologist.',
          ]}
          loop={true}
          cursor
          cursorStyle="|"
          typeSpeed={60}
          deleteSpeed={40}
          delaySpeed={2000}
        />
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        <Link
          to="/projects"
          className="px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all font-medium shadow-lg hover:scale-105"
        >
          View My Projects
        </Link>
        <Link
          to="/cv"
          className="px-6 py-3 rounded-full border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:text-white dark:hover:bg-indigo-500 transition-all font-medium shadow-lg hover:scale-105"
        >
          See My CV
        </Link>
      </div>

      {/* About Me */}
      <div className="max-w-2xl text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed italic px-4">
        <p>
          I’m passionate about building meaningful experiences — from software tools to poetic
          reflections. My work often intersects technology, design, and culture. This space is where
          I document what I create and explore. Welcome to my digital canvas.
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="flex gap-6 text-2xl mb-4">
        <a
          href="https://github.com/anormalm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:scale-110"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/lifan-hu-46728b324"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:scale-110"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://twitter.com/YOURUSERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:scale-110"
        >
          <FaTwitter />
        </a>
      </div>

      {/* Skills */}
      <div className="max-w-4xl w-full px-4 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">🔧 Skills</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-gray-700 dark:text-gray-300 text-sm">
          {[
            'React', 'Tailwind CSS', 'C,C++', 'Python',
            'Node.js', 'Git/GitHub', 'Writing / Essays', 'Creative Coding',
          ].map((skill, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md hover:shadow-xl hover:ring-1 hover:ring-indigo-500 dark:hover:ring-indigo-400 transition-all text-center"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Now Playing on Spotify (Static) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all mb-10 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">🎧 Now Playing on Spotify</h3>
        <div className="flex items-center gap-4">
          <img
            src="https://images.universal-music.de/img/assets/989/98923/4/2048/martha-argerich-debut-recital-0028944743021.jpg"
            alt="Album cover"
            className="w-16 h-16 rounded-md shadow"
          />
          <div className="text-left">
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              “Jeux D'eau, M.30” – Maurice Ravel, Martha Argerich
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Album: Debut Recital</p>
            <a
              href="https://open.spotify.com/track/4KVNTMSfvvkJMMSK8ExJc3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
            >
              Listen on Spotify →
            </a>
          </div>
        </div>
      </div>

      {/* Quote */}
      <blockquote className="italic text-gray-500 dark:text-gray-400 max-w-xl text-base md:text-lg px-4 border-l-4 border-indigo-300 dark:border-indigo-500 pl-4">
        "We write code as we write poetry — one line at a time, toward something beautiful."
      </blockquote>
    </motion.div>

    
  );
};

export default Home;
