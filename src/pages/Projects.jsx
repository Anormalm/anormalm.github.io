import { useMemo } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useGlobalSearch } from '../context/SearchContext';

const PROJECTS = [
  {
    title: 'Personal Website',
    description: 'A portfolio website built with React and Tailwind CSS. This is recursive somehow.',
    link: 'https://github.com/anormalm/personal-website',
    tags: ['product', 'interfaces'],
  },
  {
    title: 'Creative Writing Archive',
    description: 'A digital archive of my short stories.',
    link: '/writings',
    tags: ['writing', 'systems'],
  },
  {
    title: 'Autonomous Robot',
    description: 'A ROS2-powered heat-seeking robot using SLAM, frontier exploration, AMG8833, and A* navigation with firing logic.',
    tags: ['robotics', 'systems'],
  },
  {
    title: 'Lie Group Trajectory Encoder',
    description: 'Learned Lie group generators from motion sequences in SE(2), SE(3), SO(3), and SL(2,R). Includes visualizations and manifold modeling.',
    link: 'https://github.com/Anormalm/LieRL-on-Trajectories',
    tags: ['research', 'ml', 'systems'],
  },
  {
    title: 'BPCompanion',
    description: 'A blood pressure logging and prediction toolkit with anomaly detection, LSTM modeling, and a Tkinter GUI for elderly users.',
    link: 'https://github.com/anormalm/bpcompanion',
    tags: ['product', 'ml'],
  },
  {
    title: 'TopoTrace',
    description: 'A topology-aware anomaly detection toolkit using persistent homology to analyze dynamic system traces.',
    link: 'https://github.com/anormalm/topotrace',
    tags: ['research', 'ml', 'tooling'],
  },
];

const Projects = () => {
  const { query, tags } = useGlobalSearch();

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PROJECTS.filter((project) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery) ||
        project.tags?.some((tag) => tag.includes(normalizedQuery));
      const matchesTags = tags.length === 0 || tags.some((tag) => project.tags?.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [query, tags]);

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Projects</div>
            <h1 className="font-display text-4xl">Systems, experiments, and products.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              A living archive of the work. These are in-progress artifacts as much as they are finished builds.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Updated Feb 2026
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              link={project.link}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="glass-card p-6 text-sm text-[var(--muted)]">
              No projects match the current search. Try adjusting the global tags.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
