
export interface Step {
  letter: string;
  word: string;
  emoji: string;
  question: string;
  quickThoughts?: string[];
}

export interface CheckInModel {
  id: string;
  acronym: string;
  title: string;
  expanded: string;
  emoji: string;
  color: string;
  buttonColor: string;
  description: string;
  recommended?: string;
  practicalPrompt?: string;
  steps: Step[];
}

export interface JoyPlan {
  id: number;
  activity: string;
  timeInfo: string;
}

export interface PartnerNames {
  p1: string;
  p2: string;
}

export interface DualReflection {
  p1: string;
  p2: string;
}

export interface CustomQuizQuestion {
  question: string;
  answer: string;
}

export type View = 'home' | 'onboarding' | 'checkin' | 'summary' | 'ai-insight';
export type HomeTab = 'checkins' | 'fun' | 'joy';
export type Turn = 'p1' | 'p2';

export interface AIInsight {
  mood: string;
  encouragement: string;
  suggestedFocus: string;
}

export interface DateIdea {
  title: string;
  description: string;
  whyItWorks: string;
}

export interface FunQuestion {
  id: number;
  text: string;
  mode: 'light' | 'deep';
}

export interface BibleJoke {
  q: string;
  a: string;
}
