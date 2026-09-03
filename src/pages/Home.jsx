import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import { FiArrowUpRight, FiFileText, FiMail, FiMapPin } from 'react-icons/fi';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolio';

const FEATURED_PROJECTS = projects.filter((project) => project.featured);

const PRINCIPLES = [
  {
    title: 'Curiosity first',
    detail: 'I follow unusual questions across machine learning, mathematics, systems, and human behavior.',
  },
  {
    title: 'Claims need evidence',
    detail: 'I care about reproducible evaluation, honest boundaries, and understanding why a system works.',
  },
  {
    title: 'Build the whole loop',
    detail: 'Research becomes more useful when the prototype, interface, and measurement path work together.',
  },
];

const Home = () => {
  const [typedText] = useTypewriter({
    words: ['LLM evaluation', 'agentic systems', 'graph reasoning', 'human-centered AI'],
    loop: 0,
    typeSpeed: 54,
    deleteSpeed: 28,
    delaySpeed: 1500,
  });

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="bg-grid"
    >
      <section className="section">
        <div className="hero-panel relative overflow-hidden rounded-[30px] border border-[var(--line)] p-7 md:p-12">
          <div className="absolute inset-0 bg-tech-grid opacity-70" />
          <div className="absolute inset-0 bg-tech opacity-80" />

          <div className="relative z-10 grid items-start gap-9 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
            <div>
              <div className="eyebrow">Research · Engineering · Writing</div>
              <h1 className="font-display mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl lg:text-[4.25rem]">
                I build intelligent systems that <span className="text-gradient">reason, remember, and act.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                I’m Lifan Hu, a Computer Engineering student and Research Assistant at NUS. My work spans
                machine learning systems, agentic AI, evaluation, graph reasoning, and practical interfaces.
              </p>

              <div className="font-mono mt-5 min-h-6 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Current signal: <span className="text-[var(--accent)]">{typedText}</span>
                <Cursor cursorStyle="_" cursorColor="var(--accent)" />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/projects" className="button-primary">
                  Explore projects <FiArrowUpRight />
                </Link>
                <Link to="/cv" className="button-secondary">
                  View CV <FiFileText />
                </Link>
              </div>
            </div>

            <aside className="tech-panel scanline rounded-3xl p-6" aria-label="Profile snapshot">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                Profile snapshot
              </div>
              <div className="mt-5 space-y-4">
                <div className="profile-row">
                  <span>Now</span>
                  <strong>Research Assistant · NUS</strong>
                </div>
                <div className="profile-row">
                  <span>Previously</span>
                  <strong>ML Engineering Intern · TikTok</strong>
                </div>
                <div className="profile-row">
                  <span>Focus</span>
                  <strong>Evaluation + AI systems</strong>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
                <FiMapPin className="text-[var(--accent)]" /> Singapore
              </div>

              <div className="mt-5 flex items-center gap-3">
                <a className="social-link" href="https://github.com/Anormalm" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <FaGithub />
                </a>
                <a className="social-link" href="https://www.linkedin.com/in/anormalm/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a className="social-link" href="https://medium.com/@hulifan55555" target="_blank" rel="noreferrer" aria-label="Medium">
                  <FaMedium />
                </a>
                <a className="social-link" href="mailto:lifan.hu@u.nus.edu" aria-label="Email">
                  <FiMail />
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section pt-2">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Selected work</div>
            <h2 className="font-display mt-3 text-3xl md:text-4xl">Current research and builds</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              A few active threads across language-model evaluation, agent behavior, and adaptive reasoning.
            </p>
          </div>
          <Link to="/projects" className="button-secondary">
            All projects <FiArrowUpRight />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section className="section pt-2">
        <div className="tech-panel rounded-3xl p-7 md:p-9">
          <div className="eyebrow">Working principles</div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <div key={principle.title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
                  0{index + 1}
                </div>
                <h3 className="font-display mt-3 text-xl">{principle.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{principle.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-2">
        <div className="tech-panel flex flex-wrap items-center justify-between gap-6 rounded-3xl p-7 md:p-9">
          <div>
            <div className="eyebrow">Open channel</div>
            <h2 className="font-display mt-3 text-3xl">Research ideas, systems, or something stranger?</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">I’m always glad to meet thoughtful collaborators.</p>
          </div>
          <Link to="/contact" className="button-primary">
            Get in touch <FiMail />
          </Link>
        </div>
      </section>

      <footer className="section pt-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-7 text-sm text-[var(--muted)]">
          <div>© 2026 Lifan Hu</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em]">Last updated Sep 2026</div>
        </div>
      </footer>
    </Motion.div>
  );
};

export default Home;
