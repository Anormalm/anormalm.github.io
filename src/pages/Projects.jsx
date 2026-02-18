import ProjectCard from '../components/ProjectCard';

const PROJECTS = [
  {
    title: 'Personal Website',
    description: 'A portfolio website built with React and Tailwind CSS.',
    link: 'https://github.com/anormalm/personal-website',
  },
  {
    title: 'Creative Writing Archive',
    description: 'A digital archive of my short stories.',
    link: '/writings',
  },
  {
    title: 'Autonomous Robot',
    description: 'A ROS2-powered heat-seeking robot using SLAM, frontier exploration, AMG8833, and A* navigation with firing logic.',
  },
  {
    title: 'Lie Group Trajectory Encoder',
    description: 'Learned Lie group generators from motion sequences in SE(2), SE(3), SO(3), and SL(2,R). Includes visualizations and manifold modeling.',
    link: 'https://github.com/Anormalm/LieRL-on-Trajectories',
  },
  {
    title: 'BPCompanion',
    description: 'A blood pressure logging and prediction toolkit with anomaly detection, LSTM modeling, and a Tkinter GUI for elderly users.',
    link: 'https://github.com/anormalm/bpcompanion',
  },
  {
    title: 'TopoTrace',
    description: 'A topology-aware anomaly detection toolkit using persistent homology to analyze dynamic system traces.',
    link: 'https://github.com/anormalm/topotrace',
  },
  {
    title: 'Ancient-lm',
    description:
      'A stylized text generator fine-tuned from GPT-2 on Tao Te Ching, Analects, and Bhagavad Gita. Supports theme-based generation, CPU/GPU execution, and extensible corpus pipelines.',
    link: 'https://github.com/Anormalm/Ancient-lm',
  },
  {
    title: 'Recursive Web',
    description:
      'A browser-based multi-level ARG puzzle with terminal-style commands, hidden clues, binary hints, and an ASCII-art finale. Live at anormalm.com/recursive-web.',
    link: 'https://anormalm.com/recursive-web',
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="tech-panel rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Projects</div>
              <h1 className="font-display text-4xl">Systems, products, and applied research.</h1>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
                Project index covering production builds, prototypes, and engineering experiments.
              </p>
            </div>
            <div className="font-mono rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Updated Feb 2026
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              link={project.link}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
