import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Eye,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Circle,
  Copy,
  Check,
} from 'lucide-react';
import { QAItem } from '../types';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QAItem[];
  isCompleted: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  onToggleComplete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  questions,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes (120s)
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [copied, setCopied] = useState(false);

  // Pick random question when modal opens
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentIdx(randomIndex);
      setIsAnswerRevealed(false);
      setTimeLeft(120);
      setIsTimerRunning(true);
    }
  }, [isOpen, questions.length]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !isTimerRunning) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isTimerRunning, timeLeft]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIdx] || questions[0];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeUp = timeLeft === 0;

  const nextQuestion = () => {
    let nextIdx = Math.floor(Math.random() * questions.length);
    if (questions.length > 1 && nextIdx === currentIdx) {
      nextIdx = (nextIdx + 1) % questions.length;
    }
    setCurrentIdx(nextIdx);
    setIsAnswerRevealed(false);
    setTimeLeft(120);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(120);
    setIsTimerRunning(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Mock Interview Simulator
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (Question {currentIdx + 1} of {questions.length})
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Timer Card */}
          <div
            className={`p-4 rounded-lg flex items-center justify-between border ${
              isTimeUp
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-400'
                : 'bg-indigo-50/50 border-indigo-100 text-indigo-900 dark:bg-indigo-950/20 dark:border-indigo-900 dark:text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 flex-shrink-0" />
              <div>
                <div className="text-2xl font-mono font-bold leading-none">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className="text-xs opacity-80 mt-1">
                  {isTimeUp ? 'Time is up! How did your verbal answer sound?' : '2-Minute target speech time'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="p-2 rounded bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                title="Reset 2-minute timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Display */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {currentQ.level}
              </span>
              {currentQ.category && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded">
                  {currentQ.category}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Tip: Answer aloud out loud using the PREP or STAR framework before clicking "Reveal Answer".
            </p>
          </div>

          {/* Answer Section */}
          {!isAnswerRevealed ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-950/30">
              <button
                type="button"
                onClick={() => setIsAnswerRevealed(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                Reveal Model Answer
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
              {/* Short answer */}
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-md">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-1">
                  Model Quick Answer
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {currentQ.shortAnswer}
                </p>
              </div>

              {/* Detailed Answer */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Detailed Explanation
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentQ.detailedAnswer}
                </p>
              </div>

              {/* Code Snippet */}
              {currentQ.codeSnippet && (
                <div className="mt-3">
                  <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2 rounded-t-md text-xs font-mono">
                    <span>{currentQ.codeSnippet.language}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentQ.codeSnippet) {
                          navigator.clipboard.writeText(currentQ.codeSnippet.code);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono rounded-b-md overflow-x-auto leading-relaxed border border-slate-800">
                    <code>{currentQ.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleComplete(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isCompleted(currentQ.id)
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {isCompleted(currentQ.id) ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Marked as Done</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Mark as Done</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                isBookmarked(currentQ.id)
                  ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
              title={isBookmarked(currentQ.id) ? 'Bookmarked' : 'Bookmark for revision'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked(currentQ.id) ? 'fill-amber-500' : ''}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={nextQuestion}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-colors"
          >
            <span>Next Question</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

