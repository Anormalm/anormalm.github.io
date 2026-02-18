import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const WritingCard = ({ title, excerpt, date, link }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="tech-panel scanline rounded-3xl p-6 transition hover:translate-y-[-2px]"
    >
      <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{date}</div>
      <div className="font-display mt-3 text-2xl">{title}</div>
      <p className="mt-2 text-sm text-[var(--muted)]">{excerpt}</p>
      {link && (
        <Link to={link} className="font-mono mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
          Read more <FiArrowUpRight />
        </Link>
      )}
    </Motion.div>
  );
};

export default WritingCard;
