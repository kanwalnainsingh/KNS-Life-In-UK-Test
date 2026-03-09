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
- React via CDN
- `src/data.js` for all facts, mnemonics, tabs, and question bank
- `src/app.jsx` for UI and state
- No build step

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
- Added grouped navigation for mobile and desktop.
- Added `Quick Revise` swipe-style flash-card mode.
- Added coverage checklist on home so users can see no major area is skipped.
- Added visual mnemonic packs like `LECB`, `BSLH`, and `DRIM`.
- Added `Mock Test`, `Revise`, and better mobile quick panel navigation.
- Added answer reveal settings for study modes:
  - show answers immediately
  - show at end
  - optionally include memory/context
- Added recent-history avoidance for quiz/mock/rapid-fire randomness to reduce repeated questions across sessions.
- Added community/participation facts and questions.

## Data model notes
- `ALL_QUIZ` is the main bank. Each entry should keep:
  - `q`
  - `opts`
  - `a`
  - `tip`
- `tip` is used for memory/context and sometimes category hints.
- `VISUAL_MNEMONICS` powers the home memory panel and quick revision mode.
- `CONFUSABLES` powers compare/trap views and also seeds some mock/rapid content.

## UX expectations
- Mobile users should be able to move between modes with minimal scrolling.
- Important actions should stay visible:
  - back
  - home
  - quick panel
  - bottom navigation
- Long pages should feel skimmable, not heavy.

## Testing
- Run:
```bash
node tests/smoke-check.js
```
- This validates:
  - quiz bank shape
  - mnemonic packs
  - tab presence
  - key UI hooks and mobile navigation markers

## Editing guidance
- Prefer adding to existing topic structures instead of inventing new scattered sections.
- Avoid duplicating facts already present unless the new version adds a clearer mnemonic or comparison value.
- If changing quiz/mock/rapid behavior, keep the modes distinct:
  - `Quiz` = flexible practice
  - `Mock` = closest to official test
  - `Rapid Fire` = speed pressure with bigger random pool
