import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';
import { Cursor, useTypewriter } from 'react-simple-typewriter';

const FEATURED_WORK = [
  {
    title: 'GNN + MARL Fraud Detection',
    type: 'Research',
    summary: 'Graph learning and multi-agent reinforcement learning for adaptive DeFi fraud detection.',
    link: '/writings/GNNMARLFraud',
  },
  {
    title: 'Recursive Web',
    type: 'ARG',
    summary: 'Browser-based multi-level puzzle system with terminal-style interaction.',
    link: '/projects',
  },
  {
    title: 'Interactive Lab',
    type: 'Simulation',
    summary: 'Canvas-based mathematical systems with tunable controls and diagnostics.',
    link: '/lab',
  },
];

const STATUS = [
  { label: 'Runtime', value: 'Stable', tone: 'text-emerald-500' },
  { label: 'Focus', value: 'ML + Systems', tone: 'text-[var(--accent)]' },
  { label: 'Mode', value: 'Build', tone: 'text-sky-500' },
];

const Home = () => {
  const [typedText] = useTypewriter({
    words: [
      'designing robust interfaces',
      'building applied ML systems',
      'shipping technical products',
      'writing engineering notes',
    ],
    loop: 0,
    typeSpeed: 62,
    deleteSpeed: 34,
    delaySpeed: 1600,
  });

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: 'easeOut' }}
      className="bg-grid"
    >
      <section className="section">
        <div className="relative overflow-hidden rounded-[30px] border border-[var(--line)] p-8 md:p-12">
          <div className="absolute inset-0 bg-tech-grid opacity-80"></div>
          <div className="absolute inset-0 bg-tech opacity-75"></div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="chip font-mono border-[var(--accent)]/40 text-[var(--accent)]">SYSTEM PORTFOLIO</div>
              <h1 className="font-display mt-5 text-4xl leading-tight md:text-6xl">
                Technical systems
                <span className="block text-gradient">with clear execution.</span>
              </h1>

              <div className="font-mono mt-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 px-4 py-3 text-sm text-[var(--muted)]">
                <span className="text-[var(--accent)]">&gt; </span>
                {typedText}
                <Cursor cursorStyle="_" cursorColor="var(--accent)" />
              </div>

              <p className="mt-5 max-w-2xl text-sm text-[var(--muted)] md:text-base">
                I focus on machine learning systems, engineering workflows, and production-ready web interfaces.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="font-mono rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
                >
                  View Projects
                </Link>
                <Link
                  to="/lab"
                  className="font-mono rounded-full border border-[var(--line)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-[var(--accent)]"
                >
                  Open Lab
                </Link>
              </div>
            </div>

            <div className="tech-panel scanline rounded-3xl p-6">
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Runtime Console</div>
              <div className="mt-4 space-y-3">
                {STATUS.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--paper)]/70 px-3 py-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {item.label}
                    </span>
                    <span className={`font-mono text-xs font-semibold ${item.tone}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--paper)]/70 p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Endpoints</div>
                <div className="font-mono mt-2 space-y-1 text-xs text-[var(--ink)]">
                  <div>/projects</div>
                  <div>/lab</div>
                  <div>/cv</div>
                  <div>/contact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">Featured Builds</h2>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Active workstreams and technical artifacts
            </p>
          </div>
          <Link
            to="/projects"
            className="font-mono rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.22em] transition hover:border-[var(--accent)]"
          >
            All Projects
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {FEATURED_WORK.map((item) => (
            <div key={item.title} className="tech-panel rounded-3xl p-6">
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{item.type}</div>
              <h3 className="font-display mt-3 text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.summary}</p>
              <Link
                to={item.link}
                className="font-mono mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--accent)]"
              >
                Open <FiArrowUpRight />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-2">
        <div className="tech-panel flex flex-wrap items-center justify-between gap-5 rounded-3xl p-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Contact</div>
            <h2 className="font-display mt-2 text-3xl">Open to technical collaboration.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:lifan.hu@u.nus.edu"
              className="font-mono inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >
              <FiMail /> Email
            </a>
            <Link
              to="/contact"
              className="font-mono rounded-full border border-[var(--line)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </section>

      <footer className="section pt-0">
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[var(--line)] pt-8 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-4">
            <a href="https://github.com/anormalm" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/anormalm/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)]"
            >
              <FaLinkedin />
            </a>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.18em]">Built by Anormalm.</div>
        </div>
      </footer>
    </Motion.div>
  );
};

export default Home;
