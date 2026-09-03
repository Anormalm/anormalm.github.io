import { useRef } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';

const ProjectCard = ({ title, description, link, live, category, status, tags = [], index = 0 }) => {
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const onPointerMove = (event) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 7;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    cardRef.current.style.setProperty('--card-rx', `${rotateX}deg`);
    cardRef.current.style.setProperty('--card-ry', `${rotateY}deg`);
    cardRef.current.style.setProperty('--spot-x', `${x}px`);
    cardRef.current.style.setProperty('--spot-y', `${y}px`);
  };

  const resetCard = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--card-rx', '0deg');
    cardRef.current.style.setProperty('--card-ry', '0deg');
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      className="h-full"
    >
      <article
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={resetCard}
        className="project-card tech-panel flex h-full flex-col overflow-hidden rounded-[28px] p-6 md:p-7"
      >
        <span className="project-spotlight" aria-hidden="true" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
            {category}
          </div>
          <div className="project-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        <h2 className="font-display relative z-10 mt-10 text-3xl leading-tight md:text-[2rem]">{title}</h2>
        <p className="relative z-10 mt-4 flex-1 text-sm leading-6 text-[var(--muted)]">{description}</p>

        <div className="relative z-10 mt-6 flex flex-wrap gap-2" aria-label="Project topics">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
          <div className="font-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            <span className="status-pulse" aria-hidden="true" />
            {status}
          </div>
          <div className="flex items-center gap-4">
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
        </div>
      </article>
    </Motion.div>
  );
};

export default ProjectCard;
