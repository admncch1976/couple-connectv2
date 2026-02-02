
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
  emoji: string;
  color: string;
  buttonColor: string;
  description: string;
  recommended?: string;
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

export type View = 'home' | 'onboarding' | 'checkin' | 'summary';
export type HomeTab = 'checkins' | 'joy';
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
