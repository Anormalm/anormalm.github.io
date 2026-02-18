import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DebugHud = ({ ambientMode }) => {
  const location = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [fps, setFps] = useState(0);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        setEnabled((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;
    let last = performance.now();
    let frames = 0;
    let accumulator = 0;

    const tick = (now) => {
      const dt = now - last;
      last = now;
      frames += 1;
      accumulator += dt;
      if (accumulator >= 450) {
        setFps(Math.round((frames * 1000) / accumulator));
        frames = 0;
        accumulator = 0;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  const capabilities = useMemo(() => {
    const canvas = document.createElement('canvas');
    return {
      canvas2d: Boolean(canvas.getContext('2d')),
      webgl2: Boolean(canvas.getContext('webgl2')),
      webgl: Boolean(canvas.getContext('webgl')),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-3 right-3 z-[90] w-[280px] rounded-2xl border border-[var(--line)] bg-[var(--paper)]/95 p-3 text-[11px] leading-relaxed shadow-xl backdrop-blur">
      <div className="text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Debug HUD</div>
      <div className="mt-2 text-[var(--muted)]">
        <div>Route: {location.pathname}</div>
        <div>FPS: {fps || '--'}</div>
        <div>Theme: {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</div>
        <div>Ambient: {ambientMode}</div>
        <div>
          Viewport: {viewport.width}x{viewport.height}
        </div>
        <div>Canvas2D: {capabilities.canvas2d ? 'yes' : 'no'}</div>
        <div>WebGL2: {capabilities.webgl2 ? 'yes' : 'no'}</div>
        <div>WebGL: {capabilities.webgl ? 'yes' : 'no'}</div>
        <div>Reduced motion: {capabilities.reducedMotion ? 'yes' : 'no'}</div>
      </div>
    </div>
  );
};

export default DebugHud;
