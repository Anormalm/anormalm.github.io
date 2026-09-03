import { motion as Motion } from 'framer-motion';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';

const ProjectCard = ({ title, description, link, live, category, status, tags = [] }) => {
  return (
    <Motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
      className="project-card tech-panel scanline flex h-full flex-col rounded-3xl p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
          {category}
        </div>
        <div className="font-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-3)]" aria-hidden="true" />
          {status}
        </div>
      </div>

      <h2 className="font-display mt-4 text-2xl">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{description}</p>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Project topics">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-4">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="link-arrow"
          aria-label={`View ${title} on GitHub`}
        >
          <FiGithub /> Source <FiArrowUpRight />
        </a>
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
            aria-label={`Open live ${title} project`}
          >
            Live <FiArrowUpRight />
          </a>
        )}
      </div>
    </Motion.article>
  );
};

export default ProjectCard;
