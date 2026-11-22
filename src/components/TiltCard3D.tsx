import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

export interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glareOpacity?: number;
  glareColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.015,
  glareOpacity = 0.14,
  glareColor = 'rgba(245, 165, 36, 0.25)',
  onClick,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Scroll tracking for this specific card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // When card enters from bottom: tilted up towards user (e.g. 7deg)
  // When centered in viewport: flat (0deg)
  // When scrolling past top: tilted back (-7deg)
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [7, 0, -7]);
  const scrollTranslateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-25, 0, -25]);

  // Normalized mouse coords (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for organic 3D response
  const springConfig = { damping: 22, stiffness: 260, mass: 0.6 };
  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  // Combined 3D rotation: mouse tilt + scroll tilt
  const combinedRotateX = useTransform(
    [mouseRotateX, scrollRotateX],
    ([mrx, srx]: number[]) => mrx + srx
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);

    setGlarePos({
      x: Math.round(x * 100),
      y: Math.round(y * 100),
    });
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: combinedRotateX,
        rotateY: mouseRotateY,
        z: scrollTranslateZ,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        ...style,
      }}
      whileHover={{ scale }}
      transition={{ duration: 0.25 }}
      className={`relative transform-gpu will-change-transform ${className}`}
    >
      {/* Dynamic 3D Specular Light Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 65%)`,
        }}
      />

      {/* 3D Border Glow on Hover */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300 border border-orange-500/0"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: 'inset 0 0 20px rgba(245, 165, 36, 0.08), 0 10px 30px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Content wrapper with preserve-3d to allow nested child translateZ depth */}
      <div style={{ transformStyle: 'preserve-3d' }} className="w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard3D;
