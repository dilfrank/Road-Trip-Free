"use client";

import { FormEvent, useMemo, useState } from "react";
import { isSupportedOrigin, recommendRoutes } from "../lib/recommend";
import { BudgetPreference, RouteSuggestion } from "../lib/routes";

type FormState = {
  origin: string;
  month: string;
  days: string;
  maxDrive: string;
  budget: BudgetPreference;
};

const initialForm: FormState = {
  origin: "San Jose",
  month: "2026-11",
  days: "3",
  maxDrive: "4",
  budget: "省钱"
};

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [routes, setRoutes] = useState<RouteSuggestion[]>([]);
  const [generated, setGenerated] = useState(false);
  const [notice, setNotice] = useState("");

  const monthLabel = useMemo(() => {
    if (!form.month) return "未选择";
    const [year, month] = form.month.split("-");
    return `${year} 年 ${Number(month)} 月`;
  }, [form.month]);

  function scrollToResults() {
    window.setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGenerated(true);

    if (!isSupportedOrigin(form.origin)) {
      setRoutes([]);
      setNotice("Step 3 的驾驶时间模型目前先精确支持 San Jose / South Bay。请输入 San Jose、Santa Clara、Sunnyvale、Cupertino 或 Mountain View。");
      scrollToResults();
      return;
    }

    const month = Number(form.month.split("-")[1]);
    const nextRoutes = recommendRoutes({
      origin: form.origin.trim(),
      month,
      days: Number(form.days),
      maxDrive: Number(form.maxDrive),
      budget: form.budget
    });

    setRoutes(nextRoutes);
    setNotice("已按季节 35% · 驾驶时间 25% · 旅行天数 20% · 预算 10% · 路线体验 10% 重新排序。当前为规则引擎，不包含实时封路和天气数据。");
    scrollToResults();
  }

  return (
    <main>
      <section className="hero">
        <nav className="nav shell">
          <div className="brand">Road Trip Free</div>
          <div className="nav-note">只做自驾游快速攻略</div>
        </nav>

        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">ROAD TRIP PLANNER · CALIFORNIA MVP</span>
            <h1>不用先想去哪。<br />告诉我你什么时候出发。</h1>
            <p className="lead">
              根据出发地、月份、天数和驾驶强度，快速生成几条适合当下季节的自驾路线。
              不刷照片，不拼攻略。
            </p>
            <div className="principles">
              <span>季节匹配</span>
              <span>路线优先</span>
              <span>控制驾驶疲劳</span>
            </div>
          </div>

          <form className="planner" onSubmit={submit}>
            <div className="planner-title">
              <div>
                <span className="step">STEP 01</span>
                <h2>告诉我你的出行条件</h2>
              </div>
              <span className="free-badge">FREE</span>
            </div>

            <label>
              从哪里出发？
              <input
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="San Jose"
                required
              />
            </label>

            <div className="two-col">
              <label>
                什么时候出发？
                <input
                  type="month"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  required
                />
              </label>
              <label>
                玩几天？
                <select value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })}>
                  <option value="2">2 天</option>
                  <option value="3">3 天</option>
                  <option value="4">4 天</option>
                  <option value="5">5 天</option>
                </select>
              </label>
            </div>

            <div className="two-col">
              <label>
                每天最多开多久？
                <select value={form.maxDrive} onChange={(e) => setForm({ ...form, maxDrive: e.target.value })}>
                  <option value="3">3 小时</option>
                  <option value="4">4 小时</option>
                  <option value="5">5 小时</option>
                  <option value="6">6 小时</option>
                </select>
              </label>
              <label>
                预算偏好
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value as BudgetPreference })}
                >
                  <option value="省钱">省钱</option>
                  <option value="普通">普通</option>
                  <option value="舒适">舒适</option>
                </select>
              </label>
            </div>

            <button type="submit">生成我的自驾路线 →</button>
            <p className="microcopy">
              Step 3：California 候选路线 + 规则推荐。当前驾驶模型先支持 San Jose / South Bay，实时天气和封路将在后续接入。
            </p>
          </form>
        </div>
      </section>

      <section className="shell value-strip">
        <div><strong>01</strong><span>不是景点搜索</span></div>
        <div><strong>02</strong><span>先判断当下适合去哪</span></div>
        <div><strong>03</strong><span>再把驾驶、景点和休息排成路线</span></div>
      </section>

      <section className="shell results" id="results">
        <div className="section-heading">
          <div>
            <span className="eyebrow">STEP 02 · ROUTE OPTIONS</span>
            <h2>
              {!generated
                ? "生成后，这里会出现 3 条路线"
                : routes.length
                  ? `${form.origin} 出发的 3 个建议`
                  : "这个出发地还没进入 MVP 驾驶模型"}
            </h2>
          </div>
          {generated && (
            <p className="query-summary">
              {monthLabel} · {form.days} 天 · 每天 ≤ {form.maxDrive}h · {form.budget}
            </p>
          )}
        </div>

        {!generated ? (
          <div className="empty-state">
            <span>路线不是从“热门照片”开始，而是从你的时间和驾驶限制开始。</span>
          </div>
        ) : routes.length === 0 ? (
          <div className="empty-state">
            <span>{notice}</span>
          </div>
        ) : (
          <>
            <p className="engine-note">{notice}</p>
            <div className="route-grid">
              {routes.map((route, index) => (
                <article className="route-card" key={route.id}>
                  <div className="route-topline">
                    <span>方案 {String.fromCharCode(65 + index)}</span>
                    <div className="route-badges">
                      <strong>{route.theme}</strong>
                      <span className="score">{route.score} 分</span>
                    </div>
                  </div>
                  <h3>{route.name}</h3>
                  <p className="route-summary">{route.summary}</p>
                  <div className="stats">
                    <span>{route.totalDrive}</span>
                    <span>{route.seasonFit}</span>
                  </div>

                  {route.warning && <div className="warning">⚠ {route.warning}</div>}

                  <div className="why">
                    <strong>为什么排在这里</strong>
                    <ul>
                      {route.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>
                  </div>

                  <div className="days">
                    {route.days.map((day) => (
                      <div className="day" key={day.day}>
                        <div className="day-number">D{day.day}</div>
                        <div>
                          <h4>{day.title}</h4>
                          <p>{day.drive}</p>
                          <p className="stops">{day.stops.join(" · ")}</p>
                          <small>休息：{day.rest}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="next-note">下一阶段：地图路线 + 实时道路 / 天气校验</div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="shell footer">
        <strong>Road Trip Free</strong>
        <span>Four-week MVP · route first, photos later.</span>
      </footer>
    </main>
  );
}
