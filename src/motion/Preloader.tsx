import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from './useReducedMotion';
import { motionConfig } from './config';
import { expoOut } from './transitions';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!motionConfig.preloaderEnabled || shouldReduceMotion || isAdminRoute) {
      return false;
    }
    try {
      const seen = sessionStorage.getItem('umesh_preloader_seen');
      return seen !== 'true';
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      if (onComplete) onComplete();
      return;
    }

    const startTime = performance.now();
    const duration = motionConfig.preloaderMaxDuration * 1000;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          try {
            sessionStorage.setItem('umesh_preloader_seen', 'true');
          } catch {
            // ignore
          }
          if (onComplete) onComplete();
        }, 180);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  // Handle immediate skip on click or keypress
  const handleSkip = () => {
    setIsLoading(false);
    try {
      sessionStorage.setItem('umesh_preloader_seen', 'true');
    } catch {
      // ignore
    }
    if (onComplete) onComplete();
  };

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ y: 0 }}
        exit={{
          y: '-100%',
          transition: { duration: 0.75, ease: expoOut },
        }}
        onClick={handleSkip}
        className="fixed inset-0 z-[999] bg-[#070708] flex flex-col items-center justify-center cursor-pointer select-none px-6"
      >
        <div className="flex flex-col items-center max-w-xs w-full text-center">
          {/* Top category / status tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>INITIALIZING SYSTEM</span>
          </motion.div>

          {/* Central Monogram / Branding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: expoOut }}
            className="font-editorial text-4xl sm:text-5xl text-white tracking-tight mb-6"
          >
            UMESH<span className="text-orange-500">.</span>DEV
          </motion.div>

          {/* Orange Progress Line Bar */}
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-4">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Progress % and Skip Tip */}
          <div className="w-full flex items-center justify-between font-mono text-[11px] text-zinc-500">
            <span>{progress}%</span>
            <span className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
              CLICK TO SKIP ↗
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
