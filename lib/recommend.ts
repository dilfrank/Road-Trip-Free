import { routeCandidates } from "../data/routeCandidatesV1";
import {
  AttractionSuggestion,
  BudgetPreference,
  MoodPreference,
  RouteCandidate,
  RouteDay,
  RouteSuggestion,
  TripPreferences
} from "./routes";

export const moodOptions: MoodPreference[] = [
  "想放空",
  "想被自然治愈",
  "想看海",
  "想安静一点",
  "想轻松吃喝",
  "想走走但别太累",
  "想看壮阔自然",
  "想和重要的人待在一起"
];

type RouteIntentMeta = {
  moods: MoodPreference[];
  emotionalValue: string;
};

const routeIntentMeta: Record<string, RouteIntentMeta> = {
  "big-sur": {
    moods: ["想放空", "想看海", "想走走但别太累", "想看壮阔自然"],
    emotionalValue: "让海岸线把节奏慢下来，把注意力从待办事项移回到风、海和路上。"
  },
  mendocino: {
    moods: ["想放空", "想被自然治愈", "想看海", "想安静一点", "想看壮阔自然"],
    emotionalValue: "用海雾、红杉和小镇把人从拥挤和噪音里拉出来，适合真正想安静几天。"
  },
  "gold-country": {
    moods: ["想安静一点", "想轻松吃喝", "想和重要的人待在一起"],
    emotionalValue: "不靠景点密度制造充实感，靠轻松驾驶、小镇和同行的人把一天过完整。"
  },
  "santa-cruz": {
    moods: ["想放空", "想看海", "想轻松吃喝", "想和重要的人待在一起"],
    emotionalValue: "不用开很远，也能迅速进入周末状态，适合只想离开日常一小会儿。"
  },
  "napa-sonoma": {
    moods: ["想放空", "想轻松吃喝", "想和重要的人待在一起"],
    emotionalValue: "把赶路感降到最低，把更多时间留给吃饭、聊天和慢慢走。"
  },
  yosemite: {
    moods: ["想被自然治愈", "想走走但别太累", "想看壮阔自然"],
    emotionalValue: "用巨大的山谷尺度把注意力从琐碎里抽离出来，适合想重新获得力量的人。"
  },
  tahoe: {
    moods: ["想被自然治愈", "想看壮阔自然", "想和重要的人待在一起"],
    emotionalValue: "湖、山和长视野会让行程天然慢下来，适合想换一个空间呼吸的人。"
  },
  sequoia: {
    moods: ["想被自然治愈", "想安静一点", "想走走但别太累", "想看壮阔自然"],
    emotionalValue: "巨木和山林比热门打卡更有包裹感，适合想安静、恢复和重新集中注意力。"
  },
  "morro-bay": {
    moods: ["想放空", "想看海", "想安静一点", "想轻松吃喝"],
    emotionalValue: "海边小镇不会逼你完成什么，适合把日程做松，把情绪放平。"
  },
  "santa-barbara": {
    moods: ["想看海", "想轻松吃喝", "想和重要的人待在一起"],
    emotionalValue: "海岸和城市感同时存在，既能散心也不必牺牲吃饭、住宿和舒适度。"
  },
  pinnacles: {
    moods: ["想走走但别太累", "想看壮阔自然", "想和重要的人待在一起"],
    emotionalValue: "用一点运动感换来明显的“离开日常”，但仍保持短途和可控。"
  },
  healdsburg: {
    moods: ["想被自然治愈", "想安静一点", "想轻松吃喝", "想和重要的人待在一起"],
    emotionalValue: "森林、小镇和乡野节奏组合在一起，适合不想做攻略、只想舒服相处。"
  }
};

const budgetRank: Record<BudgetPreference, number> = { 省钱: 1, 普通: 2, 舒适: 3 };

const moodKeywords: Record<MoodPreference, string[]> = {
  "想放空": ["放空", "散心", "累", "休息", "逃离", "松弛", "慢一点", "不赶"],
  "想被自然治愈": ["治愈", "自然", "森林", "树", "恢复", "呼吸", "绿色"],
  "想看海": ["海", "海边", "海岸", "海风", "日落", "沙滩"],
  "想安静一点": ["安静", "人少", "不挤", "清静", "避开人群", "独处"],
  "想轻松吃喝": ["吃", "美食", "咖啡", "小镇", "餐厅", "舒服", "喝"],
  "想走走但别太累": ["走走", "徒步", "步道", "运动", "散步", "别太累", "轻徒步"],
  "想看壮阔自然": ["壮阔", "山", "国家公园", "震撼", "大自然", "雪山", "峡谷"],
  "想和重要的人待在一起": ["朋友", "家人", "对象", "伴侣", "一起", "陪伴", "约会"]
};

export function inferMoods(thought: string, explicit: MoodPreference[]) {
  const found = new Set<MoodPreference>(explicit);
  const normalized = thought.trim().toLowerCase();
  for (const mood of moodOptions) {
    if (moodKeywords[mood].some((word) => normalized.includes(word.toLowerCase()))) found.add(mood);
  }
  return Array.from(found);
}

export function emotionSummary(moods: MoodPreference[]) {
  if (moods.includes("想放空") && moods.includes("想看海")) return "这次不追满行程。先给你海风、空白时间和不过度驾驶的地方。";
  if (moods.includes("想安静一点") && moods.includes("想被自然治愈")) return "这次优先安静、自然和恢复感，不把热门程度当成推荐理由。";
  if (moods.includes("想和重要的人待在一起")) return "这次把“相处时间”放在景点数量前面，尽量少赶路、多留白。";
  if (moods.includes("想走走但别太累")) return "会保留一点活动感，但不安排连续高强度徒步，也不让驾驶把体力耗光。";
  if (moods.includes("想轻松吃喝")) return "这次优先舒服、好停、能慢慢吃饭和逛小镇的路线。";
  if (moods.includes("想看壮阔自然")) return "这次想要的是“值得开过去”的自然尺度，路线会为景色让路。";
  return "先不急着决定目的地。我们从你想获得的感觉出发，再把它翻译成景点。";
}

function routeMoods(route: RouteCandidate) {
  return routeIntentMeta[route.id]?.moods ?? [];
}

function emotionalValue(route: RouteCandidate) {
  return routeIntentMeta[route.id]?.emotionalValue ?? "让路线服务于你的状态，而不是让你去完成景点清单。";
}

function intentScore(route: RouteCandidate, moods: MoodPreference[]) {
  if (!moods.length) return 18;
  const matches = routeMoods(route).filter((mood) => moods.includes(mood)).length;
  return Math.min(30, Math.round(30 * matches / Math.max(2, moods.length)));
}

function seasonScore(route: RouteCandidate, month: number) {
  if (route.riskMonths?.includes(month)) return 5;
  if (route.bestMonths.includes(month)) return 20;
  if (route.goodMonths.includes(month)) return 15;
  return 9;
}

function drivingScore(route: RouteCandidate, maxDrive: number) {
  if (route.maxDayDrive <= maxDrive) return 10;
  return Math.max(2, Math.round(10 - (route.maxDayDrive - maxDrive) * 4));
}

function durationScore(route: RouteCandidate, days: number) {
  if (days >= route.minDays && days <= route.maxDays) return 10;
  const gap = days < route.minDays ? route.minDays - days : days - route.maxDays;
  return Math.max(2, 10 - gap * 4);
}

function budgetScore(route: RouteCandidate, budget: BudgetPreference) {
  const gap = Math.abs(budgetRank[route.budget] - budgetRank[budget]);
  return gap === 0 ? 5 : gap === 1 ? 3 : 1;
}

function attractionScore(route: RouteCandidate, selected: string[]) {
  if (!selected.length) return 12;
  const routeStops = new Set([
    ...route.highlights,
    ...route.itinerary.flatMap((day) => day.stops)
  ]);
  const matched = selected.filter((name) => routeStops.has(name)).length;
  if (!matched) return 2;
  return Math.min(25, Math.round(25 * matched / Math.min(3, selected.length)));
}

function baseRouteScore(route: RouteCandidate, prefs: Omit<TripPreferences, "selectedAttractions">) {
  const moods = inferMoods(prefs.thought, prefs.moods);
  return (
    intentScore(route, moods) +
    seasonScore(route, prefs.month) +
    drivingScore(route, prefs.maxDrive) +
    durationScore(route, prefs.days) +
    budgetScore(route, prefs.budget)
  );
}

export function suggestAttractions(prefs: Omit<TripPreferences, "selectedAttractions">): AttractionSuggestion[] {
  const moods = inferMoods(prefs.thought, prefs.moods);
  const rankedRoutes = routeCandidates
    .map((route) => ({ route, score: baseRouteScore(route, prefs) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const suggestions: AttractionSuggestion[] = [];
  const seen = new Set<string>();

  for (let pass = 0; pass < 3; pass += 1) {
    for (const { route } of rankedRoutes) {
      const name = route.highlights[pass];
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const matched = routeMoods(route).filter((mood) => moods.includes(mood));
      suggestions.push({
        name,
        routeId: route.id,
        routeName: route.name,
        theme: route.theme,
        emotionalValue: emotionalValue(route),
        reason: matched.length
          ? `和“${matched.slice(0, 2).join("、")}”很匹配`
          : `${route.theme}方向里较适合你当前条件的停留点`
      });
      if (suggestions.length >= 8) return suggestions;
    }
  }

  return suggestions;
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
        {
          ...last,
          day: 2,
          title: `${first.title.split("→").pop()?.trim() || route.name} → South Bay`,
          note: "两天版会主动减少停留，不把“完成所有景点”当目标。"
        }
      ];
    }
    return source.slice(0, targetDays).map((item, index) => ({ ...item, day: index + 1 }));
  }

  const result = source.map((item) => ({ ...item }));
  while (result.length < targetDays) {
    const returnDay = result.pop()!;
    result.push({
      day: result.length + 1,
      title: `${route.name.split("·")[0].trim()} 留白日`,
      driveHours: 1,
      drive: "约 1 小时本地驾驶",
      stops: route.highlights.slice(0, 2),
      rest: "原住宿地续住",
      note: "不新增远距离景点，把这一天留给睡够、散步、临时发现和天气变化。"
    });
    result.push({ ...returnDay, day: result.length + 1 });
  }
  return result;
}

function buildReasons(
  route: RouteCandidate,
  prefs: TripPreferences,
  moods: MoodPreference[],
  scores: { intent: number; attraction: number; season: number; driving: number; duration: number }
) {
  const output: string[] = [];
  const matchedMoods = routeMoods(route).filter((mood) => moods.includes(mood));
  const routeStops = new Set([...route.highlights, ...route.itinerary.flatMap((day) => day.stops)]);
  const matchedAttractions = prefs.selectedAttractions.filter((name) => routeStops.has(name));

  if (matchedMoods.length) output.push(`回应你“${matchedMoods.slice(0, 2).join("、")}”的旅行想法`);
  if (matchedAttractions.length) output.push(`包含你选中的 ${matchedAttractions.slice(0, 2).join("、")}`);
  if (scores.season === 20) output.push(`${prefs.month} 月正处于这条路线的优先季节`);
  else if (route.riskMonths?.includes(prefs.month)) output.push(`${prefs.month} 月有明显季节风险，已主动降分`);
  if (scores.driving === 10) output.push(`最长单日约 ${route.maxDayDrive}h，符合你 ≤ ${prefs.maxDrive}h 的驾驶上限`);
  if (scores.duration === 10) output.push(`${prefs.days} 天能留出正常休息，不必硬塞景点`);
  return output.slice(0, 4);
}

export function recommendRoutes(prefs: TripPreferences): RouteSuggestion[] {
  const moods = inferMoods(prefs.thought, prefs.moods);

  return routeCandidates
    .map((route) => {
      const intent = intentScore(route, moods);
      const attraction = attractionScore(route, prefs.selectedAttractions);
      const season = seasonScore(route, prefs.month);
      const driving = drivingScore(route, prefs.maxDrive);
      const duration = durationScore(route, prefs.days);
      const budget = budgetScore(route, prefs.budget);
      const score = Math.round(intent + attraction + season + driving + duration + budget);
      const routeStops = new Set([...route.highlights, ...route.itinerary.flatMap((day) => day.stops)]);
      const matchedAttractions = prefs.selectedAttractions.filter((name) => routeStops.has(name));
      const matchedMoods = routeMoods(route).filter((mood) => moods.includes(mood));

      return {
        ...route,
        score,
        breakdown: { intent, attraction, season, driving, duration, budget },
        reasons: buildReasons(route, prefs, moods, { intent, attraction, season, driving, duration }),
        seasonFit: route.riskMonths?.includes(prefs.month)
          ? "季节风险较高"
          : season === 20
            ? "当季优选"
            : season >= 15
              ? "当季适合"
              : "可行但非最佳",
        totalDrive: `总驾驶约 ${route.totalDriveHours}h`,
        days: adaptDays(route, prefs.days),
        emotionalValue: emotionalValue(route),
        matchedMoods,
        matchedAttractions
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
