import { useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiArrowUpRight, FiMail, FiDownload } from 'react-icons/fi';
import { useGlobalSearch } from '../context/SearchContext';

const HOME_PROJECTS = [
  {
    title: 'Atlas of Quiet Systems',
    description: 'A modular product suite for calm, high-signal workflows.',
    year: '2025',
    type: 'Product',
    stack: ['React', 'Tailwind', 'Framer Motion'],
    link: '/projects',
    tags: ['product', 'interfaces', 'systems'],
  },
  {
    title: 'GNN MARL Fraud Study',
    description: 'Research narrative on graph learning and multi-agent systems.',
    year: '2024',
    type: 'Research',
    stack: ['Python', 'PyTorch', 'Writing'],
    link: '/writings/GNNMARLFraud',
    tags: ['research', 'ml', 'systems'],
  },
  {
    title: 'Fragments of Disenchantment',
    description: 'Interactive essay with layered typographic motion.',
    year: '2023',
    type: 'Writing',
    stack: ['React', 'Typography'],
    link: '/writings/Fragments',
    tags: ['writing', 'interfaces'],
  },
  {
    title: 'Signal Garden',
    description: 'Generative visuals exploring ordered chaos and rhythm.',
    year: '2025',
    type: 'Play',
    stack: ['Canvas', 'Creative Coding'],
    link: '/projects',
    tags: ['generative', 'canvas', 'interfaces'],
  },
];

const HOME_WRITINGS = [
  {
    title: 'The Discipline of Small Interfaces',
    tag: 'Essay',
    date: 'Jan 2026',
    summary: 'On designing interfaces that behave like good rooms.',
    link: '/writings/Disenchantment',
    tags: ['writing', 'interfaces'],
  },
  {
    title: 'Notes on GNN + MARL Fraud',
    tag: 'Research',
    date: 'Nov 2025',
    summary: 'Field notes from a systems-level investigation.',
    link: '/writings/GNNMARLFraud',
    tags: ['research', 'ml', 'systems'],
  },
  {
    title: 'Fragments',
    tag: 'Fiction',
    date: 'Oct 2024',
    summary: 'Micro-stories that read like a glitching diary.',
    link: '/writings/Fragments',
    tags: ['writing', 'interfaces'],
  },
  {
    title: 'Operational Calm',
    tag: 'Notes',
    date: 'Aug 2024',
    summary: 'A checklist for building calm in complex systems.',
    link: '/writings',
    tags: ['writing', 'systems'],
  },
];

const Home = () => {
  const moods = [
    {
      id: 'ember',
      label: 'Ember',
      tone: 'Warm, tactile, and human. Interfaces with grain and glow.',
      surface: 'bg-gradient-to-br from-[#f7d6bf] via-[#f7efe6] to-[#f3ece3]',
      accent: 'text-[#f05a28]',
      text: 'text-[var(--ink)]',
      muted: '#6f655d',
      pill: 'border-[#f05a28]/40 text-[#f05a28]',
      cta: 'bg-[#f05a28] text-white hover:bg-[#d94c22]',
      glow: 'bg-[#f05a28]/20',
    },
    {
      id: 'verdant',
      label: 'Verdant',
      tone: 'Precise systems, calm focus, research-grade clarity.',
      surface: 'bg-gradient-to-br from-[#d6efe5] via-[#eef7f3] to-[#f3f0e9]',
      accent: 'text-[#138a6f]',
      text: 'text-[var(--ink)]',
      muted: '#5f6d67',
      pill: 'border-[#138a6f]/40 text-[#138a6f]',
      cta: 'bg-[#138a6f] text-white hover:bg-[#0f6f59]',
      glow: 'bg-[#138a6f]/20',
    },
    {
      id: 'noir',
      label: 'Noir',
      tone: 'High contrast, cinematic, and quietly technical.',
      surface: 'bg-gradient-to-br from-[#1e2026] via-[#232730] to-[#2a3039]',
      accent: 'text-[#f0c14b]',
      text: 'text-white',
      muted: '#d3c7bb',
      pill: 'border-[#f0c14b]/40 text-[#f0c14b]',
      cta: 'bg-[#f0c14b] text-[#1b1c20] hover:bg-[#d9ad3b]',
      glow: 'bg-[#f0c14b]/20',
    },
  ];

  const [activeMoodId, setActiveMoodId] = useState(moods[0].id);
  const activeMood = moods.find((mood) => mood.id === activeMoodId) || moods[0];

  const { query, tags } = useGlobalSearch();
  const projectCategories = ['All', 'Product', 'Research', 'Writing', 'Play'];
  const [projectFilter, setProjectFilter] = useState('All');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProjects = HOME_PROJECTS.filter((project) => {
    const matchesCategory = projectFilter === 'All' || project.type === projectFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      project.title.toLowerCase().includes(normalizedQuery) ||
      project.description.toLowerCase().includes(normalizedQuery) ||
      project.tags?.some((tag) => tag.includes(normalizedQuery));
    const matchesTags = tags.length === 0 || tags.some((tag) => project.tags?.includes(tag));
    return matchesCategory && matchesQuery && matchesTags;
  });

  const filteredWritings = useMemo(() => {
    return HOME_WRITINGS.filter((writing) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        writing.title.toLowerCase().includes(normalizedQuery) ||
        writing.summary.toLowerCase().includes(normalizedQuery) ||
        writing.tags?.some((tag) => tag.includes(normalizedQuery));
      const matchesTags = tags.length === 0 || tags.some((tag) => writing.tags?.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [normalizedQuery, tags]);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-grid"
    >
      <section className="section">
        <div
          className={`relative overflow-hidden rounded-[36px] border border-[var(--line)] bg-[var(--paper)] p-8 md:p-12 ${activeMood.text}`}
          style={{ '--muted': activeMood.muted }}
        >
          <div className={`absolute inset-0 opacity-80 ${activeMood.surface}`}></div>
          <div className={`float-slow absolute right-10 top-10 h-24 w-24 rounded-full ${activeMood.glow} blur-2xl`}></div>
          <div className="float-slow absolute bottom-10 left-12 h-20 w-20 rounded-full bg-white/30 blur-2xl"></div>

          <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className={`chip ${activeMood.pill}`}>Aesthetic Systems</div>
              <h1 className="font-display text-4xl leading-tight md:text-6xl">
                I design poetic software and experimental interfaces
                <span className={`block ${activeMood.accent}`}>for curious humans.</span>
              </h1>
              <p className="max-w-xl text-base text-[var(--muted)] md:text-lg">
                Anormalm is a creative technologist focused on calm, expressive software.
                I craft product systems, write reflective essays, and prototype future tools.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className={`rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${activeMood.cta}`}
                >
                  View Projects
                </Link>
                <Link
                  to="/cv"
                  className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
                >
                  Download CV
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMoodId(mood.id)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                      activeMoodId === mood.id
                        ? `${mood.pill} surface-strong`
                        : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                Current mood: {activeMood.tone}
              </p>
            </div>

            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                  Studio Dashboard
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                  02.06.26
                </span>
              </div>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Now Building</div>
                  <div className="font-display text-2xl">Ambient Research Suite</div>
                  <p className="text-sm text-[var(--muted)]">
                    A calm command center for writing, graph research, and publishing.
                  </p>
                </div>

                <div className="surface rounded-2xl border border-[var(--line)] p-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Signal Quality</span>
                    <span className={activeMood.accent}>High</span>
                  </div>
                  <div className="shimmer-line relative mt-3 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                    <div className="absolute inset-y-0 left-0 w-[78%] rounded-full bg-[var(--accent)]"></div>
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-[var(--muted)]">
                  <div className="flex items-center justify-between">
                    <span>Open to collaborations</span>
                    <span>Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Weekly focus</span>
                    <span>Interfaces, Writing</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Availability</span>
                    <span>Limited</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:anormalm@proton.me"
                    className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
                  >
                    <FiMail />
                    Message
                  </a>
                  <Link
                    to="/cv"
                    className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
                  >
                    <FiDownload />
                    Resume
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: 'Design Systems',
              value: '12+',
              detail: 'Interface architectures shipped to production.',
            },
            {
              label: 'Research Notes',
              value: '40+',
              detail: 'Working documents blending ML, culture, and product.',
            },
            {
              label: 'Collaborations',
              value: '8',
              detail: 'Teams spanning labs, startups, and creative studios.',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{stat.label}</div>
              <div className="font-display text-3xl">{stat.value}</div>
              <p className="mt-2 text-sm text-[var(--muted)]">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-4">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl">Selected Works</h2>
            <p className="text-[var(--muted)]">
              A mix of product systems, essays, and experimental builds.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setProjectFilter(category)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                  projectFilter === category
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <div key={project.title} className="glass-card p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                <span>{project.type}</span>
                <span>{project.year}</span>
              </div>
              <h3 className="font-display mt-4 text-2xl">{project.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs">
                    {item}
                  </span>
                ))}
              </div>
              <Link
                to={project.link}
                className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]"
              >
                View case study <FiArrowUpRight />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-4">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl">Writing Index</h2>
            <p className="text-[var(--muted)]">
              Essays, research notes, and fragments that map the studio's thinking.
            </p>

            <div className="mt-6 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              Filtered by global search and tags
            </div>

            <div className="mt-6 grid gap-4">
              {filteredWritings.map((writing) => (
                <Link
                  key={writing.title}
                  to={writing.link}
                  className="glass-card group p-5 transition hover:translate-y-[-2px]"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                    <span>{writing.tag}</span>
                    <span>{writing.date}</span>
                  </div>
                  <div className="mt-3 font-display text-xl">{writing.title}</div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{writing.summary}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Signal Lab</div>
            <h3 className="font-display mt-3 text-2xl">Technical Focus</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Systems I am tuning right now, with an emphasis on aesthetic clarity.
            </p>

            <div className="mt-6 grid gap-4">
              {[
                {
                  title: 'Research Pipeline',
                  detail: 'Graph learning, agent coordination, evaluation harness.',
                  status: 'Active',
                },
                {
                  title: 'Writing Engine',
                  detail: 'Markdown flows, narrative surfaces, reading modes.',
                  status: 'Prototype',
                },
                {
                  title: 'Portfolio OS',
                  detail: 'Reusable layout system, motion language, data hooks.',
                  status: 'Shipping',
                },
              ].map((item) => (
                <div key={item.title} className="surface rounded-2xl border border-[var(--line)] p-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{item.title}</span>
                    <span className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="surface mt-6 rounded-2xl border border-[var(--line)] p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Toolkit</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {[
                  'React 19',
                  'Vite',
                  'Tailwind',
                  'Framer Motion',
                  'Python',
                  'PyTorch',
                  'Notion',
                  'Obsidian',
                ].map((tool) => (
                  <span key={tool} className="rounded-full border border-[var(--line)] px-3 py-1">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="glass-card p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl">Studio Timeline</h2>
              <p className="text-[var(--muted)]">
                The past few seasons, in layered experiments.
              </p>
            </div>
            <Link
              to="/projects"
              className="rounded-full border border-[var(--line)] px-5 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-[var(--accent)]"
            >
              View Archive
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { date: '2026', title: 'Ambient Research Suite', detail: 'Building a unified space for research and writing.' },
              { date: '2025', title: 'Atlas of Quiet Systems', detail: 'Product templates for calm UX in technical environments.' },
              { date: '2024', title: 'Fragments', detail: 'Narrative work exploring memory and machines.' },
              { date: '2023', title: 'Early Experiments', detail: 'Interfaces, essays, and prototypes across the studio.' },
            ].map((event) => (
              <div key={event.title} className="surface rounded-2xl border border-[var(--line)] p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{event.date}</div>
                <div className="mt-2 font-display text-xl">{event.title}</div>
                <p className="mt-2 text-sm text-[var(--muted)]">{event.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--paper)] p-10">
          <div className="absolute inset-0 bg-aurora opacity-70"></div>
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Collaboration</div>
              <h2 className="font-display text-3xl">Build something with a soul.</h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
                I love partnering with thoughtful teams on products, research, or narrative systems.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
              >
                Contact
              </Link>
              <a
                href="mailto:anormalm@proton.me"
                className="rounded-full border border-[var(--line)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="section pt-0">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--line)] pt-8 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-4">
            <a href="https://github.com/anormalm" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/lifan-hu-46728b324"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--accent)]"
            >
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/YOURUSERNAME" target="_blank" rel="noreferrer" className="hover:text-[var(--accent)]">
              <FaTwitter />
            </a>
          </div>
          <div>Designed and built by Anormalm.</div>
        </div>
      </footer>
    </Motion.div>
  );
};

export default Home;
