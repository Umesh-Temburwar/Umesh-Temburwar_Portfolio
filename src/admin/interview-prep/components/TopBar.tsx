import React from 'react';
import {
  Search,
  X,
  Menu,
  Moon,
  Sun,
  Printer,
  PlayCircle,
  LogOut,
} from 'lucide-react';
import { DifficultyLevel } from '../types';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDifficulty: 'All' | DifficultyLevel;
  onDifficultyChange: (diff: 'All' | DifficultyLevel) => void;
  onOpenMobileSidebar: () => void;
  onOpenMockInterview: () => void;
  onPrint: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  onOpenMobileSidebar,
  onOpenMockInterview,
  onPrint,
  isDark,
  onToggleDark,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Search bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search concepts, questions, projects, SQL, React, Node..."
              className="w-full text-sm pl-9 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Filters & Utilities */}
        <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {(['All', 'Basic', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onDifficultyChange(lvl)}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedDifficulty === lvl
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mock Interview Button */}
            <button
              type="button"
              onClick={onOpenMockInterview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
              title="Launch Mock Interview Simulator"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden md:inline">Mock Interview</span>
            </button>

            {/* Print / Export PDF */}
            <button
              type="button"
              onClick={onPrint}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Print / Save as PDF"
              aria-label="Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDark}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                title="Lock / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
