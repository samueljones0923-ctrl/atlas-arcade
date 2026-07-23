# Atlas Arcade 2.0 — Classic feel, deeper polish

This edition deliberately keeps the layout and tone of the Classic release.
The work is concentrated in responsiveness, map precision, timing, progress,
and deployment rather than replacing the interface with a different product.

## Game feel

- Added a precise cyan crosshair for mouse players. It has no white card,
  bordered rectangle, tooltip, or answer label attached to it.
- Zoom now follows the mouse position instead of pulling toward the map center.
- Added smooth inertial panning, arrow-key panning, safe double-click zoom, and
  a visible zoom readout up to 24×.
- Shortened the pause after correct casual answers while retaining enough time
  to register the solved country.
- Interleaved world regions in guided rounds so the sequence feels varied.
- Kept country names hidden from hover labels and map accessibility labels
  while an answer is unrevealed.

## Competitive

- Kept Competitive optional and visually secondary to ordinary play.
- Added a 3–2–1–GO countdown; the timer and answer input remain locked until GO.
- Added the current mode's personal best to the in-game Competitive badge.
- Preserved independent fastest-time categories for all six modes.
- Advanced the Competitive rules version so old results cannot mix with the
  new timing behavior.

## Progress and devices

- Added per-mode games, accuracy, best streak, best score, and completion data.
- Added a recent-games history in the Progress screen.
- Improved phone touch targets, drawer behavior, and touch-safe map feedback.
- Added a browser install button where supported.
- Improved service-worker updates so a fresh release replaces stale runtime
  files more reliably.
- Added reduced-motion fallbacks for the new effects.

## Publishing

- Added a zero-dependency Node deployment builder for Cloudflare Pages.
- Added Cloudflare `_headers` for safer defaults and sensible cache behavior.
- Added a focused Cloudflare Pages guide using the existing GitHub repository.
- Kept GitHub Pages, standalone HTML, offline PWA, Supabase leaderboards, and
  optional accounts fully supported.
