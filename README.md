# 🇬🇧 Life in the UK Test Practice for ILR and Citizenship

A free, mobile-friendly study guide and practice app for the **Life in the UK test**, built for **British citizenship** and **Indefinite Leave to Remain (ILR)** preparation.

> 📖 310 quiz questions · 💡 Memory clues · ⚠️ Confusing topics together · 📅 Full timeline · 📝 Mock tests with saved progress

Current release: `v1.11.5`

---

## 🌐 Live Site

[**→ Open the Live Study Guide for ILR and Citizenship Prep**](https://kanwalnainsingh.github.io/KNS-Life-In-UK-Test/)

Official test info: https://www.gov.uk/life-in-the-uk-test

---

## 🎯 Who This Is For

- People preparing for the Life in the UK test for `ILR`
- People applying for `British citizenship / naturalisation`
- Learners who want quick revision, mock tests, and memory clues instead of reading dense notes

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/mobile-nav.png" width="22%" alt="Mobile home and revision hub" />
  &nbsp;
  <img src="screenshots/timeline.png" width="22%" alt="Timeline revision on mobile" />
  &nbsp;
  <img src="screenshots/figures.png" width="22%" alt="Key historical figures on mobile" />
  &nbsp;
  <img src="screenshots/mock-progress.png" width="22%" alt="Mock paper tracker with saved scores" />
</p>
<p align="center"><strong>Current mobile views</strong> — revision hub, history timeline, key figures, and the saved mock-paper tracker.</p>

---

## 📱 How to Use

1. Open the app at the live link above.
2. Use the top menu on desktop or the bottom navigation / quick panel on mobile.
3. Start with `Quick Revise` for fast facts and memory clues.
4. Use `Quiz` if you want normal practice with answer options:
   - show answers instantly
   - show answers at the end
   - include context and memory tips
5. Use `Mock Test` for a more exam-style run.
6. Use `Rapid Fire` for faster timed recall.
7. Use `Revise Mistakes` to retry weak questions.

---

## ✨ Features

| Section | What it does |
|---|---|
| 🏠 Home | Revision hub, coverage checklist, quick jump links, memory visuals |
| ↔️ Quick Revise | Short-session revision cards with `Pass Core`, `Common Traps`, and `Full Course` modes |
| 📚 Story Mode | Small handbook-style chapters for quick sequential revision |
| 🔟 Daily 10 | Fresh 10-question practice set for quick phone sessions |
| ⚡ T/F Sprint | Very fast true/false mobile revision |
| 📄 Cram Sheet | One-page night-before summary |
| ✅ Tracker | Full-course completion tracker stored on device |
| 📅 Timeline | Full history timeline with search, era filters, and anchor dates |
| 🏴 4 Nations | Capitals, saints, symbols, languages, parliaments, and common traps |
| ⚠️ Confusing Topics | Side-by-side comparisons for the facts people mix up most |
| ⚡ Quick Facts | Government, law, values, daily life, citizenship basics |
| 🏛️ Landmarks | Important places with memory clues and exam traps |
| ⛪ Religion | Faith groups and major festivals |
| 💡 Inventors | British inventors and key discoveries |
| 🏅 Sports | Sports stars and high-yield exam facts |
| 👑 Key People | Historic figures, grouped memory links, and revision cues |
| 🎭 Arts | Literature, music, art, architecture, fashion, and film |
| 🌍 World Orgs | Commonwealth, UN, NATO, Council of Europe, G7 |
| 🧠 Quiz | Practice mode with answer timing options and memory tips |
| 📝 Mock Test | 40 fixed balanced mock papers with saved per-paper scores, attempts, and next-paper guidance |
| 🔥 Rapid Fire | Timed revision with broader randomisation and fewer repeats |
| ♻️ Revise Mistakes | Retry the questions you got wrong |

---

## 🧠 What’s New

- Better mobile navigation with bottom nav, quick panel, back controls, and less scrolling
- Stable `Story Mode` now uses dedicated chapter data instead of fragile runtime lookups
- More relevant grouped navigation with main actions first and topic subsections underneath
- `Quick Revise` now has `Pass Core`, `Common Traps`, and `Full Course` session modes
- `Mock Test` and `Revise Mistakes` modes
- Answer reveal toggles for quiz and mock flows
- Mock paper history is now saved per paper with best score, attempts, and last score kept in local storage across app updates
- Visual mnemonic packs like `LECB`, `BSLH`, and `DRIM`
- Expanded `Key Historical Figures` with extra tested people, direct memory hooks, and comparison groups
- Improved timeline with extra high-yield history anchors:
  - Boudicca
  - St Augustine
  - Athelstan
  - Henry VIII and Wales
  - first Union Flag
  - Beveridge Report
  - Elizabeth II coronation
- Dedicated `Wars & Battles` section with battle cards, compare traps, and WWII anchors
- Added direct quiz coverage for `Boxing Day`, closing the last festival audit gap
- Added boundary-topic coverage for:
  - `British Isles`
  - `Republic of Ireland`
  - `Crown Dependencies`
  - `Channel Islands`
  - `British Overseas Territories`
- Added more direct high-yield question coverage for:
  - Welsh and Scottish Gaelic language facts
  - Holyrood and Stormont
  - EU citizens and local-election voting
  - census facts used across religion and society questions
- Added more high-yield civics and everyday-life coverage across revision, mocks, and rapid modes:
  - Model Parliament
  - Cabinet ministers
  - life peers and hereditary peers
  - Police and Crime Commissioners
  - jury-service eligibility
  - National Lottery age
  - blood donation timing
  - National Trust as a charity
  - post-war decolonisation / Empire winds down
- Added the missing official-scope `citizenship / settlement` context with stable GOV.UK-style facts and questions:
  - why people take the Life in the UK Test
  - language + life in the UK as the two-part knowledge requirement
  - English, Welsh, or Scottish Gaelic as accepted languages for that requirement
  - age-based exemptions and long-term-condition exemptions
- Added more compare-heavy exam coverage for underrepresented traps and modern facts:
  - `National Insurance` vs `council tax`
  - `Industrial Revolution` vs `Glorious Revolution`
  - `Police and Crime Commissioner` vs `local councillor`
  - `Beveridge Report` vs `Butler Act`
  - `criminal courts` vs `civil courts`
  - `Cenotaph = empty tomb`
  - `Maiden Castle = Dorset`
- Strengthened the `4 Nations` section with cross-nation system facts:
  - England and Wales share one legal system
  - Scotland and Northern Ireland have separate legal systems
  - Scotland uses `Highers`
  - Northern Ireland requires photo ID at polling stations
  - nation-specific court, church, and devolution compare points
- Expanded `Speaker of the House of Commons` coverage across the app:
  - how the Speaker is chosen
  - the Speaker's role in Commons debates
  - political neutrality
  - the fact that the Speaker still remains an MP
- Rebalanced the fixed mock papers to a more exam-like spread:
  - `7` history
  - `7` government and law
  - `5` 4 nations and places
  - `4` people and culture
  - `1` compare trap
- Increased fixed papers from `30` to `40`
- Added a dedicated mock-balance regression test so every paper stays at `24` questions with the intended coverage split
- Offline cache support after first online load
- Local bundled build setup for GitHub Pages with fingerprinted assets in `docs/`

---

## 🛠️ Project Files

- `index.html` — page shell and shared CSS
- `docs/` — GitHub Pages build output
- `service-worker.js` — offline cache support
- `src/app.jsx` — React UI and study modes
- `src/main.jsx` — bundled app entry point
- `src/data.js` — facts, mnemonics, categories, and question bank
- `scripts/build.mjs` — static build for GitHub Pages
- `tests/smoke-check.cjs` — structure/content checks
- `tests/coverage-audit.cjs` — fact/question coverage audit
- `tests/regression-check.cjs` — duplicate-question and key-content regression checks
- `AGENTS.md` — notes for future contributors and coding agents

---

## ▶️ Run Locally

```bash
npm install
npm run build
python3 -m http.server 4173 -d docs
```

Then open `http://localhost:4173`

For GitHub Pages:
- build output is written to `docs/`
- the repo now includes `.github/workflows/pages.yml` for automatic Pages deployment on every push to `main`
- in GitHub repo settings, set Pages source to `GitHub Actions`

---

## 🚀 Release Versioning

- The visible app release version comes from `package.json`
- Bump `package.json` for each user-facing release
- The current version is shown in the app footer and on the home screen
- Users can tap `↻ Latest` in the footer to force-refresh cached mobile pages
- Saved mock paper progress uses local storage, so attempts and scores stay available after new versions are deployed
- Timeline progress can be saved with a checkpoint so learners can jump back to the last remembered point
- Section pages now include more exam-anchor cards, memory clues, and compare points for faster revision
- Once the app has loaded online, the service worker can cache it for offline train revision

---

## 📚 Source

Based on **Life in the United Kingdom: A Guide for New Residents** and organised into faster revision formats with extra memory clues and comparisons.
