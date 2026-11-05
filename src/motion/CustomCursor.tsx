import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from './useReducedMotion';
import { motionConfig } from './config';

export const CustomCursor: React.FC = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'view'>('default');
  const [isCoarse, setIsCoarse] = useState(true);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring for the outer ring
  const ringX = useSpring(mouseX, { stiffness: 280, damping: 24, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 280, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarseCheck = window.matchMedia('(pointer: coarse)').matches;
    setIsCoarse(coarseCheck);
    if (coarseCheck) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const viewTarget = target.closest('[data-cursor="view"]');
      if (viewTarget) {
        setCursorType('view');
        return;
      }

      const interactive = target.closest('a, button, [role="button"], input, select, textarea');
      if (interactive) {
        setCursorType('hover');
        return;
      }

      setCursorType('default');
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  // NEVER load cursor on admin routes, or if reduced-motion is requested, or if touch device, or if disabled in config
  if (
    !motionConfig.cursorEnabled ||
    shouldReduceMotion ||
    isCoarse ||
    location.pathname.startsWith('/admin') ||
    !isVisible
  ) {
    return null;
  }

  const isView = cursorType === 'view';
  const isHover = cursorType === 'hover';

  return (
    <>
      {/* Precision inner center dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[120] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isView ? 0 : 1,
        }}
      />

      {/* Trailing interactive ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[119] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border border-orange-500/50 backdrop-blur-[1px]"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: isView ? 64 : isHover ? 44 : 28,
          height: isView ? 64 : isHover ? 44 : 28,
          backgroundColor: isView
            ? 'rgba(245, 165, 36, 0.9)'
            : isHover
            ? 'rgba(245, 165, 36, 0.12)'
            : 'rgba(245, 165, 36, 0.02)',
          borderColor: isView
            ? 'rgba(245, 165, 36, 1)'
            : isHover
            ? 'rgba(245, 165, 36, 0.7)'
            : 'rgba(245, 165, 36, 0.35)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 25 }}
      >
        {isView && (
          <span className="font-mono text-[10px] uppercase font-bold text-black tracking-wider select-none">
            View
          </span>
        )}
      </motion.div>
    </>
  );
};

