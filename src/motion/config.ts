/**
 * Central Motion & Animation Configuration
 * Single source of truth for all animation flags, speeds, and easings.
 * Any effect can be toggled on/off or adjusted here.
 */

export interface MotionConfig {
  /** Global toggle for custom cursor (desktop only, hidden on touch) */
  cursorEnabled: boolean;
  /** Global toggle for landing preloader (shown once per session) */
  preloaderEnabled: boolean;
  /** Global toggle for Lenis smooth scroll */
  smoothScrollEnabled: boolean;
  /** Global toggle for magnetic button pull effects */
  magneticButtonsEnabled: boolean;
  /** Global toggle for 3D tilt effects on cards */
  tiltEnabled: boolean;
  /** Max duration for landing preloader in seconds */
  preloaderMaxDuration: number;
  /** Standard durations in seconds */
  durations: {
    fast: number;
    normal: number;
    slow: number;
    deliberate: number;
  };
  /** Shared cubic-bezier easing arrays [x1, y1, x2, y2] */
  easings: {
    primary: [number, number, number, number];
    expoOut: [number, number, number, number];
    smoothOut: [number, number, number, number];
  };
}

export const motionConfig: MotionConfig = {
  cursorEnabled: true,
  preloaderEnabled: true,
  smoothScrollEnabled: true,
  magneticButtonsEnabled: true,
  tiltEnabled: true,
  preloaderMaxDuration: 1.2,
  durations: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.85,
    deliberate: 1.1,
  },
  easings: {
    // Premium cinematic ease: smooth acceleration, long deceleration
    primary: [0.22, 1, 0.36, 1],
    expoOut: [0.16, 1, 0.3, 1],
    smoothOut: [0.25, 0.9, 0.35, 1],
  },
};
