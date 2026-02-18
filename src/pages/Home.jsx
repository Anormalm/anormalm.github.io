import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';

const FEATURED_WORK = [
  {
    title: 'GNN + MARL Fraud Detection',
    type: 'Research',
    summary: 'Graph learning and multi-agent reinforcement learning for adaptive DeFi fraud detection.',
    link: '/writings/GNNMARLFraud',
  },
  {
    title: 'Lie Group Trajectory Encoder',
    type: 'ML Systems',
    summary: 'Neural encoders for SE(2), SE(3), SO(3), and SL(2,R) trajectory spaces.',
    link: '/projects',
  },
  {
    title: 'Interactive Lab',
    type: 'Graphics',
    summary: 'Real-time Canvas and WebGL experiments focused on signal, flow, and rendering behavior.',
    link: '/lab',
  },
];

const TRACKS = [
  {
    title: 'Research',
    detail: 'Graph ML, reinforcement learning, and evaluation workflows.',
  },
  {
    title: 'Engineering',
    detail: 'Full-stack product systems with React, Python, and deployment pipelines.',
  },
  {
    title: 'Writing',
    detail: 'Technical essays on systems, design choices, and implementation tradeoffs.',
  },
];

const Home = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-grid"
    >
      <section className="section">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--line)] p-8 md:p-12">
          <div className="absolute inset-0 bg-tech opacity-80"></div>
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="chip border-[var(--accent)]/40 text-[var(--accent)]">Technology Portfolio</div>
              <h1 className="font-display mt-5 text-4xl leading-tight md:text-6xl">
                Building practical systems
                <span className="block text-gradient">for research and production.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-[var(--muted)] md:text-base">
                I design and ship technical products, machine learning workflows, and interface systems.
                This site tracks current work across software, research, and writing.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90"
                >
                  View Projects
                </Link>
                <Link
                  to="/cv"
                  className="rounded-full border border-[var(--line)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition hover:border-[var(--accent)]"
                >
                  View CV
                </Link>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Current Focus</div>
              <div className="mt-5 space-y-4">
                {TRACKS.map((track) => (
                  <div key={track.title} className="surface rounded-2xl border border-[var(--line)] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">{track.title}</div>
                    <p className="mt-2 text-sm text-[var(--muted)]">{track.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">Featured Work</h2>
            <p className="text-sm text-[var(--muted)]">Selected technical projects and research outputs.</p>
          </div>
          <Link
            to="/projects"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.22em] transition hover:border-[var(--accent)]"
          >
            All Projects
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {FEATURED_WORK.map((item) => (
            <div key={item.title} className="glass-card p-6">
              <div className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{item.type}</div>
              <h3 className="font-display mt-3 text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.summary}</p>
              <Link
                to={item.link}
                className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--accent)]"
              >
                Open <FiArrowUpRight />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-2">
        <div className="glass-card flex flex-wrap items-center justify-between gap-5 p-8">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Contact</div>
            <h2 className="font-display mt-2 text-3xl">Open to technical collaboration.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:lifan.hu@u.nus.edu"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
            >
              <FiMail /> Email
            </a>
            <Link
              to="/contact"
              className="rounded-full border border-[var(--line)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
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
          <div>Built by Hu Lifan.</div>
        </div>
      </footer>
    </Motion.div>
  );
};

export default Home;
