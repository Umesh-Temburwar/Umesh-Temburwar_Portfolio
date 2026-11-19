export type DifficultyLevel = 'Basic' | 'Intermediate' | 'Advanced';

export interface QAItem {
  id: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  followUps?: string[];
  level: DifficultyLevel;
  tags: string[];
  category?: string;
}

export interface SkillCategoryGroup {
  category: 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Auth & Storage' | 'Tools & Technologies' | 'API Development';
  skills: SkillNotes[];
}

export interface SkillNotes {
  id: string;
  name: string;
  badge: string;
  overview: string;
  keyConcepts: string[];
  commonMistakes: string[];
  questions: QAItem[];
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Basic Coding & Pseudocode';
  question: string;
  options: string[];
  correctAnswer: string;
  solution: string;
  shortcutTip?: string;
}

export interface DSAProblem {
  id: string;
  title: string;
  topic: 'Arrays' | 'Strings' | 'Hashing' | 'Two Pointers' | 'Recursion' | 'Sorting & Searching' | 'Linked List' | 'Stack & Queue' | 'Binary Trees';
  difficulty: DifficultyLevel;
  problemStatement: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  jsCode: string;
  pythonCode: string;
  keyTakeaways: string[];
}

export interface CompanyNote {
  company: string;
  category: 'IT Services Tier 1' | 'Consulting / Tech';
  rounds: string[];
  testPattern: string;
  keyFocusAreas: string[];
  generalGuidance: string;
}

export interface ProjectDiscussion {
  id: string;
  title: string;
  tagline: string;
  role: string;
  period?: string;
  pitch30s: string;
  pitch2m: string;
  problem: string;
  targetUsers: string[];
  coreFeatures: string[];
  folderStructure: string;
  architectureSvg: string;
  architectureDescription: string;
  techStackWhy: { tech: string; reason: string }[];
  databaseSchema: { tableOrCollection: string; description: string; keyFields: string[] }[];
  authAndRbac: {
    roles: string[];
    flowDescription: string;
    securityRules: string;
  };
  apiDesign: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    endpoint: string;
    purpose: string;
    reqBody?: string;
    resBody: string;
  }[];
  hardestChallenges: {
    challenge: string;
    solution: string;
    outcome: string;
  }[];
  securityAndScale: string[];
  futureImprovements: string[];
  honestNumbersDefense: {
    claim: string;
    measurementTool: string;
    explanation: string;
    interviewScript: string;
  };
  crossQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface StarStory {
  id: string;
  title: string;
  competency: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  takeaway: string;
}

export interface DayPlan {
  day: number;
  title: string;
  theme: string;
  tasks: string[];
}

export interface UserProgress {
  completedIds: string[];
  bookmarkedIds: string[];
  notes: Record<string, string>;
  checkedDays: number[];
  checkedChecklist: string[];
}

