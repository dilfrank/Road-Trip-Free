"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  emotionSummary,
  inferMoods,
  moodOptions,
  recommendRoutes,
  suggestAttractions
} from "../lib/recommend";
import {
  AttractionSuggestion,
  BudgetPreference,
  MoodPreference,
  RouteSuggestion
} from "../lib/routes";

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
  thought: "最近有点累，想开车去海边吹吹风，不想赶路，最好安静一点。",
  moods: ["想放空", "想看海", "想安静一点"],
  origin: "San Jose",
  month: "2026-11",
  days: "3",
  maxDrive: "4",
  budget: "省钱"
};

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
    setSelectedAttractions(nextAttractions.slice(0, 3).map((item) => item.name));
    setStage(2);
    setRoutes([]);
    setSelectedId("");
    setNotice("");
    window.setTimeout(() => document.getElementById("attractions")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function toggleAttraction(name: string) {
    setNotice("");
    setSelectedAttractions((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (current.length >= 5) {
        setNotice("最多先选 5 个。Road Trip Free 1.0 会优先帮你减少选择，而不是继续堆景点。");
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
    setSelectedId(next[0]?.id || "");
    setStage(3);
    setNotice("");
    setCopied(false);
    window.setTimeout(() => document.getElementById("routes")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function copyPlan() {
    if (!selected) return;
    const summary = [
      `Road Trip Free 1.0 · ${selected.name}`,
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
          <a className="brand" href="#top">Road Trip Free <i>1.0</i></a>
          <div className="nav-links"><a href="#intent">说想法</a><a href="#attractions">选景点</a><a href="#routes">看路线</a><span>California MVP</span></div>
        </nav>

        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">INTENT-FIRST ROAD TRIP PLANNER</span>
            <h1>先说你想要什么感觉。<br /><em>路线，晚一点再说。</em></h1>
            <p className="lead">“最近太累了，想去海边吹风。”“想和朋友找个安静的小镇。”“想看看真正壮阔的自然。”——Road Trip Free 先理解这次旅行对你意味着什么，再选景点，最后才排路线。</p>
            <div className="emotional-proof">
              <div><b>先理解你</b><span>不从目的地搜索框开始</span></div>
              <div><b>再定景点</b><span>只保留真正想去的地方</span></div>
              <div><b>最后成路线</b><span>让驾驶服务于体验</span></div>
            </div>
          </div>

          <form className="planner" id="intent" onSubmit={handleIntentSubmit}>
            <div className="planner-title">
              <div><span className="step">STEP 01 · 先聊聊你</span><h2>这次，你为什么想出去走走？</h2></div>
              <span className="free-badge">FREE</span>
            </div>

            <label className="thought-label">随便说，不用像填表。
              <textarea
                value={form.thought}
                onChange={(e) => setForm({ ...form, thought: e.target.value })}
                placeholder="比如：最近工作太累，想去海边吹风，不想赶路，最好安静一点。"
                rows={4}
                required
              />
            </label>

            <div className="mood-block">
              <span className="field-title">你更想得到哪种感觉？</span>
              <div className="mood-chips">
                {moodOptions.map((mood) => (
                  <button
                    type="button"
                    key={mood}
                    className={form.moods.includes(mood) ? "active" : ""}
                    onClick={() => toggleMood(mood)}
                  >{mood}</button>
                ))}
              </div>
            </div>

            <div className="reality-block">
              <div className="reality-title"><span>现实条件</span><small>让好心情不被赶路毁掉</small></div>
              <div className="two-col">
                <label>从哪里出发？<select value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })}><option>San Jose</option><option>Santa Clara</option><option>Sunnyvale</option><option>Cupertino</option><option>Mountain View</option></select></label>
                <label>什么时候？<input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required /></label>
              </div>
              <div className="three-col">
                <label>玩几天？<select value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })}><option value="2">2 天</option><option value="3">3 天</option><option value="4">4 天</option><option value="5">5 天</option></select></label>
                <label>每天最多开？<select value={form.maxDrive} onChange={(e) => setForm({ ...form, maxDrive: e.target.value })}><option value="3">3 小时</option><option value="4">4 小时</option><option value="5">5 小时</option><option value="6">6 小时</option></select></label>
                <label>预算<select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value as BudgetPreference })}><option>省钱</option><option>普通</option><option>舒适</option></select></label>
              </div>
            </div>

            <button className="primary" type="submit">先帮我挑景点 <span>→</span></button>
            <p className="microcopy">1.0 先覆盖 California / South Bay 出发。驾驶时间为内置估算，出发前请核实实时路况和天气。</p>
          </form>
        </div>
      </section>

      <section className="shell flow-strip">
        <div className={stage >= 1 ? "done" : ""}><b>01</b><span>说想法</span><small>需求与情绪价值</small></div>
        <div className={stage >= 2 ? "done" : ""}><b>02</b><span>定景点</span><small>把感觉翻译成地方</small></div>
        <div className={stage >= 3 ? "done" : ""}><b>03</b><span>成路线</span><small>再处理驾驶与顺路</small></div>
      </section>

      <section className="shell attraction-section" id="attractions">
        <div className="section-heading">
          <div><span className="eyebrow">STEP 02 · PLACES BEFORE ROUTES</span><h2>{stage >= 2 ? "先决定你真正想去哪里。" : "先理解想法，再出现景点。"}</h2></div>
          {stage >= 2 && <button className="text-btn" type="button" onClick={() => document.getElementById("intent")?.scrollIntoView({ behavior: "smooth" })}>修改我的想法 ↑</button>}
        </div>

        {stage < 2 ? (
          <div className="empty-state"><div className="empty-orbit">YOU</div><p>这里不会先塞给你热门榜单。<br />先告诉我你现在想要什么。</p></div>
        ) : (
          <>
            <div className="emotion-card">
              <span className="emotion-mark">“</span>
              <div><span className="eyebrow">我听到的是</span><h3>{emotionSummary(inferredMoods)}</h3><p>你的原话：{form.thought}</p><div className="heard-moods">{inferredMoods.map((mood) => <span key={mood}>{mood}</span>)}</div></div>
            </div>

            <div className="pick-head"><div><h3>从这些地方里，选 2–5 个你有感觉的。</h3><p>不需要懂路线。现在只问：你愿不愿意去？</p></div><strong>{selectedAttractions.length}/5 已选</strong></div>
            <div className="attraction-grid">
              {attractions.map((item, index) => {
                const checked = selectedAttractions.includes(item.name);
                return (
                  <button type="button" key={`${item.routeId}-${item.name}`} className={`attraction-card ${checked ? "selected" : ""}`} onClick={() => toggleAttraction(item.name)}>
                    <div className="attraction-index">0{index + 1}</div>
                    <div className="attraction-copy"><span>{item.theme}</span><h4>{item.name}</h4><p>{item.reason}</p><small>{item.emotionalValue}</small></div>
                    <div className="pick-state">{checked ? "✓" : "+"}</div>
                  </button>
                );
              })}
            </div>
            {notice && <p className="notice">{notice}</p>}
            <div className="build-bar"><div><span>你选中的景点</span><p>{selectedAttractions.length ? selectedAttractions.join(" · ") : "还没选"}</p></div><button className="primary compact" type="button" onClick={buildRoutes}>用这些景点生成路线 →</button></div>
          </>
        )}
      </section>

      <section className="shell results" id="routes">
        <div className="section-heading">
          <div><span className="eyebrow">STEP 03 · ROUTES SERVE YOUR CHOICES</span><h2>{stage >= 3 ? "最后，才把它们变成一条能开的路。" : "路线最后出现。"}</h2></div>
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
                  <h3>{route.name}</h3><p className="emotional-value">{route.emotionalValue}</p>
                  <div className="matched-line"><b>回应了</b>{route.matchedMoods.slice(0, 3).map((mood) => <span key={mood}>{mood}</span>)}</div>
                  <div className="matched-line"><b>包含</b>{route.matchedAttractions.length ? route.matchedAttractions.map((place) => <span key={place}>{place}</span>) : <span>相近体验景点</span>}</div>
                  <div className="stats"><span>{route.totalDrive}</span><span>{route.seasonFit}</span></div>
                  {route.warning && <div className="warning-mini">季节提醒</div>}
                  <div className="reason-list">{route.reasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div>
                  <div className="card-action">{selected?.id === route.id ? "已选择 · 查看下方详情" : "选择这条路线 →"}</div>
                </button>
              ))}
            </div>

            {selected && (
              <section className="detail" id="detail">
                <div className="detail-head">
                  <div><span className="eyebrow">SELECTED ROUTE</span><h2>{selected.name}</h2><p className="detail-emotion">{selected.emotionalValue}</p><p>{selected.summary}</p></div>
                  <div className="detail-score"><strong>{selected.score}</strong><span>/100</span><small>匹配分</small></div>
                </div>

                <div className="detail-grid">
                  <RouteSketch route={selected} />
                  <div className="score-panel">
                    <span className="eyebrow">WHY THIS ROUTE</span>
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
                  </div>
                </div>

                {selected.warning && <div className="risk-banner"><span>!</span><div><b>季节风险提示</b><p>{selected.warning}</p></div></div>}

                <div className="itinerary-head"><div><span className="eyebrow">DAY BY DAY</span><h3>{form.days} 天执行版</h3></div><button type="button" className="copy-btn" onClick={copyPlan}>{copied ? "已复制 ✓" : "复制行程摘要"}</button></div>
                <div className="timeline">
                  {selected.days.map((d) => <article className="timeline-day" key={d.day}><div className="day-index"><span>D{d.day}</span><i /></div><div className="day-content"><div className="day-title"><h4>{d.title}</h4><b>{d.drive}</b></div><div className="stop-chips">{d.stops.map((stop) => <span className={selectedAttractions.includes(stop) ? "chosen" : ""} key={stop}>{selectedAttractions.includes(stop) ? "★ " : ""}{stop}</span>)}</div><p>{d.note}</p><small>休息 / 住宿：{d.rest}</small></div></article>)}
                </div>

                <div className="preflight"><div><span className="eyebrow">BEFORE YOU GO</span><h3>好体验的最后一层，是别让现实把它打断。</h3></div><ul><li>实时天气与山火信息</li><li>Caltrans / 公园道路封闭</li><li>山区链条要求</li><li>车辆油量 / 充电与轮胎状态</li></ul></div>
              </section>
            )}
          </>
        )}
      </section>

      <footer className="shell footer"><div><strong>Road Trip Free 1.0</strong><span>先理解人，再理解路。</span></div><p>California MVP · 不做照片墙 · 不做泛旅行</p></footer>
    </main>
  );
}
