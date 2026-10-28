"use client";

import { FormEvent, useMemo, useState } from "react";
import { recommendRoutes } from "../lib/recommend";
import { BudgetPreference, RouteSuggestion } from "../lib/routes";

type FormState = { origin: string; month: string; days: string; maxDrive: string; budget: BudgetPreference };

const initialForm: FormState = { origin: "San Jose", month: "2026-11", days: "3", maxDrive: "4", budget: "省钱" };

function RouteSketch({ route }: { route: RouteSuggestion }) {
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
        <div className="map-stamp">CALIFORNIA · 1.0</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [routes, setRoutes] = useState<RouteSuggestion[]>([]);
  const [generated, setGenerated] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const selected = routes.find((route) => route.id === selectedId) || routes[0];
  const monthLabel = useMemo(() => {
    if (!form.month) return "未选择";
    const [year, month] = form.month.split("-");
    return `${year} 年 ${Number(month)} 月`;
  }, [form.month]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const month = Number(form.month.split("-")[1]);
    const next = recommendRoutes({ origin: form.origin, month, days: Number(form.days), maxDrive: Number(form.maxDrive), budget: form.budget });
    setRoutes(next);
    setSelectedId(next[0]?.id || "");
    setGenerated(true);
    setCopied(false);
    window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 40);
  }

  async function copyPlan() {
    if (!selected) return;
    const summary = [
      `Road Trip Free 1.0 · ${selected.name}`,
      `${monthLabel} · ${form.days}天 · ${form.origin}出发 · 每天≤${form.maxDrive}h`,
      `推荐分：${selected.score}/100`,
      ...selected.days.map((d) => `D${d.day} ${d.title}｜${d.drive}｜${d.stops.join(" / ")}`),
      selected.warning ? `提醒：${selected.warning}` : "提醒：出发前核实天气、封路和车辆状态。"
    ].join("\n");
    try { await navigator.clipboard.writeText(summary); setCopied(true); } catch { setCopied(false); }
  }

  return (
    <main>
      <section className="hero">
        <nav className="nav shell">
          <a className="brand" href="#top">Road Trip Free <i>1.0</i></a>
          <div className="nav-links"><a href="#planner">生成路线</a><a href="#how">怎么工作</a><span>California MVP</span></div>
        </nav>

        <div className="shell hero-grid" id="top">
          <div className="hero-copy">
            <span className="eyebrow">ROUTE-FIRST ROAD TRIP PLANNER</span>
            <h1>不用先想去哪。<br /><em>先告诉我你有多少时间。</em></h1>
            <p className="lead">Road Trip Free 把季节、驾驶强度、天数和预算先算在一起，再给你三条可执行的自驾方案。不是照片墙，也不是目的地搜索框。</p>
            <div className="hero-proof">
              <div><strong>12</strong><span>California 候选路线</span></div>
              <div><strong>5</strong><span>评分维度</span></div>
              <div><strong>3</strong><span>直接可选方案</span></div>
            </div>
          </div>

          <form className="planner" id="planner" onSubmit={submit}>
            <div className="planner-title"><div><span className="step">START HERE</span><h2>你的自驾条件</h2></div><span className="free-badge">FREE</span></div>
            <label>从哪里出发？
              <select value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })}>
                <option>San Jose</option><option>Santa Clara</option><option>Sunnyvale</option><option>Cupertino</option><option>Mountain View</option>
              </select>
            </label>
            <div className="two-col">
              <label>什么时候出发？<input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required /></label>
              <label>玩几天？<select value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })}><option value="2">2 天</option><option value="3">3 天</option><option value="4">4 天</option><option value="5">5 天</option></select></label>
            </div>
            <div className="two-col">
              <label>每天最多开多久？<select value={form.maxDrive} onChange={(e) => setForm({ ...form, maxDrive: e.target.value })}><option value="3">3 小时</option><option value="4">4 小时</option><option value="5">5 小时</option><option value="6">6 小时</option></select></label>
              <label>预算偏好<select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value as BudgetPreference })}><option>省钱</option><option>普通</option><option>舒适</option></select></label>
            </div>
            <button className="primary" type="submit">生成 3 条路线 <span>→</span></button>
            <p className="microcopy">1.0 使用内置路线与驾驶估算，适合规划和产品演示；出发前请核实实时路况、天气和封路。</p>
          </form>
        </div>
      </section>

      <section className="shell how-strip" id="how">
        <div><b>01</b><span>季节</span><small>35%</small></div><div><b>02</b><span>驾驶强度</span><small>25%</small></div><div><b>03</b><span>旅行天数</span><small>20%</small></div><div><b>04</b><span>预算</span><small>10%</small></div><div><b>05</b><span>路线体验</span><small>10%</small></div>
      </section>

      <section className="shell results" id="results">
        <div className="section-heading">
          <div><span className="eyebrow">TOP ROUTES</span><h2>{generated ? `${form.origin} 出发，最值得考虑的 3 条路线` : "输入条件后，推荐会出现在这里"}</h2></div>
          {generated && <p className="query-summary">{monthLabel}<br />{form.days} 天 · 每天 ≤ {form.maxDrive}h · {form.budget}</p>}
        </div>

        {!generated ? <div className="empty-state"><div><div className="empty-orbit">RTF</div><p>路线不是从“热门照片”开始，<br />而是从你的时间和驾驶限制开始。</p></div></div> : <>
          <div className="route-grid">
            {routes.map((route, index) => (
              <button type="button" className={`route-card ${selected?.id === route.id ? "selected" : ""}`} key={route.id} onClick={() => { setSelectedId(route.id); window.setTimeout(() => document.getElementById("detail")?.scrollIntoView({behavior:"smooth"}),40); }}>
                <div className="route-topline"><span>0{index + 1}</span><div><strong>{route.theme}</strong><b className="score">{route.score}</b></div></div>
                <h3>{route.name}</h3><p>{route.summary}</p>
                <div className="stats"><span>{route.totalDrive}</span><span>{route.seasonFit}</span></div>
                {route.warning && <div className="warning-mini">季节提醒</div>}
                <div className="reason-list">{route.reasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div>
                <div className="card-action">{selected?.id === route.id ? "已选择 · 查看下方详情" : "选择这条路线 →"}</div>
              </button>
            ))}
          </div>

          {selected && <section className="detail" id="detail">
            <div className="detail-head">
              <div><span className="eyebrow">SELECTED ROUTE</span><h2>{selected.name}</h2><p>{selected.summary}</p></div>
              <div className="detail-score"><strong>{selected.score}</strong><span>/100</span><small>推荐分</small></div>
            </div>

            <div className="detail-grid">
              <RouteSketch route={selected} />
              <div className="score-panel">
                <span className="eyebrow">WHY THIS ROUTE</span>
                {[["季节",selected.breakdown.season,35],["驾驶",selected.breakdown.driving,25],["天数",selected.breakdown.duration,20],["预算",selected.breakdown.budget,10],["体验",selected.breakdown.experience,10]].map(([label,value,max]) => <div className="score-row" key={String(label)}><div><b>{label}</b><span>{value}/{max}</span></div><div className="score-track"><i style={{width:`${Number(value)/Number(max)*100}%`}} /></div></div>)}
                <div className="highlights"><b>路线亮点</b><p>{selected.highlights.join(" · ")}</p></div>
              </div>
            </div>

            {selected.warning && <div className="risk-banner"><span>!</span><div><b>季节风险提示</b><p>{selected.warning}</p></div></div>}

            <div className="itinerary-head"><div><span className="eyebrow">DAY BY DAY</span><h3>{form.days} 天执行版</h3></div><button type="button" className="copy-btn" onClick={copyPlan}>{copied ? "已复制 ✓" : "复制行程摘要"}</button></div>
            <div className="timeline">
              {selected.days.map((d) => <article className="timeline-day" key={d.day}><div className="day-index"><span>D{d.day}</span><i /></div><div className="day-content"><div className="day-title"><h4>{d.title}</h4><b>{d.drive}</b></div><div className="stop-chips">{d.stops.map((stop) => <span key={stop}>{stop}</span>)}</div><p>{d.note}</p><small>休息 / 住宿：{d.rest}</small></div></article>)}
            </div>

            <div className="preflight"><div><span className="eyebrow">BEFORE YOU GO</span><h3>出发前 4 项检查</h3></div><ul><li>实时天气与山火信息</li><li>Caltrans / 公园道路封闭</li><li>山区链条要求</li><li>车辆油量 / 充电与轮胎状态</li></ul></div>
          </section>}
        </>}
      </section>

      <footer className="shell footer"><div><strong>Road Trip Free</strong><span>1.0 · California MVP</span></div><p>Route first. Photos later.</p></footer>
    </main>
  );
}
