import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export const GridBackground3D: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Move grid pattern along the 3D perspective plane on scroll
  const gridOffsetY = useTransform(scrollY, (v) => `${(v * 0.45) % 80}px`);

  if (shouldReduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] select-none">
      {/* Bottom 3D Ground Perspective Plane */}
      <div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[220vw] h-[65vh]"
        style={{
          perspective: 700,
          perspectiveOrigin: '50% 10%',
        }}
      >
        <motion.div
          style={{
            transform: 'rotateX(68deg) translateZ(0)',
            backgroundPositionY: gridOffsetY,
            backgroundImage: `
              linear-gradient(to right, rgba(245, 165, 36, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(245, 165, 36, 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '70px 70px',
            maskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.5) 45%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.5) 45%, transparent 85%)',
          }}
          className="w-full h-full transform-gpu"
        />
      </div>

      {/* Subtle Top 3D Cyber Ceiling Grid */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[220vw] h-[40vh]"
        style={{
          perspective: 700,
          perspectiveOrigin: '50% 90%',
        }}
      >
        <motion.div
          style={{
            transform: 'rotateX(-72deg) translateZ(0)',
            backgroundPositionY: gridOffsetY,
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '90px 90px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 75%)',
          }}
          className="w-full h-full transform-gpu"
        />
      </div>

      {/* Atmospheric Horizon Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-36 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(245, 165, 36, 0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
};

export default GridBackground3D;
