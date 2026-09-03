import { useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';

const STAGES = ['Mapping graph', 'Compiling memory', 'Opening channel'];

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(3);
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const duration = reducedMotion ? 420 : 2200;
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setProgress(Math.min(100, Math.round((elapsed / duration) * 100)));
    }, 32);
    const timer = window.setTimeout(onComplete, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, [onComplete, reducedMotion]);

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(progress / 34))];

  return (
    <Motion.div
      key="loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }}
      transition={{ duration: reducedMotion ? 0.05 : 0.55, ease: [0.76, 0, 0.24, 1] }}
      className="loader-screen"
    >
      <div className="loader-coordinate loader-coordinate-top">01°17′N · 103°51′E</div>
      <div className="loader-coordinate loader-coordinate-bottom">NUS / SINGAPORE / 2026</div>

      <div className="loader-core" aria-hidden="true">
        <span className="loader-orbit loader-orbit-one"><i /></span>
        <span className="loader-orbit loader-orbit-two"><i /></span>
        <span className="loader-monogram">Anormalm</span>
      </div>

      <div className="loader-readout" aria-live="polite">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
          {stage}
        </div>
        <div className="loader-progress-row">
          <span className="loader-progress-track">
            <Motion.span animate={{ width: `${progress}%` }} transition={{ ease: 'linear', duration: 0.08 }} />
          </span>
          <span className="font-mono text-[10px] tabular-nums text-[var(--accent)]">
            {String(progress).padStart(3, '0')}%
          </span>
        </div>
      </div>

      <button type="button" className="loader-skip" onClick={onComplete}>
        Enter now
      </button>
    </Motion.div>
  );
};

export default Loader;
