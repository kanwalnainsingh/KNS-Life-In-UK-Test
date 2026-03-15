# 🇬🇧 Life in the UK Test Practice for ILR and Citizenship

A free, mobile-friendly study guide and practice app for the **Life in the UK test**, built for **British citizenship** and **Indefinite Leave to Remain (ILR)** preparation.

> 📖 329 quiz questions · 💡 Memory clues · ⚠️ Common Mix-Ups · 📝 40 balanced mock papers · 📚 Story Mode + Quick Facts Course

Current release: `v1.23.3`

---

## 🌐 Live Site

[**→ Open the Live Study Guide for ILR and Citizenship Prep**](https://kanwalnainsingh.github.io/KNS-Life-In-UK-Test/)

Official test info: https://www.gov.uk/life-in-the-uk-test

UI stack:
- Tailwind CSS
- shadcn-style open-source UI primitives
- class-based dark mode with persisted preference
- learner-first mobile and desktop navigation
- local progress saving across refreshes and new releases

---

## 🎯 Who This Is For

- People preparing for the Life in the UK test for `ILR`
- People applying for `British citizenship / naturalisation`
- Learners who want quick revision, mock tests, and memory clues instead of reading dense notes

---

## 📸 Highlights

<p align="center">
  <img src="screenshots/mobile-menu.png" width="22%" alt="Study menu on mobile" />
  &nbsp;
</p>
<p align="center"><strong>Current mobile views</strong> — the study menu, exam-topic completion, quick-facts course flow, and saved mock progress.</p>

---

## 📱 How to Use

1. Open the app at the live link above.
2. Use the top menu on desktop or the bottom navigation / quick panel on mobile.
3. Best pass route:
   - `Story Mode` for history
   - `Quick Facts Course` for government, law, everyday life, and identity facts
   - `4 Nations`
   - `Common Mix-Ups`
   - `Mock Test`
4. Use `Exam Topics` when you want to revise by official-style exam area instead of by section name.
5. Use `Quick Revise` for fast facts and memory clues.
6. Use `Audio Mode` when you want hands-free revision while driving, walking, or doing chores.
7. Use `Quiz` if you want flexible practice with answer options:
   - show answers instantly
   - show answers at the end
   - include context and memory tips
8. Use `Mock Test` for the closest exam-style run.
9. Use page-specific mocks/tests inside sections like `Timeline`, `Key People`, `Wars`, `Landmarks`, and `Common Mix-Ups` when you want to finish one topic properly.
10. Use `Daily 10`, `Rapid Fire`, and `Dates Drill` for quick mobile revision.
11. Use `Revise Mistakes` to retry weak questions and clean up errors before another mock.

---

## ✨ Features

| Section | What it does |
|---|---|
| 🏠 Home | Pass guide, continue-learning strip, weakest-area guidance, mock progress |
| 🧭 Exam Topics | Course completion by official-style exam area with cleaner topic summaries, per-topic mocks, and learned/tested/reviewed progress |
| ↔️ Quick Revise | Fast revision cards with weak-facts focus, topic confidence, saved facts, and smarter “study this next” guidance |
| 🔊 Audio Mode | Hands-free spoken revision with full-course playlists, weak-area audio, chapter playlists, question drill, offline-friendly voice support, and a larger driving view |
| 📚 Story Mode | Chronological history course with dates, names, pass-first memory anchors, and chapter-end mini quizzes |
| 🔟 Daily 10 | Fresh 10-question practice set for quick phone sessions, with wrong-answer review at the end |
| ⚡ T/F Sprint | Very fast true/false mobile revision |
| 📄 Cram Sheet | One-page night-before summary |
| ✅ Tracker | Full-course completion tracker stored on device |
| 📅 Timeline | Cleaned history timeline with anchor dates, checkpoint saving, and a timeline-only mock |
| 🏴 4 Nations | Capitals, saints, symbols, legal-system differences, compare table, and section test |
| ⚠️ Common Mix-Ups | Mobile swipe compare cards, grouped confusion points, and mix-up-only testing |
| ⚡ Quick Facts Course | Guided civics/law/everyday-life course with grouped facts, per-group checks, and progress saving |
| 🏛️ Landmarks | Important places with memory clues, exam traps, and a page-specific section test |
| ⛪ Religion | Faith groups and major festivals |
| 💡 Inventors | British inventors and key discoveries, plus an inventor-only section test |
| 🏅 Sports | Sports stars and high-yield exam facts, plus a sports-only section test |
| 👑 Key People | Historic figures, grouped memory links, dates to remember, and a people-only mock |
| 🎭 Arts | Literature, music, art, architecture, fashion, and film |
| 🌍 World Orgs | Commonwealth, UN, NATO, Council of Europe, G7, plus a world-orgs section test |
| 🧠 Quiz | Practice mode with answer timing options and memory tips |
| 📝 Mock Test | 40 fixed balanced mock papers with saved per-paper scores, attempts, and next-paper guidance |
| 🔥 Rapid Fire | Timed revision with broader randomisation, fewer repeats, and a reset option when you want a fully fresh run |
| ♻️ Revise Mistakes | Retry the questions you got wrong |

---

## 🧠 Current Highlights

- Official-scope cleanup and topic rebalance for the current test
- Metadata-driven question mapping, so section tests and exam-topic mocks use the right pools
- `Exam Topics` course with topic mocks and learned / tested / reviewed progress
- Cleaner `Exam Topics` summaries with metadata-backed question pools and topic-specific coverage notes
- `Quick Facts Course` for civics, law, identity, and everyday-life revision
- `Audio Mode` for hands-free driving or walking revision with built-in browser speech
- `Driving view` inside Audio Mode for larger controls and a simpler now-playing screen
- `Question drill` and Story chapter playlists inside Audio Mode for more focused listening
- `Weak areas audio` from saved mistakes and hard facts, plus lock-screen / headset playback controls
- `Quick Revise` now surfaces weak facts, topic confidence, and a stronger next-step suggestion
- `Story Mode` now ends chapters with mini quizzes tied to the chapter you just studied
- `Common Mix-Ups` redesigned for cleaner mobile comparison revision
- Page-specific tests across the major sections, plus stronger pass-first route panels on Religion, Sports, Landmarks, and Inventors
- Mock history, saved progress, bookmarks, wrong-answer review, and local persistence across updates

---

## ✅ Why This Is Useful

- It covers the full course without forcing you to read the handbook straight through.
- It gives multiple ways to revise:
  - learn by story
  - learn by exam topic
  - revise by fact cards
  - test by section
  - sit full mocks
- It keeps memory clues and compare points close to the facts so revision is faster on mobile.

---

## 🛠️ Run Locally

```bash
npm install
npm test
npm run build
npm run test:browser
```

GitHub Pages is deployed from `main` using the checked-in `docs/` build output and the GitHub Actions workflow.

---

## 📁 Project Structure

| Path | Purpose |
|---|---|
| `src/data.js` | Facts, timeline, figures, compare cards, question bank, and topic metadata |
| `src/app.jsx` | Main application UI and state |
| `src/components/ui` | Reusable Tailwind / shadcn-style primitives |
| `src/components/reference-tabs.jsx` | Lower-priority reference sections |
| `src/components/figures-tab.jsx` | Key Historical Figures page |
| `scripts/build.mjs` | Static build into `docs/` |
| `tests/` | Smoke, regression, coverage, mock-balance, and browser checks |
| `docs/` | GitHub Pages build output |

---

## 🧪 Test Commands

```bash
npm test
npm run build
npm run test:browser
```

Notes:
- `npm run test:browser` should be run after `npm run build`
- the browser smoke test reads the built `docs/index.html`

---

## 📌 Notes

- This app is designed for **revision and practice**, not as an official source itself.
- For current official test rules and booking details, always check GOV.UK:
  https://www.gov.uk/life-in-the-uk-test
