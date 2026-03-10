# Life in the UK App Notes

## Purpose
This project is a static React study app for the UK "Life in the UK" test.
It is designed to help learners revise quickly on mobile and desktop with:
- topic browsing
- comparison cards for confusable facts
- quick-revision flash cards
- quiz, mock, rapid fire, and mistake revision flows
- memory clues and exam traps

## Stack
- Plain `index.html`
- Local bundled React app with `esbuild`
- Tailwind CSS with a custom PostCSS build step into `docs/assets`
- shadcn-style open-source UI primitives under `src/components/ui`
- `src/data.js` for all facts, mnemonics, tabs, and question bank
- `src/app.jsx` for UI and state
- `src/main.jsx` as bundle entry
- `scripts/build.mjs` writes the GitHub Pages build to `docs/`
- `service-worker.js` provides offline support after first online load

## Core product direction
- Keep the app mobile-first and low-friction.
- Favour memory cues, comparisons, and short-answer recall over dense prose.
- Keep official-test style facts central.
- Preserve broad topic coverage:
  - history
  - government and Parliament
  - law, rights, and values
  - geography, countries, and landmarks
  - religion and festivals
  - people, arts, sport, and symbols
  - international organisations
  - community and participation

## Recent major changes
- Added `MIGRATION_NOTES.md` to document the safe UI migration plan.
- Added Tailwind CSS and shadcn-style primitives while preserving the single-app quiz/mock logic.
- Switched theme initialization to class-based dark mode with system preference fallback.
- Migrated shared primitives such as cards, badges, footer actions, the quick-panel sheet, and question cards toward the new styling system.
- Added grouped navigation for mobile and desktop.
- Simplified mobile navigation by removing the extra mobile primary strip and relying on header menu + bottom nav + quick panel.
- Added `Quick Revise` short-session card mode.
- Added stable `Story Mode` chapters sourced from `src/data.js`.
- Rewrote `Story Mode` into a cleaner chronological history-to-modern-Britain course with stronger date anchors.
- Added visible app release versioning sourced from `package.json`.
- Added `↻ Check Update` refresh action to help mobile users pull the newest deployed version.
- Added timeline checkpoint saving so learners can jump back to the point they last remembered.
- Expanded fixed mock papers from 20 to 30 and added more handbook-style civics/everyday-life questions.
- Added more revision-anchor cards across sports, arts, symbols, religion, landmarks, world organisations, figures, and quick facts.
- Expanded `CONFUSABLES` with emergency-number, voting-rights, and Highers vs A-levels compare cards.
- Added coverage checklist on home so users can see no major area is skipped.
- Added visual mnemonic packs like `LECB`, `BSLH`, and `DRIM`.
- Added `Mock Test`, `Revise`, and better mobile quick panel navigation.
- Added answer reveal settings for study modes:
  - show answers immediately
  - show at end
  - optionally include memory/context
- Added recent-history avoidance for quiz/mock/rapid-fire randomness to reduce repeated questions across sessions.
- Added safe per-question answer shuffling across quiz, mock, rapid-fire, sprint, and mistake-revision flows to avoid repeated `B/C` answer-position bias.
- Reworked fixed mock generation so the full 40-paper series spreads questions more evenly across the course instead of over-reusing the same subset.
- Added community/participation facts and questions.
- Expanded `Key Historical Figures` with more tested names, memory hooks, and grouped revision cues.
- Expanded `Key People` again with fuller exam-focused facts, especially Henry VIII, plus extra civics/culture coverage like Jacobites, coalition government, civil servants, school governors, Tate galleries, Turner Prize, and rugby origin.
- Redesigned `Quick Revise` into a session-first mode with short runs, focus presets, saved session continuity, and `Hard / Okay / Easy` feedback.
- Simplified the visible `Quick Revise` UI so the card answer, context, and memory clue show immediately while recent-history tracking stays in the background.
- Added a pass-focused learner layer on `Home` with start routes, saved pass plans, readiness cues, and next-best-action guidance.
- Added bookmarks for quick-revision cards and question flows, plus a `Saved facts` quick-revision focus.
- Mock results now point learners to the weakest area and the most useful next revision step.
- `Daily 10` now keeps wrong answers for end-of-session review with correct answer, context, and memory tip.
- Added focused follow-up actions on the heavier topic pages so `Story Mode`, `Religion`, `Landmarks`, `Inventors`, and `Sports` can jump straight into topic-specific quick revision.
- Added a browser smoke test with `puppeteer-core` to validate core flows after build.
- Extracted the lighter reference tabs into `src/components/reference-tabs.jsx` so `Religion`, `Sports`, `Landmarks`, and `Inventors` can evolve without making `src/app.jsx` even larger.
- Reordered those lighter reference pages to put `must know first` anchors before the longer supporting lists.
- Added a broader visual polish pass across the shared theme, Home, Quick Revision, Quiz, and Mock screens to reduce clutter and improve mobile-first readability.
- Extended that visual polish to `Story Mode`, `Timeline`, `4 Nations`, and `Key Historical Figures` so the core study pages now share the calmer card hierarchy and lighter light/dark surfaces.
- Improved the desktop topics drawer and mobile bottom navigation / study menu so the main learner actions are easier to scan and the grouped topic browsing feels lighter.
- Added hash-based tab deep links like `#home`, `#timeline`, and `#figures` for easier navigation and screenshot capture.
- Added fingerprinted build assets for GitHub Pages so releases update more reliably on mobile.
- Added direct `Boxing Day` quiz coverage to close the last festival audit gap.

## Data model notes
- `ALL_QUIZ` is the main bank. Each entry should keep:
  - `q`
  - `opts`
  - `a`
  - `tip`
- `tip` is used for memory/context and sometimes category hints.
- `VISUAL_MNEMONICS` powers the home memory panel and quick revision mode.
- `STORY_CHAPTERS` is the stable source for story-mode content.
- `KEY_FIGURES`, `EXTRA_KEY_FIGURES`, and `FIGURE_MEMORY` together power the people page.
- `CONFUSABLES` powers compare/trap views and also seeds some mock/rapid content.
- `ALL_QUIZ` is protected by regression checks for duplicate questions, and mock balance tests also validate answer-position spread.

## UX expectations
- Mobile users should be able to move between modes with minimal scrolling.
- Important actions should stay visible:
  - back
  - quick panel
  - bottom navigation
- On mobile, the bottom nav is the learner-flow bar:
  - `Home`
  - `Revise`
  - `Quiz`
  - `Mock`
  - `Menu`
- Long pages should feel skimmable, not heavy.

## Testing
- Run:
```bash
node tests/smoke-check.cjs
node tests/coverage-audit.cjs
npm test
npm run build
npm run test:browser
```
- This validates:
  - quiz bank shape
  - story chapter structure
  - mnemonic packs
  - tab presence
  - key UI hooks and mobile navigation markers
  - fact/question coverage alignment
  - production bundle output
  - core browser flows after the built site is served locally

## Editing guidance
- Prefer adding to existing topic structures instead of inventing new scattered sections.
- Avoid duplicating facts already present unless the new version adds a clearer mnemonic or comparison value.
- For any user-visible release, bump `package.json` so the app version updates everywhere.
- If changing quiz/mock/rapid behavior, keep the modes distinct:
  - `Quiz` = flexible practice
  - `Mock` = closest to official test
  - `Rapid Fire` = speed pressure with bigger random pool
