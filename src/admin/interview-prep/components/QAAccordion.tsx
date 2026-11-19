import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bookmark, CheckCircle2, Circle, Copy, Check, MessageSquare } from 'lucide-react';
import { QAItem } from '../types';

interface QAAccordionProps {
  item: QAItem;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggleComplete: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  note: string;
  onSaveNote: (id: string, note: string) => void;
  defaultExpanded?: boolean;
}

export const QAAccordion: React.FC<QAAccordionProps> = ({
  item,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  note,
  onSaveNote,
  defaultExpanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const [showNotesBox, setShowNotesBox] = useState(Boolean(note));
  const [currentNote, setCurrentNote] = useState(note);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.codeSnippet) {
      navigator.clipboard.writeText(item.codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote(e.target.value);
    onSaveNote(item.id, e.target.value);
  };

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'Basic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
      case 'Advanced':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div
      className={`border rounded-lg transition-all duration-150 mb-3 overflow-hidden ${
        isCompleted
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Header bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 cursor-pointer flex items-start gap-3 select-none"
      >
        {/* Done Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(item.id);
          }}
          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none flex-shrink-0"
          title={isCompleted ? 'Mark as not done' : 'Mark as done'}
          aria-label="Toggle Complete"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 fill-emerald-50 dark:fill-emerald-950/50" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Question Title & Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border ${getDifficultyBadge(
                item.level
              )}`}
            >
              {item.level}
            </span>
            {item.category && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {item.category}
              </span>
            )}
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3
            className={`text-base font-semibold leading-snug ${
              isCompleted
                ? 'text-slate-600 dark:text-slate-400 line-through decoration-slate-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {item.question}
          </h3>

          {/* Short Answer Preview (if collapsed) */}
          {!isOpen && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Quick: </span>
              {item.shortAnswer}
            </p>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item.id);
            }}
            className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isBookmarked
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark for later revision'}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Expand Arrow */}
          <div className="p-1.5 text-slate-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-4 text-slate-700 dark:text-slate-300 text-base">
          {/* Short Answer Box */}
          <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/20 border-l-4 border-indigo-600 rounded-r-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-1">
              Short Answer (2–3 Lines)
            </h4>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
              {item.shortAnswer}
            </p>
          </div>

          {/* Detailed In-Depth Answer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Detailed Technical Explanation
            </h4>
            <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-2">
              {item.detailedAnswer}
            </div>
          </div>

          {/* Code Snippet (if available) */}
          {item.codeSnippet && (
            <div className="mt-3">
              <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2 rounded-t-md text-xs font-mono">
                <span>{item.codeSnippet.language}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 text-xs sm:text-sm font-mono rounded-b-md overflow-x-auto leading-relaxed border border-t-0 border-slate-800">
                <code>{item.codeSnippet.code}</code>
              </pre>
            </div>
          )}

          {/* Follow-up Questions */}
          {item.followUps && item.followUps.length > 0 && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Common Interviewer Follow-Up Questions:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {item.followUps.map((fu, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{fu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Personal Notes Box Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowNotesBox(!showNotesBox)}
              className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{showNotesBox ? 'Hide personal notes' : currentNote ? 'View/edit personal notes' : '+ Add personal notes'}</span>
            </button>

            {showNotesBox && (
              <div className="mt-1">
                <textarea
                  rows={2}
                  value={currentNote}
                  onChange={handleNoteChange}
                  placeholder="Type your personal revision notes or mnemonics here (automatically saved in localStorage)..."
                  className="w-full text-xs sm:text-sm p-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

