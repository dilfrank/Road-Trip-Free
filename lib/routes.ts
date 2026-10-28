export type BudgetPreference = "省钱" | "普通" | "舒适";

export type MoodPreference =
  | "想放空"
  | "想被自然治愈"
  | "想看海"
  | "想安静一点"
  | "想轻松吃喝"
  | "想走走但别太累"
  | "想看壮阔自然"
  | "想和重要的人待在一起";

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
  thought: string;
  moods: MoodPreference[];
  selectedAttractions: string[];
};

export type AttractionSuggestion = {
  name: string;
  routeId: string;
  routeName: string;
  theme: string;
  reason: string;
  emotionalValue: string;
};

export type ScoreBreakdown = {
  intent: number;
  attraction: number;
  season: number;
  driving: number;
  duration: number;
  budget: number;
};

export type RouteSuggestion = RouteCandidate & {
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  seasonFit: string;
  totalDrive: string;
  days: RouteDay[];
  emotionalValue: string;
  matchedMoods: MoodPreference[];
  matchedAttractions: string[];
};
