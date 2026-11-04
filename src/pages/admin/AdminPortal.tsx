import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  Unlock,
  LogOut,
  Search,
  BookOpen,
  Briefcase,
  Award,
  Terminal,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Download,
  AlertCircle,
  User,
  Phone,
  Mail,
  Clock,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { skillsNotesData } from '../../data/admin/skillsNotesData';
import { projectsInterviewData } from '../../data/admin/projectsInterviewData';
import { interviewRoundsData } from '../../data/admin/interviewQuestionsData';
import { cheatSheetsData } from '../../data/admin/cheatSheetsData';

type TabType = 'overview' | 'skills' | 'projects' | 'interview' | 'cheatsheets';

export default function AdminPortal() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('umesh_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('edtech-platform');
  const [selectedRoundId, setSelectedRoundId] = useState<string>('round-1-fundamentals');
  const [selectedCheatSheet, setSelectedCheatSheet] = useState<string>('git-cheatsheet');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expanded items state
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Required Admin Password: 08092002
    if (password.trim() === '08092002') {
      setIsAuthenticated(true);
      sessionStorage.setItem('umesh_admin_auth', 'true');
      setPassword('');

      // Also attempt server-side auth cookie creation if API endpoint is live
      try {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify({ username: 'UMESH', password: password.trim() }),
        });
      } catch {
        // Client-side fallback authentication succeeded
      }
    } else {
      setAuthError('Incorrect admin password. Please enter the valid master password.');
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('umesh_admin_auth');
    setIsAuthenticated(false);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
    } catch {
      // ignore
    }
  };

  // Filtered Skills
  const filteredSkills = useMemo(() => {
    return skillsNotesData
      .filter((cat) => selectedSkillCategory === 'all' || cat.id === selectedSkillCategory)
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter((t) => {
          const matchesLevel = selectedSkillLevel === 'all' || t.level === selectedSkillLevel;
          const matchesSearch =
            searchQuery === '' ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.keyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchesLevel && matchesSearch;
        }),
      }))
      .filter((cat) => cat.topics.length > 0);
  }, [selectedSkillCategory, selectedSkillLevel, searchQuery]);

  // Selected Project
  const activeProject = useMemo(() => {
    return projectsInterviewData.find((p) => p.id === selectedProjectId) || projectsInterviewData[0];
  }, [selectedProjectId]);

  // Selected Round
  const activeRound = useMemo(() => {
    return interviewRoundsData.find((r) => r.id === selectedRoundId) || interviewRoundsData[0];
  }, [selectedRoundId]);

  // Selected CheatSheet
  const activeCheatSheet = useMemo(() => {
    return cheatSheetsData.find((c) => c.id === selectedCheatSheet) || cheatSheetsData[0];
  }, [selectedCheatSheet]);

  // ----------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-textMain selection:bg-primary/20 selection:text-primary">
        <div className="w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary" />
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4 shadow-[0_0_20px_rgba(245,165,36,0.15)]">
              <Lock size={28} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-primary mb-1">
              Hidden Master Portal
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-textMain">
              Umesh Temburwar
            </h1>
            <p className="text-xs font-mono text-textMuted mt-1">
              Admin & Technical Interview Preparation Hub
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-textMuted mb-2">
                Enter Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  required
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm text-textMain placeholder:text-textMuted/40 focus:outline-none focus:border-primary transition-colors pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted">
                  <Lock size={16} />
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-background font-medium font-mono text-sm uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-[0_4px_16px_rgba(245,165,36,0.2)] hover:shadow-[0_4px_24px_rgba(245,165,36,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock size={16} /> Authenticate & Enter
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <Link
              to="/"
              className="text-xs font-mono text-textMuted hover:text-primary transition-colors flex items-center justify-center gap-1.5"
            >
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED PORTAL VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-primary/20 selection:text-primary">
      {/* TOP COMMAND BAR */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold font-mono text-sm">
              UT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm tracking-tight leading-none text-textMain">
                  Umesh Temburwar
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                  Admin Active
                </span>
              </div>
              <span className="text-[11px] font-mono text-textMuted">
                Full Stack Developer (React.js, Node.js)
              </span>
            </div>
          </div>

          {/* Quick Contact & Time */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-textMuted border-x border-border/60 px-4">
            <a href="tel:+918856087984" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Phone size={13} className="text-primary" /> +91 8856087984
            </a>
            <span className="text-border">•</span>
            <a href="mailto:umeshtemburwar2002@gmail.com" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <Mail size={13} className="text-primary" /> umeshtemburwar2002@gmail.com
            </a>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5 text-primary">
              <Clock size={13} /> {currentTime} IST
            </div>
          </div>

          {/* Actions & Logout */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg border border-border hover:border-primary text-textMuted hover:text-textMain font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} /> View Live Portfolio
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} /> Exit Admin
            </button>
          </div>
        </div>

        {/* PRIMARY NAVIGATION TABS */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex overflow-x-auto custom-scrollbar border-t border-border/40">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-primary text-primary font-bold bg-primary/5'
                : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <User size={15} /> 1. Overview & Resume
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'skills'
                ? 'border-primary text-primary font-bold bg-primary/5'
                : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <BookOpen size={15} /> 2. Skills Mastery Notes (Basic to Adv)
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'border-primary text-primary font-bold bg-primary/5'
                : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <Briefcase size={15} /> 3. Projects Interview Blueprint
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'interview'
                ? 'border-primary text-primary font-bold bg-primary/5'
                : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <Award size={15} /> 4. Round-Wise Q&A (Rounds 1 - 5)
          </button>
          <button
            onClick={() => setActiveTab('cheatsheets')}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cheatsheets'
                ? 'border-primary text-primary font-bold bg-primary/5'
                : 'border-transparent text-textMuted hover:text-textMain'
            }`}
          >
            <Zap size={15} /> 5. Quick Cheat Sheets
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* ========================================================== */}
        {/* TAB 1: OVERVIEW & RESUME DOSSIER */}
        {/* ========================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Hero Banner */}
            <div className="p-8 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                <div>
                  <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-2">
                    Master Resume Dossier • Ambajogai, Maharashtra
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-textMain">
                    Umesh Temburwar
                  </h2>
                  <p className="text-base text-textMuted max-w-3xl mt-3 leading-relaxed">
                    Full Stack Developer (React.js, Node.js) and Computer Science graduate from{' '}
                    <span className="text-textMain font-semibold">MBES College of Engineering (CGPA: 6.06)</span> with hands-on experience building responsive web applications and REST APIs using React.js, Next.js, JavaScript, TypeScript, Node.js, Express.js, PostgreSQL, MongoDB, Supabase, and Git.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href="/Umesh-Temburwar-OCT.pdf"
                    target="_blank"
                    className="px-5 py-3 rounded-xl bg-primary text-background font-mono text-xs font-medium uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(245,165,36,0.2)]"
                  >
                    <Download size={15} /> Download PDF Resume
                  </a>
                  <button
                    onClick={() => handleCopy(
                      `Umesh Temburwar | +91 8856087984 | umeshtemburwar2002@gmail.com | https://github.com/Umesh-Temburwar | https://www.linkedin.com/in/umesh-temburwar-673555373/`,
                      'copy-all-contact'
                    )}
                    className="px-5 py-3 rounded-xl border border-border bg-surface hover:border-primary text-textMain font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {copiedId === 'copy-all-contact' ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                    {copiedId === 'copy-all-contact' ? 'Copied Details' : 'Copy Contact Info'}
                  </button>
                </div>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
                <div className="p-3.5 bg-background/60 rounded-xl border border-border">
                  <div className="text-[10px] font-mono text-textMuted uppercase">Phone</div>
                  <div className="text-sm font-bold text-textMain mt-1">+91 8856087984</div>
                </div>
                <div className="p-3.5 bg-background/60 rounded-xl border border-border">
                  <div className="text-[10px] font-mono text-textMuted uppercase">Email</div>
                  <div className="text-sm font-bold text-textMain mt-1 truncate">umeshtemburwar2002@gmail.com</div>
                </div>
                <div className="p-3.5 bg-background/60 rounded-xl border border-border">
                  <div className="text-[10px] font-mono text-textMuted uppercase">Education</div>
                  <div className="text-sm font-bold text-textMain mt-1">B.Tech CSE (6.06 CGPA)</div>
                </div>
                <div className="p-3.5 bg-background/60 rounded-xl border border-border">
                  <div className="text-[10px] font-mono text-textMuted uppercase">Primary Stack</div>
                  <div className="text-sm font-bold text-primary mt-1">React · Node · PostgreSQL</div>
                </div>
              </div>
            </div>

            {/* Resume Summary & Sections breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects Card */}
              <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-primary uppercase">Core Projects</span>
                    <span className="text-xs font-mono text-textMuted">3 Production Apps</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="p-3 rounded-xl bg-background border border-border/80">
                      <div className="font-bold text-sm text-textMain">EdTech Learning Platform</div>
                      <div className="text-xs text-textMuted font-mono mt-1">React, Node, Express, Supabase, RBAC</div>
                    </li>
                    <li className="p-3 rounded-xl bg-background border border-border/80">
                      <div className="font-bold text-sm text-textMain">Inventory Management System</div>
                      <div className="text-xs text-textMuted font-mono mt-1">Auto Spare Parts, MongoDB, Streaming CSV</div>
                    </li>
                    <li className="p-3 rounded-xl bg-background border border-border/80">
                      <div className="font-bold text-sm text-textMain">ByteFest 2K25 Live Platform</div>
                      <div className="text-xs text-textMuted font-mono mt-1">2,000+ Daily Visitors, 1,500+ Registrations</div>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="mt-6 py-2.5 w-full rounded-xl bg-surface hover:bg-primary/10 border border-border hover:border-primary/50 text-xs font-mono text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  View Project Interview Blueprints →
                </button>
              </div>

              {/* Skills Card */}
              <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-primary uppercase">Skills Scope</span>
                    <span className="text-xs font-mono text-textMuted">7 Core Disciplines</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'JavaScript', 'TypeScript', 'Python', 'C/C++', 'C#',
                      'React.js', 'Next.js', 'Tailwind CSS', 'HTML5/CSS3',
                      'Node.js', 'Express.js', 'FastAPI', 'ASP.NET Core',
                      'PostgreSQL', 'MongoDB', 'Supabase', 'SQL',
                      'Git/GitHub', 'Docker', 'Linux', 'REST APIs'
                    ].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-background border border-border font-mono text-xs text-textMuted">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('skills')}
                  className="mt-6 py-2.5 w-full rounded-xl bg-surface hover:bg-primary/10 border border-border hover:border-primary/50 text-xs font-mono text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Explore Complete Notes (Basic to Adv) →
                </button>
              </div>

              {/* Interview Rounds Card */}
              <div className="p-6 rounded-2xl border border-border bg-surface flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-primary uppercase">Interview Rounds</span>
                    <span className="text-xs font-mono text-textMuted">Rounds 1 through 5</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
                      <span>R1: Core CS Fundamentals (OA)</span>
                      <span className="text-primary">DSA · DBMS</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
                      <span>R2: Frontend Deep Dive</span>
                      <span className="text-primary">React · JS · Web</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
                      <span>R3: Backend & System Design</span>
                      <span className="text-primary">Node · APIs · DB</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
                      <span>R4: Machine Coding & Bugs</span>
                      <span className="text-primary">Live Code</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs font-mono">
                      <span>R5: HR & Leadership Fit</span>
                      <span className="text-primary">STAR Format</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('interview')}
                  className="mt-6 py-2.5 w-full rounded-xl bg-surface hover:bg-primary/10 border border-border hover:border-primary/50 text-xs font-mono text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Start Round-Wise Preparation →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: SKILLS MASTERY NOTES (BASIC TO ADVANCED) */}
        {/* ========================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search and Filters Bar */}
            <div className="p-5 rounded-2xl border border-border bg-surface flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted" />
                <input
                  type="text"
                  placeholder="Search skills, concepts, or algorithms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border pl-10 pr-4 py-2.5 rounded-xl font-mono text-xs text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Category Dropdown */}
                <select
                  value={selectedSkillCategory}
                  onChange={(e) => setSelectedSkillCategory(e.target.value)}
                  className="bg-background border border-border px-3 py-2 rounded-xl font-mono text-xs text-textMain focus:outline-none focus:border-primary"
                >
                  <option value="all">All Disciplines (7 Categories)</option>
                  {skillsNotesData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Level Dropdown */}
                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value)}
                  className="bg-background border border-border px-3 py-2 rounded-xl font-mono text-xs text-textMain focus:outline-none focus:border-primary"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Skills Notes Content Grid */}
            <div className="space-y-8">
              {filteredSkills.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-textMain flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {category.name}
                      </h3>
                      <p className="text-xs font-mono text-textMuted mt-0.5">{category.badge}</p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface border border-border text-textMuted">
                      {category.topics.length} Modules
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {category.topics.map((topic) => {
                      const isExpanded = expandedTopics[topic.id] ?? true;
                      return (
                        <div
                          key={topic.id}
                          className="rounded-2xl border border-border bg-surface/50 overflow-hidden hover:border-primary/40 transition-colors"
                        >
                          {/* Topic Header */}
                          <div
                            onClick={() => toggleTopic(topic.id)}
                            className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold ${
                                    topic.level === 'Advanced'
                                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                      : topic.level === 'Intermediate'
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  }`}
                                >
                                  {topic.level}
                                </span>
                                <h4 className="text-base font-bold text-textMain hover:text-primary transition-colors">
                                  {topic.title}
                                </h4>
                              </div>
                              <p className="text-xs text-textMuted leading-relaxed">
                                {topic.summary}
                              </p>
                            </div>
                            <div className="text-textMuted p-1">
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>
                          </div>

                          {/* Expanded Topic Details */}
                          {isExpanded && (
                            <div className="px-5 pb-6 space-y-5 border-t border-border/40 pt-4 bg-background/30">
                              {/* Key Architectural Points */}
                              <div>
                                <h5 className="font-mono text-xs uppercase tracking-wider text-primary mb-2.5 flex items-center gap-1.5">
                                  <Sparkles size={13} /> Key Engineering Principles & Notes
                                </h5>
                                <ul className="space-y-2">
                                  {topic.keyPoints.map((point, idx) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-textMain leading-relaxed flex items-start gap-2.5 bg-surface/40 p-2.5 rounded-xl border border-border/40"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Code Snippet (if available) */}
                              {topic.codeExample && (
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-mono text-xs uppercase tracking-wider text-textMuted">
                                      Implementation Code Example
                                    </span>
                                    <button
                                      onClick={() => handleCopy(topic.codeExample!, `code-${topic.id}`)}
                                      className="px-2.5 py-1 rounded bg-surface border border-border text-[11px] font-mono text-textMuted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedId === `code-${topic.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                      {copiedId === `code-${topic.id}` ? 'Copied' : 'Copy Code'}
                                    </button>
                                  </div>
                                  <pre className="p-4 rounded-xl bg-[#090b0e] border border-border/80 font-mono text-xs text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed">
                                    <code>{topic.codeExample}</code>
                                  </pre>
                                </div>
                              )}

                              {/* Common Interview Questions for this topic */}
                              {topic.commonInterviewQuestions && topic.commonInterviewQuestions.length > 0 && (
                                <div>
                                  <h5 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-2">
                                    Top Interviewer Questions & Answers
                                  </h5>
                                  <div className="space-y-2.5">
                                    {topic.commonInterviewQuestions.map((qa, idx) => (
                                      <div
                                        key={idx}
                                        className="p-3.5 rounded-xl bg-surface border border-border"
                                      >
                                        <div className="font-bold text-xs text-textMain mb-1.5 flex items-start gap-2">
                                          <span className="text-primary font-mono shrink-0">Q{idx + 1}:</span>
                                          <span>{qa.q}</span>
                                        </div>
                                        <div className="text-xs text-textMuted leading-relaxed pl-6">
                                          {qa.a}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: PROJECTS INTERVIEW BLUEPRINT */}
        {/* ========================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Project Picker Tabs */}
            <div className="flex overflow-x-auto custom-scrollbar gap-3 p-1.5 bg-surface border border-border rounded-2xl">
              {projectsInterviewData.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className={`px-5 py-3 rounded-xl font-mono text-xs transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selectedProjectId === project.id
                      ? 'bg-primary text-background font-bold shadow-md'
                      : 'text-textMuted hover:text-textMain hover:bg-background'
                  }`}
                >
                  <Briefcase size={14} />
                  <span>{project.title}</span>
                </button>
              ))}
            </div>

            {/* Active Project Dossier */}
            <div className="p-8 rounded-2xl border border-border bg-surface/50 space-y-8 relative overflow-hidden">
              {/* Project Hero Header */}
              <div className="border-b border-border/60 pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] uppercase">
                      {activeProject.role}
                    </span>
                    <span className="text-xs font-mono text-textMuted">• {activeProject.timeline}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-textMain tracking-tight">
                    {activeProject.title}
                  </h3>
                  <p className="text-sm text-textMuted mt-1">{activeProject.tagline}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {activeProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-background border border-border font-mono text-[11px] text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Elevator Pitch Boxes (30s and 90s) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-background border border-border relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-primary flex items-center gap-1.5 font-bold">
                      <Clock size={13} /> 30-Second Elevator Pitch
                    </span>
                    <button
                      onClick={() => handleCopy(activeProject.elevatorPitch.quick30Sec, 'pitch-30')}
                      className="text-xs font-mono text-textMuted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'pitch-30' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedId === 'pitch-30' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-textMain leading-relaxed italic">
                    "{activeProject.elevatorPitch.quick30Sec}"
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-background border border-border relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
                      <Clock size={13} /> 90-Second In-Depth Pitch
                    </span>
                    <button
                      onClick={() => handleCopy(activeProject.elevatorPitch.detailed90Sec, 'pitch-90')}
                      className="text-xs font-mono text-textMuted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'pitch-90' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedId === 'pitch-90' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-textMain leading-relaxed italic">
                    "{activeProject.elevatorPitch.detailed90Sec}"
                  </p>
                </div>
              </div>

              {/* Architecture & Flow */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                  <Layers size={14} /> System Architecture & Execution Flow
                </h4>
                <div className="p-5 rounded-xl bg-background border border-border space-y-4">
                  <p className="text-xs text-textMuted leading-relaxed font-mono">
                    {activeProject.architecture.description}
                  </p>
                  <ol className="space-y-2">
                    {activeProject.architecture.flow.map((step, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-textMain flex items-start gap-2.5 p-2 rounded bg-surface/60 border border-border/40 font-mono"
                      >
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Tech Choice Reasoning Table */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-primary mb-3">
                  Why this Tech Stack? (Architectural Trade-Offs)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeProject.architecture.techChoiceReasoning.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-background border border-border space-y-2">
                      <div className="font-bold text-sm text-textMain flex items-center gap-1.5 text-primary">
                        <Check size={15} /> {item.tech}
                      </div>
                      <div className="text-xs text-textMuted leading-relaxed">
                        <span className="font-mono text-textMain font-semibold">Why Selected: </span>
                        {item.why}
                      </div>
                      <div className="text-xs text-textMuted/80 border-t border-border/40 pt-1.5">
                        <span className="font-mono text-red-400 font-semibold">Alternative Rejected: </span>
                        {item.alternativeRejected}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Engineering Challenges & Solutions */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                  <AlertCircle size={14} /> Difficult Engineering Challenges & How I Solved Them
                </h4>
                <div className="space-y-4">
                  {activeProject.engineeringChallenges.map((ch, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-background border border-border space-y-3">
                      <div className="font-bold text-sm text-textMain flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px]">
                          Challenge {idx + 1}
                        </span>
                        <span>{ch.problem}</span>
                      </div>
                      <div className="text-xs text-emerald-400 leading-relaxed bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">
                        <span className="font-bold font-mono uppercase block text-emerald-300 mb-1">
                          Engineering Solution:
                        </span>
                        {ch.solution}
                      </div>
                      <div className="text-[11px] font-mono text-textMuted">
                        <span className="text-primary font-semibold">Key Takeaway: </span>
                        {ch.lessonLearned}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Project-Specific Interview Q&A */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-3">
                  Project Interview Questions & STAR Method Responses
                </h4>
                <div className="space-y-4">
                  {activeProject.interviewQA.map((qa, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-background border border-border space-y-3">
                      <div className="font-bold text-sm text-textMain flex items-start gap-2">
                        <span className="text-primary font-mono shrink-0">Q{idx + 1}:</span>
                        <span>{qa.question}</span>
                      </div>
                      <p className="text-xs text-textMuted leading-relaxed pl-6">
                        {qa.answer}
                      </p>

                      {qa.starTechnique && (
                        <div className="ml-6 p-4 rounded-xl bg-surface border border-primary/20 space-y-2 mt-2">
                          <span className="font-mono text-[10px] uppercase text-primary tracking-widest font-bold block">
                            Structured STAR Model Answer
                          </span>
                          <div className="text-xs text-textMain">
                            <strong className="text-primary font-mono">S (Situation): </strong>
                            {qa.starTechnique.situation}
                          </div>
                          <div className="text-xs text-textMain">
                            <strong className="text-primary font-mono">T (Task): </strong>
                            {qa.starTechnique.task}
                          </div>
                          <div className="text-xs text-textMain">
                            <strong className="text-primary font-mono">A (Action): </strong>
                            {qa.starTechnique.action}
                          </div>
                          <div className="text-xs text-textMain">
                            <strong className="text-primary font-mono">R (Result): </strong>
                            {qa.starTechnique.result}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: ROUND-WISE INTERVIEW MASTER GUIDE */}
        {/* ========================================================== */}
        {activeTab === 'interview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Rounds Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {interviewRoundsData.map((round) => (
                <button
                  key={round.id}
                  onClick={() => setSelectedRoundId(round.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRoundId === round.id
                      ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(245,165,36,0.15)]'
                      : 'border-border bg-surface hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-primary uppercase font-bold">
                      Round {round.roundNumber}
                    </span>
                    <span className="text-[10px] font-mono text-textMuted">{round.duration}</span>
                  </div>
                  <div className="font-bold text-xs text-textMain truncate">{round.badge}</div>
                </button>
              ))}
            </div>

            {/* Active Round Card */}
            <div className="p-8 rounded-2xl border border-border bg-surface/50 space-y-6">
              <div className="border-b border-border/60 pb-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] font-bold">
                    Round {activeRound.roundNumber} of 5
                  </span>
                  <span className="text-xs font-mono text-textMuted">• Focus: {activeRound.focusArea}</span>
                </div>
                <h3 className="text-2xl font-bold text-textMain">{activeRound.roundName}</h3>
                <p className="text-xs text-textMuted mt-2 leading-relaxed">{activeRound.overview}</p>
              </div>

              {/* Strategy Pills */}
              <div className="p-4 rounded-xl bg-background border border-border">
                <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold block mb-2">
                  Winning Strategies for this Round
                </span>
                <ul className="space-y-1.5">
                  {activeRound.keyStrategies.map((strat, idx) => (
                    <li key={idx} className="text-xs text-textMain flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span>{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions List */}
              <div className="space-y-5">
                <h4 className="font-mono text-xs uppercase tracking-wider text-textMuted">
                  Round Questions & High-Impact Model Answers ({activeRound.questions.length} Items)
                </h4>

                {activeRound.questions.map((q, idx) => {
                  const isExpanded = expandedQuestions[q.id] ?? true;
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-border bg-background overflow-hidden"
                    >
                      <div
                        onClick={() => toggleQuestion(q.id)}
                        className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-primary font-bold">
                              #{idx + 1}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-textMuted">
                              {q.category}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                q.difficulty === 'Hard'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                  : q.difficulty === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-textMain">{q.question}</h5>
                        </div>
                        <div className="text-textMuted p-1">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-3 border-t border-border/40 space-y-4">
                          <div className="text-xs text-textMain leading-relaxed whitespace-pre-line bg-surface/30 p-4 rounded-xl border border-border/50">
                            {q.answer}
                          </div>

                          {q.codeSnippet && (
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-mono text-[11px] text-textMuted uppercase">
                                  Reference Code Solution
                                </span>
                                <button
                                  onClick={() => handleCopy(q.codeSnippet!, `code-${q.id}`)}
                                  className="text-[11px] font-mono text-textMuted hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedId === `code-${q.id}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                  {copiedId === `code-${q.id}` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="p-3.5 rounded-xl bg-[#090b0e] border border-border font-mono text-xs text-emerald-400 overflow-x-auto custom-scrollbar leading-relaxed">
                                <code>{q.codeSnippet}</code>
                              </pre>
                            </div>
                          )}

                          {q.interviewTip && (
                            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-textMain flex items-start gap-2">
                              <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
                              <div>
                                <span className="font-mono text-[11px] text-primary font-bold uppercase block mb-0.5">
                                  Pro Candidate Tip:
                                </span>
                                <span className="text-textMuted">{q.interviewTip}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: QUICK REVISION CHEAT SHEETS */}
        {/* ========================================================== */}
        {activeTab === 'cheatsheets' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cheat Sheet Selectors */}
            <div className="flex flex-wrap gap-3">
              {cheatSheetsData.map((sheet) => (
                <button
                  key={sheet.id}
                  onClick={() => setSelectedCheatSheet(sheet.id)}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    selectedCheatSheet === sheet.id
                      ? 'bg-primary text-background font-bold shadow-md'
                      : 'bg-surface border border-border text-textMuted hover:text-textMain'
                  }`}
                >
                  <Terminal size={14} />
                  <span>{sheet.title}</span>
                </button>
              ))}
            </div>

            {/* Active Cheat Sheet Table */}
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-xl font-bold text-textMain flex items-center gap-2">
                  <Terminal size={18} className="text-primary" />
                  {activeCheatSheet.title}
                </h3>
                <span className="font-mono text-xs text-textMuted px-2.5 py-1 rounded bg-background border border-border">
                  {activeCheatSheet.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCheatSheet.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-background border border-border flex flex-col justify-between hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <code className="text-xs font-mono font-bold text-primary break-all">
                          {item.commandOrTerm}
                        </code>
                        <button
                          onClick={() => handleCopy(item.example || item.commandOrTerm, `cmd-${idx}`)}
                          className="text-textMuted hover:text-primary transition-colors p-1 cursor-pointer shrink-0"
                          title="Copy command"
                        >
                          {copiedId === `cmd-${idx}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <p className="text-xs text-textMuted leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.example && (
                      <div className="mt-3 pt-2 border-t border-border/40 font-mono text-[11px] text-emerald-400/90 truncate">
                        $ {item.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
