# 🇬🇧 Life in the UK Test Practice for ILR and Citizenship

A free, mobile-friendly study guide and practice app for the **Life in the UK test**, built for **British citizenship** and **Indefinite Leave to Remain (ILR)** preparation.

> 📖 263 quiz questions · 💡 Memory clues · ⚠️ Confusing topics together · 📅 Full timeline · 📝 Mock tests

Current release: `v1.10.2`

---

## 🌐 Live Site

[**→ Open the Study Guide**](https://kanwalnainsingh.github.io/KNS-Life-In-UK-Test/)

Official test info: https://www.gov.uk/life-in-the-uk-test

---

## 🎯 Who This Is For

- People preparing for the Life in the UK test for `ILR`
- People applying for `British citizenship / naturalisation`
- Learners who want quick revision, mock tests, and memory clues instead of reading dense notes

---

## 📸 Screenshots

<p align="center">
  <img src="screenshots/mobile-nav.png" width="30%" alt="Mobile home and revision hub" />
  &nbsp;
  <img src="screenshots/timeline.png" width="30%" alt="Timeline revision on mobile" />
  &nbsp;
  <img src="screenshots/figures.png" width="30%" alt="Key historical figures on mobile" />
</p>
<p align="center"><strong>Current mobile views</strong> — revision hub, history timeline, and the upgraded key historical figures page.</p>

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
| ↔️ Quick Revise | Short-session revision cards with answer, context, and memory clue |
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
| 📝 Mock Test | 30 fixed balanced mock papers with stronger review context |
| 🔥 Rapid Fire | Timed revision with broader randomisation and fewer repeats |
| ♻️ Revise Mistakes | Retry the questions you got wrong |

---

## 🧠 What’s New

- Better mobile navigation with bottom nav, quick panel, back controls, and less scrolling
- Stable `Story Mode` now uses dedicated chapter data instead of fragile runtime lookups
- More relevant grouped navigation with main actions first and topic subsections underneath
- `Quick Revise` flash cards for fast revision
- `Mock Test` and `Revise Mistakes` modes
- Answer reveal toggles for quiz and mock flows
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
- Timeline progress can be saved with a checkpoint so learners can jump back to the last remembered point
- Section pages now include more exam-anchor cards, memory clues, and compare points for faster revision
- Once the app has loaded online, the service worker can cache it for offline train revision

---

## 📚 Source

Based on **Life in the United Kingdom: A Guide for New Residents** and organised into faster revision formats with extra memory clues and comparisons.
