# Road Trip Free — Recommendation Engine v0.1

This document describes the first rule-based recommendation engine used by the four-week MVP.

## Goal

The engine answers a narrow question:

> Given the user's departure area, month, trip length, daily driving limit, and budget preference, which California road trips are the best fit right now?

It does **not** attempt to rank the most popular destinations.

## Current input

- origin (Step 3 supports San Jose / South Bay)
- travel month
- trip length: 2–5 days
- maximum driving time per day: 3–6 hours
- budget preference: 省钱 / 普通 / 舒适

## Candidate dataset

The first dataset contains 12 California route candidates. Each candidate records:

- best months
- acceptable months
- caution months
- recommended trip length
- approximate total driving time
- cost tier
- route experience score
- ordered driving legs
- stops and rest suggestions

The dataset is intentionally small and inspectable. This makes it possible to debug why a route was recommended before adding AI or external APIs.

## Score (0–100)

| Dimension | Weight |
| --- | ---: |
| Season fit | 35 |
| Driving fit | 25 |
| Trip-length fit | 20 |
| Budget fit | 10 |
| Route experience | 10 |

### Season fit

- best month: 35
- acceptable month: 26
- otherwise: 14
- caution month: subtract 8 from the season component

A caution month does not automatically remove a destination. The UI displays a warning instead.

### Driving fit

The engine first adapts the route into the requested number of days, then measures the longest estimated driving day.

- within the user's daily limit: 25
- over the limit: score decreases as the overage increases

### Trip-length fit

- within candidate's recommended day range: 20
- one day outside: 12
- more than one day outside: 4

### Budget fit

Routes use a simple three-level cost tier. A route at or below the user's selected tier gets the full 10 points; more expensive routes are penalized.

### Route experience

A curated 0–10 score represents how strong the overall road-trip experience is for this MVP dataset.

## Itinerary adaptation

Candidate routes are stored as ordered driving legs. The engine combines legs when a trip is short and inserts low-driving slow days when a trip is longer than the base route.

This is a planning heuristic, not a navigation engine.

## Safety / accuracy boundary

The Step 3 engine contains seasonal heuristics but **does not use real-time road closures, weather, wildfire, chain-control, or park-status data**. Mountain routes therefore show caution messages in higher-risk months.

Before this product is used for real travel decisions, a later step must validate recommendations against live road and weather sources.

## Next version

Step 4 should add:

1. map rendering and route geometry
2. real driving-time calculation
3. current road closure / chain-control checks
4. current weather checks
5. route-detail view
