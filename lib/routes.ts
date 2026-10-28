export type BudgetPreference = "省钱" | "普通" | "舒适";

export type TripPreferences = {
  origin: string;
  month: number;
  days: number;
  maxDrive: number;
  budget: BudgetPreference;
};

export type RouteDay = {
  day: number;
  title: string;
  drive: string;
  driveHours: number;
  stops: string[];
  rest: string;
};

export type RouteSuggestion = {
  id: string;
  name: string;
  theme: string;
  summary: string;
  totalDrive: string;
  seasonFit: string;
  score: number;
  reasons: string[];
  warning?: string;
  days: RouteDay[];
};

export type RouteLeg = {
  to: string;
  hours: number;
  stops: string[];
  rest: string;
};

export type RouteCandidate = {
  id: string;
  name: string;
  theme: string;
  summary: string;
  totalDriveHours: number;
  bestMonths: number[];
  goodMonths: number[];
  cautionMonths?: number[];
  cautionText?: string;
  minDays: number;
  maxDays: number;
  costTier: 1 | 2 | 3;
  experienceScore: number;
  slowDayLocation: string;
  slowDayStops: string[];
  legs: RouteLeg[];
};
