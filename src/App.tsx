import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  LayoutGroup,
} from 'framer-motion';
import {
  ArrowUp,
  ArrowRight,
  ExternalLink,
  X,
  Menu,
  Mail,
  Phone,
  FileText,
  Check,
} from 'lucide-react';
import { useLocation, Link, Routes, Route, useNavigate } from 'react-router-dom';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const AdminPortal = React.lazy(() => import('./pages/admin/AdminPortal'));
const InterviewPrepPage = React.lazy(() => import('./admin/interview-prep/InterviewPrepPage'));

import { type ProjectItem } from './data/portfolio';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { SocialLinks } from '@/components/SocialLinks';
import { ParticlePortrait } from '@/components/ParticlePortrait';
import { DotMatrixWave } from '@/components/DotMatrixWave';
import GatewayFlow from '@/components/ui/gateway-flow';
import { SkillBadge3D } from '@/components/SkillBadge3D';

// Central Motion System
import {
  Reveal,
  SplitText,
  Magnetic,
  CustomCursor,
  SmoothScroll,
  Preloader,
  CountUp,
  TiltCard,
  TypewriterRole,
  scrollTo,
  primaryEase,
  expoOut,
} from './motion';

// --- GITHUB SVG ICON ---
const Github = ({ size = 20, className = '', ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.2 2.7 5 3.1 5 3.1a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 10.7c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
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
      <motion.div className="flex gap-12 items-center will-change-transform" style={{ x }}>
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

// --- SECTION HEADER (CINEMATIC EDITORIAL WITH SPLITTEXT) ---
const SectionHeader = ({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) => (
  <div className="col-span-12 mb-14 border-b border-white/10 pb-6">
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: primaryEase }}
      className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-orange-500 mb-3"
    >
      <span className="inline-block w-2 h-2 bg-orange-500" />
      <span>{num}</span>
    </motion.div>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <SplitText
        text={title}
        as="h2"
        className="text-3xl sm:text-4xl md:text-5xl font-editorial tracking-tight text-white uppercase"
      />
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: primaryEase }}
          className="font-mono text-xs text-zinc-500 uppercase tracking-widest"
        >
          {subtitle}
        </motion.span>
      )}
    </div>
  </div>
);

// --- FLOATING NAVBAR (RESPONSIVE, SCROLL-AWARE, ELEVATED) ---
const navItems = [
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Scroll detection: elevation, shrink, and hide/reveal behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      // Hide navbar when scrolling down past 120px, reveal immediately when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setIsNavHidden(true);
      } else {
        setIsNavHidden(false);
      }
      lastScrollY.current = currentScrollY;

      // Active section highlight tracking
      if (location.pathname === '/') {
        const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];
        const scrollPos = currentScrollY + 220;
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const id = sectionIds[i];
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollPos) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollTo('#' + targetId, -90);
      setActiveSection(targetId);
      if (window.history.pushState) {
        window.history.pushState(null, '', '#' + targetId);
      }
    } else {
      navigate('/' + '#' + targetId);
    }
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{
        y: isNavHidden ? -100 : 0,
        opacity: isNavHidden ? 0 : 1,
      }}
      transition={{ duration: 0.35, ease: primaryEase }}
      className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <nav
        className={`pointer-events-auto transition-all duration-300 border rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between w-full max-w-5xl xl:max-w-6xl ${
          isScrolled
            ? 'bg-[#0d0f12]/95 backdrop-blur-xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)]'
            : 'bg-[#0d0f12]/80 backdrop-blur-md border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
        }`}
        aria-label="Main Navigation"
      >
        {/* Brand / Logo with Portrait & Role - Exactly matching user requirements */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              scrollTo(0, 0);
            }
          }}
          className="flex items-center gap-3 group cursor-pointer select-none py-0.5 flex-shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-orange-500 group-hover:shadow-[0_0_12px_rgba(245,165,36,0.4)] transition-all duration-300 flex items-center justify-center bg-[#111317] flex-shrink-0">
            <img
              src="/umesh.jpg"
              alt={portfolioData.hero.name || 'Umesh Temburwar'}
              width={40}
              height={40}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs sm:text-sm text-white leading-tight whitespace-nowrap group-hover:text-orange-400 transition-colors">
              {portfolioData.hero.name || 'Umesh Temburwar'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-orange-400 whitespace-nowrap">
              Computer Science Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Visible on lg: 1024px+ to avoid crowded overlap) */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 font-mono text-xs text-zinc-400">
          {navItems.map((item) => {
            const targetId = item.href.replace('#', '');
            const isActive = location.pathname === '/' && activeSection === targetId;

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, targetId)}
                className={`relative py-1 transition-colors whitespace-nowrap ${
                  isActive ? 'text-white font-medium' : 'hover:text-white text-zinc-400'
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

        {/* Right CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <Magnetic strength={0.2} radius={50}>
            <Link
              to="/contact"
              className="px-4 py-1.5 rounded-full border border-white/20 bg-white/[0.04] text-xs font-mono text-white hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-sm group whitespace-nowrap flex-shrink-0"
            >
              <span>Let's talk</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>
          </Magnetic>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-zinc-300 hover:text-white lg:hidden"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Drawers cleanly on mobile and tablets < 1024px) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: expoOut }}
              className="absolute top-16 right-4 left-4 sm:left-auto bg-[#101216] border border-white/15 rounded-2xl shadow-2xl p-5 flex flex-col gap-3 min-w-[240px] lg:hidden z-[100] backdrop-blur-2xl"
            >
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={(e) => {
                    handleNavClick(e, item.href.replace('#', ''));
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm font-mono text-zinc-300 hover:text-white border-b border-white/5 pb-2.5 flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <span className="text-zinc-600 text-xs font-mono">0{idx + 1}</span>
                </motion.a>
              ))}
              <Link
                to="/resume"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-mono text-zinc-300 hover:text-white border-b border-white/5 pb-2.5 flex items-center justify-between"
              >
                <span>Resume (CV)</span>
                <span className="text-orange-400 text-xs">PDF</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-mono text-orange-400 hover:text-orange-300 pt-1 flex items-center justify-between"
              >
                <span>Get in Touch</span>
                <span>↗</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

// --- INTERACTIVE CONTACT EMAIL ROW WITH COPY TOAST ---
const ContactDetailsRow = () => {
  const [copied, setCopied] = useState(false);
  const email = 'umeshtemburwar2002@gmail.com';

  const copyEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  }, [email]);

  return (
    <div className="pt-8 border-t border-white/10 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 font-mono text-xs text-zinc-400">
      <div className="relative">
        <button
          onClick={copyEmail}
          className="hover:text-white transition-colors flex items-center gap-2 group cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-2 py-1"
          title="Click to copy email"
        >
          {copied ? (
            <Check size={14} className="text-emerald-400 animate-in zoom-in-75 duration-200" />
          ) : (
            <Mail size={14} className="text-orange-500 group-hover:scale-110 transition-transform" />
          )}
          <span className="underline-offset-4 group-hover:underline">{email}</span>
          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">(Click to copy)</span>
        </button>

        {/* Spring Toast Pop-In */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: -28, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-orange-500 text-black font-mono text-[10px] font-bold uppercase tracking-wider shadow-lg pointer-events-none whitespace-nowrap z-30"
            >
              Email Copied!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <a
        href="tel:+918856087984"
        className="hover:text-white transition-colors flex items-center gap-2 group px-2 py-1 rounded focus-visible:ring-2 focus-visible:ring-orange-500"
      >
        <Phone size={14} className="text-orange-500 group-hover:scale-110 transition-transform" />
        <span className="underline-offset-4 group-hover:underline">+91 8856087984</span>
      </a>
    </div>
  );
};

// --- MAIN APP CONTENT ---
const AppContent = () => {
  const { data: portfolioData } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | typeof portfolioData.projects[0] | null>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const location = useLocation();

  // Scroll Progress and Parallax
  const { scrollY, scrollYProgress } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.4]);

  const experienceRef = useRef<HTMLElement>(null);
  const { scrollYProgress: expScrollY } = useScroll({ target: experienceRef, offset: ["start center", "end center"] });

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        scrollTo(location.hash, -90);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedProject]);

  const allTech = portfolioData.projects.flatMap(p => p.tech).filter((v, i, a) => a.indexOf(v) === i);

  const resumeSummary =
    "Full Stack Developer (React.js, Node.js) and Computer Science graduate with hands-on experience building responsive web applications and REST APIs using React.js, Next.js, JavaScript, TypeScript, Node.js, Express.js, PostgreSQL, MongoDB, Supabase, and Git.";

  return (
    <LayoutGroup>
      <div className="relative min-h-screen text-[#EDEDED] selection:bg-orange-500/25 selection:text-orange-400 z-0">
        <GatewayFlow speed={0.8} opacity={0.65} />
        <Preloader />
        <CustomCursor />

        {/* Global 2px Orange Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 origin-left z-[100]"
          style={{ scaleX: scrollYProgress }}
        />

        <FloatingNavBar />

        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname.startsWith('/admin') ? 'admin' : location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* HERO SECTION — SIDE-BY-SIDE CINEMATIC COMPOSITION */}
                    <section
                      id="hero"
                      className="min-h-screen relative flex flex-col justify-between pt-24 pb-8 px-4 sm:px-8 md:px-12 bg-transparent overflow-hidden"
                      aria-label="Hero Introduction"
                    >
                      {/* Subtle Noise Texture & Amber Vignette Aura */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                          backgroundImage: `radial-gradient(circle at 60% 40%, rgba(245, 165, 36, 0.08) 0%, transparent 65%)`,
                        }}
                      />

                      {/* Top Metadata Strip */}
                      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 pt-4 mb-4">
                        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-[0.25em] uppercase">
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          ENGINEER. BUILDER. FULL STACK.
                        </div>
                        <div className="hidden sm:block font-mono text-[10px] sm:text-[11px] text-zinc-500 tracking-[0.25em] uppercase">
                          BASED IN MAHARASHTRA, INDIA • OPEN FOR ROLES
                        </div>
                      </div>

                      {/* Center Grid: Left Side Text & Role & Summary | Right Side Particle Portrait */}
                      <motion.div
                        style={{ y: heroParallaxY, opacity: heroOpacity }}
                        className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4"
                      >
                        {/* Left Column: Role, Name, Detailed Resume Summary, Tech Pills, & CTAs */}
                        <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
                          {/* Open to Work Badge */}
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 font-mono text-xs text-orange-400 mb-4"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                            <span>OPEN TO SOFTWARE ENGINEERING ROLES</span>
                          </motion.div>

                          {/* Large Editorial Serif Name with Word Reveal */}
                          <SplitText
                            text={portfolioData.hero.name || 'Umesh Temburwar'}
                            as="h1"
                            stagger={0.06}
                            delay={0.15}
                            className="font-editorial italic font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-4 select-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
                          />

                          {/* Accessible Rotating Role Headline with Blinking Orange Cursor */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35, ease: primaryEase }}
                            className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm text-zinc-300 uppercase tracking-widest mb-4"
                          >
                            <span className="w-2 h-2 bg-orange-500 flex-shrink-0" />
                            <TypewriterRole
                              roles={[
                                'Full Stack Developer (React.js, Node.js)',
                                'Computer Science Engineer',
                                'Modern Web & REST API Builder',
                                'React & Next.js Specialist',
                              ]}
                              className="text-orange-400 font-semibold"
                            />
                            <span className="hidden sm:inline text-zinc-500">• B.Tech Computer Science</span>
                          </motion.div>

                          {/* Resume Summary Text */}
                          <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.45, ease: primaryEase }}
                            className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl mb-6 font-light"
                          >
                            {portfolioData.hero.description || resumeSummary}
                          </motion.p>

                          {/* Tech Stack Pills (Staggered Opening Animation) */}
                          <div className="flex flex-wrap gap-2 mb-8">
                            {portfolioData.hero.heroStack?.map((tech, idx) => (
                              <motion.span
                                key={tech}
                                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: 0.52 + idx * 0.04 }}
                                className="font-mono text-xs border border-white/10 bg-white/[0.03] text-zinc-300 px-3 py-1 rounded hover:border-orange-500/50 hover:text-white transition-colors"
                              >
                                {tech}
                              </motion.span>
                            ))}
                          </div>

                          {/* Action CTAs with Magnetic Effect & Tap Physics */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.65, ease: primaryEase }}
                            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
                          >
                            <Magnetic strength={0.25} radius={65}>
                              <motion.a
                                href="#projects"
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  scrollTo('#projects', -90);
                                }}
                                className="px-6 py-3 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase font-semibold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 shadow-lg group focus-visible:ring-2 focus-visible:ring-orange-500"
                              >
                                <span>Explore My Work</span>
                                <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                              </motion.a>
                            </Magnetic>

                            <Magnetic strength={0.25} radius={65}>
                              <motion.div whileTap={{ scale: 0.96 }}>
                                <Link
                                  to="/contact"
                                  className="px-6 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white font-mono text-xs tracking-wider uppercase hover:border-orange-500 hover:text-orange-400 transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500"
                                >
                                  <span>Let's Connect</span>
                                  <span>↗</span>
                                </Link>
                              </motion.div>
                            </Magnetic>

                            {portfolioData.resume.exists && (
                              <Magnetic strength={0.2} radius={50}>
                                <motion.div whileTap={{ scale: 0.96 }}>
                                  <Link
                                    to="/resume"
                                    className="px-5 py-3 font-mono text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                                  >
                                    <FileText size={15} className="text-orange-400" />
                                    <span>View CV</span>
                                  </Link>
                                </motion.div>
                              </Magnetic>
                            )}
                          </motion.div>

                          {/* Quick Location & Social info */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.75 }}
                            className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-500"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-orange-500">📍</span>
                              <span>{portfolioData.experience[0]?.location || 'Ambajogai, Maharashtra'}</span>
                            </div>
                            <SocialLinks />
                          </motion.div>
                        </div>

                        {/* Right Column: Colorful Studio Interactive Particle Portrait */}
                        <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.0, ease: expoOut, delay: 0.2 }}
                            className="relative w-full max-w-[420px] sm:max-w-[460px] md:max-w-[500px]"
                          >
                            <ParticlePortrait
                              imageSrc="/umesh-colorful.png"
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

                      {/* Hero Bottom Bar */}
                      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 pt-6 border-t border-white/10 font-mono text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-[0.2em]">
                        <a
                          href="#about"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollTo('#about', -90);
                          }}
                          className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                          <span className="w-px h-3.5 bg-orange-500 inline-block mr-1" />
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
                            className="px-2.5 py-1 rounded border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-orange-500"
                            title="Toggle particle motion"
                          >
                            <span>{motionEnabled ? '⏸' : '▶'}</span>
                            <span>{motionEnabled ? 'MOTION ON' : 'MOTION OFF'}</span>
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* ========================================================================= */}
                    {/* SECTIONS: 1. ABOUT  2. SKILLS  3. PROJECTS  4. EXPERIENCE  5. EDUCATION   */}
                    {/* 6. CERTIFICATIONS  7. CONTACT                                            */}
                    {/* ========================================================================= */}

                    {/* 1. ABOUT ME (WITH METRICS STRIP & COUNT-UP ANIMATION) */}
                    <section
                      id="about"
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="about-heading"
                    >
                      <SectionHeader
                        num="01 / ABOUT ME"
                        title="About Me"
                        subtitle="THE PERSON BEHIND THE WORK"
                      />

                      {/* Impact Metrics Row with Animated Number Count-Up */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 border border-white/10 bg-[#0c0e12] p-6 sm:p-8 rounded-lg shadow-lg">
                        <div className="border-l-2 border-orange-500/60 pl-4">
                          <div className="font-editorial text-4xl sm:text-5xl text-white">
                            <CountUp end={3} suffix="+" />
                          </div>
                          <p className="font-mono text-xs text-zinc-400 mt-2 uppercase tracking-wider">
                            Years Building & Coding
                          </p>
                        </div>

                        <div className="border-l-2 border-orange-500/60 pl-4">
                          <div className="font-editorial text-4xl sm:text-5xl text-white">
                            <CountUp end={10} suffix="+" />
                          </div>
                          <p className="font-mono text-xs text-zinc-400 mt-2 uppercase tracking-wider">
                            Full-Stack & AI Projects
                          </p>
                        </div>

                        <div className="border-l-2 border-orange-500/60 pl-4">
                          <div className="font-editorial text-4xl sm:text-5xl text-white">
                            <CountUp end={2000} suffix="+" />
                          </div>
                          <p className="font-mono text-xs text-zinc-400 mt-2 uppercase tracking-wider">
                            ByteFest Daily Visitors
                          </p>
                        </div>

                        <div className="border-l-2 border-orange-500/60 pl-4 flex flex-col justify-between">
                          <div>
                            <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
                              THE WORK.
                            </div>
                            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mt-0.5">
                              REAL-WORLD IMPACT.
                            </div>
                          </div>
                          <a
                            href="#projects"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollTo('#projects', -90);
                            }}
                            className="text-orange-500 font-mono text-xs hover:underline mt-2 flex items-center gap-1 w-fit focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                          >
                            EXPLORE WORK ↗
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-8 items-start">
                        <Reveal delay={0} className="col-span-12 lg:col-span-8 pr-0 lg:pr-12">
                          <p className="text-xl sm:text-2xl font-editorial italic text-zinc-200 leading-relaxed mb-6">
                            {portfolioData.about.content}
                          </p>
                          <p className="text-sm md:text-base text-zinc-400 font-sans leading-relaxed mb-6">
                            I am dedicated to building robust, accessible, and high-performance digital solutions. My experience ranges from architecting end-to-end full-stack web platforms with React and Node.js to designing resilient REST APIs, automated backend workers, and cloud storage workflows.
                          </p>
                        </Reveal>

                        <Reveal delay={150} className="col-span-12 lg:col-span-4 flex flex-col gap-5 font-mono text-xs border-l-0 lg:border-l border-white/10 pl-0 lg:pl-10 mt-6 lg:mt-0">
                          <div className="p-4 border border-white/10 bg-[#0d0f12] rounded hover:border-orange-500/40 transition-colors">
                            <span className="text-zinc-500 uppercase tracking-wider block mb-1">Academic Degree</span>
                            <span className="text-white text-sm font-sans">{portfolioData.education[0]?.degree}</span>
                          </div>

                          <div className="p-4 border border-white/10 bg-[#0d0f12] rounded hover:border-orange-500/40 transition-colors">
                            <span className="text-zinc-500 uppercase tracking-wider block mb-1">Institution</span>
                            <span className="text-white text-sm font-sans">{portfolioData.education[0]?.institution}</span>
                          </div>

                          <div className="p-4 border border-white/10 bg-[#0d0f12] rounded hover:border-orange-500/40 transition-colors">
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
                    <section
                      id="skills"
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="skills-heading"
                    >
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
                            className="p-6 sm:p-7 border border-white/10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl hover:border-orange-500/40 transition-all group flex flex-col justify-between shadow-lg"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                                <h3 className="font-mono text-xs text-orange-400 uppercase tracking-[0.2em] font-semibold">
                                  {group.category}
                                </h3>
                                <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded">0{idx + 1}</span>
                              </div>
                              <div className="flex flex-wrap gap-2.5">
                                {group.items.map((item, itemIdx) => (
                                  <SkillBadge3D
                                    key={item}
                                    name={item}
                                    index={itemIdx}
                                  />
                                ))}
                              </div>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    </section>

                    {/* 3. FEATURED PROJECTS (WITH 3D TILT & CUSTOM CURSOR "VIEW") */}
                    <section
                      id="projects"
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="projects-heading"
                    >
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
                            <TiltCard maxTilt={4} className="h-full">
                              <div
                                data-cursor="view"
                                className="border border-white/10 bg-[#0c0e12] rounded-lg flex flex-col justify-between group hover:border-orange-500/50 transition-all overflow-hidden h-full shadow-xl"
                              >
                                {project.coverImage && (
                                  <div className="w-full h-52 overflow-hidden bg-black/80 relative">
                                    <img
                                      src={project.coverImage}
                                      alt={project.title}
                                      width={600}
                                      height={220}
                                      className="w-full h-full object-cover object-top opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-transparent" />
                                  </div>
                                )}

                                <div className="p-7 flex flex-col flex-grow">
                                  <div className="flex items-center justify-between mb-3 font-mono text-[11px] text-orange-400 uppercase tracking-widest">
                                    <span>{project.category || 'Full-Stack Application'}</span>
                                    <span className="text-zinc-500">{project.status}</span>
                                  </div>

                                  <h3 className="font-editorial text-2xl sm:text-3xl text-white mb-3 group-hover:text-orange-400 transition-colors">
                                    {project.title}
                                  </h3>

                                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-light">
                                    {project.shortDescription || project.description}
                                  </p>

                                  <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                    {project.tech.slice(0, 5).map((t) => (
                                      <span
                                        key={t}
                                        className="font-mono text-[11px] text-zinc-400 bg-white/[0.03] border border-white/10 px-2.5 py-1 rounded"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between pt-5 border-t border-white/10">
                                    <button
                                      onClick={() => setSelectedProject(project)}
                                      className="font-mono text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors group/btn focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1.5 py-0.5"
                                    >
                                      <span>Case Study Details</span>
                                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>

                                    <div className="flex items-center gap-3">
                                      {project.liveUrl && (
                                        <a
                                          href={project.liveUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-2 border border-white/10 hover:border-orange-500 hover:text-orange-400 rounded transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
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
                                          className="p-2 border border-white/10 hover:border-orange-500 hover:text-orange-400 rounded transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
                                          title="Source Code"
                                        >
                                          <Github size={16} />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TiltCard>
                          </Reveal>
                        ))}
                      </div>

                      <div className="mt-12 text-center">
                        <Magnetic strength={0.2} radius={50}>
                          <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/20 bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500"
                          >
                            <span>View All Projects & Architectures</span>
                            <ArrowRight size={14} />
                          </Link>
                        </Magnetic>
                      </div>
                    </section>

                    {/* 4. WORK EXPERIENCE (ANIMATED VERTICAL TIMELINE) */}
                    <section
                      id="experience"
                      ref={experienceRef}
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="experience-heading"
                    >
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
                                  {exp.highlights.map((h, i) => (
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

                    {/* 5. EDUCATION (DEDICATED STANDALONE SECTION) */}
                    <section
                      id="education"
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="education-heading"
                    >
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
                            className="md:col-span-12 border border-white/10 bg-[#0c0e12]/80 backdrop-blur-md rounded-xl p-8 hover:border-orange-500/40 transition-all shadow-xl"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
                              <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 font-mono text-xs text-orange-400 mb-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                  <span>Bachelor of Technology (B.Tech)</span>
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
                                  CGPA: <strong className="text-white">6.06</strong> / 10.0
                                </span>
                              </div>
                            </div>

                            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-mono text-xs text-orange-400 uppercase tracking-widest mb-3">
                                  Core Focus & Fundamentals
                                </h4>
                                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                                  Focusing on Computer Science fundamentals: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, and Full-Stack Engineering.
                                </p>
                              </div>

                              <div>
                                <h4 className="font-mono text-xs text-orange-400 uppercase tracking-widest mb-3">
                                  Key Competencies Developed
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {["Data Structures", "Algorithms", "DBMS & SQL", "Operating Systems", "Computer Networks", "OOP", "Full-Stack Web Dev", "REST APIs"].map((sub) => (
                                    <span key={sub} className="px-3 py-1 rounded bg-black/60 border border-white/10 font-mono text-xs text-zinc-300">
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    </section>

                    {/* 6. CERTIFICATIONS (ALTERNATING DESKTOP SLIDE-IN) */}
                    <section
                      id="certifications"
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="certifications-heading"
                    >
                      <SectionHeader
                        num="06 / CERTIFICATIONS"
                        title="Certifications & Credentials"
                        subtitle="VERIFIED TECHNICAL ACHIEVEMENTS"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolioData.certifications.map((cert, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -24 : 24, y: 16 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.65, delay: Math.min(idx * 0.1, 0.4), ease: primaryEase }}
                            className="border border-white/10 bg-[#0c0e12] rounded-lg flex flex-col justify-between group hover:border-orange-500/40 hover:-translate-y-1 transition-all p-7 shadow-lg"
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
                                className="font-mono text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1.5 pt-4 border-t border-white/10 mt-auto focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
                              >
                                <span>View Certificate</span>
                                <ExternalLink size={13} />
                              </a>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* 7. CONTACT (BALANCED BUTTONS, RESPONSIVE ROW, MAGNETIC CTAs) */}
                    <section
                      id="contact"
                      className="py-24 md:py-32 px-6 max-w-7xl mx-auto scroll-mt-28 md:scroll-mt-32 border-t border-white/10"
                      aria-labelledby="contact-heading"
                    >
                      <div className="border border-white/10 bg-gradient-to-b from-[#0e1014] to-[#070708] p-8 sm:p-14 md:p-20 rounded-2xl relative overflow-hidden text-center flex flex-col items-center shadow-2xl">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className="font-mono text-xs text-orange-400 uppercase tracking-[0.3em] mb-4"
                        >
                          ■ 07 / INITIATE A CONVERSATION
                        </motion.div>

                        <SplitText
                          text="Let's build something exceptional together."
                          as="h2"
                          className="font-editorial italic text-4xl sm:text-6xl md:text-7xl text-white max-w-3xl leading-tight mb-6"
                        />

                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="text-zinc-400 text-sm sm:text-base max-w-xl font-sans mb-10 leading-relaxed font-light"
                        >
                          Whether you have an engineering role opening, an ambitious full-stack project, or simply want to connect, my inbox is always open.
                        </motion.p>

                        {/* Centered, balanced CTA button group with Magnetic Physics */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 w-full sm:w-auto">
                          <Magnetic strength={0.25} radius={65}>
                            <motion.div whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                              <Link
                                to="/contact"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-orange-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-orange-500"
                              >
                                <span>Send a Message</span>
                                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                              </Link>
                            </motion.div>
                          </Magnetic>

                          {portfolioData.resume.exists && (
                            <Magnetic strength={0.25} radius={65}>
                              <motion.div whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                                <Link
                                  to="/resume"
                                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 bg-black/40 text-white font-mono text-xs uppercase tracking-wider hover:border-orange-500 hover:text-orange-400 transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-500"
                                >
                                  <span>Review Full CV</span>
                                </Link>
                              </motion.div>
                            </Magnetic>
                          )}
                        </div>

                        {/* Aligned Interactive Email & Phone Row */}
                        <ContactDetailsRow />
                      </div>
                    </section>
                  </motion.div>
                }
              />

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
          </AnimatePresence>
        </main>

        {/* 3-COLUMN RESPONSIVE CINEMATIC FOOTER */}
        <footer className="py-12 border-t border-white/10 px-6 bg-[#070708]/90 backdrop-blur-md" role="contentinfo">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 font-mono text-xs text-zinc-500 uppercase tracking-widest text-center md:text-left">
            {/* Left: Copyright */}
            <div className="md:text-left">
              <Link
                to="/admin"
                className="hover:text-orange-400 transition-colors cursor-pointer inline-block focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
                title="Admin Portal (Shortcut: Ctrl+Shift+A)"
              >
                &copy; {new Date().getFullYear()} {portfolioData.hero.name || 'Umesh Temburwar'} • ALL RIGHTS RESERVED
              </Link>
            </div>

            {/* Center: Social Links */}
            <div className="flex items-center justify-center gap-6">
              {portfolioData.hero.githubUrl && (
                <a
                  href={portfolioData.hero.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
                >
                  GitHub
                </a>
              )}
              {portfolioData.hero.linkedinUrl && (
                <a
                  href={portfolioData.hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
                >
                  LinkedIn
                </a>
              )}
              <Link
                to="/resume"
                className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
              >
                Resume
              </Link>
            </div>

            {/* Right: Floating Arrow Back to Top with Smooth Scroll */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={() => scrollTo(0, 0)}
                className="hover:text-white transition-colors inline-flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-2 py-1"
                aria-label="Back to Top of Page"
              >
                <span>Back to Top</span>
                <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform duration-200" />
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
                transition={{ duration: 0.35, ease: primaryEase }}
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
                    className="p-2 border border-white/10 hover:border-white rounded transition-colors text-zinc-400 hover:text-white focus-visible:ring-2 focus-visible:ring-orange-500"
                    aria-label="Close project modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8">
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
                        className="px-6 py-2.5 bg-white text-black hover:bg-orange-500 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 rounded-full font-semibold focus-visible:ring-2 focus-visible:ring-orange-500"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 border border-white/20 hover:border-orange-500 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 rounded-full focus-visible:ring-2 focus-visible:ring-orange-500"
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
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </PortfolioProvider>
  );
};

export default App;
