"use client";

import { FormEvent, useMemo, useState } from "react";
import { demoRoutes, RouteSuggestion } from "../lib/routes";

type FormState = {
  origin: string;
  month: string;
  days: string;
  maxDrive: string;
  budget: string;
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

  const monthLabel = useMemo(() => {
    if (!form.month) return "未选择";
    const [year, month] = form.month.split("-");
    return `${year} 年 ${Number(month)} 月`;
  }, [form.month]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRoutes(demoRoutes);
    setGenerated(true);
    window.setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
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
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                  <option>省钱</option>
                  <option>普通</option>
                  <option>舒适</option>
                </select>
              </label>
            </div>

            <button type="submit">生成我的自驾路线 →</button>
            <p className="microcopy">MVP 阶段先覆盖 California，结果目前使用演示路线数据。</p>
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
            <h2>{generated ? `${form.origin} 出发的 3 个建议` : "生成后，这里会出现 3 条路线"}</h2>
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
        ) : (
          <div className="route-grid">
            {routes.map((route, index) => (
              <article className="route-card" key={route.id}>
                <div className="route-topline">
                  <span>方案 {String.fromCharCode(65 + index)}</span>
                  <strong>{route.theme}</strong>
                </div>
                <h3>{route.name}</h3>
                <p className="route-summary">{route.summary}</p>
                <div className="stats">
                  <span>{route.totalDrive}</span>
                  <span>{route.seasonFit}</span>
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
                <button className="secondary" type="button">查看完整路线</button>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="shell footer">
        <strong>Road Trip Free</strong>
        <span>Four-week MVP · route first, photos later.</span>
      </footer>
    </main>
  );
}
