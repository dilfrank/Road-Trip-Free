# Road Trip Free

Road Trip Free helps budget-conscious road travelers quickly generate season-aware road trip plans with routes, attractions, driving time, and rest stops.

## MVP positioning

Instead of asking users to browse destination photos first, Road Trip Free starts with:

- departure city
- travel month
- number of days
- maximum driving time per day
- budget preference

It then recommends several road-trip options that fit those constraints.

## Four-week scope

### Included

- California-first MVP
- road-trip-only planning
- 2–3 recommended route options
- seasonal fit
- daily driving time
- attractions/stops
- rest planning

### Explicitly excluded for now

- social posting
- photo check-in feeds
- flights or trains
- hotel/flight booking
- ticket sales
- generic travel community features

## Current prototype

The current homepage demonstrates the main product flow with mock California route data. The next implementation step is to replace the demo route list with a small structured destination dataset and a rule-based recommendation engine.

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
