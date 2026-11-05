import { Transition } from 'framer-motion';
import { motionConfig } from './config';

/** Shared easing curves */
export const primaryEase = motionConfig.easings.primary;
export const expoOut = motionConfig.easings.expoOut;
export const smoothOut = motionConfig.easings.smoothOut;

/** Shared transition definitions */
export const transitions = {
  fast: {
    duration: motionConfig.durations.fast,
    ease: primaryEase,
  } as Transition,

  normal: {
    duration: motionConfig.durations.normal,
    ease: primaryEase,
  } as Transition,

  slow: {
    duration: motionConfig.durations.slow,
    ease: primaryEase,
  } as Transition,

  deliberate: {
    duration: motionConfig.durations.deliberate,
    ease: expoOut,
  } as Transition,

  smoothSpring: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
    mass: 0.8,
  } as Transition,

  quickSpring: {
    type: 'spring',
    stiffness: 380,
    damping: 28,
  } as Transition,

  gentleSpring: {
    type: 'spring',
    stiffness: 160,
    damping: 20,
    mass: 1,
  } as Transition,

  magneticSpring: {
    type: 'spring',
    stiffness: 280,
    damping: 20,
    mass: 0.5,
  } as Transition,
};
