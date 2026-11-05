import { Variants } from 'framer-motion';
import { primaryEase, expoOut } from './transitions';
import { motionConfig } from './config';

/**
 * GPU-accelerated motion variants.
 * Only transform (translate3d, scale) and opacity are animated to prevent layout thrashing.
 */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: motionConfig.durations.normal,
      ease: primaryEase,
    },
  },
};

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionConfig.durations.normal,
      ease: primaryEase,
    },
  },
};

export const fadeDown: Variants = {
  hidden: {
    opacity: 0,
    y: -24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionConfig.durations.normal,
      ease: primaryEase,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionConfig.durations.normal,
      ease: primaryEase,
    },
  },
};

export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -36,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: motionConfig.durations.slow,
      ease: primaryEase,
    },
  },
};

export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: 36,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: motionConfig.durations.slow,
      ease: primaryEase,
    },
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionConfig.durations.normal,
      ease: primaryEase,
    },
  },
};

export const maskReveal: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: motionConfig.durations.slow,
      ease: expoOut,
    },
  },
};
