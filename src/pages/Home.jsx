import { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import { FiArrowDown, FiArrowUpRight, FiFileText, FiMail, FiMapPin } from 'react-icons/fi';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolio';

const FEATURED_PROJECTS = projects.filter((project) => project.featured);

const PRINCIPLES = [
  {
    verb: 'Make',
    title: 'Build the whole loop',
    detail: 'Research gets interesting when the model, interface, and measurement path all work together.',
  },
  {
    verb: 'Test',
    title: 'Claims need evidence',
    detail: 'I care about reproducible evaluation, honest boundaries, and finding out why a system works.',
  },
  {
    verb: 'Wander',
    title: 'Keep strange ideas alive',
    detail: 'The useful route is not always the obvious one. I leave room for puzzles, experiments, and detours.',
  },
];

const SOCIALS = [
  ['GitHub', 'https://github.com/Anormalm', <FaGithub key="github" />],
  ['LinkedIn', 'https://www.linkedin.com/in/anormalm/', <FaLinkedin key="linkedin" />],
  ['Medium', 'https://medium.com/@hulifan55555', <FaMedium key="medium" />],
];

const Home = () => {
  const heroRef = useRef(null);
  const [ghostMode, setGhostMode] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 28]);

  const [typedText] = useTypewriter({
    words: [
      'graph-grounded language models',
      'adaptive graph evidence',
      'edge multimodal inference',
      'distributed ML systems',
    ],
    loop: 0,
    typeSpeed: 52,
    deleteSpeed: 28,
    delaySpeed: 1450,
  });
  const [ghostTypedText] = useTypewriter({
    words: [
      'tracing hidden routes in distributed memory',
      'recovering signals from digital ruins',
      'stitching runtime fragments into coherent systems',
      'listening for state changes in the noise floor',
    ],
    loop: 0,
    typeSpeed: 40,
    deleteSpeed: 25,
    delaySpeed: 1250,
  });

  useEffect(() => {
    if (!ghostMode) return undefined;
    const timer = window.setTimeout(() => setGhostMode(false), 20_000);
    return () => window.clearTimeout(timer);
  }, [ghostMode]);

  const toggleGhostMode = () => setGhostMode((previous) => !previous);

  return (
    <div className="home-page">
      <section ref={heroRef} className={`kinetic-hero ${ghostMode ? 'ghost-mode' : ''}`}>
        <div className="hero-coordinate hero-coordinate-left" aria-hidden="true">01 / 06</div>
        <div className="hero-coordinate hero-coordinate-right" aria-hidden="true">SCROLL TO EXPLORE</div>

        <Motion.div className="hero-copy" style={reduceMotion ? undefined : { y: copyY }}>
          <Motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="hero-kicker"
          >
            <span className="live-dot" /> ML engineer · researcher · builder
          </Motion.div>

          <h1 className="kinetic-title" aria-label="I build systems that think and move">
            <Motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              I build
            </Motion.span>
            <Motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.16, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="kinetic-title-offset"
            >
              systems that
            </Motion.span>
            <Motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.24, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="kinetic-title-accent"
            >
              think <i>&amp;</i> move.
            </Motion.span>
          </h1>

          <div className="hero-bottom-grid">
            <p className="hero-intro">
              I’m Lifan Hu—a Computer Engineering student at NUS, Machine Learning Engineer Intern at TikTok,
              and Research Assistant exploring graph intelligence, language models, and edge AI.
            </p>

            <div>
              <button
                type="button"
                onDoubleClick={toggleGhostMode}
                onClick={(event) => {
                  if (event.detail === 0) toggleGhostMode();
                }}
                aria-pressed={ghostMode}
                className="signal-line"
                title="Double-click to unlock ghost typing"
              >
                <span>{ghostMode ? 'Ghost channel' : 'Current signal'}</span>
                <strong>{ghostMode ? ghostTypedText : typedText}</strong>
                <Cursor cursorStyle="_" cursorColor="var(--accent-warm)" />
              </button>
              <div className="hero-actions">
                <Link to="/projects" className="button-primary">
                  Explore work <FiArrowUpRight />
                </Link>
                <Link to="/cv" className="button-secondary">
                  View CV <FiFileText />
                </Link>
                <Link to="/lab" className="hero-lab-link">
                  Enter the lab <FiArrowUpRight />
                </Link>
              </div>
            </div>
          </div>
        </Motion.div>

        <Motion.aside
          className="signal-world"
          style={reduceMotion ? undefined : { y: orbitY, rotate: orbitRotate }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.32, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Interactive signal map"
        >
          <span className="signal-ring signal-ring-a"><i /></span>
          <span className="signal-ring signal-ring-b"><i /></span>
          <span className="signal-ring signal-ring-c"><i /></span>
          <button type="button" className="signal-core" onClick={toggleGhostMode} aria-label="Toggle ghost signal">
            <span>LH</span>
            <small>{ghostMode ? 'GHOST' : 'ONLINE'}</small>
          </button>
          <span className="signal-label signal-label-a">GRAPH</span>
          <span className="signal-label signal-label-b">LANGUAGE</span>
          <span className="signal-label signal-label-c">SYSTEMS</span>
        </Motion.aside>

        <a href="#selected-work" className="scroll-cue" aria-label="Scroll to selected work">
          <span>Down</span><FiArrowDown />
        </a>
      </section>

      <Marquee />

      <section id="selected-work" className="section editorial-section">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-heading"
        >
          <div className="eyebrow">Selected signals / 2026</div>
          <h2 className="display-heading">Ideas made<br /><em>testable.</em></h2>
          <div className="editorial-aside">
            <p>Research, experiments, and working systems—built far enough to expose what is actually true.</p>
            <Link to="/projects" className="link-arrow">See the full index <FiArrowUpRight /></Link>
          </div>
        </Motion.div>

        <div className="featured-grid">
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </section>

      <section className="manifesto-section">
        <div className="section manifesto-inner">
          <div className="eyebrow">Personal operating system</div>
          <Motion.h2
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="manifesto-quote"
          >
            “I build and code<br />whenever I want to.”
          </Motion.h2>

          <div className="principle-list">
            {PRINCIPLES.map((principle, index) => (
              <Motion.article
                key={principle.title}
                initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="principle-row"
              >
                <span className="principle-index">0{index + 1}</span>
                <strong>{principle.verb}</strong>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.detail}</p>
                </div>
              </Motion.article>
            ))}
          </div>

          <div className="now-playing">
            <span className="playing-bars" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>Non-tech signal</span>
            <strong>Gaspard de la Nuit · Maurice Ravel</strong>
          </div>
        </div>
      </section>

      <section className="section contact-stage">
        <div className="contact-stage-copy">
          <div className="eyebrow">Open channel</div>
          <h2>Let’s make<br /><span>something strange.</span></h2>
          <p>Research ideas, intelligent systems, ambitious prototypes—or a problem that refuses to fit neatly.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/contact" className="button-primary">Start a conversation <FiMail /></Link>
            <div className="location-pill"><FiMapPin /> Singapore</div>
          </div>
        </div>

        <div className="contact-orbit" aria-hidden="true">
          <span className="contact-orbit-text">OPEN TO COLLABORATION · OPEN TO IDEAS · </span>
          <span className="contact-orbit-core">+</span>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-name">LIFAN<br />HU</div>
        <div className="site-footer-meta">
          <div>© 2026 · Built by Anormalm</div>
          <div className="footer-socials">
            {SOCIALS.map(([label, href, icon]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>{icon}</a>
            ))}
          </div>
          <a href="mailto:lifan.hu@u.nus.edu">lifan.hu@u.nus.edu <FiArrowUpRight /></a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
