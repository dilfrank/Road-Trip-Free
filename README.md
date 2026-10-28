# Road Trip Free 1.0

**Road Trip Free** is a route-first road trip planner for travelers who know **when they can go**, but do not want to research dozens of destinations before deciding **where to go**.

> Give it your departure city, month, number of days, daily driving limit and budget. It returns three ranked California road-trip options with an executable day-by-day plan.

## Why it is different

Traditional travel products usually start with a destination or a feed of attractions. Road Trip Free starts with constraints:

**time → season → driving tolerance → budget → route**

The 1.0 recommendation score is transparent:

- Season fit — 35%
- Daily driving fit — 25%
- Trip duration fit — 20%
- Budget fit — 10%
- Route experience — 10%

## 1.0 features

- 12 curated California route candidates
- 2–5 day trip planning
- South Bay departure presets
- Top-3 rule-based route ranking
- Transparent score breakdown and reasons
- Adaptive day-by-day itinerary
- Route schematic visualization
- Seasonal road-risk warnings
- Copyable trip summary
- Responsive desktop/mobile UI
- Pre-departure safety checklist

## Scope / data disclaimer

1.0 uses curated route data and estimated driving times. It does **not** claim to provide live navigation, live weather, chain controls, wildfire status, or live road closures. The UI explicitly asks users to verify those conditions before departure.

## Tech

- Next.js 16
- React 19
- TypeScript
- No external map/API key required for the 1.0 demo

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product flow

1. Choose departure city, month, days, maximum daily driving and budget.
2. Generate three ranked routes.
3. Select a route.
4. Review the score, route schematic, risks and daily plan.
5. Copy the plan summary and verify live conditions before departure.

## Next after 1.0

- Real routing / travel time API
- Live Caltrans / park road-status checks
- Weather and wildfire risk
- More California departure regions
- Save/share trips
