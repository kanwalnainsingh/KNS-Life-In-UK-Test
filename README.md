# 🇬🇧 Life in the UK — Complete Study Guide

A free, open-source study guide for the **Life in the UK citizenship test** (3rd Edition).

> 📖 100+ quiz questions · 💡 Memory hooks on every fact · 📅 Full timeline · ⚠️ Don't-confuse section

---

## 🌐 Live Site

[Life In UK Guide](https://kanwalnainsingh.github.io/KNS-Life-In-UK-Test/)

---

## ✨ Features

| Tab | What's in it |
|---|---|
| 🏠 Home | Test info, tips, jump links |
| 📅 Timeline | All events 10,000 BC → 2020, filterable by era |
| 🏴 4 Nations | England, Scotland, Wales, N. Ireland — all details |
| ⚠️ Don't Confuse | 8 most-confused topic pairs |
| 💡 Inventors | 24 inventors with categories + memory hooks |
| 🏅 Sports Stars | 22 athletes with achievements |
| 👑 Key People | 21 historical figures |
| ⛪ Religion | 2011 Census stats + 16 festivals |
| 🏛️ Landmarks | 20 places with exam traps |
| 🌍 World Orgs | Commonwealth, UN, NATO, Council of Europe |
| 🎭 Arts & Culture | Literature, Music, Art, Architecture, Fashion, Film |
| 🎵 Anthem & Symbols | National anthem, Union Jack, population history |
| ⚡ Quick Facts | Government, Law, Everyday Life, Currency |
| 🧠 QUIZ ME | 100+ randomised questions with tips |

---

## 🚀 How to Host on GitHub Pages (5 minutes)

### Step 1 — Upload to GitHub
1. Create a new **public** repository on GitHub
2. Upload all these files maintaining the folder structure:
   ```
   index.html
   src/
     data.js
     app.jsx
   README.md
   .nojekyll
   ```

### Step 2 — Enable GitHub Pages
1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose **main** branch, **/ (root)** folder
4. Click **Save**
5. Wait ~1 minute, then visit your live URL

✅ No build step needed. No Node.js. No npm. Pure HTML + CDN React.

---

## ✏️ How to Maintain & Update Facts

The app is split into two files intentionally:

### To add or edit a fact → `src/data.js`

Each section is clearly labelled. For example, to add a timeline event:
```javascript
// In TIMELINE array, add:
{ year:"1945", era:"Modern", event:"Your new event here", icon:"🕊️", color:"#065f46",
  memory:"Memory hook to help remember this." },
```

To add a quiz question:
```javascript
// In ALL_QUIZ array, add:
{ q:"Your question?", opts:["Option A","Option B","Option C","Option D"], a:1,
  tip:"Memory tip shown after answering." },
// a: is the INDEX (0-3) of the correct answer
```

### To change the UI → `src/app.jsx`

Each tab has its own function (e.g., `TimelineTab`, `QuizTab`). Edit independently.

### All categories in `src/data.js`:
| Variable | Tab |
|---|---|
| `TIMELINE` | Timeline tab |
| `NATIONS` | 4 Nations tab |
| `CONFUSABLES` | Don't Confuse tab |
| `INVENTORS` | Inventors tab |
| `SPORTS_STARS` | Sports Stars tab |
| `KEY_FIGURES` | Key People tab |
| `RELIGIONS` / `FESTIVALS` | Religion tab |
| `LANDMARKS` | Landmarks tab |
| `INT_ORGS` | World Orgs tab |
| `ARTS` | Arts & Culture tab |
| `QUICK_FACTS` | Quick Facts tab |
| `ALL_QUIZ` | Quiz tab |
| `POPULATION_HISTORY` | Anthem & Symbols tab |
| `ANTHEM` | Anthem & Symbols tab |

---

## 📚 Source

All facts are based on **Life in the United Kingdom: A Guide for New Residents (3rd Edition)**, published by TSO. That is the only official source for the test.

---

## 🔓 License

Open source — share freely. Help others pass their test!

---

## 🤝 Contributing

Pull requests welcome! If you find an error or want to add more quiz questions:
1. Fork the repo
2. Edit `src/data.js`
3. Submit a pull request
