export type RouteSuggestion = {
  id: string;
  name: string;
  theme: string;
  summary: string;
  totalDrive: string;
  seasonFit: string;
  days: Array<{
    day: number;
    title: string;
    drive: string;
    stops: string[];
    rest: string;
  }>;
};

export const demoRoutes: RouteSuggestion[] = [
  {
    id: "coast",
    name: "California Coast Escape",
    theme: "风景优先",
    summary: "海岸线、公路观景与轻量徒步，适合秋冬短途自驾。",
    totalDrive: "约 8 小时",
    seasonFit: "10–11 月推荐",
    days: [
      {
        day: 1,
        title: "San Jose → Monterey",
        drive: "约 1.5 小时",
        stops: ["Monterey Bay", "17-Mile Drive"],
        rest: "Monterey 住宿"
      },
      {
        day: 2,
        title: "Monterey → Big Sur → San Luis Obispo",
        drive: "约 3.5 小时",
        stops: ["Bixby Creek Bridge", "Big Sur overlooks"],
        rest: "San Luis Obispo 住宿"
      },
      {
        day: 3,
        title: "San Luis Obispo → San Jose",
        drive: "约 3 小时",
        stops: ["Morro Bay 可选停留"],
        rest: "中途每 90–120 分钟休息一次"
      }
    ]
  },
  {
    id: "redwoods",
    name: "Redwoods & North Coast",
    theme: "自然优先",
    summary: "森林、公路与海岸混合，减少热门打卡点，强调沿途体验。",
    totalDrive: "约 9 小时",
    seasonFit: "秋季推荐",
    days: [
      {
        day: 1,
        title: "San Jose → Point Reyes",
        drive: "约 2.5 小时",
        stops: ["Point Reyes", "海岸观景"],
        rest: "附近小镇住宿"
      },
      {
        day: 2,
        title: "Point Reyes → Mendocino",
        drive: "约 3 小时",
        stops: ["Sonoma Coast", "Mendocino Headlands"],
        rest: "Mendocino 住宿"
      },
      {
        day: 3,
        title: "Mendocino → San Jose",
        drive: "约 3.5 小时",
        stops: ["红杉林短停"],
        rest: "返程设置 1 次长休息"
      }
    ]
  },
  {
    id: "foothills",
    name: "Gold Country Slow Drive",
    theme: "轻松省钱",
    summary: "缩短单日驾驶、住宿选择更多，适合低预算的周末自驾。",
    totalDrive: "约 7 小时",
    seasonFit: "秋季推荐",
    days: [
      {
        day: 1,
        title: "San Jose → Sacramento",
        drive: "约 2 小时",
        stops: ["Old Sacramento"],
        rest: "Sacramento 住宿"
      },
      {
        day: 2,
        title: "Sacramento → Placerville → Auburn",
        drive: "约 2 小时",
        stops: ["Placerville", "Auburn State Recreation Area"],
        rest: "Auburn 住宿"
      },
      {
        day: 3,
        title: "Auburn → San Jose",
        drive: "约 3 小时",
        stops: ["沿途咖啡/加油休息"],
        rest: "返程中途休息"
      }
    ]
  }
];
