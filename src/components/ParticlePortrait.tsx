import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValue } from 'framer-motion';

interface Particle {
  ox: number; // original X
  oy: number; // original Y
  x: number;  // current X
  y: number;  // current Y
  vx: number; // velocity X
  vy: number; // velocity Y
  radius: number;
  alpha: number;
  phase: number;
  isAccent: boolean;
}

interface ParticlePortraitProps {
  imageSrc?: string;
  motionEnabled?: boolean;
  className?: string;
}

export const ParticlePortrait: React.FC<ParticlePortraitProps> = ({
  imageSrc = '/umesh-cutout.png',
  motionEnabled = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const animFrameRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  // Mouse tilt motion values
  const mouseTiltX = useMotionValue(0);
  const mouseTiltY = useMotionValue(0);

  // Scroll tracking for Hero stage
  const { scrollY } = useScroll();

  // Scroll-driven 3D transforms (0 to 600px scroll)
  const scrollRotateX = useTransform(scrollY, [0, 600], [0, 22]);
  const scrollRotateY = useTransform(scrollY, [0, 600], [0, -18]);
  const scrollZ = useTransform(scrollY, [0, 600], [0, -95]);
  const scrollScale = useTransform(scrollY, [0, 600], [1, 0.90]);

  // Combined 3D rotation: interactive mouse + scroll-driven 3D tilt
  const totalRotateX = useTransform(
    [mouseTiltY, scrollRotateX],
    ([my, sy]: number[]) => my + sy
  );
  const totalRotateY = useTransform(
    [mouseTiltX, scrollRotateY],
    ([mx, sy]: number[]) => mx + sy
  );

  // Deep orbital rings separate backwards & spin on scroll
  const orbitDepth = useTransform(scrollY, [0, 600], [-60, -145]);
  const orbitRotateZ = useTransform(scrollY, [0, 600], [0, 160]);
  const orbitRotateX = useTransform(scrollY, [0, 600], [25, 65]);

  // Floating 3D badges detach forward towards user on scroll
  const badge1Z = useTransform(scrollY, [0, 600], [65, 145]);
  const badge1X = useTransform(scrollY, [0, 600], [0, 35]);
  const badge1Y = useTransform(scrollY, [0, 600], [0, -15]);

  const badge2Z = useTransform(scrollY, [0, 600], [80, 165]);
  const badge2X = useTransform(scrollY, [0, 600], [0, -40]);
  const badge2Y = useTransform(scrollY, [0, 600], [0, 20]);

  // Initialize interactive holographic halftone particles from portrait
  const initParticles = useCallback((img: HTMLImageElement, width: number, height: number) => {
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // Grid spacing for fine, elegant holographic dots overlay
    const gridStep = 5.5;
    const sampleW = Math.floor(width / gridStep);
    const sampleH = Math.floor(height / gridStep);

    offscreen.width = sampleW;
    offscreen.height = sampleH;

    offCtx.drawImage(img, 0, 0, sampleW, sampleH);
    const imgData = offCtx.getImageData(0, 0, sampleW, sampleH);
    const data = imgData.data;

    const particles: Particle[] = [];

    for (let sy = 0; sy < sampleH; sy++) {
      for (let sx = 0; sx < sampleW; sx++) {
        const idx = (sy * sampleW + sx) * 4;
        const a = data[idx + 3];

        if (a > 40) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          const normY = sy / sampleH;
          const fade = normY <= 0.75 ? 1.0 : Math.max(0.0, 1.0 - (normY - 0.75) / 0.25);
          if (fade <= 0.05) continue;

          const ox = sx * gridStep + gridStep / 2;
          const oy = sy * gridStep + gridStep / 2;

          // Radius scales gracefully with brightness
          const radius = Math.max(0.6, (0.5 + lum * 1.3) * fade);

          // Subtle warm amber accent particles scattered naturally
          const isAccent = (sx + sy * 3) % 19 === 0 && lum > 0.3;

          particles.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            radius,
            alpha: fade * (0.25 + lum * 0.55),
            phase: Math.random() * Math.PI * 2,
            isAccent,
          });
        }
      }
    }

    particlesRef.current = particles;
    setIsLoaded(true);
  }, []);

  // Load portrait image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const targetW = 520;
      const targetH = Math.floor(targetW * (img.height / img.width));

      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = targetW * dpr;
        canvas.height = targetH * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }

      initParticles(img, targetW, targetH);
    };

    img.onerror = () => {
      setIsLoaded(true);
    };
  }, [imageSrc, initParticles]);

  // Main interactive physics & holographic rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = true;
    const onVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let time = 0;
    const effectiveMotion = motionEnabled && !shouldReduceMotion;

    const render = () => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const mouseRadius = 110;
      const springK = 0.08;
      const damping = 0.78;
      const idleWaveAmp = effectiveMotion ? 0.3 : 0;

      time += 0.035;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (effectiveMotion) {
          // Cursor repulsion
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouseRadius && dist > 0.1) {
              const force = (1 - dist / mouseRadius) * 5.2;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Subtle organic floating wave
          const idleY = Math.sin(time + p.phase) * idleWaveAmp;

          // Spring pull towards origin
          const fx = (p.ox - p.x) * springK;
          const fy = (p.oy + idleY - p.y) * springK;

          p.vx = (p.vx + fx) * damping;
          p.vy = (p.vy + fy) * damping;

          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = p.ox;
          p.y = p.oy;
        }

        // Render delicate holographic dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isAccent) {
          ctx.fillStyle = `rgba(245, 165, 36, ${p.alpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(240, 245, 255, ${p.alpha * 0.65})`;
        }
        ctx.fill();
      }

      if (effectiveMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isLoaded, motionEnabled, shouldReduceMotion]);

  // Mouse move handlers for 3D tilt & particle magnetism
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvasRef.current) {
      const scaleX = (canvasRef.current.width / dpr) / rect.width;
      const scaleY = (canvasRef.current.height / dpr) / rect.height;

      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
        active: true,
      };
    }

    // 3D Parallax tilt
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseTiltX.set(normX * 12);
    mouseTiltY.set(-normY * 12);
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseTiltX.set(0);
    mouseTiltY.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvasRef.current) {
      const scaleX = (canvasRef.current.width / dpr) / rect.width;
      const scaleY = (canvasRef.current.height / dpr) / rect.height;

      mouseRef.current = {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
        active: true,
      };
    }
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1200,
        rotateX: totalRotateX,
        rotateY: totalRotateY,
        z: scrollZ,
        scale: scrollScale,
      }}
      className={`relative flex items-center justify-center select-none transform-gpu ${className}`}
    >
      {/* 3D Deep Layer: Ambient Radiant Flare (Separate depth on scroll) */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] pointer-events-none rounded-full"
        style={{
          z: orbitDepth,
          background: 'radial-gradient(circle at 50% 50%, rgba(245, 165, 36, 0.18) 0%, rgba(245, 165, 36, 0.04) 45%, transparent 70%)',
          filter: 'blur(34px)',
        }}
      />

      {/* 3D Layer: Animated Rotating Cyber Orbit Ring (Spins on scroll) */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[98%] h-[98%] rounded-full border border-orange-500/30 pointer-events-none"
        style={{
          z: orbitDepth,
          rotateZ: orbitRotateZ,
          rotateX: orbitRotateX,
          borderStyle: 'dashed',
          boxShadow: '0 0 45px rgba(245, 165, 36, 0.12), inset 0 0 30px rgba(245, 165, 36, 0.06)',
        }}
      />

      {/* 3D Layer: Concentric Inner Depth Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full border border-white/10 pointer-events-none"
        style={{
          z: orbitDepth,
          rotateZ: orbitRotateZ,
        }}
      />

      {/* 3D Ground Shadow */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-12 rounded-full pointer-events-none"
        style={{
          transform: 'translateZ(-20px) rotateX(75deg)',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(245, 165, 36, 0.15) 30%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* 3D Primary Layer: Crystal-Clear Transparent Cutout Portrait */}
      <div
        className="relative z-10 w-full flex items-center justify-center"
        style={{
          transform: 'translateZ(18px)',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={imageSrc}
          alt="Umesh Temburwar"
          className="w-full max-w-[500px] h-auto object-contain pointer-events-none drop-shadow-[0_22px_45px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(245,165,36,0.22)] filter contrast-[1.08] brightness-[1.03]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
          }}
        />
      </div>

      {/* 3D Layer: Interactive Holographic Halftone Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 w-full h-full object-contain pointer-events-none cursor-crosshair transition-opacity duration-700"
        style={{
          transform: 'translateZ(38px)',
          opacity: isLoaded ? 0.9 : 0,
          maskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 82%, transparent 100%)',
        }}
      />

      {/* 3D High-Elevation Floating Badge 1 (Top-Right): Detaches forward on scroll */}
      <motion.div
        className="absolute -top-3 -right-2 sm:-right-4 z-30 pointer-events-none"
        style={{
          z: badge1Z,
          x: badge1X,
          y: badge1Y,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0e12]/92 border border-orange-500/40 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.9),0_0_20px_rgba(245,165,36,0.2)] font-mono text-[11px] text-white">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="tracking-wide font-medium">Full-Stack Architect</span>
          <span className="text-[9px] uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-1.5 py-0.5 rounded font-bold">3D</span>
        </div>
      </motion.div>

      {/* 3D High-Elevation Floating Badge 2 (Mid-Left): Detaches forward on scroll */}
      <motion.div
        className="hidden sm:flex items-center gap-2.5 absolute top-[42%] -left-4 sm:-left-6 -translate-y-1/2 z-30 pointer-events-none px-3.5 py-2 rounded-xl bg-[#0c0e12]/92 border border-white/15 backdrop-blur-xl shadow-[0_14px_32px_rgba(0,0,0,0.9),0_0_22px_rgba(245,165,36,0.18)] font-mono text-[11px]"
        style={{
          z: badge2Z,
          x: badge2X,
          y: badge2Y,
          transformStyle: 'preserve-3d',
        }}
      >
        <span className="text-orange-400 text-sm animate-pulse">⚛</span>
        <div className="flex flex-col text-left">
          <span className="text-white font-medium leading-tight">React · Node · Supabase</span>
          <span className="text-[10px] text-zinc-400 font-mono">Real-time Architecture</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
