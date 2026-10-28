export type BudgetPreference = "省钱" | "普通" | "舒适";

export type RouteDay = {
  day: number;
  title: string;
  driveHours: number;
  drive: string;
  stops: string[];
  rest: string;
  note: string;
};

export type MapPoint = {
  label: string;
  x: number;
  y: number;
};

export type RouteCandidate = {
  id: string;
  name: string;
  theme: string;
  summary: string;
  bestMonths: number[];
  goodMonths: number[];
  riskMonths?: number[];
  warning?: string;
  minDays: number;
  maxDays: number;
  maxDayDrive: number;
  totalDriveHours: number;
  budget: BudgetPreference;
  experience: number;
  highlights: string[];
  itinerary: RouteDay[];
  mapPoints: MapPoint[];
};

export type TripPreferences = {
  origin: string;
  month: number;
  days: number;
  maxDrive: number;
  budget: BudgetPreference;
};

export type ScoreBreakdown = {
  season: number;
  driving: number;
  duration: number;
  budget: number;
  experience: number;
};

export type RouteSuggestion = RouteCandidate & {
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  seasonFit: string;
  totalDrive: string;
  days: RouteDay[];
};
