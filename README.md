# Road Trip Free

Road Trip Free helps budget-conscious road travelers quickly generate season-aware road trip plans with routes, attractions, driving time, and rest stops.

## Product idea

Instead of asking users to browse destination photos first, Road Trip Free starts with:

- departure area
- travel month
- number of days
- maximum driving time per day
- budget preference

It then recommends several road-trip options that fit those constraints.

> You do not need to know where to go first. Tell Road Trip Free when you are leaving and how you want to drive.

## Four-week MVP scope

### Included

- California-first MVP
- road-trip-only planning
- 2–3 recommended route options
- season-aware ranking
- daily driving limits
- attractions / stops
- rest planning
- transparent recommendation reasons

### Explicitly excluded for now

- social posting
- photo check-in feeds
- flights or trains
- hotel / flight booking
- ticket sales
- generic travel community features

## Step 3 — Recommendation Engine

The prototype now uses a rule-based recommendation engine instead of returning three fixed demo routes.

Current candidate dataset: **12 California road trips**.

The score is:

- Season fit: 35%
- Driving fit: 25%
- Trip-length fit: 20%
- Budget fit: 10%
- Route experience: 10%

The UI also explains why each route received its score and shows seasonal caution messages where appropriate.

See [`docs/RECOMMENDATION_ENGINE.md`](docs/RECOMMENDATION_ENGINE.md) for the model and known limitations.

## Current limitation

Driving-time estimates are currently modeled for **San Jose / South Bay departures**. The engine does not yet use live weather, wildfire, road-closure, chain-control, or navigation data.

## Tech

- Next.js 16
- React 19
- TypeScript
- CSS

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Roadmap

- [x] Step 1 — narrow the product scope
- [x] Step 2 — build the first planner UI
- [x] Step 3 — add a rule-based recommendation engine
- [ ] Step 4 — map + real route / road-condition validation
- [ ] Step 5 — deploy and test with real users
