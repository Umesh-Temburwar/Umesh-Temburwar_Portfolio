import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Info, CheckCircle2, Cpu, AlertTriangle, Layers, ShieldCheck } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { type ProjectItem } from '../data/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { Reveal } from '../components/Reveal';
import { TiltCard3D } from '../components/TiltCard3D';

const SectionHeader = ({ num, title }: { num: string; title: string }) => (
  <div className="col-span-12 flex items-baseline gap-4 mb-8">
    <span className="font-mono text-sm text-primary">{num}</span>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase">{title}</h2>
    <div className="flex-grow h-[1px] bg-border ml-4" />
  </div>
);

export default function Projects() {
  const { data: portfolioData } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | typeof portfolioData.projects[0] | null>(null);

  // SEO Optimization for Projects and Selected Project Modal
  useEffect(() => {
    const originalTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    if (selectedProject?.id === 'universal-job-apply-bot') {
      document.title = 'Universal Job Apply Bot | Full-Stack Automation Project';
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Explore Universal Job Apply Bot, a Python, Selenium, FastAPI, React, and Supabase-based job application automation project.'
        );
      }
    } else if (selectedProject) {
      document.title = `${selectedProject.title} | Umesh Temburwar`;
    } else {
      document.title = 'Universal Job Apply Bot & Projects | Umesh Temburwar';
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, [selectedProject]);

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen text-textMain">
      <SectionHeader num="02 /" title="Projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">
        {portfolioData.projects.map((project, idx) => (
          <Reveal
            key={project.id}
            delay={Math.min(idx * 80, 480)}
            className="h-full"
          >
            <TiltCard3D
              maxTilt={6}
              scale={1.01}
              className="group border border-border bg-surface overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors rounded-xl shadow-lg"
            >
              <div
                className="w-full h-64 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
                aria-label={`View details for ${project.title}`}
                style={{ transform: 'translateZ(20px)' }}
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="p-8 flex flex-col flex-grow" style={{ transform: 'translateZ(25px)' }}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  {'category' in project && project.category ? (
                    <span className="font-mono text-[11px] text-primary/80 uppercase tracking-wider">
                      {project.category}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-textMuted uppercase tracking-wider">
                      Project
                    </span>
                  )}
                  <span className="font-mono text-xs text-primary px-3 py-0.5 border border-primary/30 rounded-full shrink-0">
                    {project.status}
                  </span>
                </div>

                <div className="mb-3">
                  <h3
                    className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors tracking-tight"
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.title}
                  </h3>
                  {'subtitle' in project && project.subtitle && (
                    <p className="font-mono text-xs text-primary/90 mt-1 font-medium">
                      {project.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-textMuted leading-relaxed mb-6 flex-grow">
                  {project.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-8 mt-auto" aria-label="Technology Badges" style={{ transform: 'translateZ(15px)' }}>
                  {project.tech.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs text-textMuted bg-background border border-border px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 6 && (
                    <span className="font-mono text-xs text-textMuted bg-background border border-border px-2 py-1">
                      +{project.tech.length - 6}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 items-center" style={{ transform: 'translateZ(18px)' }}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-sm font-mono text-textMain border-b border-textMain hover:border-primary hover:text-primary transition-colors pb-1 flex items-center gap-1 cursor-pointer"
                    aria-label={`View detailed overview of ${project.title}`}
                  >
                    <Info size={12} /> VIEW DETAILS
                  </button>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-textMain border-b border-textMain hover:border-primary hover:text-primary transition-colors pb-1 flex items-center gap-1"
                      aria-label={`Open GitHub repository for ${project.title}`}
                    >
                      <FiGithub size={12} /> GITHUB
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-textMain border-b border-textMain hover:border-primary hover:text-primary transition-colors pb-1 flex items-center gap-1"
                      aria-label={`Open live demo for ${project.title}`}
                    >
                      <ExternalLink size={12} /> LIVE DEMO
                    </a>
                  )}
                </div>
              </div>
            </TiltCard3D>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="w-full max-w-4xl max-h-[90vh] bg-surface border border-border overflow-y-auto flex flex-col relative shadow-2xl custom-scrollbar"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-textMain hover:text-primary transition-colors cursor-pointer"
                aria-label="Close project details modal"
              >
                <X size={20} />
              </button>

              <div className="w-full h-[36vh] min-h-[260px] relative overflow-hidden bg-background">
                <img
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                  {'category' in selectedProject && selectedProject.category && (
                    <span className="font-mono text-xs text-primary/90 uppercase tracking-widest block mb-2 font-medium">
                      {selectedProject.category}
                    </span>
                  )}
                  <h2 className="text-2xl md:text-4xl font-bold mb-2 tracking-tighter uppercase text-textMain">
                    {selectedProject.title}
                  </h2>
                  {'subtitle' in selectedProject && selectedProject.subtitle && (
                    <p className="font-mono text-sm text-textMuted mb-4">
                      {selectedProject.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-xs text-textMain bg-background/70 backdrop-blur-md border border-border px-2.5 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-10 flex flex-col gap-10">
                {/* Project Overview */}
                <div>
                  <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers size={14} /> Project Overview
                  </h3>
                  <p className="text-textMuted text-base md:text-lg leading-relaxed">
                    {selectedProject.description || selectedProject.shortDescription}
                  </p>
                </div>

                {/* Problem Statement */}
                {'problem' in selectedProject && selectedProject.problem && (
                  <div className="bg-background/40 border border-border/80 p-5">
                    <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-400" /> Problem Statement
                    </h3>
                    <p className="text-textMuted text-sm md:text-base leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>
                )}

                {/* Solution */}
                {'solution' in selectedProject && selectedProject.solution && (
                  <div className="bg-background/40 border border-border/80 p-5">
                    <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-primary" /> Engineered Solution
                    </h3>
                    <p className="text-textMuted text-sm md:text-base leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                )}

                {/* Key Features */}
                {'features' in selectedProject && selectedProject.features && selectedProject.features.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Cpu size={14} /> Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProject.features.map((feat, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 bg-background/60 border border-border/80 p-3.5"
                        >
                          <span className="text-primary font-mono text-xs mt-0.5">✦</span>
                          <span className="text-textMuted text-sm leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Architecture */}
                {'architecture' in selectedProject && selectedProject.architecture && (
                  <div>
                    <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers size={14} /> System Architecture & Data Flow
                    </h3>
                    <div className="bg-background/80 border border-border p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-primary pb-3 border-b border-border/60 mb-3 font-semibold">
                        <span className="bg-surface px-2.5 py-1 border border-border">React Frontend</span>
                        <span className="text-textMuted">→</span>
                        <span className="bg-surface px-2.5 py-1 border border-border">FastAPI Backend</span>
                        <span className="text-textMuted">→</span>
                        <span className="bg-surface px-2.5 py-1 border border-border">Automation Worker</span>
                        <span className="text-textMuted">→</span>
                        <span className="bg-surface px-2.5 py-1 border border-border">Browser Automation (Selenium)</span>
                      </div>
                      <p className="text-textMuted text-sm leading-relaxed mb-2">
                        {selectedProject.architecture}
                      </p>
                      <p className="text-textMuted/70 text-xs italic">
                        Supabase provides authentication and database services where implemented, alongside a local SQLite application tracker for offline persistence and deduplication.
                      </p>
                    </div>
                  </div>
                )}

                {/* Development Challenges */}
                {'challenges' in selectedProject && selectedProject.challenges && (
                  <div>
                    <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ShieldCheck size={14} /> Development Challenges & Resolutions
                    </h3>
                    <p className="text-textMuted text-sm md:text-base leading-relaxed bg-background/40 border border-border/80 p-5">
                      {selectedProject.challenges}
                    </p>
                  </div>
                )}

                {/* Project Screenshots Preview */}
                {'screenshots' in selectedProject && selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layers size={14} /> Application Preview
                    </h3>
                    <div className="border border-border overflow-hidden bg-background">
                      <img
                        src={selectedProject.screenshots[0]}
                        alt={`${selectedProject.title} dashboard preview`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/50">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-textMain text-background hover:bg-primary hover:text-background transition-colors font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                      aria-label="Open live application"
                    >
                      Live Demo <ExternalLink size={16} />
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 border border-border hover:border-primary hover:text-primary transition-colors font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-2 text-textMain"
                      aria-label="View source repository on GitHub"
                    >
                      GitHub Repository <FiGithub size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
