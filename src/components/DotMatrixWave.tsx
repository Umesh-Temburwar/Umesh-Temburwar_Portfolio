import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface DotMatrixWaveProps {
  motionEnabled?: boolean;
  className?: string;
  rows?: number;
  cols?: number;
  accentColor?: string;
}

export const DotMatrixWave: React.FC<DotMatrixWaveProps> = ({
  motionEnabled = true,
  className = '',
  rows = 12,
  cols = 55,
  accentColor = 'rgba(245, 165, 36, 0.45)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 140);
    let isInView = true;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 140;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // IntersectionObserver to pause when not in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (isInView && !animRef.current && effectiveMotion) {
          render();
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    let time = 0;
    const effectiveMotion = motionEnabled && !shouldReduceMotion;

    const render = () => {
      if (!isInView) {
        animRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      time += effectiveMotion ? 0.025 : 0;

      const spacingX = width / cols;
      const spacingY = height / (rows + 2);

      // 1. Batch accents
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((c + r) % 9 === 0) {
            const x = c * spacingX + spacingX / 2;
            const wave1 = Math.sin(time + c * 0.12 + r * 0.35) * 10;
            const wave2 = Math.cos(time * 0.7 + c * 0.08) * 6;
            const y = (r + 1.5) * spacingY + wave1 + wave2;
            const radius = 1.2;
            ctx.moveTo(x + radius, y);
            ctx.arc(x, y, radius, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      // 2. Batch normal dots
      ctx.fillStyle = 'rgba(215, 222, 235, 0.28)';
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((c + r) % 9 !== 0) {
            const x = c * spacingX + spacingX / 2;
            const wave1 = Math.sin(time + c * 0.12 + r * 0.35) * 10;
            const wave2 = Math.cos(time * 0.7 + c * 0.08) * 6;
            const y = (r + 1.5) * spacingY + wave1 + wave2;
            const radius = 0.9;
            ctx.moveTo(x + radius, y);
            ctx.arc(x, y, radius, 0, Math.PI * 2);
          }
        }
      }
      ctx.fill();

      if (effectiveMotion && isInView) {
        animRef.current = requestAnimationFrame(render);
      } else {
        animRef.current = null;
      }
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [motionEnabled, shouldReduceMotion, rows, cols, accentColor]);

  return (
    <div ref={containerRef} className={`w-full overflow-hidden flex items-center justify-center opacity-60 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-[140px]" />
    </div>
  );
};

