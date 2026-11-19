import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Code2 } from 'lucide-react';
import { skillsData } from './data/skillsData';
import { aptitudeData } from './data/aptitudeData';
import { dsaProblemsData } from './data/dsaProblemsData';
import {
  csFundamentalsData,
  managerialRoundData,
  hrRoundData,
  mncCompanyNotes,
} from './data/roundsData';
import { projectsData } from './data/projectsData';
import { useProgress } from './hooks/useProgress';
import { Sidebar, ActiveSection } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { QAAccordion } from './components/QAAccordion';
import { ProgressDashboard } from './components/ProgressDashboard';
import { MockInterviewModal } from './components/MockInterviewModal';
import { ProjectDeepDive } from './components/ProjectDeepDive';
import { RoundDetail } from './components/RoundDetail';
import { ExtrasDetail } from './components/ExtrasDetail';
import { QAItem, DifficultyLevel } from './types';

export default function InterviewPrepPage() {
  // 1. Auth Guard (Shared with AdminPortal: password 08092002 / sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('umesh_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // 2. Navigation & View State
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('interview_prep_theme') === 'dark';
  });

  // 3. Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | DifficultyLevel>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('all');

  // 4. Progress Tracking Hook (Persisted in localStorage with try/catch)
  const {
    progress,
    toggleComplete,
    isCompleted,
    toggleBookmark,
    isBookmarked,
    setNote,
    getNote,
    toggleDay,
    toggleChecklist,
    resetProgress,
    completedCount,
    bookmarkedCount,
  } = useProgress();

  // 5. Injected SEO Robots Meta Tag
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    const previousContent = metaTag.content;
    metaTag.content = 'noindex, nofollow';

    return () => {
      metaTag.content = previousContent || '';
    };
  }, []);

  // Sync theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('interview_prep_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('interview_prep_theme', 'light');
    }
  }, [isDark]);

  // Aggregate All Q&A Items for global search and metrics
  const allQAItems = useMemo<QAItem[]>(() => {
    const list: QAItem[] = [];
    skillsData.forEach((group) => {
      group.skills.forEach((skill) => {
        skill.questions.forEach((q) => {
          list.push({ ...q, category: skill.name });
        });
      });
    });
    csFundamentalsData.forEach((q) => list.push(q));
    managerialRoundData.forEach((q) => list.push(q));
    hrRoundData.forEach((q) => list.push(q));
    return list;
  }, []);

  // Filtered Questions based on Search & Difficulty
  const filteredQAItems = useMemo(() => {
    return allQAItems.filter((item) => {
      // Difficulty match
      if (selectedDifficulty !== 'All' && item.level !== selectedDifficulty) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const qLower = searchQuery.toLowerCase();
        const matchesQ = item.question.toLowerCase().includes(qLower);
        const matchesShort = item.shortAnswer.toLowerCase().includes(qLower);
        const matchesDetail = item.detailedAnswer.toLowerCase().includes(qLower);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(qLower));
        const matchesCat = item.category?.toLowerCase().includes(qLower);
        return matchesQ || matchesShort || matchesDetail || matchesTags || matchesCat;
      }
      return true;
    });
  }, [allQAItems, selectedDifficulty, searchQuery]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '08092002') {
      sessionStorage.setItem('umesh_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError('Incorrect master password. Access denied.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('umesh_admin_auth');
    setIsAuthenticated(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // If Not Authenticated, show simple clean login guard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-800 dark:text-slate-100">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Interview Prep Hub
            </h1>
            <p className="text-xs text-slate-500">
              Restricted Area • Master Password Required
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Master Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Unlock Prep Hub
            </button>
          </form>

          <div className="text-center text-[11px] text-slate-400">
            Private Admin Section • <meta name="robots" content="noindex, nofollow" />
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN AUTHENTICATED APP ---
  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex ${isDark ? 'dark' : ''}`}>
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          aside, header, button, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setSearchQuery('');
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        completedCount={completedCount}
        bookmarkedCount={bookmarkedCount}
        totalQACount={allQAItems.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top Search & Action Bar */}
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenMockInterview={() => setIsMockModalOpen(true)}
          onPrint={handlePrint}
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onLogout={handleLogout}
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {/* Global Search Results Mode */}
          {searchQuery.trim() ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Search Results for "{searchQuery}"
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {filteredQAItems.length} matches found
                </span>
              </div>

              {filteredQAItems.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 text-sm">No interview questions matched your query.</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-indigo-600 font-medium underline"
                  >
                    Clear search filter
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredQAItems.map((q) => (
                    <QAAccordion
                      key={q.id}
                      item={q}
                      isCompleted={isCompleted(q.id)}
                      isBookmarked={isBookmarked(q.id)}
                      onToggleComplete={toggleComplete}
                      onToggleBookmark={toggleBookmark}
                      note={getNote(q.id)}
                      onSaveNote={setNote}
                      defaultExpanded={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* 1. Progress Dashboard */}
              {activeSection === 'dashboard' && (
                <ProgressDashboard
                  completedIds={progress.completedIds}
                  bookmarkedIds={progress.bookmarkedIds}
                  allQuestions={allQAItems}
                  skillsData={skillsData}
                  onSelectQuestion={() => setActiveSection('skills')}
                  onResetProgress={resetProgress}
                  onLaunchMock={() => setIsMockModalOpen(true)}
                  onToggleComplete={toggleComplete}
                  onToggleBookmark={toggleBookmark}
                />
              )}

              {/* 2. Skills Notes Section */}
              {activeSection === 'skills' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
                      <Code2 className="w-5 h-5" />
                      <span>Section A • Technical Skills Notes</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Comprehensive Notes & Q&As (Basic → Intermediate → Advanced)
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Covering all skills from your resume: JavaScript, TypeScript, React, Next.js, Node.js, Express, SQL/PostgreSQL, MongoDB, Docker, Git, and REST APIs.
                    </p>

                    {/* Skill selector filter */}
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setSelectedSkillId('all')}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          selectedSkillId === 'all'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        All Skills
                      </button>
                      {skillsData.map((group) =>
                        group.skills.map((skill) => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => setSelectedSkillId(skill.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                              selectedSkillId === skill.id
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {skill.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Skills Display Cards */}
                  <div className="space-y-8">
                    {skillsData.map((group) => {
                      const visibleSkills =
                        selectedSkillId === 'all'
                          ? group.skills
                          : group.skills.filter((s) => s.id === selectedSkillId);

                      if (visibleSkills.length === 0) return null;

                      return (
                        <div key={group.category} className="space-y-6">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-800">
                            {group.category}
                          </h3>

                          {visibleSkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {skill.name}
                                  </h4>
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400">
                                    {skill.badge}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">
                                  {skill.questions.length} Q&As
                                </span>
                              </div>

                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {skill.overview}
                              </p>

                              {/* Key Concepts and Common Mistakes */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                                    Must-Know Key Concepts:
                                  </span>
                                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                                    {skill.keyConcepts.map((kc, i) => (
                                      <li key={i}>{kc}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/20 rounded-lg border border-rose-200/80 dark:border-rose-900/60 text-xs space-y-1.5">
                                  <span className="font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider text-[11px]">
                                    Common Mistakes to Avoid:
                                  </span>
                                  <ul className="list-disc list-inside space-y-1 text-rose-700 dark:text-rose-300">
                                    {skill.commonMistakes.map((cm, i) => (
                                      <li key={i}>{cm}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Accordion Questions */}
                              <div className="pt-2">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                  Interview Q&As ({skill.name})
                                </h5>
                                <div className="space-y-2">
                                  {skill.questions.map((q) => (
                                    <QAAccordion
                                      key={q.id}
                                      item={q}
                                      isCompleted={isCompleted(q.id)}
                                      isBookmarked={isBookmarked(q.id)}
                                      onToggleComplete={toggleComplete}
                                      onToggleBookmark={toggleBookmark}
                                      note={getNote(q.id)}
                                      onSaveNote={setNote}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Section B: Rounds (OA, Tech 1 DSA, Tech 2 CS, Managerial, HR, MNC Notes) */}
              {(activeSection === 'round-oa-aptitude' ||
                activeSection === 'round-tech1-dsa' ||
                activeSection === 'round-tech2-cs' ||
                activeSection === 'round-managerial' ||
                activeSection === 'round-hr' ||
                activeSection === 'mnc-companies') && (
                <RoundDetail
                  roundType={activeSection}
                  aptitudeData={aptitudeData}
                  dsaData={dsaProblemsData}
                  csFundamentals={csFundamentalsData}
                  managerialData={managerialRoundData}
                  hrData={hrRoundData}
                  mncNotes={mncCompanyNotes}
                  isCompleted={isCompleted}
                  isBookmarked={isBookmarked}
                  onToggleComplete={toggleComplete}
                  onToggleBookmark={toggleBookmark}
                  getNote={getNote}
                  onSaveNote={setNote}
                />
              )}

              {/* 4. Section C: Projects Discussion */}
              {activeSection === 'projects' && (
                <ProjectDeepDive projects={projectsData} />
              )}

              {/* 5. Sections D & E: Resume, System Design, STAR Stories, 30-Day Plan, Checklist */}
              {(activeSection === 'resume-defense' ||
                activeSection === 'system-design' ||
                activeSection === 'star-stories' ||
                activeSection === 'study-plan' ||
                activeSection === 'final-checklist') && (
                <ExtrasDetail
                  viewType={activeSection}
                  checkedDays={progress.checkedDays}
                  onToggleDay={toggleDay}
                  checkedTasks={progress.checkedChecklist}
                  onToggleTask={toggleChecklist}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mock Interview Simulation Modal */}
      <MockInterviewModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        questions={allQAItems}
        isCompleted={isCompleted}
        isBookmarked={isBookmarked}
        onToggleComplete={toggleComplete}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
