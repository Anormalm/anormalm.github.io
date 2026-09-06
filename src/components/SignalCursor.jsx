import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiMapPin, FiMove } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const MODE_COPY = {
  default: ['', ''],
  open: ['OPEN', '打开'],
  read: ['READ', '阅读'],
  pin: ['PIN', '落针'],
  pull: ['PULL', '牵引'],
  drag: ['DRAG', '拖动'],
  swipe: ['SWIPE', '滑动'],
};

const SignalCursor = () => {
  const { isChinese } = useLanguage();
  const cursorRef = useRef(null);
  const [mode, setMode] = useState('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!finePointer.matches) return undefined;

    document.body.classList.add('signal-cursor-enabled');
    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const updatePosition = () => {
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      frame = 0;
    };

    const onPointerMove = (event) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(updatePosition);
      setVisible(true);

      const target = document.elementFromPoint(event.clientX, event.clientY);
      const cursorTarget = target?.closest?.('[data-cursor]');
      const nextMode = cursorTarget?.dataset.cursor || (target?.closest?.('a, button') ? 'open' : 'default');
      setMode((current) => (current === nextMode ? current : nextMode));
    };

    const onPointerLeave = () => setVisible(false);
    const onPointerEnter = () => setVisible(true);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onPointerLeave);
    document.documentElement.addEventListener('mouseenter', onPointerEnter);

    return () => {
      document.body.classList.remove('signal-cursor-enabled');
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      document.documentElement.removeEventListener('mouseenter', onPointerEnter);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const copy = MODE_COPY[mode] || MODE_COPY.default;

  return (
    <div
      ref={cursorRef}
      className={`signal-cursor signal-cursor-${mode} ${visible ? 'is-visible' : ''}`}
      aria-hidden="true"
    >
      <span className="signal-cursor-core">
        {mode === 'pin' && <FiMapPin />}
        {(mode === 'drag' || mode === 'pull' || mode === 'swipe') && <FiMove />}
        {(mode === 'open' || mode === 'read') && <FiArrowUpRight />}
      </span>
      {copy[0] && <small>{copy[isChinese ? 1 : 0]}</small>}
    </div>
  );
};

export default SignalCursor;
