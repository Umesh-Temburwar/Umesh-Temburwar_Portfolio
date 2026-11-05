import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { motionConfig } from './config';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // Distance multiplier (0.1 to 0.4)
  radius?: number; // Activation distance from center in px
  className?: string;
  as?: 'div' | 'span';
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.28,
  radius = 65,
  className = '',
  as = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(pointer: fine)').matches);
    }
  }, []);

  const springConfig = { stiffness: 280, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!motionConfig.magneticButtonsEnabled || shouldReduceMotion || !canHover || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < radius) {
      x.set((e.clientX - centerX) * strength);
      y.set((e.clientY - centerY) * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = motion[as] as typeof motion.div;

  if (shouldReduceMotion || !motionConfig.magneticButtonsEnabled || !canHover) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </Component>
  );
};
