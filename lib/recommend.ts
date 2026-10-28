import { routeCandidates } from "../data/routeCandidatesV1";
import { BudgetPreference, RouteCandidate, RouteDay, RouteSuggestion, TripPreferences } from "./routes";

const budgetRank: Record<BudgetPreference, number> = { "省钱": 1, "普通": 2, "舒适": 3 };

function seasonScore(route: RouteCandidate, month: number) {
  if (route.riskMonths?.includes(month)) return 8;
  if (route.bestMonths.includes(month)) return 35;
  if (route.goodMonths.includes(month)) return 27;
  return 16;
}

function drivingScore(route: RouteCandidate, maxDrive: number) {
  if (route.maxDayDrive <= maxDrive) return 25;
  return Math.max(4, Math.round(25 - (route.maxDayDrive - maxDrive) * 9));
}

function durationScore(route: RouteCandidate, days: number) {
  if (days >= route.minDays && days <= route.maxDays) return 20;
  const gap = days < route.minDays ? route.minDays - days : days - route.maxDays;
  return Math.max(5, 20 - gap * 8);
}

function budgetScore(route: RouteCandidate, budget: BudgetPreference) {
  const gap = Math.abs(budgetRank[route.budget] - budgetRank[budget]);
  return gap === 0 ? 10 : gap === 1 ? 7 : 3;
}

function adaptDays(route: RouteCandidate, targetDays: number): RouteDay[] {
  const source = route.itinerary;
  if (targetDays === source.length) return source;
  if (targetDays < source.length) {
    if (targetDays === 2) {
      const first = source[0];
      const last = source[source.length - 1];
      return [
        { ...first, day: 1 },
        { ...last, day: 2, title: `${first.title.split("→").pop()?.trim() || route.name} → South Bay`, note: "两天版会压缩体验，建议减少中途停留。" }
      ];
    }
    return source.slice(0, targetDays).map((item, index) => ({ ...item, day: index + 1 }));
  }

  const result = source.map((item) => ({ ...item }));
  while (result.length < targetDays) {
    const returnDay = result.pop()!;
    result.push({
      day: result.length + 1,
      title: `${route.name.split("·")[0].trim()} 机动慢游日`,
      driveHours: 1,
      drive: "约 1 小时本地驾驶",
      stops: route.highlights.slice(0, 2),
      rest: "原住宿地续住",
      note: "给天气、体力和临时发现留出缓冲。"
    });
    result.push({ ...returnDay, day: result.length + 1 });
  }
  return result;
}

function reasons(route: RouteCandidate, prefs: TripPreferences, scores: {season:number;driving:number;duration:number;budget:number}) {
  const output: string[] = [];
  if (scores.season >= 35) output.push(`${prefs.month} 月处于这条路线的优先季节`);
  else if (scores.season >= 27) output.push(`${prefs.month} 月整体适合，季节匹配良好`);
  else if (route.riskMonths?.includes(prefs.month)) output.push(`${prefs.month} 月存在明显季节风险，因此已降分`);
  else output.push(`${prefs.month} 月可行，但不是最佳窗口`);

  if (scores.driving === 25) output.push(`最长单日约 ${route.maxDayDrive}h，符合你 ≤ ${prefs.maxDrive}h 的驾驶上限`);
  else output.push(`最长单日约 ${route.maxDayDrive}h，超过你的驾驶偏好`);

  if (scores.duration === 20) output.push(`${prefs.days} 天落在建议天数范围内`);
  if (scores.budget === 10) output.push(`与“${prefs.budget}”预算偏好匹配`);
  return output.slice(0, 3);
}

export function recommendRoutes(prefs: TripPreferences): RouteSuggestion[] {
  return routeCandidates
    .map((route) => {
      const season = seasonScore(route, prefs.month);
      const driving = drivingScore(route, prefs.maxDrive);
      const duration = durationScore(route, prefs.days);
      const budget = budgetScore(route, prefs.budget);
      const experience = route.experience;
      const score = Math.round(season + driving + duration + budget + experience);
      return {
        ...route,
        score,
        breakdown: { season, driving, duration, budget, experience },
        reasons: reasons(route, prefs, { season, driving, duration, budget }),
        seasonFit: route.riskMonths?.includes(prefs.month) ? "季节风险较高" : season >= 35 ? "当季优选" : season >= 27 ? "当季适合" : "可行但非最佳",
        totalDrive: `总驾驶约 ${route.totalDriveHours}h`,
        days: adaptDays(route, prefs.days)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
