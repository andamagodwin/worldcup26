# MUNDIAL '26 ⚽

A World Cup 2026 companion app (Expo / React Native) built on the free
[worldcup26.ir](https://worldcup26.ir/api-docs) REST API.

## Features

- **Matches** — fixtures bucketed by day, auto-scrolls to today, `LIVE` minute
  badges, finished scores, and a live filter. Polls the API every 30s and
  supports pull-to-refresh.
- **Standings** — all 12 group tables with qualification colour-coding
  (green = top-2 advance, gold = 3rd-place playoff contention).
- **Bracket** — every knockout round R32 → Final. Undecided slots show the
  API's placeholder labels (e.g. _"Winner Match 86"_) until teams are drawn.
- **Teams** — all 48 nations grouped, follow teams with ★, tap through to a
  team page with its group stats and full fixture list.
- **Match detail** — scoreline, parsed goal scorers, venue, and stage.

## Architecture

- `lib/api.ts` — typed API client with retry/backoff (the public host is flaky).
- `lib/types.ts` — response shapes (the API serialises numbers as strings).
- `lib/format.ts` — date parsing, scorer parsing, live-state derivation.
- `store/store.ts` — Zustand store. The whole dataset (104 matches, 48 teams,
  12 groups, 16 stadiums) is small, so it's fetched once and filtered locally.
- `app/` — expo-router screens (`(tabs)` + `match/[id]` + `team/[id]`).

## Run

```bash
npm install
npm run ios      # or: npm run android
```

No API key required — all read endpoints are public.
