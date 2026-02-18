import { useEffect, useRef, useState } from 'react';

const EXPERIMENTS = [
  {
    id: 'flow-field',
    title: 'Flow Field Atlas',
    description: 'Particle traces steered by a slow noise field.',
    mode: 'canvas',
  },
  {
    id: 'prism-shader',
    title: 'Prism Shader',
    description: 'WebGL plasma gradient with time-driven distortion.',
    mode: 'webgl',
  },
  {
    id: 'signal-scan',
    title: 'Signal Scan',
    description: 'A sweeping radar-like scan with reactive noise.',
    mode: 'canvas',
  },
];

const Lab = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeId, setActiveId] = useState('flow-field');

  useEffect(() => {
    const activeExists = EXPERIMENTS.some((experiment) => experiment.id === activeId);
    if (!activeExists) {
      setActiveId(EXPERIMENTS[0].id);
    }
  }, [activeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const experiment = EXPERIMENTS.find((item) => item.id === activeId);
    if (!experiment) return;

    let running = true;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener('resize', resize);

    const stopAnimation = () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    if (experiment.mode === 'canvas') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return () => {};
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = () => canvas.width / dpr;
      const height = () => canvas.height / dpr;

      let time = 0;
      const particles = Array.from({ length: 260 }, () => ({
        x: Math.random() * width(),
        y: Math.random() * height(),
        vx: 0,
        vy: 0,
      }));

      const drawFlow = () => {
        if (!running) return;
        ctx.fillStyle = 'rgba(15, 12, 10, 0.08)';
        ctx.fillRect(0, 0, width(), height());
        ctx.strokeStyle = 'rgba(255, 122, 89, 0.5)';
        ctx.lineWidth = 1;
        particles.forEach((p) => {
          const angle = Math.sin((p.x + time) * 0.002) + Math.cos((p.y - time) * 0.002);
          p.vx += Math.cos(angle) * 0.15;
          p.vy += Math.sin(angle) * 0.15;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.9;
          p.vy *= 0.9;

          if (p.x < 0 || p.x > width() || p.y < 0 || p.y > height()) {
            p.x = Math.random() * width();
            p.y = Math.random() * height();
          }

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 6, p.y + p.vy * 6);
          ctx.stroke();
        });
        time += 1.5;
        animationRef.current = requestAnimationFrame(drawFlow);
      };

      const drawScan = () => {
        if (!running) return;
        ctx.fillStyle = 'rgba(12, 14, 18, 0.12)';
        ctx.fillRect(0, 0, width(), height());
        const centerX = width() * 0.5;
        const centerY = height() * 0.55;
        const radius = Math.min(width(), height()) * 0.45;

        ctx.strokeStyle = 'rgba(19, 138, 111, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i += 1) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2);
          ctx.stroke();
        }

        const sweep = (time * 0.015) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(sweep) * radius,
          centerY + Math.sin(sweep) * radius
        );
        ctx.strokeStyle = 'rgba(240, 193, 75, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        for (let i = 0; i < 30; i += 1) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * radius;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.beginPath();
          ctx.arc(centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        time += 1;
        animationRef.current = requestAnimationFrame(drawScan);
      };

      ctx.fillStyle = '#0f0c0a';
      ctx.fillRect(0, 0, width(), height());
      if (experiment.id === 'flow-field') {
        drawFlow();
      } else {
        drawScan();
      }
    }

    if (experiment.mode === 'webgl') {
      const gl = canvas.getContext('webgl', { antialias: true });
      if (!gl) return () => {};

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
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution;
          float wave = sin(st.x * 8.0 + u_time) + cos(st.y * 6.0 - u_time);
          float glow = smoothstep(0.2, 0.8, wave);
          vec3 colorA = vec3(0.12, 0.82, 0.7);
          vec3 colorB = vec3(0.95, 0.55, 0.25);
          vec3 color = mix(colorA, colorB, glow);
          gl_FragColor = vec4(color, 1.0);
        }
      `;

      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      };

      const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
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

      const draw = (time) => {
        if (!running) return;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
        gl.uniform1f(timeUniform, time * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationRef.current = requestAnimationFrame(draw);
      };

      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      stopAnimation();
      window.removeEventListener('resize', resize);
    };
  }, [activeId]);

  return (
    <div className="min-h-screen">
      <section className="section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Lab</div>
            <h1 className="font-display text-4xl">Interactive experiments.</h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              A playground for visual systems.
            </p>
          </div>
          <div className="rounded-full border border-[var(--line)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Live Canvas + WebGL
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="glass-card relative min-h-[420px] overflow-hidden p-0">
            <canvas ref={canvasRef} className="h-full w-full"></canvas>
            <div className="absolute left-6 top-6 rounded-full border border-[var(--line)] bg-[var(--paper)]/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              {EXPERIMENTS.find((item) => item.id === activeId)?.title ?? 'Select an experiment'}
            </div>
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
