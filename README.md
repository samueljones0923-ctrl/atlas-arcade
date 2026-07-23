# Atlas Arcade

![Atlas Arcade preview](assets/social-preview.png)

Atlas Arcade is a full-screen world-geography game built as a plain static
website. It keeps the classic layout: the mission, score, hints, and feedback
stay on the left while the interactive map stays on the right. On phones, the
same panel becomes a slide-out drawer over a full-screen map.

The game has no framework or package dependencies. It can run as a normal
website, an installable phone app, or the included single-file offline edition.
Local progress works immediately. Supabase is optional and adds shared
fastest-time boards plus cross-device accounts.

## Six game modes

- **Locate** — see a country name and click it on the map.
- **Capitals** — see a capital and locate its country.
- **Flags** — identify bundled flag artwork and locate the country.
- **Map → Name** — type the highlighted country's name.
- **Mixed Mission** — rotate through names, capitals, flags, and map shapes.
- **Spell All** — name all 197 countries in any order.

Every mode supports normal practice and an optional **Competitive** setting.
Competitive uses the complete 197-country set, disables hints and skips,
starts with a clear countdown, and adds two seconds per mistake. Each mode has
its own independent fastest-time category.

## What was polished in this edition

- Full-viewport home and gameplay screens with no page scrolling during rounds
- Fixed desktop mission panel and full-screen mobile map drawer
- Precise crosshair cursor for mouse players without a bordered answer box
- Zoom toward the cursor, smooth dragging, pinch zoom, keyboard panning, and
  zoom up to 24×
- A balanced country queue that avoids long runs from the same part of the
  world
- Faster correct-answer transitions and quiet feedback in the left panel
- Competitive 3–2–1 countdown so timing begins consistently
- Per-mode progress cards, recent games, personal bests, and exportable data
- Real locally bundled flag artwork rather than emoji or abbreviations
- Install prompt, offline cache updates, touch-safe controls, and reduced-motion
  handling
- Cloudflare Pages and GitHub Pages deployment support

## Run it locally

Open `standalone.html` for the quickest offline test.

For the complete installable edition, serve the folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish it free

The recommended route is Cloudflare Pages connected to the existing GitHub
repository. Use these build values:

```text
Framework preset: None
Build command: node build_public.mjs
Build output directory: _site
Production branch: main
```

Follow [`CLOUDFLARE-PAGES-GUIDE.md`](CLOUDFLARE-PAGES-GUIDE.md) one step at a
time. GitHub Pages remains supported through the included workflow and the
broader [`PUBLISHING-GUIDE.md`](PUBLISHING-GUIDE.md).

## Online configuration

`config.js` starts with online services disabled:

```js
window.ATLAS_CONFIG = Object.freeze({
  supabaseUrl: '',
  supabasePublishableKey: '',
  leaderboardEnabled: false,
  accountsEnabled: false,
  siteUrl: ''
});
```

| Leaderboard | Accounts | Result |
|---|---|---|
| `false` | `false` | Local best times and browser-only progress |
| `true` | `false` | Shared fastest times with guest identities |
| `false` | `true` | Accounts/cloud progress with local times |
| `true` | `true` | Shared times plus cross-device accounts |

Only a Supabase **publishable** key belongs in this browser file. Never add a
secret key, `service_role` key, database password, SMTP password, or private
GitHub token.

## Build generated editions

Build the exact static deployment directory with Node:

```bash
node build_public.mjs
```

A Python equivalent remains available:

```bash
python build_public.py
```

Rebuild the portable single-file edition after source changes:

```bash
python build_standalone.py
```

## Project structure

```text
atlas-arcade/
├── .github/workflows/deploy-pages.yml  GitHub Pages deployment
├── assets/                             Icons, preview, and local flag atlas
├── supabase/schema.sql                 Leaderboard/account database schema
├── index.html                          Application markup
├── styles.css                          Responsive visual design
├── app.js                              Game, map, progress, auth, and times
├── data.js                             Bundled geography and map data
├── config.js                           Public online-service settings
├── service-worker.js                   Offline application cache
├── manifest.webmanifest                Installable-app metadata
├── build_public.mjs                    Cloudflare/static deployment builder
├── build_public.py                     Python deployment builder
├── build_standalone.py                 Single-file builder
└── standalone.html                     Portable offline edition
```

## Controls

Click or tap a country to answer. Drag to pan. Use the mouse wheel, map buttons,
or a two-finger pinch to zoom up to 24×.

- `H` — hint in normal rounds
- `S` — skip in normal rounds
- `+` / `-` — zoom
- Arrow keys — pan the map
- `0` — fit the current scope
- `M` — sound
- `?` — help

## Data and licensing

The original site code is MIT licensed. The generalized map geometry is based
on public-domain Natural Earth data. The bundled flag atlas is derived from
Google Noto Color Emoji flag artwork and is packaged locally. See
[`ATTRIBUTION.md`](ATTRIBUTION.md) and [`PRIVACY.md`](PRIVACY.md).

## Competitive integrity

The optional SQL schema validates the mode, rules version, completion count,
raw time, mistake count, player name, and identity; calculates official time in
the database; and keeps one fastest result per identity and mode. It is suitable
for a friendly public game.

A static browser game is not a tamper-proof tournament platform. Cash prizes or
formal record certification would require trusted server-side sessions and
answer-event validation.
