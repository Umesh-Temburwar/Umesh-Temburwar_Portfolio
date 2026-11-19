import React, { useState } from 'react';
import {
  Calculator,
  Terminal,
  BrainCircuit,
  Users2,
  HelpCircle,
  Building2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { AptitudeQuestion, DSAProblem, CompanyNote, QAItem } from '../types';
import { QAAccordion } from './QAAccordion';

interface RoundDetailProps {
  roundType:
    | 'round-oa-aptitude'
    | 'round-tech1-dsa'
    | 'round-tech2-cs'
    | 'round-managerial'
    | 'round-hr'
    | 'mnc-companies';
  aptitudeData: AptitudeQuestion[];
  dsaData: DSAProblem[];
  csFundamentals: QAItem[];
  managerialData: QAItem[];
  hrData: QAItem[];
  mncNotes: CompanyNote[];
  isCompleted: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  onToggleComplete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  getNote: (id: string) => string;
  onSaveNote: (id: string, note: string) => void;
}

export const RoundDetail: React.FC<RoundDetailProps> = ({
  roundType,
  aptitudeData,
  dsaData,
  csFundamentals,
  managerialData,
  hrData,
  mncNotes,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  getNote,
  onSaveNote,
}) => {
  // Aptitude filters & solution toggles
  const [selectedAptCat, setSelectedAptCat] = useState<string>('All');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // DSA filters & code language toggle
  const [selectedDsaTopic, setSelectedDsaTopic] = useState<string>('All');
  const [dsaLang, setDsaLang] = useState<'js' | 'python'>('js');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Toggle Aptitude solution
  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // 1. ONLINE ASSESSMENT APTITUDE
  if (roundType === 'round-oa-aptitude') {
    const categories = ['All', 'Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Basic Coding & Pseudocode'];
    const filteredApt = selectedAptCat === 'All' ? aptitudeData : aptitudeData.filter((q) => q.category === selectedAptCat);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Calculator className="w-5 h-5" />
            <span>Round 1 • Online Assessment (OA)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Aptitude, Reasoning & Pseudocode Practice (30 Top Questions)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Carefully curated for MNC initial screening tests (TCS NQT, Infosys, Wipro, Accenture, Cognizant, Capgemini).
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedAptCat(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedAptCat === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Aptitude Question Cards */}
        <div className="space-y-4">
          {filteredApt.map((item, idx) => {
            const isRevealed = revealedSolutions[item.id];
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      Q{idx + 1}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {item.question}
                </h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {item.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-lg border text-xs font-medium ${
                        isRevealed && opt === item.correctAnswer
                          ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="font-mono text-slate-400 mr-1.5">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>

                {/* Solution Reveal Toggle */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleSolution(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {isRevealed ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span>Hide Detailed Solution</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span>Show Answer & Shortcut Trick</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Solution Box */}
                {isRevealed && (
                  <div className="mt-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">
                      Correct Answer: {item.correctAnswer}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {item.solution}
                    </div>
                    {item.shortcutTip && (
                      <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-800/60 flex items-start gap-2 text-amber-900 dark:text-amber-300 text-xs">
                        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Shortcut / Trick: </span>
                          {item.shortcutTip}
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
    );
  }

  // 2. TECHNICAL ROUND 1: DSA BASICS
  if (roundType === 'round-tech1-dsa') {
    const topics = [
      'All',
      'Arrays',
      'Strings',
      'Hashing',
      'Two Pointers',
      'Recursion',
      'Sorting & Searching',
      'Linked List',
      'Stack & Queue',
      'Binary Trees',
    ];

    const filteredDsa = selectedDsaTopic === 'All' ? dsaData : dsaData.filter((d) => d.topic === selectedDsaTopic);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Terminal className="w-5 h-5" />
            <span>Round 2 • Technical Round 1: DSA Basics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            25 Most-Asked LeetCode Problems (Approach + JS & Python Code)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Master the core patterns: Two Pointers, Sliding Window, Fast & Slow Pointers, DFS, and Hash Lookups.
          </p>

          {/* Topic Filters & Language Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedDsaTopic(t)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedDsaTopic === t
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-center">
              <button
                type="button"
                onClick={() => setDsaLang('js')}
                className={`text-xs font-mono font-bold px-3 py-1 rounded transition-colors ${
                  dsaLang === 'js'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                JavaScript
              </button>
              <button
                type="button"
                onClick={() => setDsaLang('python')}
                className={`text-xs font-mono font-bold px-3 py-1 rounded transition-colors ${
                  dsaLang === 'python'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Python
              </button>
            </div>
          </div>
        </div>

        {/* DSA Problems List */}
        <div className="space-y-4">
          {filteredDsa.map((prob, idx) => {
            const activeCode = dsaLang === 'js' ? prob.jsCode : prob.pythonCode;
            const isCopied = copiedCodeId === prob.id;

            return (
              <div
                key={prob.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {prob.topic}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
                      {prob.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-500">Time: <strong className="text-indigo-600">{prob.timeComplexity}</strong></span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500">Space: <strong className="text-emerald-600">{prob.spaceComplexity}</strong></span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {prob.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {prob.problemStatement}
                </p>

                {/* Approach */}
                <div className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[11px] mb-1">
                    Optimal Algorithmic Approach
                  </div>
                  <p className="leading-relaxed">{prob.approach}</p>
                </div>

                {/* Code Block */}
                <div className="rounded-lg overflow-hidden border border-slate-800">
                  <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2 text-xs font-mono">
                    <span>{dsaLang === 'js' ? 'solution.js' : 'solution.py'}</span>
                    <button
                      type="button"
                      onClick={() => copyCode(activeCode, prob.id)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px] transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                    <code>{activeCode}</code>
                  </pre>
                </div>

                {/* Key takeaways */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-500">Key Takeaways:</span>
                  {prob.keyTakeaways.map((k, kIdx) => (
                    <span
                      key={kIdx}
                      className="text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      ✓ {k}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. TECHNICAL ROUND 2: CS FUNDAMENTALS
  if (roundType === 'round-tech2-cs') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <BrainCircuit className="w-5 h-5" />
            <span>Round 3 • Technical Round 2: CS Fundamentals</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Core Computer Science Theory & System Fundamentals
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Object-Oriented Programming (OOP), SOLID Principles, DBMS & Relational Theory, Operating Systems, Computer Networks, and Agile SDLC.
          </p>
        </div>

        <div className="space-y-3">
          {csFundamentals.map((item) => (
            <QAAccordion
              key={item.id}
              item={item}
              isCompleted={isCompleted(item.id)}
              isBookmarked={isBookmarked(item.id)}
              onToggleComplete={onToggleComplete}
              onToggleBookmark={onToggleBookmark}
              note={getNote(item.id)}
              onSaveNote={onSaveNote}
            />
          ))}
        </div>
      </div>
    );
  }

  // 4. MANAGERIAL ROUND
  if (roundType === 'round-managerial') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Users2 className="w-5 h-5" />
            <span>Round 4 • Managerial & Behavioral Round</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Situational & Behavioral Questions (STAR Method Answers)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Demonstrate ownership, leadership, conflict resolution, dealing with pressure, and technical accountability.
          </p>
        </div>

        <div className="space-y-3">
          {managerialData.map((item) => (
            <QAAccordion
              key={item.id}
              item={item}
              isCompleted={isCompleted(item.id)}
              isBookmarked={isBookmarked(item.id)}
              onToggleComplete={onToggleComplete}
              onToggleBookmark={onToggleBookmark}
              note={getNote(item.id)}
              onSaveNote={onSaveNote}
            />
          ))}
        </div>
      </div>
    );
  }

  // 5. HR ROUND (FRESHER GUIDE)
  if (roundType === 'round-hr') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <HelpCircle className="w-5 h-5" />
            <span>Round 5 • HR Round Preparation (Fresher Focus)</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Fresher Self-Introduction, Strengths/Weaknesses, Salary, Relocation & Bond
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Polished scripts crafted specifically for Umesh Temburwar to close interviews with confidence.
          </p>
        </div>

        <div className="space-y-3">
          {hrData.map((item) => (
            <QAAccordion
              key={item.id}
              item={item}
              isCompleted={isCompleted(item.id)}
              isBookmarked={isBookmarked(item.id)}
              onToggleComplete={onToggleComplete}
              onToggleBookmark={onToggleBookmark}
              note={getNote(item.id)}
              onSaveNote={onSaveNote}
            />
          ))}
        </div>
      </div>
    );
  }

  // 6. MNC COMPANY NOTES
  if (roundType === 'mnc-companies') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Building2 className="w-5 h-5" />
            <span>Company Notes • Tier 1 MNC Hiring Patterns</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hiring Patterns, Test Formats & Interview Focus for 11 Major MNCs
          </h2>
          <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Written as general guidance based on recent recruitment drives. Please verify the latest process and syllabus on the official careers page before your scheduled test.
            </span>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mncNotes.map((comp) => (
            <div
              key={comp.company}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {comp.company}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {comp.category}
                  </span>
                </div>
              </div>

              {/* Rounds List */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Typical Selection Rounds:
                </div>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {comp.rounds.map((r, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="font-mono text-indigo-600 font-bold">{rIdx + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test Pattern */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">Test Platform & Pattern: </span>
                <span className="text-slate-600 dark:text-slate-300">{comp.testPattern}</span>
              </div>

              {/* Interview Focus Areas */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Primary Interview Focus:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {comp.keyFocusAreas.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      • {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* General Guidance */}
              <div className="text-xs text-indigo-900 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded border border-indigo-100 dark:border-indigo-900">
                <span className="font-bold">Guidance: </span>
                {comp.generalGuidance}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
