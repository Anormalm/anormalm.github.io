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
];

const Projects = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Projects</div>
            <h1 className="font-display text-4xl">Systems, products, and applied research.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Project index covering production builds, prototypes, and engineering experiments.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Updated Feb 2026
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
