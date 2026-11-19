import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Bookmark,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { QAItem, SkillCategoryGroup } from '../types';

interface ProgressDashboardProps {
  completedIds: string[];
  bookmarkedIds: string[];
  allQuestions: QAItem[];
  skillsData: SkillCategoryGroup[];
  onSelectQuestion: (id: string) => void;
  onResetProgress: () => void;
  onLaunchMock: () => void;
  onToggleComplete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  completedIds,
  bookmarkedIds,
  allQuestions,
  skillsData,
  onSelectQuestion,
  onResetProgress,
  onLaunchMock,
  onToggleComplete,
  onToggleBookmark,
}) => {
  const totalQuestions = allQuestions.length;
  const completedCount = completedIds.length;
  const bookmarkedCount = bookmarkedIds.length;
  const percentage = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  // Bookmarked questions items
  const bookmarkedItems = useMemo(() => {
    return allQuestions.filter((q) => bookmarkedIds.includes(q.id));
  }, [allQuestions, bookmarkedIds]);

  // "Today's Revision": pick up to 10 from bookmarks (or random if bookmarks < 10)
  const todaysRevisionList = useMemo(() => {
    if (bookmarkedItems.length >= 10) {
      return [...bookmarkedItems].sort(() => 0.5 - Math.random()).slice(0, 10);
    }
    const needed = 10 - bookmarkedItems.length;
    const remaining = allQuestions.filter((q) => !bookmarkedIds.includes(q.id));
    const randomFills = [...remaining].sort(() => 0.5 - Math.random()).slice(0, needed);
    return [...bookmarkedItems, ...randomFills];
  }, [bookmarkedItems, allQuestions, bookmarkedIds]);

  // Section-wise completion breakdown
  const sectionBreakdown = useMemo(() => {
    return skillsData.map((group) => {
      let groupTotal = 0;
      let groupDone = 0;
      group.skills.forEach((skill) => {
        skill.questions.forEach((q) => {
          groupTotal++;
          if (completedIds.includes(q.id)) groupDone++;
        });
      });
      const pct = groupTotal > 0 ? Math.round((groupDone / groupTotal) * 100) : 0;
      return {
        category: group.category,
        total: groupTotal,
        done: groupDone,
        percentage: pct,
      };
    });
  }, [skillsData, completedIds]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Completion */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
            <span className="text-xs text-slate-500">
              ({completedCount} / {totalQuestions})
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Completed Items */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Questions Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
              {completedCount}
            </span>
            <span className="text-xs text-slate-500">concepts cleared</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Target: 100% completion before campus drive
          </p>
        </div>

        {/* Starred / Revise Later */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Revise Later</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-500">{bookmarkedCount}</span>
            <span className="text-xs text-slate-500">starred topics</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Focus heavily on these in mock practice
          </p>
        </div>

        {/* Quick Launch Simulator */}
        <div className="bg-indigo-600 text-white rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1 opacity-90">
              <span className="text-xs font-semibold uppercase tracking-wider">Simulation</span>
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <h3 className="font-bold text-base">Mock Interview Mode</h3>
            <p className="text-xs text-indigo-100 mt-1">
              Random question + 2-min timer + hidden answer.
            </p>
          </div>
          <button
            type="button"
            onClick={onLaunchMock}
            className="mt-4 px-3 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-lg transition-colors text-center"
          >
            Start Rapid Fire Test →
          </button>
        </div>
      </div>

      {/* Today's Revision: Random 10 from Bookmarks / Important */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Today\'s Quick Revision (Target 10 Items)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hand-picked from your bookmarked and high-frequency interview topics.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {todaysRevisionList.length} items
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {todaysRevisionList.map((item, idx) => {
            const isDone = completedIds.includes(item.id);
            const isStarred = bookmarkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-slate-400 mt-0.5 w-5">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4
                      onClick={() => onSelectQuestion(item.id)}
                      className={`text-sm font-semibold cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.question}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.shortAnswer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleComplete(item.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600"
                    title={isDone ? 'Mark as not done' : 'Mark as done'}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isDone ? 'text-emerald-600 fill-emerald-50' : 'text-slate-300'
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(item.id)}
                    className="p-1 text-slate-400 hover:text-amber-500"
                    title={isStarred ? 'Remove star' : 'Bookmark'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isStarred ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section-Wise % Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          Section Mastery Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionBreakdown.map((sec) => (
            <div
              key={sec.category}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {sec.category}
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {sec.percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${sec.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                <span>{sec.done} completed</span>
                <span>{sec.total} questions</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Items List */}
      {bookmarkedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              All Bookmarked Questions ({bookmarkedItems.length})
            </h3>
            <span className="text-xs text-slate-500">Prioritize before interview day</span>
          </div>

          <div className="space-y-3">
            {bookmarkedItems.map((q) => (
              <div
                key={q.id}
                className="p-3.5 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {q.category || 'General'}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-600">
                      {q.level}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {q.question}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{q.shortAnswer}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(q.id)}
                    className="p-1.5 text-amber-500 hover:text-slate-400 text-xs"
                    title="Remove bookmark"
                  >
                    <Bookmark className="w-4 h-4 fill-amber-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Progress Danger Zone */}
      <div className="p-4 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400">
            Reset Progress & Clear Local Notes
          </h4>
          <p className="text-xs text-rose-600 dark:text-rose-500">
            Clears your marked-done checkboxes, bookmark stars, and personal notes stored in browser localStorage.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetProgress}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Progress</span>
        </button>
      </div>
    </div>
  );
};
