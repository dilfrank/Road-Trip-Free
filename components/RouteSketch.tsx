import { RouteSuggestion } from "../lib/routes";

export default function RouteSketch({ route }: { route: RouteSuggestion }) {
  return (
    <div className="map-card">
      <div className="map-toolbar"><span>ROUTE VIEW</span><span>示意图 · 非导航地图</span></div>
      <div className="route-map" aria-label={`${route.name} 路线示意图`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><pattern id={`grid-${route.id}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth=".25" /></pattern></defs>
          <rect width="100" height="100" fill={`url(#grid-${route.id})`} className="map-grid" />
          <polyline points={route.mapPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" className="map-line" />
        </svg>
        {route.mapPoints.map((point, index) => (
          <div className="map-point" key={`${route.id}-${point.label}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}>
            <span>{index + 1}</span><b>{point.label}</b>
          </div>
        ))}
        <div className="map-stamp">CALIFORNIA · 2.0 α</div>
      </div>
    </div>
  );
}

