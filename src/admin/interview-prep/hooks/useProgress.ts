import { useState, useEffect, useCallback } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'interview_prep_progress_v1';

const defaultProgress: UserProgress = {
  completedIds: [],
  bookmarkedIds: [],
  notes: {},
  checkedDays: [],
  checkedChecklist: [],
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
          bookmarkedIds: Array.isArray(parsed.bookmarkedIds) ? parsed.bookmarkedIds : [],
          notes: parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
          checkedDays: Array.isArray(parsed.checkedDays) ? parsed.checkedDays : [],
          checkedChecklist: Array.isArray(parsed.checkedChecklist) ? parsed.checkedChecklist : [],
        };
      }
    } catch (err) {
      console.warn('Failed to read interview prep progress from localStorage:', err);
    }
    return defaultProgress;
  });

  // Save to localStorage safely on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.warn('Failed to persist interview prep progress to localStorage:', err);
    }
  }, [progress]);

  const toggleComplete = useCallback((id: string) => {
    setProgress((prev) => {
      const isAlready = prev.completedIds.includes(id);
      return {
        ...prev,
        completedIds: isAlready
          ? prev.completedIds.filter((item) => item !== id)
          : [...prev.completedIds, id],
      };
    });
  }, []);

  const isCompleted = useCallback(
    (id: string) => progress.completedIds.includes(id),
    [progress.completedIds]
  );

  const toggleBookmark = useCallback((id: string) => {
    setProgress((prev) => {
      const isAlready = prev.bookmarkedIds.includes(id);
      return {
        ...prev,
        bookmarkedIds: isAlready
          ? prev.bookmarkedIds.filter((item) => item !== id)
          : [...prev.bookmarkedIds, id],
      };
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => progress.bookmarkedIds.includes(id),
    [progress.bookmarkedIds]
  );

  const setNote = useCallback((id: string, noteText: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [id]: noteText,
      },
    }));
  }, []);

  const getNote = useCallback(
    (id: string) => progress.notes[id] || '',
    [progress.notes]
  );

  const toggleDay = useCallback((day: number) => {
    setProgress((prev) => {
      const hasDay = prev.checkedDays.includes(day);
      return {
        ...prev,
        checkedDays: hasDay
          ? prev.checkedDays.filter((d) => d !== day)
          : [...prev.checkedDays, day],
      };
    });
  }, []);

  const isDayCompleted = useCallback(
    (day: number) => progress.checkedDays.includes(day),
    [progress.checkedDays]
  );

  const toggleChecklist = useCallback((taskKey: string) => {
    setProgress((prev) => {
      const hasTask = prev.checkedChecklist.includes(taskKey);
      return {
        ...prev,
        checkedChecklist: hasTask
          ? prev.checkedChecklist.filter((t) => t !== taskKey)
          : [...prev.checkedChecklist, taskKey],
      };
    });
  }, []);

  const isChecklistCompleted = useCallback(
    (taskKey: string) => progress.checkedChecklist.includes(taskKey),
    [progress.checkedChecklist]
  );

  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all preparation progress and notes?')) {
      setProgress(defaultProgress);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  return {
    progress,
    toggleComplete,
    isCompleted,
    toggleBookmark,
    isBookmarked,
    setNote,
    getNote,
    toggleDay,
    isDayCompleted,
    toggleChecklist,
    isChecklistCompleted,
    resetProgress,
    completedCount: progress.completedIds.length,
    bookmarkedCount: progress.bookmarkedIds.length,
  };
}

