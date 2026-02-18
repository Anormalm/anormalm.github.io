import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const projectTelemetry = (title) => {
  const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return {
    health: 70 + (seed % 25),
    velocity: 45 + ((seed * 3) % 45),
    complexity: 35 + ((seed * 5) % 60),
    status: seed % 2 === 0 ? 'active' : 'stable',
  };
};

const ProjectCard = ({ title, description, link, systemView = true }) => {
  const isExternal = link?.startsWith('http');
  const telemetry = projectTelemetry(title);

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Project</div>
        {systemView && (
          <div className="font-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
            {telemetry.status}
          </div>
        )}
      </div>
      <h3 className="font-display mt-3 text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      {systemView && (
        <div className="mt-4 space-y-2">
          {[
            ['health', telemetry.health],
            ['velocity', telemetry.velocity],
            ['complexity', telemetry.complexity],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                <span className="font-mono">{label}</span>
                <span className="font-mono">{value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--line)]">
                <div
                  className="h-1.5 rounded-full bg-[var(--accent)]"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {link && (
        <span className="font-mono mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
          View project <FiArrowUpRight />
        </span>
      )}
    </>
  );

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="tech-panel scanline rounded-3xl p-6 transition hover:translate-y-[-2px]"
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
    </Motion.div>
  );
};

export default ProjectCard;
