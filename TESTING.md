# Final verification checklist

The polished release was checked with the multi-file build and the generated
`standalone.html` edition.

- JavaScript syntax passes `node --check app.js`.
- The manifest parses as valid JSON.
- The stylesheet parses successfully with PostCSS.
- The full-screen setup page fills 1440×900 and 1366×768 without an outer page
  scrollbar.
- Escape cannot dismiss the initial home into an empty game screen.
- Normal desktop and phone games remain one viewport high.
- Live answer feedback has no border or background rectangle.
- The map callout and last-country card remain hidden during live play.
- Locate accepts both wrong and correct map clicks and advances correctly.
- Competitive locks the standard 197-country rules while the primary
  button remains simply **Start Game**.
- Competitive is available for all six leaderboard categories.
- The optional timed ruleset is labeled consistently as **Competitive**.
- Flags use bundled sprite artwork rather than country abbreviations.
- The phone home uses a balanced two-column six-mode grid.
- The service-worker cache version was advanced for the release.
- `build_standalone.py` and `build_public.py` complete successfully.
