import React from 'react';
import {
  FileCheck2,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  cgpaDefenseData,
  selfIntroData,
  resumeLineChecklist,
} from '../data/resumePrepData';
import {
  systemDesignTopics,
  starStoriesBank,
  communicationFrameworks,
  thirtyDaysPlan,
  finalDayChecklist,
} from '../data/extrasData';

interface ExtrasDetailProps {
  viewType:
    | 'resume-defense'
    | 'system-design'
    | 'star-stories'
    | 'study-plan'
    | 'final-checklist';
  checkedDays: number[];
  onToggleDay: (day: number) => void;
  checkedTasks: string[];
  onToggleTask: (taskKey: string) => void;
}

export const ExtrasDetail: React.FC<ExtrasDetailProps> = ({
  viewType,
  checkedDays,
  onToggleDay,
  checkedTasks,
  onToggleTask,
}) => {
  // 1. RESUME & CGPA 6.06 DEFENSE
  if (viewType === 'resume-defense') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <FileCheck2 className="w-5 h-5" />
            <span>Section D • Resume-Specific Preparation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            CGPA 6.06 Defense, Elevator Pitches & Line-by-Line Checklist
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            How to defend academic scores with total confidence, take command of the interview, and master your resume.
          </p>
        </div>

        {/* CGPA 6.06 Defense Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Prepared Answer: "Your CGPA is 6.06. Can you explain why it is relatively low?"
            </h3>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              CGPA: {cgpaDefenseData.cgpa}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border-l-4 border-indigo-600 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              Core Strategy & Verbal Script
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
              {cgpaDefenseData.shortDefenseScript}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white">Full In-Depth Explanation:</span>
            <p className="whitespace-pre-line">{cgpaDefenseData.detailedDefenseScript}</p>
          </div>

          <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">Cut-off & Evaluation Tips:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              {cgpaDefenseData.cutoffHandlingTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Elevator Pitches: 60s & 2m */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              "Tell Me About Yourself" (60-Second Version)
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed whitespace-pre-line p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700">
              {selfIntroData.intro60s}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              "Tell Me About Yourself" (2-Minute Full Version)
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed whitespace-pre-line p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700">
              {selfIntroData.intro2min}
            </p>
          </div>
        </div>

        {/* Resume Line-By-Line Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Resume Line-By-Line "Be Ready to Explain" Checklist
              </h3>
              <p className="text-xs text-slate-500">Every single bullet point on your resume paired with probable questions.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{resumeLineChecklist.length} items</span>
          </div>

          <div className="space-y-3">
            {resumeLineChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    [{item.section}]
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 italic">
                  Resume Bullet: "{item.bulletOrItem}"
                </div>

                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  Q: {item.interviewerQuestion}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Recommended Defense: </span>
                  {item.recommendedAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. SYSTEM DESIGN FOR FRESHERS
  if (viewType === 'system-design') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Layers className="w-5 h-5" />
            <span>Section E • System Design Basics for Freshers</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            High-Level Architecture Frameworks (URL Shortener, Chat, Flash Sale)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simple 5-step framework: Requirements → Scale Estimation → High Level Design → Data Model → Bottlenecks.
          </p>
        </div>

        <div className="space-y-6">
          {systemDesignTopics.map((sd) => (
            <div
              key={sd.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{sd.title}</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  {sd.tagline}
                </p>
              </div>

              {/* Requirements & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Functional Requirements
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                    {sd.functionalReqs.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Capacity & Traffic Estimation
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {sd.capacityEstimation}
                  </p>
                </div>
              </div>

              {/* Components */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Architectural Components
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {sd.architectureComponents.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{c.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Algorithm & Flow */}
              <div className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
                <span className="font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 text-[11px]">
                  Core Algorithm / End-to-End Flow
                </span>
                <p className="leading-relaxed">{sd.coreAlgorithmOrFlow}</p>
              </div>

              {/* Bottlenecks and Solutions */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[11px]">
                  Key Scaling Bottlenecks & Solutions
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  {sd.bottlenecksAndSolutions.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. BEHAVIORAL STAR STORIES BANK
  if (viewType === 'star-stories') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Sparkles className="w-5 h-5" />
            <span>Section E • Behavioral STAR Story Bank</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            6 Field-Tested STAR Stories for Situational & Managerial Rounds
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Situation → Task → Action → Result → Key Engineering Takeaway.
          </p>
        </div>

        {/* Communication Framework Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            {communicationFrameworks.prepFramework.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {communicationFrameworks.prepFramework.steps.map((st) => (
              <div
                key={st.step}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="font-bold text-indigo-600 mb-1">{st.step}</div>
                <div className="text-slate-600 dark:text-slate-300">{st.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800/60 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-amber-900 dark:text-amber-400">
              {communicationFrameworks.howToSayIDontKnow.title}:
            </span>
            <p className="italic mt-1">{communicationFrameworks.howToSayIDontKnow.scriptTemplate}</p>
          </div>
        </div>

        {/* Stories List */}
        <div className="space-y-4">
          {starStoriesBank.map((story, idx) => (
            <div
              key={story.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300">
                  {story.competency}
                </span>
                <span className="text-xs font-mono text-slate-400">Story #{idx + 1}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{story.title}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Situation:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {story.situation}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Task:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {story.task}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 text-xs sm:text-sm">
                <span className="font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 text-[11px]">
                  Action Taken:
                </span>
                <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                  {story.action}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm">
                <span className="font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 text-[11px]">
                  Result & Impact:
                </span>
                <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                  {story.result}
                </p>
              </div>

              <div className="text-xs text-slate-500 italic">
                <strong>Key Takeaway: </strong> {story.takeaway}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. 30-DAY PREPARATION PLAN
  if (viewType === 'study-plan') {
    const totalDays = thirtyDaysPlan.length;
    const completedDaysCount = checkedDays.length;
    const planPercentage = Math.round((completedDaysCount / totalDays) * 100);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <Clock className="w-5 h-5" />
            <span>Section E • 30-Day Preparation Plan</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Daily Tickable Roadmap to Day-30 Interview Readiness
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tick each day as you finish your study tasks. Your progress is saved automatically.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-indigo-600">{planPercentage}%</span>
              <div className="text-xs text-slate-500">
                ({completedDaysCount} / {totalDays} Days)
              </div>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${planPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {thirtyDaysPlan.map((p) => {
            const isDayDone = checkedDays.includes(p.day);

            return (
              <div
                key={p.day}
                onClick={() => onToggleDay(p.day)}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  isDayDone
                    ? 'bg-slate-50/70 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isDayDone
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700'
                      }`}
                    >
                      Day {p.day}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {p.theme}
                    </span>
                  </div>

                  <div className="text-slate-400">
                    {isDayDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <h3
                  className={`text-base font-bold mb-2 ${
                    isDayDone
                      ? 'line-through text-slate-500 dark:text-slate-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {p.title}
                </h3>

                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {p.tasks.map((task, tIdx) => (
                    <li key={tIdx}>{task}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 5. FINAL-DAY CHECKLIST
  if (viewType === 'final-checklist') {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span>Section E • Final-Day Checklist</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Pre-Interview Night & Morning Verification Checklist
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Ensure every logistical, technical, and document requirement is verified before you step into the interview.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
          {finalDayChecklist.map((item) => {
            const isChecked = checkedTasks.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onToggleTask(item.id)}
                className="py-3.5 px-2 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-lg transition-colors select-none"
              >
                <div className="mt-0.5 text-slate-400 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`text-sm leading-relaxed ${
                    isChecked
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200 font-medium'
                  }`}
                >
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
