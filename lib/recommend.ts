import { routeCandidates } from "../data/routeCandidates";
import {
  BudgetPreference,
  RouteCandidate,
  RouteDay,
  RouteSuggestion,
  TripPreferences
} from "./routes";

const budgetRank: Record<BudgetPreference, number> = {
  省钱: 1,
  普通: 2,
  舒适: 3
};

const supportedOriginTokens = [
  "san jose",
  "santa clara",
  "sunnyvale",
  "cupertino",
  "mountain view",
  "south bay",
  "圣何塞"
];

export function isSupportedOrigin(origin: string) {
  const normalized = origin.trim().toLowerCase();
  return supportedOriginTokens.some((token) => normalized.includes(token));
}

function displayDestination(destination: string, origin: string) {
  return destination === "__origin__" ? origin : destination;
}

function formatDrive(hours: number) {
  if (hours < 1) return "约 30–60 分钟本地驾驶";
  const rounded = Math.round(hours * 10) / 10;
  return `约 ${rounded} 小时`;
}

function buildDays(candidate: RouteCandidate, preferences: TripPreferences): RouteDay[] {
  const legs = candidate.legs;

  if (preferences.days <= legs.length) {
    const result: RouteDay[] = [];
    let legIndex = 0;

    for (let dayIndex = 0; dayIndex < preferences.days; dayIndex += 1) {
      const remainingLegs = legs.length - legIndex;
      const remainingDays = preferences.days - dayIndex;
      const take = Math.ceil(remainingLegs / remainingDays);
      const group = legs.slice(legIndex, legIndex + take);
      const previousDestination = legIndex === 0
        ? preferences.origin
        : displayDestination(legs[legIndex - 1].to, preferences.origin);
      const destinations = group.map((leg) => displayDestination(leg.to, preferences.origin));
      const driveHours = group.reduce((sum, leg) => sum + leg.hours, 0);

      result.push({
        day: dayIndex + 1,
        title: [previousDestination, ...destinations].join(" → "),
        drive: formatDrive(driveHours),
        driveHours,
        stops: group.flatMap((leg) => leg.stops),
        rest: group[group.length - 1].rest
      });

      legIndex += take;
    }

    return result;
  }

  const directDays: RouteDay[] = legs.map((leg, index) => {
    const from = index === 0
      ? preferences.origin
      : displayDestination(legs[index - 1].to, preferences.origin);
    const to = displayDestination(leg.to, preferences.origin);

    return {
      day: index + 1,
      title: `${from} → ${to}`,
      drive: formatDrive(leg.hours),
      driveHours: leg.hours,
      stops: leg.stops,
      rest: leg.rest
    };
  });

  const returnDay = directDays.pop();
  const extraDays = preferences.days - legs.length;

  for (let index = 0; index < extraDays; index += 1) {
    directDays.push({
      day: directDays.length + 1,
      title: `${candidate.slowDayLocation} 慢游 / 休息日`,
      drive: "≤ 1 小时本地驾驶",
      driveHours: 0.8,
      stops: candidate.slowDayStops,
      rest: `${candidate.slowDayLocation} 连住，减少搬运行李和长途驾驶`
    });
  }

  if (returnDay) directDays.push(returnDay);

  return directDays.map((day, index) => ({ ...day, day: index + 1 }));
}

function scoreSeason(candidate: RouteCandidate, month: number) {
  let points = 14;
  let label = `${month} 月季节匹配一般`;

  if (candidate.bestMonths.includes(month)) {
    points = 35;
    label = `${month} 月属于这条路线的强推荐季节`;
  } else if (candidate.goodMonths.includes(month)) {
    points = 26;
    label = `${month} 月适合这条路线，但不是最佳窗口`;
  }

  const cautioned = candidate.cautionMonths?.includes(month) ?? false;
  if (cautioned) {
    points = Math.max(4, points - 8);
    label = `${month} 月可去，但存在明显季节道路 / 天气风险`;
  }

  return { points, label, cautioned };
}

function scoreDays(candidate: RouteCandidate, days: number) {
  if (days >= candidate.minDays && days <= candidate.maxDays) {
    return { points: 20, label: `${days} 天正好落在建议的 ${candidate.minDays}–${candidate.maxDays} 天范围` };
  }

  const distance = days < candidate.minDays
    ? candidate.minDays - days
    : days - candidate.maxDays;

  return {
    points: distance === 1 ? 12 : 4,
    label: days < candidate.minDays
      ? `${days} 天偏紧，建议至少 ${candidate.minDays} 天`
      : `${days} 天偏宽松，可增加慢游 / 休息日`
  };
}

function scoreDrive(days: RouteDay[], maxDrive: number) {
  const longest = Math.max(...days.map((day) => day.driveHours));

  if (longest <= maxDrive) {
    return {
      points: 25,
      label: `拆分后单日最长约 ${longest.toFixed(1)}h，符合 ≤ ${maxDrive}h 的驾驶限制`
    };
  }

  const over = longest - maxDrive;
  const points = Math.max(0, Math.round(25 - over * 11));
  return {
    points,
    label: `单日最长约 ${longest.toFixed(1)}h，比你的 ${maxDrive}h 上限多约 ${over.toFixed(1)}h`
  };
}

function scoreBudget(candidate: RouteCandidate, budget: BudgetPreference) {
  const userRank = budgetRank[budget];
  const gap = Math.max(0, candidate.costTier - userRank);
  const points = gap === 0 ? 10 : gap === 1 ? 6 : 2;
  const costLabel = candidate.costTier === 1 ? "省钱" : candidate.costTier === 2 ? "普通" : "舒适";

  return {
    points,
    label: gap === 0
      ? `路线成本等级（${costLabel}）符合你的“${budget}”偏好`
      : `路线成本等级偏向“${costLabel}”，高于你的“${budget}”偏好`
  };
}

function seasonFit(candidate: RouteCandidate, month: number) {
  if (candidate.cautionMonths?.includes(month)) return `${month} 月需谨慎`;
  if (candidate.bestMonths.includes(month)) return `${month} 月强匹配`;
  if (candidate.goodMonths.includes(month)) return `${month} 月可行`;
  return `${month} 月一般`;
}

export function recommendRoutes(preferences: TripPreferences): RouteSuggestion[] {
  return routeCandidates
    .map((candidate) => {
      const days = buildDays(candidate, preferences);
      const season = scoreSeason(candidate, preferences.month);
      const drive = scoreDrive(days, preferences.maxDrive);
      const duration = scoreDays(candidate, preferences.days);
      const budget = scoreBudget(candidate, preferences.budget);
      const score = Math.max(
        0,
        Math.min(100, season.points + drive.points + duration.points + budget.points + candidate.experienceScore)
      );

      return {
        id: candidate.id,
        name: candidate.name,
        theme: candidate.theme,
        summary: candidate.summary,
        totalDrive: `总驾驶约 ${candidate.totalDriveHours} 小时`,
        seasonFit: seasonFit(candidate, preferences.month),
        score,
        reasons: [season.label, drive.label, duration.label, budget.label],
        warning: season.cautioned ? candidate.cautionText : undefined,
        days
      } satisfies RouteSuggestion;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
