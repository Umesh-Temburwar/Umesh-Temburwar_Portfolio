import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Returns true if the user's OS prefers reduced motion or if running in an environment
 * where reduced motion is favored.
 */
export const useReducedMotion = (): boolean => {
  const prefersReduced = useFramerReducedMotion();
  return Boolean(prefersReduced);
};
