import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const WritingCard = ({ title, excerpt, date, readingTime, link }) => {
  const isExternal = link?.startsWith('http');
  const linkClassName = 'link-arrow mt-6';

  return (
    <Motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
      className="project-card tech-panel scanline flex h-full flex-col rounded-3xl p-6"
    >
      <div className="font-mono flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        <span>{date}</span>
        {readingTime && <span aria-hidden="true">·</span>}
        {readingTime && <span>{readingTime}</span>}
      </div>
      <h2 className="font-display mt-4 text-2xl leading-snug">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{excerpt}</p>
      {isExternal ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          Read on Medium <FiArrowUpRight />
        </a>
      ) : (
        <Link to={link} className={linkClassName}>
          Read essay <FiArrowUpRight />
        </Link>
      )}
    </Motion.article>
  );
};

export default WritingCard;
