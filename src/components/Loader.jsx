import { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showLoader && (
        <Motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--paper)]"
        >
          <div className="flex flex-col items-center gap-6">
            <Motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="h-20 w-20 rounded-full border border-[var(--line)] bg-aurora"
            ></Motion.div>
            <div className="text-center">
              <div className="font-display text-2xl tracking-tight">Preparing the studio</div>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                01 / 04 assembling atmosphere
              </div>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
