import { RouteCandidate } from "../lib/routes";

export const routeCandidates: RouteCandidate[] = [
  {
    id: "central-coast",
    name: "Monterey · Big Sur · SLO",
    theme: "海岸风景",
    summary: "把 Monterey、Big Sur 和 San Luis Obispo 串成一条连续海岸线，适合第一次体验 California 公路旅行。",
    totalDriveHours: 8,
    bestMonths: [4, 5, 6, 9, 10, 11],
    goodMonths: [1, 2, 3, 7, 8, 12],
    minDays: 2,
    maxDays: 4,
    costTier: 2,
    experienceScore: 10,
    slowDayLocation: "Big Sur / Monterey",
    slowDayStops: ["海岸慢游", "短徒步", "咖啡与观景休息"],
    legs: [
      { to: "Monterey", hours: 1.5, stops: ["Monterey Bay", "Pacific Grove"], rest: "Monterey 住宿" },
      { to: "Big Sur", hours: 1.2, stops: ["Bixby Creek Bridge", "Big Sur overlooks"], rest: "Big Sur / Monterey 周边住宿" },
      { to: "San Luis Obispo", hours: 2.3, stops: ["沿 Highway 1 观景", "Morro Bay 可选停留"], rest: "San Luis Obispo 住宿" },
      { to: "__origin__", hours: 3, stops: ["返程咖啡与加油休息"], rest: "每 90–120 分钟休息一次" }
    ]
  },
  {
    id: "north-coast",
    name: "Point Reyes · Sonoma Coast · Mendocino",
    theme: "海岸自然",
    summary: "比热门城市更安静的北海岸路线，重点是海岸、公路、森林和小镇节奏。",
    totalDriveHours: 9.2,
    bestMonths: [4, 5, 6, 9, 10],
    goodMonths: [1, 2, 3, 7, 8, 11, 12],
    minDays: 3,
    maxDays: 5,
    costTier: 2,
    experienceScore: 9,
    slowDayLocation: "Mendocino",
    slowDayStops: ["Mendocino Headlands", "海岸步道", "小镇慢游"],
    legs: [
      { to: "Point Reyes", hours: 2.2, stops: ["Point Reyes 海岸", "短步道"], rest: "Point Reyes / Petaluma 周边住宿" },
      { to: "Mendocino", hours: 3.1, stops: ["Sonoma Coast", "沿海观景点"], rest: "Mendocino 住宿" },
      { to: "__origin__", hours: 3.9, stops: ["红杉林短停", "返程休息"], rest: "返程设置一次长休息" }
    ]
  },
  {
    id: "gold-country",
    name: "Sacramento · Placerville · Auburn",
    theme: "轻松省钱",
    summary: "住宿选择多、单日驾驶较短，适合预算优先和不想连续长时间驾驶的周末路线。",
    totalDriveHours: 6.7,
    bestMonths: [3, 4, 5, 9, 10, 11],
    goodMonths: [1, 2, 6, 7, 8, 12],
    minDays: 2,
    maxDays: 4,
    costTier: 1,
    experienceScore: 8,
    slowDayLocation: "Auburn / Placerville",
    slowDayStops: ["老城慢游", "河谷步道", "咖啡休息"],
    legs: [
      { to: "Sacramento", hours: 2, stops: ["Old Sacramento", "河畔散步"], rest: "Sacramento 住宿" },
      { to: "Placerville", hours: 0.8, stops: ["Placerville Main Street"], rest: "Placerville 周边住宿" },
      { to: "Auburn", hours: 0.7, stops: ["Auburn Old Town", "Auburn State Recreation Area"], rest: "Auburn 住宿" },
      { to: "__origin__", hours: 3.2, stops: ["中途咖啡 / 加油"], rest: "返程中途休息" }
    ]
  },
  {
    id: "yosemite",
    name: "Yosemite Valley",
    theme: "山谷自然",
    summary: "以 Yosemite Valley 为核心，不追求一次跑完全部景点，优先控制驾驶和步行强度。",
    totalDriveHours: 8.2,
    bestMonths: [5, 6, 7, 8, 9, 10],
    goodMonths: [4, 11],
    cautionMonths: [1, 2, 3, 11, 12],
    cautionText: "冬季和晚秋需检查道路、天气和防滑链要求；Tioga Road 通常冬季关闭。",
    minDays: 3,
    maxDays: 4,
    costTier: 2,
    experienceScore: 10,
    slowDayLocation: "Yosemite Valley",
    slowDayStops: ["Yosemite Valley 慢游", "短步道", "日落观景"],
    legs: [
      { to: "Mariposa", hours: 2.6, stops: ["途中补给", "Mariposa 小镇"], rest: "Mariposa / El Portal 住宿" },
      { to: "Yosemite Valley", hours: 1.2, stops: ["Tunnel View", "Yosemite Valley"], rest: "Yosemite 周边住宿" },
      { to: "__origin__", hours: 4.4, stops: ["返程前短步道", "中途休息"], rest: "长途返程至少安排一次长休息" }
    ]
  },
  {
    id: "tahoe",
    name: "Lake Tahoe",
    theme: "高山湖泊",
    summary: "湖景和高山环境非常突出，但冬季道路条件对自驾经验要求更高。",
    totalDriveHours: 8.8,
    bestMonths: [6, 7, 8, 9],
    goodMonths: [1, 2, 3, 5, 10, 12],
    cautionMonths: [1, 2, 3, 11, 12],
    cautionText: "冬季 Sierra 路段可能出现防滑链管制或天气延误，出发前必须查实时路况。",
    minDays: 3,
    maxDays: 5,
    costTier: 2,
    experienceScore: 9,
    slowDayLocation: "Lake Tahoe",
    slowDayStops: ["湖边慢游", "观景点", "减少驾驶的休息日"],
    legs: [
      { to: "Sacramento", hours: 2, stops: ["午餐 / 补给"], rest: "短休后继续" },
      { to: "South Lake Tahoe", hours: 2.2, stops: ["湖边观景", "傍晚散步"], rest: "South Lake Tahoe 住宿" },
      { to: "__origin__", hours: 4.6, stops: ["返程中途休息"], rest: "长途返程至少安排一次长休息" }
    ]
  },
  {
    id: "napa-sonoma",
    name: "Napa · Sonoma Slow Drive",
    theme: "舒适慢游",
    summary: "驾驶轻松、餐饮和住宿选择多，适合把节奏放慢而不是追求景点数量。",
    totalDriveHours: 5.5,
    bestMonths: [3, 4, 5, 6, 9, 10],
    goodMonths: [1, 2, 7, 8, 11, 12],
    minDays: 2,
    maxDays: 4,
    costTier: 3,
    experienceScore: 8,
    slowDayLocation: "Sonoma",
    slowDayStops: ["小镇慢游", "餐饮休息", "乡间短途驾驶"],
    legs: [
      { to: "Napa", hours: 1.8, stops: ["Napa Downtown", "乡间公路"], rest: "Napa / Vallejo 周边住宿" },
      { to: "Sonoma", hours: 0.6, stops: ["Sonoma Plaza", "周边小镇"], rest: "Sonoma 周边住宿" },
      { to: "__origin__", hours: 3.1, stops: ["Marin 可选短停"], rest: "轻松返程" }
    ]
  },
  {
    id: "santa-cruz-coast",
    name: "Santa Cruz · Half Moon Bay",
    theme: "短途海岸",
    summary: "距离短、调整空间大，适合只有 2 天或每天不想开太久的自驾用户。",
    totalDriveHours: 4.1,
    bestMonths: [3, 4, 5, 6, 9, 10, 11],
    goodMonths: [1, 2, 7, 8, 12],
    minDays: 2,
    maxDays: 3,
    costTier: 1,
    experienceScore: 8,
    slowDayLocation: "Santa Cruz",
    slowDayStops: ["海边散步", "咖啡休息", "轻量短途"],
    legs: [
      { to: "Santa Cruz", hours: 0.7, stops: ["West Cliff Drive", "Natural Bridges"], rest: "Santa Cruz 住宿" },
      { to: "Half Moon Bay", hours: 1.1, stops: ["Highway 1 海岸", "Half Moon Bay"], rest: "Half Moon Bay 周边住宿" },
      { to: "__origin__", hours: 2.3, stops: ["沿途海岸短停"], rest: "轻松返程" }
    ]
  },
  {
    id: "pinnacles-monterey",
    name: "Pinnacles · Monterey",
    theme: "徒步 + 海岸",
    summary: "把国家公园短徒步和 Monterey 海岸组合起来，适合凉爽月份的 2–3 日路线。",
    totalDriveHours: 5.8,
    bestMonths: [1, 2, 3, 4, 10, 11, 12],
    goodMonths: [5, 9],
    minDays: 2,
    maxDays: 3,
    costTier: 1,
    experienceScore: 9,
    slowDayLocation: "Monterey",
    slowDayStops: ["Monterey Bay", "海岸步道", "恢复性休息"],
    legs: [
      { to: "Pinnacles National Park", hours: 1.5, stops: ["短徒步", "野餐休息"], rest: "Soledad / Monterey 周边住宿" },
      { to: "Monterey", hours: 1.3, stops: ["Pacific Grove", "Monterey Bay"], rest: "Monterey 住宿" },
      { to: "__origin__", hours: 3, stops: ["返程短停"], rest: "返程休息" }
    ]
  },
  {
    id: "morro-cambria",
    name: "Morro Bay · Cambria",
    theme: "海岸慢游",
    summary: "比 Big Sur 更强调小镇和放松节奏，适合 3–4 天、不想把行程塞满的人。",
    totalDriveHours: 8.4,
    bestMonths: [3, 4, 5, 9, 10, 11],
    goodMonths: [1, 2, 6, 7, 8, 12],
    minDays: 3,
    maxDays: 4,
    costTier: 2,
    experienceScore: 9,
    slowDayLocation: "Cambria",
    slowDayStops: ["Moonstone Beach", "小镇慢游", "海边休息"],
    legs: [
      { to: "Morro Bay", hours: 3.1, stops: ["Morro Rock", "海湾散步"], rest: "Morro Bay 住宿" },
      { to: "Cambria", hours: 0.6, stops: ["Moonstone Beach", "Cambria"], rest: "Cambria 住宿" },
      { to: "__origin__", hours: 4.7, stops: ["返程补给", "中途长休息"], rest: "返程安排一次长休息" }
    ]
  },
  {
    id: "santa-barbara",
    name: "San Luis Obispo · Santa Barbara",
    theme: "长线海岸",
    summary: "适合 4–5 天，把中央海岸继续向南延伸，但不建议给驾驶上限很低的用户。",
    totalDriveHours: 11.2,
    bestMonths: [2, 3, 4, 5, 9, 10, 11],
    goodMonths: [1, 6, 7, 8, 12],
    minDays: 4,
    maxDays: 5,
    costTier: 2,
    experienceScore: 9,
    slowDayLocation: "Santa Barbara",
    slowDayStops: ["海滨慢游", "市区步行", "减少驾驶"],
    legs: [
      { to: "San Luis Obispo", hours: 3.1, stops: ["午餐", "市中心散步"], rest: "San Luis Obispo 住宿" },
      { to: "Santa Barbara", hours: 1.8, stops: ["海滨", "市区慢游"], rest: "Santa Barbara 住宿" },
      { to: "Morro Bay", hours: 2.1, stops: ["沿海返程", "Morro Bay"], rest: "Morro Bay 住宿" },
      { to: "__origin__", hours: 4.2, stops: ["返程长休息"], rest: "返程安排一次长休息" }
    ]
  },
  {
    id: "sequoia-kings",
    name: "Sequoia · Kings Canyon",
    theme: "巨杉山地",
    summary: "适合愿意多开一点车的自然型用户；冬季和早春需要更谨慎地处理山路条件。",
    totalDriveHours: 10.8,
    bestMonths: [5, 6, 7, 8, 9, 10],
    goodMonths: [4, 11],
    cautionMonths: [1, 2, 3, 11, 12],
    cautionText: "冬季山区可能有积雪、道路限制或防滑链要求；MVP 不提供实时路况。",
    minDays: 3,
    maxDays: 5,
    costTier: 2,
    experienceScore: 9,
    slowDayLocation: "Sequoia National Park",
    slowDayStops: ["巨杉林慢游", "短步道", "减少山路驾驶"],
    legs: [
      { to: "Three Rivers", hours: 3.8, stops: ["途中补给", "Three Rivers"], rest: "Three Rivers 住宿" },
      { to: "Sequoia National Park", hours: 1.4, stops: ["General Sherman 区域", "巨杉林"], rest: "公园周边住宿" },
      { to: "__origin__", hours: 5.6, stops: ["返程补给", "中途长休息"], rest: "长途返程至少安排一次长休息" }
    ]
  },
  {
    id: "redwood-north",
    name: "Avenue of the Giants · Humboldt",
    theme: "红杉长线",
    summary: "真正把北加州红杉作为主角的路线，适合 4–5 天和可接受较长驾驶的用户。",
    totalDriveHours: 11.6,
    bestMonths: [5, 6, 7, 8, 9, 10],
    goodMonths: [3, 4, 11],
    minDays: 4,
    maxDays: 5,
    costTier: 2,
    experienceScore: 10,
    slowDayLocation: "Humboldt / Eureka",
    slowDayStops: ["红杉林慢游", "短步道", "减少连续驾驶"],
    legs: [
      { to: "Ukiah", hours: 2.8, stops: ["补给", "小镇休息"], rest: "Ukiah 周边住宿" },
      { to: "Avenue of the Giants", hours: 2.3, stops: ["红杉公路", "短步道"], rest: "Humboldt 周边住宿" },
      { to: "Eureka", hours: 1, stops: ["Old Town Eureka", "海岸短停"], rest: "Eureka 住宿" },
      { to: "__origin__", hours: 5.5, stops: ["返程至少两次休息"], rest: "长途返程分段休息" }
    ]
  }
];
