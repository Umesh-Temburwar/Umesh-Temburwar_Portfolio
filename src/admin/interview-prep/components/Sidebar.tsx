import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Terminal,
  FolderGit2,
  FileCheck2,
  Sparkles,
  X,
  CheckCircle2,
  Bookmark,
  Layers,
  Calculator,
  BrainCircuit,
  Users2,
  Building2,
  HelpCircle,
  Clock
} from 'lucide-react';

export type ActiveSection =
  | 'dashboard'
  | 'skills'
  | 'round-oa-aptitude'
  | 'round-tech1-dsa'
  | 'round-tech2-cs'
  | 'round-managerial'
  | 'round-hr'
  | 'mnc-companies'
  | 'projects'
  | 'resume-defense'
  | 'system-design'
  | 'star-stories'
  | 'study-plan'
  | 'final-checklist';

interface SidebarProps {
  activeSection: ActiveSection;
  onSelectSection: (sec: ActiveSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  completedCount: number;
  bookmarkedCount: number;
  totalQACount: number;
}

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subLabel?: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  completedCount,
  bookmarkedCount,
  totalQACount,
}) => {
  const overallPercentage = totalQACount > 0 ? Math.round((completedCount / totalQACount) * 100) : 0;

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard' as ActiveSection,
          label: 'Progress Dashboard',
          icon: LayoutDashboard,
          badge: `${overallPercentage}%`,
        },
      ],
    },
    {
      title: 'SECTION A: SKILLS',
      items: [
        {
          id: 'skills' as ActiveSection,
          label: 'Skills Notes (Basic → Adv)',
          icon: Code2,
          subLabel: 'Languages, React, Node, DBs',
        },
      ],
    },
    {
      title: 'SECTION B: INTERVIEW ROUNDS',
      items: [
        {
          id: 'round-oa-aptitude' as ActiveSection,
          label: '1. Online Assessment (OA)',
          icon: Calculator,
          subLabel: '30 Aptitude & Pseudocode Q&As',
        },
        {
          id: 'round-tech1-dsa' as ActiveSection,
          label: '2. Tech 1: DSA Basics',
          icon: Terminal,
          subLabel: '25 Top LeetCode in JS/Python',
        },
        {
          id: 'round-tech2-cs' as ActiveSection,
          label: '3. Tech 2: CS Fundamentals',
          icon: BrainCircuit,
          subLabel: 'OOP, SOLID, DBMS, OS, Networks',
        },
        {
          id: 'round-managerial' as ActiveSection,
          label: '4. Managerial Round',
          icon: Users2,
          subLabel: 'Situational & STAR Framework',
        },
        {
          id: 'round-hr' as ActiveSection,
          label: '5. HR Round (Fresher Guide)',
          icon: HelpCircle,
          subLabel: 'Intro, Relocation, Bond, Salary',
        },
        {
          id: 'mnc-companies' as ActiveSection,
          label: 'MNC Company Notes',
          icon: Building2,
          subLabel: 'TCS, Infosys, Wipro, Accenture...',
        },
      ],
    },
    {
      title: 'SECTION C: PROJECTS',
      items: [
        {
          id: 'projects' as ActiveSection,
          label: 'Project Discussion Round',
          icon: FolderGit2,
          subLabel: 'EdTech, Inventory, ByteFest 2K25',
        },
      ],
    },
    {
      title: 'SECTION D: RESUME PREP',
      items: [
        {
          id: 'resume-defense' as ActiveSection,
          label: 'CGPA 6.06 & Resume Defense',
          icon: FileCheck2,
          subLabel: 'Cut-off Handling & Checklist',
        },
      ],
    },
    {
      title: 'SECTION E: EXTRAS & READINESS',
      items: [
        {
          id: 'system-design' as ActiveSection,
          label: 'System Design for Freshers',
          icon: Layers,
          subLabel: 'URL Shortener, Chat, Flash Sale',
        },
        {
          id: 'star-stories' as ActiveSection,
          label: 'Behavioral STAR Story Bank',
          icon: Sparkles,
          subLabel: '6 Pre-written Field Stories',
        },
        {
          id: 'study-plan' as ActiveSection,
          label: '30-Day Preparation Plan',
          icon: Clock,
          subLabel: 'Daily Tickable Milestones',
        },
        {
          id: 'final-checklist' as ActiveSection,
          label: 'Final-Day Checklist',
          icon: CheckCircle2,
          subLabel: 'Documents & Setup Readiness',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              UT
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Interview Prep Hub
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Umesh Temburwar • Full Stack
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-600 dark:text-slate-400">Prep Progress</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{overallPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {completedCount} Done
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              {bookmarkedCount} Starred
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-2 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectSection(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white font-medium shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <div className="truncate">
                          <div className="truncate font-medium">{item.label}</div>
                          {item.subLabel && (
                            <div
                              className={`text-[10px] truncate ${
                                isActive
                                  ? 'text-indigo-100'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {item.subLabel}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.badge && (
                        <span
                          className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between">
            <span>Hidden Hub</span>
            <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              v2.5
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
