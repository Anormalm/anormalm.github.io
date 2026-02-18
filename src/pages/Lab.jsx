import { useEffect, useRef, useState } from 'react';

const EXPERIMENTS = [
  {
    id: 'hamiltonian-flow',
    title: 'Hamiltonian Flow Field',
    description:
      'Particle advection in an incompressible vector field derived from stream function psi(x,y)=sin(ax)sin(by).',
    mode: 'canvas',
    math: 'Divergence-free flow, RK2 integration',
  },
  {
    id: 'spectral-shader',
    title: 'Spectral Interference Shader',
    description:
      'Real-time Fourier-style superposition of directional wave modes rendered in WebGL.',
    mode: 'webgl',
    math: 'Wave summation and phase evolution',
  },
  {
    id: 'kalman-tracker',
    title: 'Kalman Target Tracker',
    description:
      '2D constant-velocity Kalman filter estimating trajectory from noisy observations.',
    mode: 'canvas',
    math: 'State estimation with Gaussian noise',
  },
];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const Lab = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeId, setActiveId] = useState(EXPERIMENTS[0].id);
  const [renderError, setRenderError] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const experiment = EXPERIMENTS.find((item) => item.id === activeId);
    if (!experiment) return;

    setRenderError('');

    let running = true;
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    if (!parent) return;

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    let disposeExperiment = () => {};

    const drawHamiltonianFlow = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;
      const particleCount = 520;
      let time = 0;

      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width(),
        y: Math.random() * height(),
      }));

      const field = (x, y, t) => {
        const w = width();
        const h = height();
        const xn = (x / w) * (2 * Math.PI) - Math.PI;
        const yn = (y / h) * (2 * Math.PI) - Math.PI;
        const a = 1.6 + 0.2 * Math.sin(t * 0.00025);
        const b = 1.2 + 0.15 * Math.cos(t * 0.00019);
        const vx = b * Math.sin(a * xn) * Math.cos(b * yn);
        const vy = -a * Math.cos(a * xn) * Math.sin(b * yn);
        return { vx: vx * 28, vy: vy * 28 };
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
          const mx = p.x + 0.5 * k1.vx * 0.016;
          const my = p.y + 0.5 * k1.vy * 0.016;
          const k2 = field(mx, my, time + 8);

          const nx = p.x + k2.vx * 0.016;
          const ny = p.y + k2.vy * 0.016;

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

    const drawKalmanTracker = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;

      const dt = 1 / 60;
      const sigma = 13;
      const q = 0.4;
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
      const H = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
      ];
      const Ht = [
        [1, 0],
        [0, 1],
        [0, 0],
        [0, 0],
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
        for (let i = 0; i < 4; i += 1) {
          for (let j = 0; j < 4; j += 1) {
            P[i][j] += Q[i][j];
          }
        }

        const y = [z[0] - x[0], z[1] - x[1]];
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
          x[0] + K[0][0] * y[0] + K[0][1] * y[1],
          x[1] + K[1][0] * y[0] + K[1][1] * y[1],
          x[2] + K[2][0] * y[0] + K[2][1] * y[1],
          x[3] + K[3][0] * y[0] + K[3][1] * y[1],
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
        if (trueTrail.length > 240) trueTrail.shift();
        if (measurementTrail.length > 120) measurementTrail.shift();
        if (estimateTrail.length > 240) estimateTrail.shift();

        ctx.fillStyle = 'rgba(10, 17, 29, 0.18)';
        ctx.fillRect(0, 0, width(), height());

        const polyline = (pts, stroke, widthPx) => {
          if (pts.length < 2) return;
          ctx.strokeStyle = stroke;
          ctx.lineWidth = widthPx;
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i += 1) {
            ctx.lineTo(pts[i][0], pts[i][1]);
          }
          ctx.stroke();
        };

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

    const drawCursorVectorField = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;
      const spacing = 28;
      const arrowLength = 14;
      const influence = 210;
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
        ctx.lineTo(
          x2 - Math.cos(angle - 0.42) * head,
          y2 - Math.sin(angle - 0.42) * head
        );
        ctx.moveTo(x2, y2);
        ctx.lineTo(
          x2 - Math.cos(angle + 0.42) * head,
          y2 - Math.sin(angle + 0.42) * head
        );
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

        phase += 1.4;
        animationRef.current = requestAnimationFrame(tick);
      };

      ctx.fillStyle = '#080f1b';
      ctx.fillRect(0, 0, width(), height());
      tick();
    };

    const drawSpectralShader = () => {
      const gl =
        canvas.getContext('webgl2', { antialias: true }) ||
        canvas.getContext('webgl', { antialias: true }) ||
        canvas.getContext('experimental-webgl', { antialias: true });
      if (!gl) {
        setRenderError('WebGL unavailable. Fallback active: Cursor Vector Field.');
        drawCursorVectorField();
        return;
      }

      const vertexSource = `
        attribute vec2 a_position;
        void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const fragmentSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;

        float wave(vec2 p, vec2 k, float w, float phase) {
          return sin(dot(p, k) + w * u_time + phase);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
          uv.x *= u_resolution.x / u_resolution.y;

          float f =
            0.42 * wave(uv, vec2(4.0, 1.7), 1.05, 0.0) +
            0.31 * wave(uv, vec2(-2.4, 5.2), -0.82, 1.2) +
            0.20 * wave(uv, vec2(7.1, -3.8), 0.57, 2.4) +
            0.14 * wave(uv, vec2(-8.3, -2.1), -0.44, 0.7);

          float g = smoothstep(-0.25, 0.55, f);
          vec3 c0 = vec3(0.06, 0.10, 0.20);
          vec3 c1 = vec3(0.12, 0.44, 0.95);
          vec3 c2 = vec3(0.00, 0.78, 0.68);
          vec3 color = mix(mix(c0, c1, g), c2, smoothstep(0.52, 1.0, g));

          gl_FragColor = vec4(color, 1.0);
        }
      `;

      const compileShader = (type, source) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!ok) {
          const info = gl.getShaderInfoLog(shader) || 'Shader compile error';
          setRenderError(`Shader issue. Fallback active: Cursor Vector Field. (${info})`);
          gl.deleteShader(shader);
          drawCursorVectorField();
          return null;
        }
        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) return;

      const program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        setRenderError('Program link issue. Fallback active: Cursor Vector Field.');
        gl.deleteProgram(program);
        drawCursorVectorField();
        return;
      }

      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const position = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
      const timeUniform = gl.getUniformLocation(program, 'u_time');

      const tick = (ms) => {
        if (!running) return;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
        gl.uniform1f(timeUniform, ms * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationRef.current = requestAnimationFrame(tick);
      };

      tick(0);
    };

    if (experiment.id === 'hamiltonian-flow') drawHamiltonianFlow();
    if (experiment.id === 'kalman-tracker') drawKalmanTracker();
    if (experiment.id === 'spectral-shader') drawSpectralShader();

    return () => {
      stop();
      disposeExperiment();
      window.removeEventListener('resize', resize);
    };
  }, [activeId]);

  const current = EXPERIMENTS.find((item) => item.id === activeId);

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Lab</div>
            <h1 className="font-display text-4xl">Mathematical interactive systems.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Experiments based on numerical integration, spectral methods, and state estimation.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Canvas + WebGL + Estimation
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="glass-card relative min-h-[460px] overflow-hidden p-0">
            <canvas ref={canvasRef} className="h-full w-full"></canvas>
            <div className="absolute left-6 top-6 rounded-full border border-[var(--line)] bg-[var(--paper)]/85 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              {current?.title}
            </div>
            {renderError && (
              <div
                className={`absolute bottom-4 left-4 right-4 rounded-xl border bg-black/60 px-4 py-3 text-xs ${
                  renderError.includes('Fallback active')
                    ? 'border-sky-400/40 text-sky-200'
                    : 'border-red-400/40 text-red-200'
                }`}
              >
                Render error: {renderError}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lab;
