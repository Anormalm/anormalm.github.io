import { useEffect, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const LOG_BANK = [
  'NODE/01 handshake accepted',
  'NODE/02 latent route discovered',
  'NODE/03 graph memory coherent',
  'NODE/04 noise floor listening',
  'NODE/05 strange loop stabilized',
  'NODE/06 visitor signature unknown',
  'NODE/07 ghost channel available',
  'NODE/08 curiosity threshold exceeded',
];

const Node = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === 'n') setPulse((previous) => previous + 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const logs = Array.from({ length: 4 }, (_, index) => LOG_BANK[(index + pulse) % LOG_BANK.length]);

  return (
    <div className="node-page">
      <div className="node-grid" aria-hidden="true" />
      <section className="section node-stage">
        <Motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="node-visual"
          aria-hidden="true"
        >
          <span className="node-ring node-ring-one"><i /></span>
          <span className="node-ring node-ring-two"><i /></span>
          <span className="node-ring node-ring-three"><i /></span>
          <strong>{String(pulse + 1).padStart(2, '0')}</strong>
        </Motion.div>

        <div className="node-console">
          <div className="eyebrow">Hidden route / access granted</div>
          <h1>YOU FOUND<br /><span>THE NODE.</span></h1>
          <p>
            A private diagnostics channel left intentionally between the obvious links. The website is behaving
            strangely—as designed.
          </p>

          <div className="node-logs">
            {logs.map((line, index) => (
              <Motion.div
                key={`${pulse}-${line}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>{line}
              </Motion.div>
            ))}
          </div>

          <div className="node-actions">
            <button type="button" onClick={() => setPulse((previous) => previous + 1)} className="button-primary">
              Pulse node <FiRefreshCw />
            </button>
            <Link to="/" className="button-secondary"><FiArrowLeft /> Return home</Link>
          </div>
          <div className="node-hint">Keyboard shortcut: press N to rotate the signal.</div>
        </div>
      </section>
    </div>
  );
};

export default Node;
