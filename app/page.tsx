"use client";


import { FormEvent, useMemo, useState } from "react";
import {
  inferMoods,
  recommendRoutes,
  suggestAttractions
} from "../lib/recommend";
import {
  AttractionSuggestion,
  BudgetPreference,
  MoodPreference,
  RouteSuggestion
} from "../lib/routes";

import RouteSketch from "../components/RouteSketch";
import RouteCoverage from "../components/RouteCoverage";

type FormState = {
  thought: string;
  moods: MoodPreference[];
  origin: string;
  month: string;
  days: string;
  maxDrive: string;
  budget: BudgetPreference;
};

const initialForm: FormState = {
  thought: "",
  moods: [],
  origin: "San Jose",
  month: "2026-11",
  days: "3",
  maxDrive: "4",
  budget: "省钱"
};

export default function Home() {
  const [form, updateForm] = useState<FormState>(initialForm);
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [attractions, setAttractions] = useState<AttractionSuggestion[]>([]);
  const [selectedAttractions, setSelectedAttractions] = useState<string[]>([]);
  const [routes, setRoutes] = useState<RouteSuggestion[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  const selected = routes.find((route) => route.id === selectedId) || routes[0];
  const inferredMoods = useMemo(() => inferMoods(form.thought, form.moods), [form.thought, form.moods]);
  const monthLabel = useMemo(() => {
    if (!form.month) return "未选择";
    const [year, month] = form.month.split("-");
    return `${year} 年 ${Number(month)} 月`;
  }, [form.month]);

  function setForm(next: FormState | ((current: FormState) => FormState)) {
    updateForm(next);
    setStage(1);
    setRoutes([]);
    setSelectedAttractions([]);
    setCopied(false);
    setNotice("");
  }

  function toggleMood(mood: MoodPreference) {
    setForm((current) => ({
      ...current,
      moods: current.moods.includes(mood)
        ? current.moods.filter((item) => item !== mood)
        : [...current.moods, mood]
    }));
  }

  function handleIntentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.thought.trim() && !form.moods.length) { setNotice("写点想法，或选一种偏好。"); return; }
    const month = Number(form.month.split("-")[1]);
    const nextAttractions = suggestAttractions({
      thought: form.thought,
      moods: form.moods,
      origin: form.origin,
      month,
      days: Number(form.days),
      maxDrive: Number(form.maxDrive),
      budget: form.budget
    });
    setAttractions(nextAttractions);
    setSelectedAttractions([]);
    setStage(2);
    setRoutes([]);
    setSelectedId("");
    setNotice("");
    window.setTimeout(() => document.getElementById("attractions")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function toggleAttraction(name: string) {
    setStage(2);
    setRoutes([]);
    setCopied(false);
    setNotice("");
    setSelectedAttractions((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (current.length >= 5) {
        setNotice("最多先选 5 个。Road Trip Free 2.0 α 会优先帮你减少选择，而不是继续堆景点。");
        return current;
      }
      return [...current, name];
    });
  }

  function buildRoutes() {
    if (selectedAttractions.length < 2) {
      setNotice("请至少选 2 个你真的想去的地方，再让路线为这些景点服务。");
      return;
    }
    const month = Number(form.month.split("-")[1]);
    const next = recommendRoutes({
      thought: form.thought,
      moods: form.moods,
      selectedAttractions,
      origin: form.origin,
      month,
      days: Number(form.days),
      maxDrive: Number(form.maxDrive),
      budget: form.budget
    });
    setRoutes(next);
    if (!next.length) {
      setNotice("当前天数没有可用的完整路线模板，请增加天数后重新选择景点。");
      setStage(2);
      return;
    }
    setSelectedId(next[0]?.id || "");
    setStage(3);
    setNotice("");
    setCopied(false);
    window.setTimeout(() => document.getElementById("routes")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function copyPlan() {
    if (!selected) return;
    const summary = [
      `Road Trip Free 2.0 α · ${selected.name}`,
      `这次想要：${form.thought}`,
      `情绪偏好：${inferredMoods.join(" / ")}`,
      `已选景点：${selectedAttractions.join(" / ")}`,
      `${monthLabel} · ${form.days}天 · ${form.origin}出发 · 每天≤${form.maxDrive}h`,
      `推荐分：${selected.score}/100`,
      ...selected.days.map((d) => `D${d.day} ${d.title}｜${d.drive}｜${d.stops.join(" / ")}`),
      selected.warning ? `提醒：${selected.warning}` : "提醒：出发前核实天气、封路和车辆状态。"
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav shell">
          <a className="brand" href="#top">Road Trip Free</a>
          <div className="nav-links"><a href="#intent">说想法</a><a href="#attractions" aria-disabled={stage < 2} onClick={e => { if (stage < 2) e.preventDefault(); }}>选景点</a><a href="#routes" aria-disabled={stage < 3} onClick={e => { if (stage < 3) e.preventDefault(); }}>看路线</a></div>
        </nav>

        <div className="shell hero-grid">
          <form className="planner" id="intent" onSubmit={handleIntentSubmit}>
            <h1>想去哪走走？</h1>
            <label className="thought-label"><span className="sr-only">旅行想法</span>
              <textarea
                value={form.thought}
                onChange={(e) => setForm({ ...form, thought: e.target.value })}
                placeholder="想去海边吹风，慢慢走……"
                rows={3}
              />
            </label>

            <div className="mood-block">
              <div className="mood-chips">
                {([ ["想放空", "放空"], ["想看海", "看海"], ["想被自然治愈", "自然"], ["想安静一点", "安静"], ["想轻松吃喝", "吃喝"] ] as [MoodPreference, string][]).map(([mood, label]) => (
                  <button
                    type="button"
                    key={mood}
                    className={form.moods.includes(mood) ? "active" : ""}
                    aria-pressed={form.moods.includes(mood)}
                    onClick={() => toggleMood(mood)}
                  >{label}</button>
                ))}
              </div>
            </div>

            <div className="reality-block">
              <div className="two-col">
                <label>从哪里出发<select value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })}><option>San Jose</option><option>Santa Clara</option><option>Sunnyvale</option><option>Cupertino</option><option>Mountain View</option></select></label>
                <label>出发月份<input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required /></label>
              </div>
              <div className="three-col">
                <label>天数<select value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })}><option value="2">2 天</option><option value="3">3 天</option><option value="4">4 天</option><option value="5">5 天</option></select></label>
                <label>每天最多驾驶<select value={form.maxDrive} onChange={(e) => setForm({ ...form, maxDrive: e.target.value })}><option value="3">3 小时</option><option value="4">4 小时</option><option value="5">5 小时</option><option value="6">6 小时</option></select></label>
                <label>预算<select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value as BudgetPreference })}><option>省钱</option><option>普通</option><option>舒适</option></select></label>
              </div>
            </div>

            <button className="primary" type="submit">选景点 <span>→</span></button>
            {notice && stage === 1 && <p className="notice" role="status">{notice}</p>}
          </form>
        </div>
      </section>


      <section className="shell attraction-section" id="attractions" hidden={stage < 2}>
        <div className="section-heading">
          <div><h2>选景点</h2></div>
          {stage >= 2 && <button className="text-btn" type="button" onClick={() => document.getElementById("intent")?.scrollIntoView({ behavior: "smooth" })}>修改我的想法 ↑</button>}
        </div>

        {stage < 2 ? (
          <div className="empty-state"><div className="empty-orbit">YOU</div><p>这里不会先塞给你热门榜单。<br />先告诉我你现在想要什么。</p></div>
        ) : (
          <>
            <div className="pick-head"><div><p>选 2–5 个</p></div><strong>{selectedAttractions.length}/5 已选</strong></div>
            <div className="attraction-grid">
              {attractions.map((item, index) => {
                const checked = selectedAttractions.includes(item.name);
                return (
                  <button type="button" key={`${item.routeId}-${item.name}`} className={`attraction-card ${checked ? "selected" : ""}`} onClick={() => toggleAttraction(item.name)}>
                    <div className="attraction-index">0{index + 1}</div>
                    <div className="attraction-copy"><span>{item.theme}</span><h4>{item.name}</h4><p>{item.reason}</p></div>
                    <div className="pick-state">{checked ? "✓" : "+"}</div>
                  </button>
                );
              })}
            </div>
            {notice && <p className="notice">{notice}</p>}
            <div className="build-bar"><div><span>你选中的景点</span><p>{selectedAttractions.length ? selectedAttractions.join(" · ") : "还没选"}</p></div><button className="primary compact" type="button" onClick={buildRoutes}>看路线 →</button></div>
          </>
        )}
      </section>

      <section className="shell results" id="routes" hidden={stage < 3}>
        <div className="section-heading">
          <div><h2>选路线</h2></div>
          {stage >= 3 && <p className="query-summary">{monthLabel}<br />{form.days} 天 · 每天 ≤ {form.maxDrive}h · {form.budget}</p>}
        </div>

        {stage < 3 ? (
          <div className="empty-state route-empty"><div className="empty-orbit">03</div><p>我们不会为了“路线漂亮”牺牲你真正想去的地方。<br />先完成上一步的景点选择。</p></div>
        ) : (
          <>
            <div className="route-grid">
              {routes.map((route, index) => (
                <button type="button" className={`route-card ${selected?.id === route.id ? "selected" : ""}`} key={route.id} onClick={() => { setSelectedId(route.id); window.setTimeout(() => document.getElementById("detail")?.scrollIntoView({ behavior: "smooth" }), 40); }}>
                  <div className="route-topline"><span>方案 0{index + 1}</span><div><strong>{route.theme}</strong><b className="score">{route.score}</b></div></div>
                  <h3>{route.name}</h3>
                  <div className="matched-line"><b>包含</b>{route.matchedAttractions.length ? route.matchedAttractions.map((place) => <span key={place}>{place}</span>) : <span>相近体验景点</span>}</div>
                  <div className="stats"><span>{route.totalDrive}</span><span>{route.seasonFit}</span></div>
                  {route.warning && <div className="warning-mini">季节提醒</div>}
                  <div className="card-action">{selected?.id === route.id ? "已选择 · 查看下方详情" : "选择这条路线 →"}</div>
                </button>
              ))}
            </div>

            {selected && (
              <section className="detail" id="detail">
                <div className="detail-head">
                  <div><h2>{selected.name}</h2><p>{selected.summary}</p></div>
                  <div className="detail-score"><strong>{selected.score}</strong><span>/100</span><small>匹配分</small></div>
                </div>

                <div className="detail-grid">
                  <div><RouteSketch route={selected} /><RouteCoverage route={selected} chosen={selectedAttractions} maxDrive={Number(form.maxDrive)} /></div>
                  <details className="score-panel"><summary>推荐依据</summary>
                    {[
                      ["你的想法", selected.breakdown.intent, 30],
                      ["已选景点", selected.breakdown.attraction, 25],
                      ["季节", selected.breakdown.season, 20],
                      ["驾驶", selected.breakdown.driving, 10],
                      ["天数", selected.breakdown.duration, 10],
                      ["预算", selected.breakdown.budget, 5]
                    ].map(([label, value, max]) => (
                      <div className="score-row" key={String(label)}><div><b>{label}</b><span>{value}/{max}</span></div><div className="score-track"><i style={{ width: `${Number(value) / Number(max) * 100}%` }} /></div></div>
                    ))}
                    <div className="highlights"><b>这条路线保留的重点</b><p>{selected.matchedAttractions.length ? selected.matchedAttractions.join(" · ") : selected.highlights.slice(0, 3).join(" · ")}</p></div>
                  </details>
                </div>

                {selected.warning && <div className="risk-banner"><span>!</span><div><b>季节风险提示</b><p>{selected.warning}</p></div></div>}

                <div className="itinerary-head"><div><h3>{form.days} 天行程</h3></div><button type="button" className="copy-btn" onClick={copyPlan}>{copied ? "已复制 ✓" : "复制行程摘要"}</button></div>
                <div className="timeline">
                  {selected.days.map((d) => <article className="timeline-day" key={d.day}><div className="day-index"><span>D{d.day}</span><i /></div><div className="day-content"><div className="day-title"><h4>{d.title}</h4><b>{d.drive}</b></div><div className="stop-chips">{d.stops.map((stop) => <span className={selectedAttractions.includes(stop) ? "chosen" : ""} key={stop}>{selectedAttractions.includes(stop) ? "★ " : ""}{stop}</span>)}</div><p>{d.note}</p><small>休息 / 住宿：{d.rest}</small></div></article>)}
                </div>

                <div className="preflight"><div><h3>出发前检查</h3></div><ul><li>实时天气与山火信息</li><li>Caltrans / 公园道路封闭</li><li>山区链条要求</li><li>车辆油量 / 充电与轮胎状态</li></ul></div>
              </section>
            )}
          </>
        )}
      </section>

      <footer className="shell footer"><p>驾驶时间为估算，出发前请核实路况与天气。</p></footer>
    </main>
  );
}
