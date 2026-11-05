import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { primaryEase } from './transitions';
import { motionConfig } from './config';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number; // milliseconds or fractional seconds
  y?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'article' | 'span' | 'p' | 'li';
  viewportMargin?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 24,
  duration = motionConfig.durations.normal,
  className = '',
  style,
  as = 'div',
  viewportMargin = '-80px',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Normalize delay: if user passed delay in ms (e.g. 150), convert to seconds (0.15)
  const delaySec = delay > 5 ? delay / 1000 : delay;

  const Component = motion[as] as typeof motion.div;

  if (shouldReduceMotion) {
    return (
      <Component
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: viewportMargin }}
        transition={{ duration: 0.25, delay: delaySec }}
        className={className}
        style={style}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration,
        delay: delaySec,
        ease: primaryEase,
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};
