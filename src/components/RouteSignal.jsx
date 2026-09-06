import { motion as Motion, useReducedMotion } from 'framer-motion';

const ROUTE_ORIGINS = {
  '/': 0.1,
  '/projects': 0.54,
  '/writings': 0.62,
  '/lab': 0.7,
  '/cv': 0.77,
  '/contact': 0.85,
  '/privacy': 0.9,
  '/node': 0.05,
};

const RouteSignal = ({ pathname }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  const origin = ROUTE_ORIGINS[pathname] ?? 0.5;
  const startX = typeof window === 'undefined' ? 0 : window.innerWidth * origin;
  const endX = typeof window === 'undefined' ? 0 : window.innerWidth * 0.5;
  const endY = typeof window === 'undefined' ? 0 : Math.min(window.innerHeight * 0.22, 220);

  return (
    <Motion.div
      key={pathname}
      className="route-signal"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
      aria-hidden="true"
    >
      <Motion.span
        className="route-signal-trail"
        initial={{ x: startX, y: 34, scaleX: 0.05, opacity: 0.8 }}
        animate={{ x: endX, y: endY, scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      />
      <Motion.span
        className="route-signal-node"
        initial={{ x: startX, y: 34, scale: 0.55 }}
        animate={{ x: endX, y: endY, scale: [0.55, 0.85, 2.1] }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      />
    </Motion.div>
  );
};

export default RouteSignal;
