import { useEffect, useMemo, useRef, useState } from 'react';

const EXPERIMENTS = [
  {
    id: 'hamiltonian-flow',
    title: 'Hamiltonian Flow Field',
    description: 'Divergence-free particle advection from a stream function.',
    mode: 'canvas',
    math: 'RK2 + incompressible field',
  },
  {
    id: 'cursor-vector',
    title: 'Cursor Vector Field',
    description: 'Arrow lattice with local vector attraction toward cursor.',
    mode: 'canvas',
    math: 'Discrete vector dynamics',
  },
  {
    id: 'kalman-tracker',
    title: 'Kalman Target Tracker',
    description: '2D constant-velocity filter under noisy observations.',
    mode: 'canvas',
    math: 'Linear Gaussian estimation',
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const defaultParams = {
  hamiltonian: { particles: 520, speed: 1.0, intensity: 28 },
  cursor: { spacing: 28, influence: 210, arrowLength: 14 },
  kalman: { sigma: 13, processNoise: 0.4, trail: 240 },
};

const Lab = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeId, setActiveId] = useState(EXPERIMENTS[0].id);
  const [params, setParams] = useState(defaultParams);
  const [statusMessage, setStatusMessage] = useState('');
  const [supportsCanvas, setSupportsCanvas] = useState(true);
  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    const test = document.createElement('canvas');
    setSupportsCanvas(Boolean(test.getContext && test.getContext('2d')));
  }, []);

  useEffect(() => {
    if (!supportsCanvas) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const experiment = EXPERIMENTS.find((item) => item.id === activeId);
    if (!experiment) return undefined;

    setStatusMessage(reducedMotion ? 'Reduced-motion mode active: lower simulation intensity.' : '');
    let running = true;
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return undefined;

    window.__labRenderMode = 'canvas';

    const resize = () => {
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const stop = () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    let disposeExperiment = () => {};

    const drawHamiltonian = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;

      const cfg = params.hamiltonian;
      const particleCount = reducedMotion ? Math.floor(cfg.particles * 0.35) : cfg.particles;
      const speed = reducedMotion ? cfg.speed * 0.35 : cfg.speed;
      const intensity = cfg.intensity;
      let time = 0;

      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width(),
        y: Math.random() * height(),
      }));

      const field = (x, y, t) => {
        const xn = (x / width()) * (2 * Math.PI) - Math.PI;
        const yn = (y / height()) * (2 * Math.PI) - Math.PI;
        const a = 1.6 + 0.2 * Math.sin(t * 0.00025);
        const b = 1.2 + 0.15 * Math.cos(t * 0.00019);
        const vx = b * Math.sin(a * xn) * Math.cos(b * yn);
        const vy = -a * Math.cos(a * xn) * Math.sin(b * yn);
        return { vx: vx * intensity, vy: vy * intensity };
      };

      ctx.fillStyle = '#080f1b';
      ctx.fillRect(0, 0, width(), height());

      const tick = () => {
        if (!running) return;
        ctx.fillStyle = 'rgba(8, 15, 27, 0.08)';
        ctx.fillRect(0, 0, width(), height());
        ctx.strokeStyle = 'rgba(76, 144, 255, 0.42)';
        ctx.lineWidth = 0.9;

        for (const p of particles) {
          const k1 = field(p.x, p.y, time);
          const mx = p.x + 0.5 * k1.vx * 0.016 * speed;
          const my = p.y + 0.5 * k1.vy * 0.016 * speed;
          const k2 = field(mx, my, time + 8);
          const nx = p.x + k2.vx * 0.016 * speed;
          const ny = p.y + k2.vy * 0.016 * speed;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          p.x = nx;
          p.y = ny;
          if (p.x < 0 || p.x > width() || p.y < 0 || p.y > height()) {
            p.x = Math.random() * width();
            p.y = Math.random() * height();
          }
        }

        time += 16;
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
    };

    const drawCursorVector = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;
      const cfg = params.cursor;
      const spacing = reducedMotion ? cfg.spacing + 10 : cfg.spacing;
      const influence = cfg.influence;
      const arrowLength = cfg.arrowLength;
      const mouse = { x: width() * 0.5, y: height() * 0.5, active: false };
      let phase = 0;

      const onMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        mouse.active = true;
      };
      const onLeave = () => {
        mouse.active = false;
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);
      disposeExperiment = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
      };

      const drawArrow = (x, y, angle, length, color) => {
        const x2 = x + Math.cos(angle) * length;
        const y2 = y + Math.sin(angle) * length;
        const head = 4;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - Math.cos(angle - 0.42) * head, y2 - Math.sin(angle - 0.42) * head);
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - Math.cos(angle + 0.42) * head, y2 - Math.sin(angle + 0.42) * head);
        ctx.stroke();
      };

      const tick = () => {
        if (!running) return;
        ctx.fillStyle = 'rgba(8, 15, 27, 0.2)';
        ctx.fillRect(0, 0, width(), height());

        for (let y = spacing * 0.6; y < height(); y += spacing) {
          for (let x = spacing * 0.6; x < width(); x += spacing) {
            let angle = Math.sin((x + phase) * 0.01) * 0.6 + Math.cos((y - phase) * 0.011) * 0.6;
            if (mouse.active) {
              const dx = mouse.x - x;
              const dy = mouse.y - y;
              const dist = Math.hypot(dx, dy);
              const attract = clamp(1 - dist / influence, 0, 1);
              const target = Math.atan2(dy, dx);
              angle = (1 - attract) * angle + attract * target;
            }
            const mag = mouse.active
              ? clamp(1 + (influence - Math.hypot(mouse.x - x, mouse.y - y)) / influence, 0.7, 1.8)
              : 1;
            drawArrow(x, y, angle, arrowLength * mag, 'rgba(76, 144, 255, 0.78)');
          }
        }
        phase += reducedMotion ? 0.7 : 1.4;
        animationRef.current = requestAnimationFrame(tick);
      };
      ctx.fillStyle = '#080f1b';
      ctx.fillRect(0, 0, width(), height());
      tick();
    };

    const drawKalman = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;

      const dt = 1 / 60;
      const cfg = params.kalman;
      const sigma = reducedMotion ? cfg.sigma * 0.7 : cfg.sigma;
      const q = cfg.processNoise;
      const trailCap = cfg.trail;
      let t = 0;
      let xTrue = width() * 0.25;
      let yTrue = height() * 0.5;
      let xPrev = xTrue;
      let yPrev = yTrue;

      let x = [xTrue, yTrue, 0, 0];
      let P = [
        [100, 0, 0, 0],
        [0, 100, 0, 0],
        [0, 0, 25, 0],
        [0, 0, 0, 25],
      ];

      const F = [
        [1, 0, dt, 0],
        [0, 1, 0, dt],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
      const Ft = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [dt, 0, 1, 0],
        [0, dt, 0, 1],
      ];
      const R = [
        [sigma * sigma, 0],
        [0, sigma * sigma],
      ];
      const q11 = 0.25 * dt * dt * dt * dt * q;
      const q13 = 0.5 * dt * dt * dt * q;
      const q33 = dt * dt * q;
      const Q = [
        [q11, 0, q13, 0],
        [0, q11, 0, q13],
        [q13, 0, q33, 0],
        [0, q13, 0, q33],
      ];

      const matMul4 = (A, B) => {
        const out = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
        for (let i = 0; i < 4; i += 1) {
          for (let j = 0; j < 4; j += 1) {
            out[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j] + A[i][3] * B[3][j];
          }
        }
        return out;
      };
      const matVec4 = (A, v) => [
        A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2] + A[0][3] * v[3],
        A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2] + A[1][3] * v[3],
        A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2] + A[2][3] * v[3],
        A[3][0] * v[0] + A[3][1] * v[1] + A[3][2] * v[2] + A[3][3] * v[3],
      ];
      const gaussian = () => {
        const u1 = Math.max(Math.random(), 1e-10);
        const u2 = Math.max(Math.random(), 1e-10);
        return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      };
      const invert2 = (M) => {
        const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        if (Math.abs(det) < 1e-9) return null;
        const inv = 1 / det;
        return [
          [M[1][1] * inv, -M[0][1] * inv],
          [-M[1][0] * inv, M[0][0] * inv],
        ];
      };

      const trueTrail = [];
      const estimateTrail = [];
      const measurementTrail = [];
      let rmseAccum = 0;
      let rmseCount = 0;

      const polyline = (pts, stroke, widthPx) => {
        if (pts.length < 2) return;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = widthPx;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      };

      ctx.fillStyle = '#0a111d';
      ctx.fillRect(0, 0, width(), height());

      const tick = () => {
        if (!running) return;
        t += dt;
        const xt = width() * 0.5 + width() * 0.34 * Math.cos(0.55 * t) + width() * 0.09 * Math.cos(1.8 * t);
        const yt = height() * 0.52 + height() * 0.3 * Math.sin(0.72 * t);
        xPrev = xTrue;
        yPrev = yTrue;
        xTrue = xt;
        yTrue = yt;
        const vxTrue = (xTrue - xPrev) / dt;
        const vyTrue = (yTrue - yPrev) / dt;

        const z = [xTrue + sigma * gaussian(), yTrue + sigma * gaussian()];
        x = matVec4(F, x);
        P = matMul4(matMul4(F, P), Ft);
        for (let i = 0; i < 4; i += 1) for (let j = 0; j < 4; j += 1) P[i][j] += Q[i][j];

        const residual = [z[0] - x[0], z[1] - x[1]];
        const S = [
          [P[0][0] + R[0][0], P[0][1] + R[0][1]],
          [P[1][0] + R[1][0], P[1][1] + R[1][1]],
        ];
        const invS = invert2(S);
        if (!invS) return;

        const PHt = [
          [P[0][0], P[0][1]],
          [P[1][0], P[1][1]],
          [P[2][0], P[2][1]],
          [P[3][0], P[3][1]],
        ];
        const K = Array.from({ length: 4 }, () => [0, 0]);
        for (let i = 0; i < 4; i += 1) {
          K[i][0] = PHt[i][0] * invS[0][0] + PHt[i][1] * invS[1][0];
          K[i][1] = PHt[i][0] * invS[0][1] + PHt[i][1] * invS[1][1];
        }

        x = [
          x[0] + K[0][0] * residual[0] + K[0][1] * residual[1],
          x[1] + K[1][0] * residual[0] + K[1][1] * residual[1],
          x[2] + K[2][0] * residual[0] + K[2][1] * residual[1],
          x[3] + K[3][0] * residual[0] + K[3][1] * residual[1],
        ];

        const KH = [
          [K[0][0], K[0][1], 0, 0],
          [K[1][0], K[1][1], 0, 0],
          [K[2][0], K[2][1], 0, 0],
          [K[3][0], K[3][1], 0, 0],
        ];
        const IminusKH = [
          [1 - KH[0][0], -KH[0][1], 0, 0],
          [-KH[1][0], 1 - KH[1][1], 0, 0],
          [-KH[2][0], -KH[2][1], 1, 0],
          [-KH[3][0], -KH[3][1], 0, 1],
        ];
        P = matMul4(IminusKH, P);

        const err = Math.hypot(x[0] - xTrue, x[1] - yTrue);
        rmseAccum += err * err;
        rmseCount += 1;
        trueTrail.push([xTrue, yTrue]);
        measurementTrail.push([z[0], z[1]]);
        estimateTrail.push([x[0], x[1]]);
        if (trueTrail.length > trailCap) trueTrail.shift();
        if (measurementTrail.length > Math.floor(trailCap * 0.5)) measurementTrail.shift();
        if (estimateTrail.length > trailCap) estimateTrail.shift();

        ctx.fillStyle = 'rgba(10, 17, 29, 0.18)';
        ctx.fillRect(0, 0, width(), height());
        polyline(trueTrail, 'rgba(44, 208, 157, 0.85)', 2.2);
        polyline(estimateTrail, 'rgba(76, 144, 255, 0.92)', 2.2);

        ctx.fillStyle = 'rgba(245, 189, 76, 0.45)';
        for (let i = 0; i < measurementTrail.length; i += 4) {
          const m = measurementTrail[i];
          ctx.beginPath();
          ctx.arc(m[0], m[1], 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        const uncertainty = Math.sqrt(Math.max(P[0][0] + P[1][1], 1));
        ctx.strokeStyle = 'rgba(76, 144, 255, 0.28)';
        ctx.beginPath();
        ctx.arc(x[0], x[1], clamp(uncertainty * 0.7, 6, 42), 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(234, 241, 255, 0.92)';
        ctx.font = '12px "Space Grotesk", sans-serif';
        ctx.fillText(`RMSE: ${Math.sqrt(rmseAccum / Math.max(rmseCount, 1)).toFixed(2)} px`, 14, 24);
        ctx.fillText(`|v_true|: ${Math.hypot(vxTrue, vyTrue).toFixed(1)} px/s`, 14, 42);
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
    };

    if (activeId === 'hamiltonian-flow') drawHamiltonian();
    if (activeId === 'cursor-vector') drawCursorVector();
    if (activeId === 'kalman-tracker') drawKalman();

    return () => {
      stop();
      disposeExperiment();
      window.removeEventListener('resize', resize);
    };
  }, [activeId, params, supportsCanvas, reducedMotion]);

  const current = EXPERIMENTS.find((item) => item.id === activeId);

  const activeControls = useMemo(() => {
    if (activeId === 'hamiltonian-flow') {
      return [
        { key: 'particles', label: 'Particles', min: 120, max: 1200, step: 20, group: 'hamiltonian' },
        { key: 'speed', label: 'Speed', min: 0.2, max: 2.5, step: 0.1, group: 'hamiltonian' },
        { key: 'intensity', label: 'Intensity', min: 10, max: 50, step: 1, group: 'hamiltonian' },
      ];
    }
    if (activeId === 'cursor-vector') {
      return [
        { key: 'spacing', label: 'Grid spacing', min: 16, max: 44, step: 2, group: 'cursor' },
        { key: 'influence', label: 'Influence radius', min: 80, max: 360, step: 10, group: 'cursor' },
        { key: 'arrowLength', label: 'Arrow length', min: 6, max: 24, step: 1, group: 'cursor' },
      ];
    }
    return [
      { key: 'sigma', label: 'Measurement noise', min: 4, max: 24, step: 1, group: 'kalman' },
      { key: 'processNoise', label: 'Process noise', min: 0.05, max: 1.2, step: 0.05, group: 'kalman' },
      { key: 'trail', label: 'Trail length', min: 80, max: 360, step: 10, group: 'kalman' },
    ];
  }, [activeId]);

  const updateParam = (group, key, value) => {
    setParams((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: Number(value),
      },
    }));
  };

  if (!supportsCanvas) {
    return (
      <div className="min-h-screen">
        <section className="section">
          <div className="glass-card p-8">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Lab Fallback</div>
            <h1 className="font-display mt-3 text-4xl">Interactive rendering unavailable.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Canvas is not available in this environment. Static descriptions are shown as a progressive fallback layer.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {EXPERIMENTS.map((item) => (
                <div key={item.id} className="surface rounded-2xl border border-[var(--line)] p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">{item.mode}</div>
                  <div className="font-display mt-2 text-xl">{item.title}</div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Lab</div>
            <h1 className="font-display text-4xl">Mathematical interactive systems.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Canvas-only modules with parameter controls and progressive fallback behavior.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Canvas + Estimation
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="glass-card relative min-h-[460px] overflow-hidden p-0">
            <canvas ref={canvasRef} className="h-full w-full"></canvas>
            <div className="absolute left-6 top-6 rounded-full border border-[var(--line)] bg-[var(--paper)]/85 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              {current?.title}
            </div>
            {statusMessage && (
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-sky-400/40 bg-black/60 px-4 py-3 text-xs text-sky-200">
                {statusMessage}
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Experiments</div>
            <div className="mt-5 grid gap-4">
              {EXPERIMENTS.map((experiment) => (
                <button
                  key={experiment.id}
                  onClick={() => setActiveId(experiment.id)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    experiment.id === activeId
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="text-xs uppercase tracking-[0.25em]">{experiment.mode}</div>
                  <div className="font-display mt-2 text-lg">{experiment.title}</div>
                  <p className="mt-2 text-xs text-[var(--muted)]">{experiment.description}</p>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]">
                    {experiment.math}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-[var(--line)] pt-5">
              <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Parameters</div>
              <div className="mt-4 space-y-4">
                {activeControls.map((control) => {
                  const value = params[control.group][control.key];
                  return (
                    <label key={control.key} className="block">
                      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                        <span>{control.label}</span>
                        <span>{value}</span>
                      </div>
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={value}
                        onChange={(event) => updateParam(control.group, control.key, event.target.value)}
                        className="w-full accent-[var(--accent)]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lab;
