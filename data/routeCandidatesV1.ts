import { RouteCandidate } from "../lib/routes";

const day = (day: number, title: string, driveHours: number, stops: string[], rest: string, note: string) => ({
  day,
  title,
  driveHours,
  drive: `约 ${driveHours} 小时驾驶`,
  stops,
  rest,
  note
});

export const routeCandidates: RouteCandidate[] = [
  {
    id: "big-sur",
    name: "Monterey · Big Sur 海岸线",
    theme: "海岸风景",
    summary: "把最经典的加州海岸线拆成低压力的三日路线，日落、观景和轻量徒步都留出时间。",
    bestMonths: [3,4,5,9,10,11], goodMonths: [1,2,6,7,8,12], minDays: 2, maxDays: 4,
    maxDayDrive: 3.6, totalDriveHours: 8.2, budget: "普通", experience: 10,
    highlights: ["Monterey Bay", "17-Mile Drive", "Bixby Creek Bridge", "Big Sur", "Morro Bay"],
    itinerary: [
      day(1,"South Bay → Monterey",1.6,["Monterey Bay","17-Mile Drive"],"Monterey","下午抵达后不要赶夜路，留给海边散步。"),
      day(2,"Monterey → Big Sur → San Luis Obispo",3.4,["Bixby Creek Bridge","Big Sur overlooks"],"San Luis Obispo","海岸段弯道较多，建议天黑前结束长距离驾驶。"),
      day(3,"San Luis Obispo → Morro Bay → South Bay",3.2,["Morro Bay","沿途咖啡休息"],"返程","每 90–120 分钟休息一次。")
    ],
    mapPoints: [{label:"San Jose",x:72,y:18},{label:"Monterey",x:62,y:34},{label:"Big Sur",x:55,y:50},{label:"SLO",x:43,y:70},{label:"Morro Bay",x:38,y:79}]
  },
  {
    id: "mendocino",
    name: "Point Reyes · Mendocino 北海岸",
    theme: "森林海岸",
    summary: "红杉、海雾与小镇组合，比热门打卡线路更安静，适合愿意多开一点的人。",
    bestMonths: [4,5,6,9,10], goodMonths: [3,7,8,11], riskMonths: [1,2,12],
    warning: "冬季海岸雨天较多，山路和临海路段需留更多时间。", minDays: 3, maxDays: 5,
    maxDayDrive: 4.1, totalDriveHours: 10.2, budget: "普通", experience: 9,
    highlights: ["Point Reyes", "Sonoma Coast", "Mendocino Headlands", "红杉林"],
    itinerary: [
      day(1,"South Bay → Point Reyes",2.5,["Point Reyes","Tomales Bay"],"Point Reyes / Petaluma","日落前结束海岸支线。"),
      day(2,"Point Reyes → Sonoma Coast → Mendocino",3.2,["Sonoma Coast","Mendocino Headlands"],"Mendocino","沿海段限速低，不按高速公路速度估算。"),
      day(3,"Mendocino → 红杉短停 → South Bay",4.1,["红杉林短停","Ukiah 休息"],"返程","返程安排一次 30 分钟长休息。")
    ],
    mapPoints: [{label:"San Jose",x:66,y:82},{label:"Point Reyes",x:48,y:62},{label:"Sonoma",x:52,y:48},{label:"Mendocino",x:38,y:22}]
  },
  {
    id: "gold-country",
    name: "Sacramento · Gold Country 慢游",
    theme: "轻松省钱",
    summary: "住宿选择多、驾驶段短、机动性高，适合预算敏感或第一次尝试多日自驾。",
    bestMonths: [2,3,4,5,10,11], goodMonths: [1,6,9,12], minDays: 2, maxDays: 4,
    maxDayDrive: 3.0, totalDriveHours: 7.0, budget: "省钱", experience: 8,
    highlights: ["Old Sacramento", "Placerville", "Auburn", "American River"],
    itinerary: [
      day(1,"South Bay → Sacramento",2.0,["Old Sacramento","河畔步行"],"Sacramento","城市段停车方便，适合晚一点出发。"),
      day(2,"Sacramento → Placerville → Auburn",2.0,["Placerville","Auburn State Recreation Area"],"Auburn","把主要活动放在白天。"),
      day(3,"Auburn → South Bay",3.0,["咖啡休息","沿途补给"],"返程","不追景点数量，保留返程缓冲。")
    ],
    mapPoints: [{label:"San Jose",x:36,y:79},{label:"Sacramento",x:55,y:45},{label:"Placerville",x:72,y:36},{label:"Auburn",x:66,y:27}]
  },
  {
    id: "santa-cruz",
    name: "Santa Cruz · Half Moon Bay 轻松环线",
    theme: "短途松弛",
    summary: "总驾驶量最低，适合两天周末、小预算和不想把时间浪费在长距离赶路上的用户。",
    bestMonths: [3,4,5,6,9,10,11], goodMonths: [1,2,7,8,12], minDays: 2, maxDays: 3,
    maxDayDrive: 2.2, totalDriveHours: 4.0, budget: "省钱", experience: 8,
    highlights: ["Santa Cruz", "Natural Bridges", "Pescadero", "Half Moon Bay"],
    itinerary: [
      day(1,"South Bay → Santa Cruz",1.0,["Natural Bridges","West Cliff Drive"],"Santa Cruz","下午留给海边，不堆景点。"),
      day(2,"Santa Cruz → Pescadero → Half Moon Bay → South Bay",2.2,["Pescadero","Half Moon Bay"],"返程","海岸公路留出停车与观景时间。")
    ],
    mapPoints: [{label:"San Jose",x:70,y:25},{label:"Santa Cruz",x:57,y:66},{label:"Pescadero",x:35,y:53},{label:"Half Moon Bay",x:38,y:30}]
  },
  {
    id: "napa-sonoma",
    name: "Napa · Sonoma 山谷慢行",
    theme: "舒适慢游",
    summary: "减少徒步与赶路，用小镇、餐饮和山谷公路组成舒适路线。",
    bestMonths: [4,5,6,9,10], goodMonths: [3,7,8,11], minDays: 2, maxDays: 4,
    maxDayDrive: 2.8, totalDriveHours: 6.2, budget: "舒适", experience: 8,
    highlights: ["Sonoma Plaza", "Napa Valley", "Calistoga", "Petaluma"],
    itinerary: [
      day(1,"South Bay → Sonoma",2.0,["Sonoma Plaza","Petaluma"],"Sonoma","优先步行和餐饮，不安排夜间山路。"),
      day(2,"Sonoma → Napa → Calistoga",1.6,["Napa Valley","Calistoga"],"Calistoga","把驾驶拆碎，午后慢游。"),
      day(3,"Calistoga → South Bay",2.6,["山谷公路","中途咖啡"],"返程","避开通勤高峰返程。")
    ],
    mapPoints: [{label:"San Jose",x:60,y:84},{label:"Sonoma",x:44,y:48},{label:"Napa",x:58,y:42},{label:"Calistoga",x:55,y:23}]
  },
  {
    id: "yosemite",
    name: "Yosemite 山谷经典线",
    theme: "山谷自然",
    summary: "自然体验强，但季节对路线影响很大；1.0 会在冬季主动降分并提醒道路条件。",
    bestMonths: [5,6,9,10], goodMonths: [4,7,8], riskMonths: [1,2,3,11,12],
    warning: "秋末到春季部分高山道路常季节性关闭，冬季可能有防滑链要求；出发前必须核实官方路况。",
    minDays: 3, maxDays: 5, maxDayDrive: 4.2, totalDriveHours: 9.2, budget: "普通", experience: 10,
    highlights: ["Yosemite Valley", "Tunnel View", "Valley Loop", "Mariposa Grove"],
    itinerary: [
      day(1,"South Bay → Yosemite gateway",4.0,["沿途补给","山谷日落"],"Yosemite gateway","长驾驶日，进山前加油。"),
      day(2,"Yosemite Valley 慢游",1.0,["Tunnel View","Valley Loop"],"Yosemite gateway","把天气变化当作行程变量。"),
      day(3,"Yosemite → South Bay",4.2,["Mariposa / 返程补给"],"返程","下山前确认天气与链条管制。")
    ],
    mapPoints: [{label:"San Jose",x:24,y:66},{label:"Merced",x:52,y:61},{label:"Yosemite",x:77,y:33}]
  },
  {
    id: "tahoe",
    name: "Lake Tahoe 湖景线",
    theme: "高山湖泊",
    summary: "夏季湖景与冬季雪景都强，但冬季驾驶门槛更高，适合能接受路况变化的人。",
    bestMonths: [6,7,8,9], goodMonths: [5,10], riskMonths: [1,2,3,11,12],
    warning: "冬季可能遇到降雪、结冰和链条管制；没有雪地驾驶准备时不建议把它作为首选。",
    minDays: 3, maxDays: 5, maxDayDrive: 4.5, totalDriveHours: 10.0, budget: "舒适", experience: 9,
    highlights: ["South Lake Tahoe", "Emerald Bay", "湖岸公路", "Sacramento"],
    itinerary: [
      day(1,"South Bay → Sacramento → Tahoe",4.5,["Sacramento 休息","South Lake Tahoe"],"South Lake Tahoe","高海拔天气变化快。"),
      day(2,"Tahoe 湖岸慢游",1.8,["Emerald Bay","湖岸观景"],"South Lake Tahoe","不追求完整环湖。"),
      day(3,"Tahoe → South Bay",4.2,["山脚补给","中途长休息"],"返程","确认山口路况后再出发。")
    ],
    mapPoints: [{label:"San Jose",x:22,y:79},{label:"Sacramento",x:50,y:55},{label:"Tahoe",x:78,y:25}]
  },
  {
    id: "sequoia",
    name: "Sequoia · Kings Canyon 巨木线",
    theme: "巨木山林",
    summary: "比 Yosemite 更偏山林与巨木，适合三到四天；冬季道路风险较高。",
    bestMonths: [5,6,9,10], goodMonths: [4,7,8], riskMonths: [1,2,3,11,12],
    warning: "冬季高海拔路段可能受雪和链条要求影响，部分设施季节性关闭。",
    minDays: 3, maxDays: 5, maxDayDrive: 4.8, totalDriveHours: 10.5, budget: "普通", experience: 9,
    highlights: ["Giant Forest", "General Sherman Tree", "Kings Canyon foothills"],
    itinerary: [
      day(1,"South Bay → Three Rivers",4.2,["途中补给","Three Rivers"],"Three Rivers","进入山路前补油。"),
      day(2,"Sequoia National Park",2.0,["Giant Forest","General Sherman Tree"],"Three Rivers","高海拔段留足天气缓冲。"),
      day(3,"Three Rivers → South Bay",4.3,["Central Valley 休息"],"返程","避免疲劳驾驶。")
    ],
    mapPoints: [{label:"San Jose",x:27,y:18},{label:"Fresno",x:52,y:50},{label:"Three Rivers",x:72,y:75}]
  },
  {
    id: "morro-bay",
    name: "Morro Bay · Cambria 海岸小镇",
    theme: "海岸小镇",
    summary: "比 Big Sur 更偏慢生活和小镇，住宿弹性较好，适合三天且不想天天徒步。",
    bestMonths: [2,3,4,5,9,10,11], goodMonths: [1,6,7,8,12], minDays: 3, maxDays: 4,
    maxDayDrive: 3.5, totalDriveHours: 8.3, budget: "普通", experience: 9,
    highlights: ["Morro Rock", "Cambria", "Moonstone Beach", "Paso Robles"],
    itinerary: [
      day(1,"South Bay → Morro Bay",3.3,["Morro Rock","Embarcadero"],"Morro Bay","下午抵达后以步行为主。"),
      day(2,"Morro Bay → Cambria → Paso Robles",2.2,["Moonstone Beach","Cambria"],"Paso Robles","海岸和内陆各半天。"),
      day(3,"Paso Robles → South Bay",2.8,["沿途咖啡","短停"],"返程","午后前出发，避开晚高峰。")
    ],
    mapPoints: [{label:"San Jose",x:64,y:17},{label:"Morro Bay",x:41,y:62},{label:"Cambria",x:35,y:48},{label:"Paso Robles",x:55,y:47}]
  },
  {
    id: "santa-barbara",
    name: "Santa Barbara · Central Coast",
    theme: "城市海岸",
    summary: "城市、美食、海岸组合，适合四天以上；三天也能做但驾驶占比会明显上升。",
    bestMonths: [2,3,4,5,9,10,11], goodMonths: [1,6,7,8,12], minDays: 3, maxDays: 5,
    maxDayDrive: 4.5, totalDriveHours: 10.8, budget: "舒适", experience: 9,
    highlights: ["Santa Barbara", "State Street", "Pismo Beach", "Morro Bay"],
    itinerary: [
      day(1,"South Bay → Pismo Beach",3.1,["Pismo Beach","海边晚餐"],"Pismo Beach","第一天只做到中段。"),
      day(2,"Pismo Beach → Santa Barbara",1.7,["Santa Barbara","State Street"],"Santa Barbara","用一整天给城市和海岸。"),
      day(3,"Santa Barbara → Morro Bay",2.0,["海岸停留","Morro Bay"],"Morro Bay","回程拆段减少疲劳。"),
      day(4,"Morro Bay → South Bay",3.2,["沿途休息"],"返程","不安排额外远距离支线。")
    ],
    mapPoints: [{label:"San Jose",x:65,y:15},{label:"Pismo",x:46,y:50},{label:"Santa Barbara",x:35,y:79},{label:"Morro Bay",x:42,y:57}]
  },
  {
    id: "pinnacles",
    name: "Pinnacles · Monterey 山海组合",
    theme: "轻徒步",
    summary: "短途山景和海边混合，适合春秋两到三天，驾驶量低但活动感更强。",
    bestMonths: [2,3,4,10,11], goodMonths: [1,5,9,12], minDays: 2, maxDays: 3,
    maxDayDrive: 2.6, totalDriveHours: 5.5, budget: "省钱", experience: 9,
    highlights: ["Pinnacles", "Monterey", "Carmel"],
    itinerary: [
      day(1,"South Bay → Pinnacles",1.6,["Pinnacles short hike"],"Soledad / Monterey","夏季高温时不推荐午后长徒步。"),
      day(2,"Pinnacles → Carmel → Monterey",1.5,["Carmel","Monterey"],"Monterey","把山路和海边拆开。"),
      day(3,"Monterey → South Bay",1.5,["海边早餐","返程"],"返程","轻松返程。")
    ],
    mapPoints: [{label:"San Jose",x:56,y:20},{label:"Pinnacles",x:62,y:65},{label:"Carmel",x:37,y:60},{label:"Monterey",x:38,y:49}]
  },
  {
    id: "healdsburg",
    name: "Healdsburg · Russian River",
    theme: "乡野慢行",
    summary: "山谷、小镇和红杉短停组合，比 Napa 更松弛，适合三天舒适型路线。",
    bestMonths: [4,5,6,9,10], goodMonths: [3,7,8,11], minDays: 2, maxDays: 4,
    maxDayDrive: 3.0, totalDriveHours: 6.8, budget: "舒适", experience: 8,
    highlights: ["Healdsburg", "Russian River", "Armstrong Redwoods", "Sebastopol"],
    itinerary: [
      day(1,"South Bay → Sebastopol → Healdsburg",2.5,["Sebastopol","Healdsburg"],"Healdsburg","下午小镇慢游。"),
      day(2,"Healdsburg → Armstrong Redwoods",1.5,["Armstrong Redwoods","Russian River"],"Healdsburg","森林步行后不安排长驾。"),
      day(3,"Healdsburg → South Bay",2.8,["山谷早餐","返程休息"],"返程","避开通勤时段。")
    ],
    mapPoints: [{label:"San Jose",x:59,y:83},{label:"Sebastopol",x:40,y:52},{label:"Healdsburg",x:50,y:31},{label:"Redwoods",x:35,y:24}]
  }
];
