import { RouteSuggestion } from "../lib/routes";

export default function RouteCoverage({ route, chosen, maxDrive }: {
  route: RouteSuggestion; chosen: string[]; maxDrive: number;
}) {
  const missing = chosen.filter(name => !route.matchedAttractions.includes(name));
  const over = route.days.filter(day => day.driveHours > maxDrive);
  return <aside className="risk-banner" aria-label="行程核对">
    <div><b>行程核对 · 已保留 {route.matchedAttractions.length}/{chosen.length} 个心愿景点</b>
      <p>{missing.length ? `尚未纳入：${missing.join("、")}。当前方案来自既有路线模板，可返回调整景点。` : "所选景点均已出现在逐日行程中。"}</p>
      <p>{over.length ? `超过驾驶上限：${over.map(day => `第 ${day.day} 天约 ${day.driveHours}h`).join("、")}。请调整方案。` : "按内置估算，各天驾驶均在上限内。"}</p>
      <small>估算不能替代实时道路计算；当前尚不支持跨模板自动拼接路线。</small>
    </div>
  </aside>;
}
