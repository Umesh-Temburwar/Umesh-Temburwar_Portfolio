import React, { useState } from 'react';
import {
  FolderGit2,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Terminal,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCode2,
} from 'lucide-react';
import { ProjectDiscussion } from '../types';

interface ProjectDeepDiveProps {
  projects: ProjectDiscussion[];
}

export const ProjectDeepDive: React.FC<ProjectDeepDiveProps> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'edtech-platform');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const toggleQuestion = (qIdx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx],
    }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Project Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {projects.map((proj) => {
          const isSelected = proj.id === selectedProjectId;
          return (
            <button
              key={proj.id}
              type="button"
              onClick={() => setSelectedProjectId(proj.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>{proj.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Project Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-8">
        {/* Header & Tagline */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400">
              {activeProject.role}
            </span>
            {activeProject.period && (
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                {activeProject.period}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {activeProject.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {activeProject.tagline}
          </p>
        </div>

        {/* 1. Elevator Pitches (30s & 2min) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              30-Second Elevator Pitch
            </h3>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
              "{activeProject.pitch30s}"
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              2-Minute Detailed Walkthrough
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line">
              {activeProject.pitch2m}
            </div>
          </div>
        </div>

        {/* 2. Honest Numbers Defense Box */}
        <div className="p-5 rounded-lg border-2 border-amber-300 dark:border-amber-700/80 bg-amber-50/60 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm mb-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Honest Numbers Defense: "{activeProject.honestNumbersDefense.claim}"</span>
          </div>
          <div className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Measurement Tool / Proof Source: </span>
              <span className="font-mono text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                {activeProject.honestNumbersDefense.measurementTool}
              </span>
            </div>
            <p>{activeProject.honestNumbersDefense.explanation}</p>
            <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded border border-amber-200 dark:border-amber-800 text-xs sm:text-sm">
              <span className="font-semibold text-amber-900 dark:text-amber-400">Verbatim Interview Script to Defend Metrics: </span>
              <p className="italic mt-1 text-slate-700 dark:text-slate-300">
                {activeProject.honestNumbersDefense.interviewScript}
              </p>
            </div>
          </div>
        </div>

        {/* 3. System Architecture Diagram & Description */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            System Architecture & Data Flow
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeProject.architectureDescription}
          </p>

          <div
            className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-950 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: activeProject.architectureSvg }}
          />
        </div>

        {/* 4. Tech Stack & WHY Each Choice */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Tech Stack Rationale (Why each technology was selected)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeProject.techStackWhy.map((t) => (
              <div
                key={t.tech}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
              >
                <div className="font-mono font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                  {t.tech}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Database Schema & Tables / Collections */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            Database Schema & Main Tables / Collections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeProject.databaseSchema.map((tbl) => (
              <div
                key={tbl.tableOrCollection}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {tbl.tableOrCollection}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{tbl.description}</p>
                <div className="flex flex-wrap gap-1">
                  {tbl.keyFields.map((f) => (
                    <span
                      key={f}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Auth Flow & Role-Based Access Control (RBAC) */}
        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Authentication & Role-Based Access Control (RBAC)
          </h3>
          <div className="flex flex-wrap gap-2 py-1">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Roles Supported:</span>
            {activeProject.authAndRbac.roles.map((r) => (
              <span
                key={r}
                className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
              >
                {r}
              </span>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {activeProject.authAndRbac.flowDescription}
          </p>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 mt-2">
            <span className="font-bold text-slate-900 dark:text-white font-sans">Security Enforcement: </span>
            {activeProject.authAndRbac.securityRules}
          </div>
        </div>

        {/* 7. Key REST API Design with Request / Response */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            Key API Endpoints & Request/Response Contracts
          </h3>
          <div className="space-y-3">
            {activeProject.apiDesign.map((api, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
              >
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      api.method === 'GET'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                        : api.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : api.method === 'PATCH' || api.method === 'PUT'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {api.method}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{api.endpoint}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{api.purpose}</p>

                {api.reqBody && (
                  <div className="text-xs font-mono bg-slate-900 text-slate-200 p-2.5 rounded">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-sans">
                      Request Body
                    </div>
                    <code>{api.reqBody}</code>
                  </div>
                )}

                <div className="text-xs font-mono bg-slate-900 text-emerald-300 p-2.5 rounded">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-sans">
                    Response Payload (200 OK / 201 Created)
                  </div>
                  <code>{api.resBody}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Hardest Challenges and Solutions */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Hardest Engineering Challenges & Solutions
          </h3>
          <div className="space-y-3">
            {activeProject.hardestChallenges.map((ch, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Problem #{idx + 1}: {ch.challenge}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-indigo-600">How I Solved It: </span>
                  {ch.solution}
                </p>
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded inline-block">
                  Outcome: {ch.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Security, Performance & Future Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Security & Performance Safeguards
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
              {activeProject.securityAndScale.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Future Improvements & Scaling Roadmap
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
              {activeProject.futureImprovements.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 10. Folder Structure */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-indigo-600" />
            Project Repository Folder Structure
          </h3>
          <pre className="p-4 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <code>{activeProject.folderStructure}</code>
          </pre>
        </div>

        {/* 11. Cross-Questions an Interviewer May Ask (Accordion) */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Interviewer Cross-Questions & Model Answers ({activeProject.crossQuestions.length})
            </h3>
            <span className="text-xs text-slate-500">Click to expand</span>
          </div>

          <div className="space-y-2">
            {activeProject.crossQuestions.map((cq, idx) => {
              const isExpanded = expandedQuestions[idx];
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900"
                >
                  <div
                    onClick={() => toggleQuestion(idx)}
                    className="p-3.5 cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      Q{idx + 1}: {cq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed bg-slate-50/30 dark:bg-slate-950/30">
                      <p className="font-medium text-indigo-900 dark:text-indigo-300 mb-1">
                        Recommended Answer:
                      </p>
                      <p>{cq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
