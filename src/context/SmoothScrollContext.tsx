import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
  lock?: boolean;
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's reduced-motion preference if enabled
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    // High performance responsive silky smooth Lenis configuration (zero lag)
    const lenis = new Lenis({
      lerp: 0.1, // Immediate response: zero delay, instantaneous start, buttery smooth momentum
      wheelMultiplier: 1.0, // Natural 1:1 distance per mouse notch
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true, // Native Lenis internal RAF loop for perfect 60-144Hz timing
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      delete window.__lenis;
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: ScrollToOptions) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? -70,
        duration: options?.duration ?? 1.0,
        immediate: options?.immediate ?? false,
        lock: options?.lock ?? false,
      });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

