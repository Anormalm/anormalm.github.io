import { useEffect } from 'react';

const AmbientField = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reducedMotion || !finePointer) return undefined;

    let frame = 0;
    const onPointerMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div className="ambient-field" aria-hidden="true">
      <span className="ambient-field-cursor" />
      <span className="ambient-field-orb ambient-field-orb-one" />
      <span className="ambient-field-orb ambient-field-orb-two" />
      <span className="ambient-noise" />
    </div>
  );
};

export default AmbientField;
