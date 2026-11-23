import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useMotionValue, useAnimationFrame, LayoutGroup } from 'framer-motion';
import { ArrowRight, ExternalLink, X, Menu, Mail, Phone, FileText } from 'lucide-react';
import { IconLinkedin } from './components/icons/BrandIcons';
import { useLocation, Link, Routes, Route, useNavigate } from 'react-router-dom';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const AdminPortal = React.lazy(() => import('./pages/admin/AdminPortal'));
const InterviewPrepPage = React.lazy(() => import('./admin/interview-prep/InterviewPrepPage'));

import { type ProjectItem } from './data/portfolio';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import { Reveal } from '@/components/Reveal';
import { SocialLinks } from '@/components/SocialLinks';
import { ParticlePortrait } from '@/components/ParticlePortrait';
import { DotMatrixWave } from '@/components/DotMatrixWave';
import GatewayFlow from '@/components/ui/gateway-flow';
import { SkillBadge3D } from '@/components/SkillBadge3D';
import { TiltCard3D } from '@/components/TiltCard3D';
import { GridBackground3D } from '@/components/GridBackground3D';

// --- CUSTOM CURSOR (DISABLED TO PREVENT STRAY ORANGE DOT IN MIDDLE OF SCREEN) ---
const CustomCursor = () => null;

// --- GITHUB ICON ---
const Github = ({ size = 20, className = '', ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props} aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.2 2.7 5 3.1 5 3.1a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 10.7c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
);

// --- MARQUEE TECH TICKER ---
const Marquee = ({ items }: { items: string[] }) => {
  const shouldReduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v: number) => `${v}%`);

  useAnimationFrame((_t, delta) => {
    if (shouldReduceMotion) return;
    const moveBy = 0.003 * delta;
    let newX = baseX.get() - moveBy;
    if (newX <= -50) newX += 50;
    baseX.set(newX);
  });

  return (
    <div className="py-6 border-y border-white/10 overflow-hidden bg-black/40 backdrop-blur-sm flex whitespace-nowrap select-none">
      <motion.div className="flex gap-12 items-center" style={{ x }}>
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-xs md:text-sm font-mono text-zinc-500 uppercase tracking-[0.25em] flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- SECTION HEADER (CINEMATIC EDITORIAL) ---
const SectionHeader = ({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) => (
  <div className="col-span-12 mb-14 border-b border-white/10 pb-6">
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-orange-500 mb-3">
      <span className="inline-block w-2 h-2 bg-orange-500" />
      <span>{num}</span>
    </div>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-white uppercase">{title}</h2>
      {subtitle && <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{subtitle}</span>}
    </div>
  </div>
);

// --- FLOATING NAVBAR (ALIGNED WITH SECTION SEQUENCE) ---
const defaultNavItems = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

const FloatingNavBar = () => {
  const { data: portfolioData } = usePortfolio();
  const { scrollTo } = useSmoothScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = portfolioData.navbar?.items?.length ? portfolioData.navbar.items : defaultNavItems;

  // Hidden Master Admin Shortcut: Ctrl + Shift + A or Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Track active section with RAF throttling (zero layout thrashing)
  useEffect(() => {
    let ticking = false;
    const sectionIds = ['hero', ...navItems.map((item) => item.href.replace('#', ''))];

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (location.pathname === '/') {
            const scrollPos = window.scrollY + 220;
            for (let i = sectionIds.length - 1; i >= 0; i--) {
              const id = sectionIds[i];
              const el = document.getElementById(id);
              if (el && el.offsetTop <= scrollPos) {
                setActiveSection((prev) => (prev !== id ? id : prev));
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location, navItems]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollTo(`#${id}`, { offset: -70, duration: 1.1 });
    } else {
      navigate('/' + '#' + id);
    }
  };

  return (
    <>
      {/* Mobile Drawer Click-Outside Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ x: '-50%' }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl pointer-events-none"
      >
        <nav
          className="w-full flex items-center justify-between gap-8 px-5 py-2.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl pointer-events-auto relative shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          aria-label="Main Navigation"
        >
          {/* Zone 1: Logo + Brand Identity */}
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                scrollTo(0, { duration: 1.1 });
              }
            }}
            className="flex items-center gap-3 group cursor-pointer select-none py-0.5 shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-orange-500 group-hover:shadow-[0_0_12px_rgba(245,165,36,0.4)] transition-all duration-300 flex items-center justify-center bg-[#111317] shrink-0">
              <img
                src={portfolioData.navbar?.avatarUrl || portfolioData.hero.profilePhoto || '/umesh-cutout.png'}
                alt={portfolioData.navbar?.brandName || portfolioData.hero.name || 'Umesh Temburwar'}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-xs sm:text-sm text-white leading-tight whitespace-nowrap group-hover:text-orange-400 transition-colors">
                {portfolioData.navbar?.brandName || portfolioData.hero.name || 'Umesh Temburwar'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-orange-400 whitespace-nowrap hidden sm:inline-block">
                {portfolioData.navbar?.brandRole || portfolioData.hero.role || 'Computer Science Engineer'}
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Centered, whitespace-nowrap) */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 font-mono text-xs lg:text-sm text-white/70 shrink-0">
            {navItems.map((item) => {
              const targetId = item.href.replace('#', '');
              const isActive = location.pathname === '/' && activeSection === targetId;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, targetId)}
                  className={`relative py-1 whitespace-nowrap transition-colors ${
                    isActive ? 'text-white font-medium' : 'hover:text-white text-white/70'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-orange-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Zone 3: CTA & Mobile Drawer Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={portfolioData.navbar?.ctaLink || "/contact"}
              className="shrink-0 px-4 sm:px-5 py-2 rounded-full border border-white/20 bg-white/[0.04] text-xs font-mono text-white hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-sm group whitespace-nowrap"
            >
              <span>{portfolioData.navbar?.ctaText || "Let's talk"}</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 text-zinc-300 hover:text-white lg:hidden rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown Panel (Below 1024px) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 bg-[#0d0f12]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col gap-3 lg:hidden z-50 pointer-events-auto"
              >
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      scrollToSection(e, item.href.replace('#', ''));
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-mono text-zinc-300 hover:text-white border-b border-white/5 pb-2.5 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to="/resume"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Resume (CV)
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-mono text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Get in Touch ↗
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </>
  );
};

// --- MAIN APP CONTENT ---
const AppContent = () => {
  const { data: portfolioData } = usePortfolio();
  const { scrollTo, stop, start } = useSmoothScroll();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | typeof portfolioData.projects[0] | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const location = useLocation();

  // Scroll Progress and Parallax
  const { scrollY, scrollYProgress } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);
  const heroRotateX = useTransform(scrollY, [0, 600], [0, 8]);
  const heroZ = useTransform(scrollY, [0, 600], [0, -50]);

  const experienceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: expScrollY } = useScroll({ target: experienceRef, offset: ["start center", "end center"] });

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash;
      const timer = setTimeout(() => {
        scrollTo(targetId, { offset: -70, duration: 1.1 });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      scrollTo(0, { immediate: true });
    }
  }, [location, scrollTo]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      stop();
    } else {
      document.body.style.overflow = 'unset';
      start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      start();
    };
  }, [selectedProject, stop, start]);

  const allTech = portfolioData.projects.flatMap(p => p.tech).filter((v, i, a) => a.indexOf(v) === i);

  // Resume summary text
  const resumeSummary =
    "Full Stack Developer (React.js, Node.js) and Computer Science graduate with hands-on experience building responsive web applications and REST APIs using React.js, Next.js, JavaScript, TypeScript, Node.js, Express.js, PostgreSQL, MongoDB, Supabase, and Git.";

  return (
    <LayoutGroup>
      <div className="relative min-h-screen text-[#EDEDED] selection:bg-orange-500/25 selection:text-orange-400 z-0">
        <GatewayFlow speed={0.8} opacity={0.65} />
        <GridBackground3D />
        <CustomCursor />

        {/* Global Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 origin-left z-[100] pointer-events-none"
          style={{ scaleX: scrollYProgress }}
        />

        <FloatingNavBar />

        <main>
          <Routes>
            <Route path="/" element={
              <>
                {/* HERO SECTION — 3-ROW VERTICAL LAYOUT */}
                <section
                  id="hero"
                  className="relative min-h-screen flex flex-col pt-28 md:pt-32 pb-8 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 bg-transparent overflow-hidden"
                >
                  {/* Subtle Noise Texture & Amber Vignette Aura */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      backgroundImage: `radial-gradient(circle at 60% 40%, rgba(245, 165, 36, 0.08) 0%, transparent 65%)`,
                    }}
                  />

                  {/* Row 1: Top Eyebrow Row */}
                  <div className="w-full flex items-center justify-between mt-4 z-20">
                    <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-[0.25em] uppercase">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      ENGINEER. BUILDER. FULL STACK.
                    </div>
                    <div className="hidden sm:block font-mono text-[10px] sm:text-[11px] text-zinc-500 tracking-[0.25em] uppercase">
                      BASED IN MAHARASHTRA, INDIA • OPEN FOR ROLES
                    </div>
                  </div>

                  {/* Row 2: Main Grid Row (Vertically centered, max py-8) */}
                  <div className="w-full flex-1 flex items-center py-6 md:py-8 z-10" style={{ perspective: 1200 }}>
                    <motion.div
                      style={{
                        y: heroParallaxY,
                        opacity: heroOpacity,
                        rotateX: heroRotateX,
                        z: heroZ,
                        transformStyle: 'preserve-3d',
                      }}
                      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center transform-gpu"
                    >
                      {/* Left Column: Role, Name, Detailed Resume Summary, Tech Pills, & CTAs */}
                      <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start text-left z-20">
                        {/* Open to Work Badge */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 font-mono text-xs text-orange-400 mb-5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                          <span>OPEN TO SOFTWARE ENGINEERING ROLES</span>
                        </motion.div>

                        {/* Large Editorial Serif Name */}
                        <motion.h1
                          initial={{ opacity: 0, y: 35 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                          className="font-editorial italic font-normal text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-white tracking-tight mb-4 select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)] text-balance"
                        >
                          {portfolioData.hero.name || 'Umesh Temburwar'}
                        </motion.h1>

                        {/* Role Line */}
                        <motion.div
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                          className="flex items-center gap-2 font-mono text-xs sm:text-sm text-zinc-300 uppercase tracking-widest mb-5"
                        >
                          <span className="w-2 h-2 bg-orange-500 shrink-0" />
                          <span className="text-orange-400 font-semibold">
                            Full Stack Developer (React.js, Node.js)
                          </span>
                          <span className="hidden sm:inline text-zinc-500">• B.Tech Computer Science</span>
                        </motion.div>

                        {/* Paragraph */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                          className="text-white/70 text-sm sm:text-base leading-relaxed font-sans max-w-xl mb-6 font-light"
                        >
                          {portfolioData.hero.description || resumeSummary}
                        </motion.p>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {portfolioData.hero.heroStack?.map((tech, idx) => (
                            <motion.span
                              key={tech}
                              initial={{ opacity: 0, scale: 0.9, y: 12 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.55 + idx * 0.05 }}
                              className="font-mono text-xs border border-white/20 bg-white/[0.05] text-zinc-200 px-3 py-1.5 rounded hover:border-orange-500/50 hover:text-white transition-colors"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>

                        {/* Action CTAs */}
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                          className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto"
                        >
                          <a
                            href="#projects"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollTo('#projects', { offset: -70, duration: 1.1 });
                            }}
                            className="h-11 md:h-12 px-6 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase font-semibold hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg group w-full sm:w-auto"
                          >
                            <span>Explore My Work</span>
                            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                          </a>

                          <Link
                            to="/contact"
                            className="h-11 md:h-12 px-6 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white font-mono text-xs tracking-wider uppercase hover:border-orange-500 hover:text-orange-400 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            <span>Let's Connect</span>
                            <span>↗</span>
                          </Link>

                          {portfolioData.resume.exists && (
                            <Link
                              to="/resume"
                              className="px-4 py-2 font-mono text-sm text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                              <FileText size={16} className="text-orange-400 shrink-0" />
                              <span>View CV</span>
                            </Link>
                          )}
                        </motion.div>

                        {/* Location & Social Links */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-6 w-full"
                        >
                          <div className="flex items-center gap-2 text-xs text-white/60 font-mono">
                            <span className="text-orange-500">📍</span>
                            <span>{portfolioData.experience[0]?.location || 'Ambajogai, Maharashtra'}</span>
                          </div>
                          <SocialLinks />
                        </motion.div>
                      </div>

                      {/* Right Column: Colorful Studio Interactive Particle Portrait with Parallax */}
                      <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end relative">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.88, y: 35 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                          className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px]"
                        >
                          {/* Interactive Colorful Studio Portrait */}
                          <ParticlePortrait
                            imageSrc={portfolioData.hero.profilePhoto || '/umesh-cutout.png'}
                            motionEnabled={motionEnabled}
                            className="w-full h-auto"
                          />

                          {/* Floating Corner ID Card Badge */}
                          <motion.div
                            initial={{ opacity: 0, x: -20, y: 20 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.65 }}
                            className="hidden sm:block absolute -bottom-3 -left-3 bg-[#0d0f12]/95 border border-white/10 p-3.5 rounded-lg shadow-2xl font-mono text-xs backdrop-blur-md z-30"
                          >
                            <div className="text-white font-semibold flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              {portfolioData.hero.idCard?.line1 || 'B.Tech CSE, 2022-2026'}
                            </div>
                            <div className="text-zinc-500 text-[11px] mt-0.5">
                              {portfolioData.hero.idCard?.line2 || 'Ambajogai, Maharashtra'}
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Row 3: Bottom Bar */}
                  <div className="w-full flex items-center justify-between mt-8 pt-6 border-t border-white/10 font-mono text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-[0.2em] z-20">
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo('#about', { offset: -70, duration: 1.1 });
                      }}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse mr-1" />
                      SCROLL TO DISCOVER ↓
                    </a>

                    <div className="hidden md:block text-zinc-500">
                      BUILDING & SHIPPING SINCE 2021
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="hidden sm:inline text-zinc-500">
                        AN ONGOING EXPLORATION ↗
                      </span>
                      <button
                        onClick={() => setMotionEnabled(!motionEnabled)}
                        className="px-2.5 py-1 rounded border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5"
                        title="Toggle particle motion"
                      >
                        <span>{motionEnabled ? '⏸' : '▶'}</span>
                        <span>{motionEnabled ? 'MOTION ON' : 'MOTION OFF'}</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* ========================================================================= */}
                {/* SECTIONS ARRANGED 1:1 TO MATCH NAVBAR:                                  */}
                {/* 1. ABOUT  2. SKILLS  3. PROJECTS  4. EXPERIENCE  5. CERTIFICATIONS  6. CONTACT */}
                {/* ========================================================================= */}

                {/* 1. ABOUT ME (WITH METRICS STRIP & DOT MATRIX WAVE) */}
                <section id="about" className="py-24 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-24 border-t border-white/10">
                  <SectionHeader
                    num="01 / ABOUT ME"
                    title={portfolioData.about.title || "About Me"}
                    subtitle={portfolioData.about.subtitle || "THE PERSON BEHIND THE WORK"}
                  />

                  {/* Impact Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 border border-white/10 bg-[#0c0e12] p-6 sm:p-8 rounded-lg">
                    {(portfolioData.about.metrics || [
                      { value: "3+", label: "Years Building & Coding" },
                      { value: "10+", label: "Full-Stack & AI Projects" },
                      { value: "2,000+", label: "ByteFest Daily Visitors" },
                      { value: "THE WORK", label: "REAL-WORLD IMPACT." }
                    ]).map((metric, idx) => (
                      <div key={idx} className="border-l-2 border-orange-500/60 pl-4 flex flex-col justify-between">
                        <div>
                          <div className="font-editorial text-4xl sm:text-5xl text-white">
                            {metric.value}
                          </div>
                          <p className="font-mono text-xs text-zinc-400 mt-2 uppercase tracking-wider">
                            {metric.label}
                          </p>
                        </div>
                        {idx === 3 && (
                          <a href="#projects" className="text-orange-500 font-mono text-xs hover:underline mt-2 flex items-center gap-1 w-fit">
                            EXPLORE WORK ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-12 gap-8 items-start">
                    <Reveal delay={0} className="col-span-12 lg:col-span-8 pr-0 lg:pr-12">
                      <p className="text-xl sm:text-2xl font-editorial italic text-zinc-200 leading-relaxed mb-6">
                        {portfolioData.about.content}
                      </p>
                      <p className="text-sm md:text-base text-zinc-400 font-sans leading-relaxed mb-6">
                        {portfolioData.about.bio || "I am dedicated to building robust, accessible, and high-performance digital solutions. My experience ranges from architecting end-to-end full-stack web platforms with React and Node.js to designing resilient REST APIs, automated backend workers, and cloud storage workflows."}
                      </p>
                    </Reveal>

                    <Reveal delay={200} className="col-span-12 lg:col-span-4 flex flex-col gap-5 font-mono text-xs border-l-0 lg:border-l border-white/10 pl-0 lg:pl-10 mt-6 lg:mt-0">
                      <div className="p-4 border border-white/10 bg-[#0d0f12] rounded">
                        <span className="text-zinc-500 uppercase tracking-wider block mb-1">Academic Degree</span>
                        <span className="text-white text-sm font-sans">{portfolioData.education[0]?.degree}</span>
                      </div>

                      <div className="p-4 border border-white/10 bg-[#0d0f12] rounded">
                        <span className="text-zinc-500 uppercase tracking-wider block mb-1">Institution</span>
                        <span className="text-white text-sm font-sans">{portfolioData.education[0]?.institution}</span>
                      </div>

                      <div className="p-4 border border-white/10 bg-[#0d0f12] rounded">
                        <span className="text-zinc-500 uppercase tracking-wider block mb-1">Location</span>
                        <span className="text-white text-sm font-sans">{portfolioData.experience[0]?.location || "Maharashtra, India"}</span>
                      </div>
                    </Reveal>
                  </div>

                  {/* Topographic Dot-Matrix Wave Banner */}
                  <div className="mt-16 pt-8 border-t border-white/10">
                    <DotMatrixWave motionEnabled={motionEnabled} />
                  </div>
                </section>

                <Marquee items={allTech} />

                {/* 2. SKILLS & TECHNOLOGIES */}
                <section id="skills" className="py-24 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-24 border-t border-white/10">
                  <SectionHeader
                    num="02 / SKILLS"
                    title="Skills & Technologies"
                    subtitle="CORE ARSENAL & MODERN TOOLING"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioData.skills.core.map((group, idx) => (
                      <Reveal
                        key={idx}
                        delay={Math.min(idx * 70, 420)}
                        className="h-full"
                      >
                        <TiltCard3D
                          maxTilt={6}
                          scale={1.01}
                          className="h-full p-6 sm:p-7 border border-white/10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-lg"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10" style={{ transform: 'translateZ(15px)' }}>
                              <h3 className="font-mono text-xs text-orange-400 uppercase tracking-[0.2em] font-semibold">
                                {group.category}
                              </h3>
                              <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded">0{idx + 1}</span>
                            </div>
                            <div className="flex flex-wrap gap-2.5" style={{ transform: 'translateZ(20px)' }}>
                              {group.items.map((item, itemIdx) => (
                                <SkillBadge3D
                                  key={item}
                                  name={item}
                                  index={itemIdx}
                                />
                              ))}
                            </div>
                          </div>
                        </TiltCard3D>
                      </Reveal>
                    ))}
                  </div>
                </section>

                {/* 3. FEATURED PROJECTS */}
                <section id="projects" className="py-24 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-24 border-t border-white/10">
                  <SectionHeader
                    num="03 / PROJECTS"
                    title="Featured Projects"
                    subtitle="SELECT CASE STUDIES & PRODUCTION WORK"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioData.projects.slice(0, 4).map((project, idx) => (
                      <Reveal
                        key={project.id}
                        delay={Math.min(idx * 90, 360)}
                        className="h-full"
                      >
                        <TiltCard3D
                          maxTilt={7}
                          scale={1.015}
                          className="h-full border border-white/10 bg-[#0c0e12] rounded-xl flex flex-col justify-between group hover:border-orange-500/40 transition-all overflow-hidden shadow-xl"
                        >
                          {project.coverImage && (
                            <div
                              className="w-full h-52 overflow-hidden bg-black/80 relative"
                              style={{ transform: 'translateZ(20px)' }}
                            >
                              <img
                                src={project.coverImage}
                                alt={project.title}
                                className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-transparent" />
                            </div>
                          )}

                          <div className="p-7 flex flex-col flex-grow" style={{ transform: 'translateZ(25px)' }}>
                            <div className="flex items-center justify-between mb-3 font-mono text-[11px] text-orange-400 uppercase tracking-widest">
                              <span>{project.category || 'Full-Stack Application'}</span>
                              <span className="text-zinc-500">{project.status}</span>
                            </div>

                            <h3 className="font-editorial text-2xl sm:text-3xl text-white mb-3 group-hover:text-orange-400 transition-colors">
                              {project.title}
                            </h3>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                              {project.shortDescription || project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8 mt-auto" style={{ transform: 'translateZ(15px)' }}>
                              {project.tech.slice(0, 5).map((t) => (
                                <span
                                  key={t}
                                  className="font-mono text-[11px] text-zinc-400 bg-white/[0.03] border border-white/10 px-2.5 py-1 rounded"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-5 border-t border-white/10" style={{ transform: 'translateZ(18px)' }}>
                              <button
                                onClick={() => setSelectedProject(project)}
                                className="font-mono text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                Case Study Details <ArrowRight size={14} />
                              </button>

                              <div className="flex items-center gap-3">
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 border border-white/10 hover:border-orange-500 hover:text-orange-400 rounded transition-colors"
                                    title="Live Demo"
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                                )}
                                {project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 border border-white/10 hover:border-orange-500 hover:text-orange-400 rounded transition-colors"
                                    title="Source Code"
                                  >
                                    <Github size={16} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </TiltCard3D>
                      </Reveal>
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                    >
                      View All Projects & Architectures <ArrowRight size={14} />
                    </Link>
                  </div>
                </section>

                {/* 4. WORK EXPERIENCE */}
                <section id="experience" ref={experienceRef} className="py-24 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-24 border-t border-white/10">
                  <SectionHeader
                    num="04 / EXPERIENCE"
                    title="Work Experience"
                    subtitle="PROJECT COORDINATION & TECHNICAL ROLES"
                  />

                  <div className="col-span-12 lg:col-span-10 lg:col-start-2 relative">
                    {/* Animated Scroll Timeline Line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
                    <motion.div
                      className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-orange-500 -translate-x-1/2 origin-top"
                      style={{ scaleY: expScrollY }}
                    />

                    <div className="space-y-16">
                      {/* Work Experience */}
                      {portfolioData.experience.map((exp, idx) => (
                        <Reveal
                          key={idx}
                          delay={Math.min(idx * 80, 480)}
                          className="relative flex flex-col md:flex-row items-start justify-between w-full"
                        >
                          <div className="absolute left-0 md:left-1/2 top-0 w-3.5 h-3.5 bg-black border-2 border-orange-500 rounded-full -translate-x-1/2 mt-1.5 z-10 shadow-[0_0_8px_rgba(245,165,36,0.8)]" />

                          <div className="w-full md:w-[45%] pl-8 md:pl-0 md:pr-12 text-left md:text-right mb-4 md:mb-0">
                            <h3 className="font-editorial text-2xl md:text-3xl text-white mb-1">{exp.role}</h3>
                            <div className="font-mono text-xs text-orange-400 mb-2">{exp.company}</div>
                            <div className="font-mono text-xs text-zinc-500">{exp.duration} • {exp.location}</div>
                          </div>

                          <div className="w-full md:w-[45%] pl-8 md:pl-12">
                            <ul className="space-y-3">
                              {(exp.highlights || []).map((h, i) => (
                                <li key={i} className="text-zinc-400 text-sm leading-relaxed flex items-start gap-2">
                                  <span className="text-orange-500 mt-1">✦</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 5. EDUCATION (DEDICATED SECTION) */}
                <section id="education" className="py-24 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-24 border-t border-white/10">
                  <SectionHeader
                    num="05 / EDUCATION"
                    title="Education"
                    subtitle="ACADEMIC BACKGROUND & FORMAL STUDIES"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {portfolioData.education.map((edu, idx) => (
                      <Reveal
                        key={idx}
                        delay={150}
                        className="md:col-span-12"
                      >
                        <TiltCard3D
                          maxTilt={4}
                          scale={1.008}
                          className="border border-white/10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl p-8 hover:border-orange-500/40 transition-all shadow-xl"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10" style={{ transform: 'translateZ(18px)' }}>
                            <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 font-mono text-xs text-orange-400 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                <span>{edu.degreeType || 'Bachelor of Technology (B.Tech)'}</span>
                              </div>
                              <h3 className="font-editorial text-3xl sm:text-4xl text-white mb-2">{edu.degree}</h3>
                              <div className="font-mono text-sm text-zinc-300">{edu.institution}</div>
                              <div className="font-mono text-xs text-zinc-500 mt-1">{edu.location}</div>
                            </div>

                            <div className="flex flex-col lg:items-end font-mono text-xs gap-2">
                              <span className="px-3 py-1.5 rounded border border-white/10 bg-white/5 text-orange-400">
                                {edu.duration}
                              </span>
                              <span className="text-zinc-400">
                                CGPA: <strong className="text-white">{edu.cgpa || '6.06'}</strong> / 10.0
                              </span>
                            </div>
                          </div>

                          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6" style={{ transform: 'translateZ(12px)' }}>
                            <div>
                              <h4 className="font-mono text-xs text-orange-400 uppercase tracking-widest mb-3">
                                Core Focus & Fundamentals
                              </h4>
                              <p className="text-zinc-400 text-sm leading-relaxed">
                                {edu.coreFocus || 'Focusing on Computer Science fundamentals: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, and Full-Stack Engineering.'}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-mono text-xs text-orange-400 uppercase tracking-widest mb-3">
                                Key Competencies Developed
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {(edu.competencies || ["Data Structures", "Algorithms", "DBMS & SQL", "Operating Systems", "Computer Networks", "OOP", "Full-Stack Web Dev", "REST APIs"]).map((sub) => (
                                  <span key={sub} className="px-3 py-1 rounded bg-black/60 border border-white/10 font-mono text-xs text-zinc-300">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TiltCard3D>
                      </Reveal>
                    ))}
                  </div>
                </section>

                {/* 6. CERTIFICATIONS */}
                <section id="certifications" className="py-24 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-24 border-t border-white/10">
                  <SectionHeader
                    num="06 / CERTIFICATIONS"
                    title="Certifications & Credentials"
                    subtitle="VERIFIED TECHNICAL ACHIEVEMENTS"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioData.certifications.map((cert, idx) => (
                      <Reveal
                        key={idx}
                        delay={Math.min(idx * 80, 480)}
                        className="border border-white/10 bg-[#0c0e12] rounded-lg flex flex-col justify-between group hover:border-orange-500/40 transition-all p-7"
                      >
                        <div>
                          {cert.credentialType && (
                            <span className="font-mono text-[10px] text-orange-400 uppercase tracking-widest block mb-2">
                              {cert.credentialType}
                            </span>
                          )}
                          <h4 className="font-editorial text-2xl text-white mb-2 group-hover:text-orange-400 transition-colors">
                            {cert.title}
                          </h4>
                          <div className="font-mono text-xs text-zinc-500 mb-5">
                            {cert.issuer} • {cert.date}
                          </div>
                          {cert.topics && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {cert.topics.slice(0, 4).map((t) => (
                                <span key={t} className="font-mono text-[10px] text-zinc-400 bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1.5 pt-4 border-t border-white/10 mt-auto"
                          >
                            <span>View Certificate</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </Reveal>
                    ))}
                  </div>
                </section>

                {/* 7. CONTACT */}
                <section
                  id="contact"
                  className="min-h-screen flex items-center justify-center pt-32 pb-16 md:pb-20 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 scroll-mt-28 border-t border-white/10"
                >
                  <div className="w-full max-w-5xl mx-auto px-6 md:px-16 py-16 md:py-24 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e1014] to-[#070708] relative overflow-hidden text-center flex flex-col items-center shadow-2xl">
                    <div className="font-mono text-xs text-orange-400 uppercase tracking-[0.3em] mb-6">
                      {portfolioData.contact.tag || '■ 07 / INITIATE A CONVERSATION'}
                    </div>

                    <h2 className="font-editorial italic text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance text-center text-white max-w-4xl mb-6">
                      {portfolioData.contact.heading || "Let's build something exceptional together."}
                    </h2>

                    <p className="text-zinc-400 text-sm md:text-base max-w-xl text-center font-sans mb-10 leading-relaxed font-light">
                      {portfolioData.contact.description || "Whether you have an engineering role opening, an ambitious full-stack project, or simply want to connect, my inbox is always open."}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
                      <Link
                        to="/contact"
                        className="h-12 md:h-14 px-8 rounded-full bg-white text-black font-mono text-xs md:text-sm uppercase tracking-wider font-semibold hover:bg-orange-500 hover:text-white transition-all shadow-xl hover:shadow-[0_0_24px_rgba(245,165,36,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <span>Send a message</span>
                        <span className="text-base">↗</span>
                      </Link>

                      {portfolioData.resume.exists && (
                        <Link
                          to="/resume"
                          className="h-12 md:h-14 px-8 rounded-full border border-white/20 bg-white/[0.03] text-white font-mono text-xs md:text-sm uppercase tracking-wider hover:border-orange-500 hover:text-orange-400 hover:shadow-[0_0_24px_rgba(245,165,36,0.25)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                          <span>Review full CV</span>
                        </Link>
                      )}
                    </div>

                    {/* Contact Info Row: Two equal clickable pill-cards + social icons */}
                    <div className="mt-12 pt-10 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a
                        href={`mailto:${portfolioData.contact.email}`}
                        className="w-full sm:w-auto border border-white/10 rounded-2xl px-5 py-3 bg-white/[0.02] hover:border-orange-500 hover:bg-orange-500/[0.04] transition-all flex items-center gap-3.5 group shadow-sm justify-center sm:justify-start"
                      >
                        <div className="w-9 h-9 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors shrink-0">
                          <Mail size={16} />
                        </div>
                        <span className="text-sm md:text-base font-mono text-zinc-300 group-hover:text-white transition-colors">
                          {portfolioData.contact.email}
                        </span>
                      </a>

                      <a
                        href={`tel:${portfolioData.contact.phone?.replace(/\s+/g, '') || '+918856087984'}`}
                        className="w-full sm:w-auto border border-white/10 rounded-2xl px-5 py-3 bg-white/[0.02] hover:border-orange-500 hover:bg-orange-500/[0.04] transition-all flex items-center gap-3.5 group shadow-sm justify-center sm:justify-start"
                      >
                        <div className="w-9 h-9 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-colors shrink-0">
                          <Phone size={16} />
                        </div>
                        <span className="text-sm md:text-base font-mono text-zinc-300 group-hover:text-white transition-colors">
                          {portfolioData.contact.phone}
                        </span>
                      </a>

                      <div className="flex items-center gap-3 justify-center">
                        {portfolioData.hero.githubUrl && (
                          <a
                            href={portfolioData.hero.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500 hover:text-orange-400 text-zinc-400 transition-all flex items-center justify-center shadow-sm"
                            title="GitHub Profile"
                            aria-label="GitHub Profile"
                          >
                            <Github size={18} />
                          </a>
                        )}
                        {portfolioData.hero.linkedinUrl && (
                          <a
                            href={portfolioData.hero.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500 hover:text-orange-400 text-zinc-400 transition-all flex items-center justify-center shadow-sm"
                            title="LinkedIn Profile"
                            aria-label="LinkedIn Profile"
                          >
                            <IconLinkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            } />

            {/* OTHER APP ROUTES */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/admin/interview-prep"
              element={
                <React.Suspense
                  fallback={
                    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6 font-mono text-sm">
                      Loading Interview Prep Hub...
                    </div>
                  }
                >
                  <InterviewPrepPage />
                </React.Suspense>
              }
            />

            <Route
              path="/admin"
              element={
                <React.Suspense
                  fallback={
                    <div className="min-h-screen bg-[#070708] text-zinc-400 flex items-center justify-center p-6 font-mono text-sm">
                      Loading Admin Portal...
                    </div>
                  }
                >
                  <AdminPortal />
                </React.Suspense>
              }
            />

            <Route
              path="/admin/*"
              element={
                <React.Suspense
                  fallback={
                    <div className="min-h-screen bg-[#070708] text-zinc-400 flex items-center justify-center p-6 font-mono text-sm">
                      Loading Admin Portal...
                    </div>
                  }
                >
                  <AdminPortal />
                </React.Suspense>
              }
            />

            <Route
              path="/admin/resume"
              element={
                <React.Suspense
                  fallback={
                    <div className="min-h-screen bg-[#070708] text-zinc-400 flex items-center justify-center p-6 font-mono text-sm">
                      Loading Admin Portal...
                    </div>
                  }
                >
                  <AdminPortal />
                </React.Suspense>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* 3-COLUMN FOOTER */}
        <footer className="py-8 border-t border-white/10 px-6 md:px-10 lg:px-12 bg-[#070708]/85 backdrop-blur-md">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-6 font-mono text-xs text-zinc-500 uppercase tracking-widest text-center">
            {/* Left Column: Copyright */}
            <div className="md:text-left">
              <Link
                to="/admin"
                className="hover:text-orange-400 transition-colors cursor-pointer"
                title="Admin Portal (Shortcut: Ctrl+Shift+A)"
              >
                &copy; {new Date().getFullYear()} {portfolioData.hero.name || 'Umesh Temburwar'} • ALL RIGHTS RESERVED
              </Link>
            </div>

            {/* Center Column: GitHub · LinkedIn · Resume */}
            <div className="flex items-center justify-center gap-6 text-zinc-400">
              {portfolioData.hero.githubUrl && (
                <a
                  href={portfolioData.hero.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              )}
              {portfolioData.hero.linkedinUrl && (
                <a
                  href={portfolioData.hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              )}
              <Link to="/resume" className="hover:text-white transition-colors">
                Resume
              </Link>
            </div>

            {/* Right Column: Back to Top */}
            <div className="flex items-center justify-center md:justify-end">
              <button
                onClick={() => scrollTo(0, { duration: 1.1 })}
                className="hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                aria-label="Scroll back to top"
              >
                <span>Back to Top</span>
                <span className="text-orange-400 group-hover:-translate-y-1 transition-transform font-bold">↑</span>
              </button>
            </div>
          </div>
        </footer>

        {/* PROJECT DETAIL MODAL */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-4xl bg-[#0f1115] border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-xl"
              >
                <div className="p-8 border-b border-white/10 flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs text-orange-400 uppercase tracking-widest block mb-1">
                      {selectedProject.status}
                    </span>
                    <h3 className="font-editorial text-3xl sm:text-4xl text-white uppercase tracking-tight">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 border border-white/10 hover:border-white rounded transition-colors text-zinc-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div data-lenis-prevent className="p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8">
                  <div>
                    <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-3">Project Overview</div>
                    <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
                      {selectedProject.description || selectedProject.shortDescription}
                    </p>
                  </div>

                  {'problem' in selectedProject && selectedProject.problem && (
                    <div className="bg-black/50 border border-white/10 p-5 rounded-lg">
                      <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">Problem Statement</div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{selectedProject.problem}</p>
                    </div>
                  )}

                  {'solution' in selectedProject && selectedProject.solution && (
                    <div className="bg-black/50 border border-white/10 p-5 rounded-lg">
                      <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-2">Engineered Solution</div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{selectedProject.solution}</p>
                    </div>
                  )}

                  {'features' in selectedProject && selectedProject.features && selectedProject.features.length > 0 && (
                    <div>
                      <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-3">Key Capabilities</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProject.features.map((feat: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 bg-black/40 border border-white/10 p-3 rounded text-xs text-zinc-300">
                            <span className="text-orange-500 mt-0.5">✦</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {'architecture' in selectedProject && selectedProject.architecture && (
                    <div>
                      <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-3">System Architecture</div>
                      <div className="bg-black/60 border border-white/10 p-4 rounded text-xs font-mono text-zinc-400">
                        <p>{selectedProject.architecture}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="font-mono text-xs uppercase text-orange-400 mb-3 tracking-widest">Technologies</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t: string) => (
                        <span key={t} className="px-3 py-1 bg-black border border-white/10 font-mono text-xs text-zinc-300 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-white text-black hover:bg-orange-500 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 rounded-full font-semibold"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 border border-white/20 hover:border-orange-500 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 rounded-full"
                      >
                        <Github size={14} /> GitHub Repo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

const App = () => {
  return (
    <PortfolioProvider>
      <SmoothScrollProvider>
        <AppContent />
      </SmoothScrollProvider>
    </PortfolioProvider>
  );
};

export default App;
