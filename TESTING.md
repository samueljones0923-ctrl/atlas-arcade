# Atlas Arcade 2.0 verification

The source edition, generated `_site` directory, and generated
`standalone.html` were checked after the final changes.

## Static validation

- `node --check app.js` passes.
- `node --check build_public.mjs` passes.
- The stylesheet parses with no CSS parser errors.
- `manifest.webmanifest` parses as valid JSON.
- HTML IDs are unique.
- Every `<label for>` points to an existing control.
- All local script, stylesheet, icon, flag, and map assets required by the
  public build are present.
- Both public builders create the same runtime file set.
- The standalone builder completes successfully.

## Desktop behavior

- The home page fills 1440×900 and 1366×768 without an outer scrollbar.
- Active games stay one viewport high with the mission panel on the left.
- Correct guesses advance without a bordered or white feedback rectangle.
- Country hover does not disclose unrevealed answers.
- Mouse reticle position follows the pointer and disappears when the pointer
  leaves the map.
- Wheel zoom follows the pointer, button zoom reaches 24×, reset returns to
  1×, and dragging does not accidentally answer.
- Locate, Capitals, Flags, Map → Name, Mixed Mission, and Spell All each accept
  a correct answer and advance.

## Competitive behavior

- Answer controls are locked during the 3–2–1 countdown.
- The timer begins at GO rather than when the setup screen closes.
- A correct answer entered before GO is ignored.
- Hints and skips remain disabled.
- Two seconds are added per mistake.
- All six modes retain separate personal-best and leaderboard categories.
- Competitive uses all 197 country records and the current rules version.

## Progress

- Completing a round records the correct mode, score, accuracy, duration, and
  date.
- Progress renders six mode cards and a recent-games list.
- Exported progress uses the current progress-data version.
- Existing local progress from older versions migrates without being erased.

## Phone and accessibility behavior

- Portrait phone layout was checked at 390×844 with no document scrolling
  during active play.
- Short landscape layout was checked at 844×390.
- The mission drawer opens and closes, and typing modes expose their input.
- The mouse reticle stays hidden on coarse-pointer touch devices.
- Pinch zoom and one-finger drag remain available.
- Reduced-motion mode suppresses the countdown pop and transition motion.
- Keyboard zoom, fit, hint, skip, help, sound, and arrow-key pan controls work.
