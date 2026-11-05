import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { expoOut } from './transitions';

interface SplitTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  stagger?: number;
  delay?: number;
  mode?: 'words' | 'chars';
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
  stagger = 0.04,
  delay = 0,
  mode = 'words',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const items = mode === 'words' ? text.split(' ') : text.split('');

  return (
    <Component className={`inline-block ${className}`} aria-label={text}>
      {/* Screen reader full text */}
      <span className="sr-only">{text}</span>

      {/* Visual animated tokens */}
      <span aria-hidden="true" className="inline">
        {items.map((token, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-top leading-tight mr-[0.25em] last:mr-0"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.75,
                ease: expoOut,
                delay: delay + i * stagger,
              }}
            >
              {token === ' ' ? '\u00A0' : token}
            </motion.span>
          </span>
        ))}
      </span>
    </Component>
  );
};
