import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const ProjectCard = ({ title, description, link }) => {
  const isExternal = link?.startsWith('http');

  const content = (
    <>
      <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Project</div>
      <h3 className="font-display mt-3 text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      {link && (
        <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
          View project <FiArrowUpRight />
        </span>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="glass-card p-6 transition hover:translate-y-[-2px]"
    >
      {link ? (
        isExternal ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        ) : (
          <Link to={link}>{content}</Link>
        )
      ) : (
        content
      )}
    </motion.div>
  );
};

export default ProjectCard;
