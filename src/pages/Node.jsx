import { Link } from 'react-router-dom';

const NODE_LOGS = [
  'NODE/01 handshake accepted',
  'NODE/02 cache window stabilized',
  'NODE/03 latent route discovered',
  'NODE/04 maintenance heartbeat nominal',
];

const Node = () => {
  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="tech-panel scanline rounded-3xl p-8">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Hidden Route</div>
          <h1 className="font-display mt-3 text-4xl">/node</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
            You found a private diagnostics node. This route is an intentional easter egg.
          </p>

          <div className="mt-6 grid gap-3">
            {NODE_LOGS.map((line) => (
              <div key={line} className="font-mono rounded-xl border border-[var(--line)] bg-[var(--paper)]/70 px-4 py-3 text-xs">
                {line}
              </div>
            ))}
          </div>

          <div className="mt-7">
            <Link
              to="/"
              className="font-mono rounded-full border border-[var(--line)] px-5 py-3 text-xs uppercase tracking-[0.2em] transition hover:border-[var(--accent)]"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Node;
