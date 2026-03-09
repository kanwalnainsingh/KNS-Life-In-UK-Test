/* =============================================================
   app.jsx — React UI for Life in the UK Study Guide
   Edit data.js to change content. Edit this file for UI changes.
   ============================================================= */

const { useState, useRef } = React;

// ── HELPERS ──────────────────────────────────────────────────
const Badge = ({ text, color = "#3b82f6" }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, fontFamily: "monospace" }}>{text}</span>
);
const Card = ({ children, style = {} }) => (
  <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 12, padding: 16, marginBottom: 12, ...style }}>{children}</div>
);
const SectionTitle = ({ children, icon }) => (
  <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-strong)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
    {icon && <span>{icon}</span>}{children}
  </h2>
);
const MemoryHook = ({ text }) => (
  <div style={{ background: "#1a2a1a", border: "1px solid #166534", borderRadius: 8, padding: "8px 12px", marginTop: 8, fontSize: 13, color: "#86efac" }}>
    <span style={{ color: "#4ade80", fontWeight: 700 }}>💡 Memory: </span>{text}
  </div>
);
const TrapAlert = ({ text }) => (
  <div style={{ background: "#2a1a1a", border: "1px solid #991b1b", borderRadius: 8, padding: "8px 12px", marginTop: 6, fontSize: 13, color: "#fca5a5" }}>
    <span style={{ color: "#f87171", fontWeight: 700 }}>🚨 Exam trap: </span>{text}
  </div>
);

// ── TAB BAR ──────────────────────────────────────────────────
const TabBar = ({ active, setActive, menuOpen, setMenuOpen, isDark, toggleDark }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid var(--card-border)", background: "var(--header-bg)", position: "sticky", top: 0, zIndex: 100 }}>
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-strong)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>☰</button>
      <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 16 }}>🇬🇧 Life in the UK</span>
      <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
        <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener"
          style={{ color: "var(--text-muted)", fontSize: 12, textDecoration: "none", padding: "5px 8px", borderRadius: 6, border: "1px solid var(--card-border)", background: "var(--card-bg)", whiteSpace: "nowrap" }}>
          ⭐ GitHub
        </a>
        <button onClick={toggleDark} title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-strong)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 15 }}>
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
    <div className="tab-strip-wrap">
      <div className="noscroll" style={{ display: "flex", overflowX: "auto", background: "var(--header-bg)", borderBottom: "2px solid var(--card-border)", padding: "0 8px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setActive(t.id); setMenuOpen(false); }}
            style={{ flexShrink: 0, padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: active === t.id ? 700 : 400,
              color: active === t.id ? "#60a5fa" : "var(--text-muted)", borderBottom: active === t.id ? "2px solid #60a5fa" : "2px solid transparent",
              transition: "all 0.15s", whiteSpace: "nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
    </div>
    {menuOpen && (
      <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 200 }} onClick={() => setMenuOpen(false)}>
        <div style={{ background: "var(--card-bg)", width: 280, height: "100%", overflowY: "auto", padding: 16 }} onClick={e => e.stopPropagation()}>
          <div style={{ color: "#60a5fa", fontWeight: 700, marginBottom: 16, fontSize: 18 }}>🇬🇧 Topics</div>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setActive(t.id); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", padding: "12px 16px", background: active === t.id ? "#1e3a5f" : "none",
                border: "none", cursor: "pointer", textAlign: "left", color: active === t.id ? "#60a5fa" : "var(--text)",
                borderRadius: 8, marginBottom: 4, fontSize: 15 }}>
              {t.icon} {t.label}
            </button>
          ))}
          <div style={{ marginTop: 16, padding: "12px 16px", borderTop: "1px solid var(--card-border)" }}>
            <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener"
              style={{ color: "#60a5fa", fontSize: 13, textDecoration: "none" }}>
              ⭐ View on GitHub →
            </a>
          </div>
        </div>
      </div>
    )}
  </>
);

// ── HOME ─────────────────────────────────────────────────────
const HomeTab = ({ setActive }) => (
  <div style={{ padding: 20 }}>
    <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🇬🇧</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Life in the UK</h1>
      <p style={{ color: "#60a5fa", fontSize: 18, marginBottom: 4 }}>Complete Study Guide</p>
      <p style={{ color: "#6b7280", fontSize: 14 }}>Based on the 3rd Edition Official Handbook</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
        <Badge text="24 questions" color="#3b82f6" />
        <Badge text="45 minutes" color="#10b981" />
        <Badge text="75% to pass (18/24)" color="#f59e0b" />
        <Badge text="£50 per attempt" color="#ef4444" />
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
      {TABS.filter(t => t.id !== "home").map(t => (
        <button key={t.id} onClick={() => setActive(t.id)}
          style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 12, padding: "16px 8px", cursor: "pointer",
            color: "var(--text)", fontSize: 13, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
          <div style={{ fontWeight: 600 }}>{t.label}</div>
        </button>
      ))}
    </div>
    <Card style={{ background: "#0f1f0f", border: "1px solid #166534" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 12 }}>🎯 Top 10 Most-Tested Facts</div>
      {["1066 = Battle of Hastings. LAST invasion. William the Conqueror.",
        "1603 = Crowns join only. 1707 = Parliaments merge (Great Britain).",
        "1807 = slave TRADE banned. 1833 = slavery fully ABOLISHED.",
        "1918 = women over 30 vote. 1928 = equal age 21. 1969 = age 18.",
        "Great Britain = 3 nations. United Kingdom = 4 (add N. Ireland).",
        "Church of England = Monarch IS head. Church of Scotland = NO role.",
        "Council of Europe (47) ≠ EU (27). Council CANNOT make laws.",
        "House of Commons = ELECTED. House of Lords = APPOINTED.",
        "NHS = 1948. Aneurin Bevan = Minister. Attlee = PM.",
        "Big Ben = THE BELL (not tower). Tower = Elizabeth Tower.",
      ].map((f, i) => (
        <div key={i} style={{ padding: "6px 0", borderBottom: i < 9 ? "1px solid #1a3a1a" : "none", color: "#d1fae5", fontSize: 14 }}>
          {f}
        </div>
      ))}
    </Card>
    <div style={{ textAlign: "center", marginTop: 16, padding: 12, background: "#1a1a2e", borderRadius: 10, border: "1px solid #312e81" }}>
      <div style={{ fontSize: 12, color: "#818cf8" }}>🔓 Open Source — Fork it, share it, improve it</div>
      <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener"
        style={{ display: "inline-block", marginTop: 6, fontSize: 12, color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>
        ⭐ github.com/kanwalnainsingh/KNS-Life-In-UK-Test →
      </a>
    </div>
  </div>
);

// ── TIMELINE ─────────────────────────────────────────────────
const TimelineTab = () => {
  const eras = ["All","Ancient","Roman","Medieval","Tudor","Stuart","Georgian","Victorian","Modern"];
  const [era, setEra] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = TIMELINE.filter(e =>
    (era === "All" || e.era === era) &&
    (!search || e.event.toLowerCase().includes(search.toLowerCase()) || e.year.toString().includes(search))
  );
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="📅">British History Timeline</SectionTitle>
      <input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 8, padding: "8px 12px", color: "var(--text-strong)", marginBottom: 12, fontSize: 14 }} />
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {eras.map(e => (
          <button key={e} onClick={() => setEra(e)}
            style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 12,
              background: era === e ? "#3b82f6" : "#111827", borderColor: era === e ? "#3b82f6" : "#374151", color: era === e ? "#fff" : "#9ca3af" }}>
            {e}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{filtered.length} events</div>
      {filtered.map((ev, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
          <div style={{ flexShrink: 0, width: 80, textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ev.color }}>{ev.year}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{ev.era}</div>
          </div>
          <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: ev.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>{ev.icon}</div>
            <div style={{ width: 2, flexGrow: 1, background: "#1f2937", marginTop: 2 }} />
          </div>
          <div style={{ flex: 1, background: "#111827", border: `1px solid ${ev.color}33`, borderRadius: 10, padding: 12, marginBottom: 4 }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 14 }}>{ev.event}</div>
            <MemoryHook text={ev.memory} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── 4 NATIONS ────────────────────────────────────────────────
const NationsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏴">The 4 Nations</SectionTitle>
    <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 8 }}>🗺️ Great Britain vs United Kingdom</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "#1e3a5f33", borderRadius: 8, padding: 10 }}>
          <div style={{ fontWeight: 700, color: "#93c5fd", marginBottom: 4 }}>Great Britain</div>
          <div style={{ color: "var(--text)", fontSize: 13 }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England + 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland + 🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales = 3 nations</div>
        </div>
        <div style={{ background: "#dc262633", borderRadius: 8, padding: 10 }}>
          <div style={{ fontWeight: 700, color: "#fca5a5", marginBottom: 4 }}>United Kingdom</div>
          <div style={{ color: "var(--text)", fontSize: 13 }}>GB + 🇬🇧 Northern Ireland = 4 nations</div>
        </div>
      </div>
      <MemoryHook text="UK = GB + NI. One extra nation." />
    </Card>
    {NATIONS.map(n => (
      <Card key={n.name} style={{ border: `1px solid ${n.color}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{n.flag}</span>
          <div>
            <h3 style={{ color: n.color, fontWeight: 800, fontSize: 20 }}>{n.name}</h3>
            <div style={{ color: "#9ca3af", fontSize: 13 }}>{n.pop} of UK population</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[["🙏 Saint",n.saint],["📅 Day",n.day],["🌸 Flower",n.flower],["🏙️ Capital",n.capital],["🗣️ Language",n.lang],["🍽️ Food",n.food]].map(([label,val]) => (
            <div key={label} style={{ background: "#1a2030", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1a2e", borderRadius: 8, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#818cf8", fontWeight: 700, marginBottom: 4 }}>🏛️ Parliament</div>
          <div style={{ fontSize: 13, color: "#c7d2fe" }}>{n.parliament}</div>
        </div>
        {n.tricks.map((t, i) => (
          <div key={i} style={{ fontSize: 13, color: "#fde68a", padding: "3px 0", borderBottom: i < n.tricks.length-1 ? "1px solid #27272a" : "none" }}>⚡ {t}</div>
        ))}
      </Card>
    ))}
    <Card style={{ background: "#1a1a0a", border: "1px solid #713f12" }}>
      <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: 10 }}>📅 Patron Saints — Calendar Order (D-P-G-A)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[{flag:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",name:"St David",date:"1 Mar",letter:"D"},{flag:"☘️",name:"St Patrick",date:"17 Mar",letter:"P"},{flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",name:"St George",date:"23 Apr",letter:"G"},{flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",name:"St Andrew",date:"30 Nov",letter:"A"}].map(s => (
          <div key={s.letter} style={{ background: "#27200a", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{s.flag}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>{s.letter}</div>
            <div style={{ fontSize: 11, color: "#fde68a" }}>{s.name}</div>
            <div style={{ fontSize: 12, color: "#a16207", fontWeight: 700 }}>{s.date}</div>
          </div>
        ))}
      </div>
    </Card>
    <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f", marginTop: 12 }}>
      <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 10 }}>📈 UK Population Through History</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
        {POPULATION_HISTORY.map(p => (
          <div key={p.year} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", background: "#1f2937", borderRadius: 6 }}>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>{p.year}</span>
            <span style={{ color: "#60a5fa", fontWeight: 600, fontSize: 13 }}>{p.pop}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ── CONFUSABLES ──────────────────────────────────────────────
const ConfuseTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="⚠️">Don't Confuse These!</SectionTitle>
    {CONFUSABLES.map((c, i) => (
      <Card key={i} style={{ border: "1px solid #374151" }}>
        <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 16, marginBottom: 12 }}>{c.icon} {c.title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          {[c.left, c.right].map((side, si) => (
            <div key={si} style={{ background: side.color+"11", border: `1px solid ${side.color}44`, borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, color: side.color, marginBottom: 8, fontSize: 13 }}>{side.label}</div>
              {side.points.map((p, pi) => (
                <div key={pi} style={{ fontSize: 13, color: "var(--text)", padding: "3px 0", borderBottom: pi < side.points.length-1 ? `1px solid ${side.color}22` : "none" }}>{p}</div>
              ))}
            </div>
          ))}
        </div>
        <MemoryHook text={c.memory} />
        <TrapAlert text={c.alert} />
      </Card>
    ))}
  </div>
);

// ── INVENTORS ────────────────────────────────────────────────
const InventorsTab = () => {
  const cats = ["All","Medicine","Computing","Engineering","Electronics","Physics","Biology"];
  const [cat, setCat] = useState("All");
  const filtered = INVENTORS.filter(i => cat === "All" || i.link === cat);
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="💡">British Inventors & Scientists</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 12,
              background: cat === c ? "#3b82f6" : "#111827", borderColor: cat === c ? "#3b82f6" : "#374151", color: cat === c ? "#fff" : "#9ca3af" }}>
            {c}
          </button>
        ))}
      </div>
      {filtered.map((inv, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{inv.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 15 }}>{inv.who}</span>
                <Badge text={inv.nation} color="#6b7280" />
                <Badge text={inv.link} color="#3b82f6" />
                {inv.when && <Badge text={inv.when} color="#d97706" />}
              </div>
              <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6 }}>{inv.what}</div>
              <MemoryHook text={inv.memory} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// ── SPORTS ───────────────────────────────────────────────────
const SportsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏅">British Sports Stars</SectionTitle>
    <Card style={{ background: "#0f1f0f", border: "1px solid #166534", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>🏟️ Olympics Key Facts</div>
      <div style={{ color: "#d1fae5", fontSize: 14, lineHeight: 1.8 }}>
        • UK hosted Olympics <strong>3 times</strong>: 1908, 1948, 2012 (Stratford, East London)<br/>
        • 2012: UK finished <strong>3rd in the medal table</strong><br/>
        • Scotland has <strong>5 ski resorts</strong>
      </div>
      <MemoryHook text="Three times: 1908, 1948, 2012. All in London (or near it)." />
    </Card>
    {SPORTS_STARS.map((s, i) => (
      <Card key={i}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 15 }}>{s.name}</span>
              <Badge text={s.sport} color="#f59e0b" />
              {s.year && <Badge text={s.year} color="#6b7280" />}
            </div>
            <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6 }}>{s.achievement}</div>
            <MemoryHook text={s.memory} />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// ── KEY FIGURES ──────────────────────────────────────────────
const FiguresTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="👑">Key Historical Figures</SectionTitle>
    {KEY_FIGURES.map((f, i) => (
      <Card key={i} style={{ border: `1px solid ${f.color}33` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</div>
            <div style={{ color: f.color, fontSize: 12, fontWeight: 600 }}>{f.role}</div>
          </div>
        </div>
        {f.facts.map((fact, fi) => (
          <div key={fi} style={{ fontSize: 13, color: "var(--text)", padding: "4px 0", borderBottom: fi < f.facts.length-1 ? "1px solid #1f2937" : "none" }}>• {fact}</div>
        ))}
      </Card>
    ))}
  </div>
);

// ── RELIGION ─────────────────────────────────────────────────
const ReligionTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="⛪">Religion & Festivals</SectionTitle>
    <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f" }}>
      <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 12 }}>📊 2011 Census — Religious Identity</div>
      {RELIGIONS.map(r => (
        <div key={r.faith} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 15 }}>{r.icon} <span style={{ color: "var(--text-strong)", fontWeight: 600 }}>{r.faith}</span></span>
            <Badge text={r.pct} color={r.color} />
          </div>
          <div style={{ background: "#1f2937", borderRadius: 6, height: 8, overflow: "hidden" }}>
            <div className="bar-fill" style={{ height: "100%", borderRadius: 6, background: r.color, width: `${Math.min(r.bar, 100)}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{r.note}</div>
        </div>
      ))}
    </Card>
    <Card style={{ background: "#0f0f1a", border: "1px solid #312e81", marginTop: 8 }}>
      <div style={{ fontWeight: 700, color: "#818cf8", marginBottom: 8 }}>⛪ Church Facts</div>
      <div style={{ fontSize: 13, color: "#c7d2fe", lineHeight: 1.8 }}>
        • Protestant groups: Baptists, Methodists, Presbyterians (Scotland), Quakers<br/>
        • Church of England = also called <strong>Episcopal Church</strong> in USA and Scotland<br/>
        • Church of Scotland Moderator = chairperson, appointed for <strong>ONE year only</strong>
      </div>
    </Card>
    <SectionTitle icon="🎉">Key Festivals & Traditions</SectionTitle>
    {FESTIVALS.map((f, i) => (
      <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <span style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</span>
          <Badge text={f.date} color="#d97706" />
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>{f.faith}</div>
        <div style={{ fontSize: 13, color: "var(--text)" }}>{f.detail}</div>
      </Card>
    ))}
  </div>
);

// ── LANDMARKS ────────────────────────────────────────────────
const LandmarksTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏛️">Landmarks & Places</SectionTitle>
    {LANDMARKS.map((l, i) => (
      <Card key={i}>
        <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 15, marginBottom: 4 }}>{l.name}</div>
        <Badge text={l.where} color="#6b7280" />
        <div style={{ color: "var(--text)", fontSize: 14, marginTop: 8 }}>{l.fact}</div>
        <TrapAlert text={l.trap} />
      </Card>
    ))}
  </div>
);

// ── INTERNATIONAL ────────────────────────────────────────────
const InternationalTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🌍">International Organisations</SectionTitle>
    <TrapAlert text="Council of Europe ≠ EU. Completely different! Council has 47 members and CANNOT make laws. EU has 27 members and CAN." />
    <div style={{ marginTop: 16 }}>
      {INT_ORGS.map((o, i) => (
        <Card key={i}>
          <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 16, marginBottom: 6 }}>{o.name}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <Badge text={o.members} color="#3b82f6" />
            <Badge text={o.power} color={o.power.includes("CANNOT") ? "#ef4444" : "#10b981"} />
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}><strong style={{ color: "#9ca3af" }}>Purpose:</strong> {o.purpose}</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8 }}><strong style={{ color: "#9ca3af" }}>UK's role:</strong> {o.ukRole}</div>
          <MemoryHook text={o.memory} />
        </Card>
      ))}
    </div>
  </div>
);

// ── ARTS ─────────────────────────────────────────────────────
const ArtsTab = () => {
  const sections = [
    { key:"literature", label:"📚 Literature", color:"#3b82f6" },
    { key:"music",      label:"🎵 Music",       color:"#8b5cf6" },
    { key:"art",        label:"🎨 Art",          color:"#ec4899" },
    { key:"architecture", label:"🏛️ Architecture", color:"#f59e0b" },
    { key:"fashion",    label:"👗 Fashion",      color:"#10b981" },
    { key:"film",       label:"🎬 Film",         color:"#ef4444" },
  ];
  const [active, setActive] = useState("literature");
  const sec = sections.find(s => s.key === active);
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="🎭">Arts & Culture</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {sections.map(s => (
          <button key={s.key} onClick={() => setActive(s.key)}
            style={{ flexShrink: 0, padding: "7px 12px", borderRadius: 20, border: `1px solid ${active === s.key ? s.color : "#374151"}`, cursor: "pointer", fontSize: 12,
              background: active === s.key ? s.color+"22" : "#111827", color: active === s.key ? s.color : "#9ca3af" }}>
            {s.label}
          </button>
        ))}
      </div>
      {(ARTS[active] || []).map((item, i) => (
        <Card key={i}>
          <div style={{ fontWeight: 700, color: sec ? sec.color : "#f9fafb", fontSize: 14, marginBottom: 4 }}>{item.who}</div>
          <div style={{ color: "var(--text)", fontSize: 13, marginBottom: 6 }}>{item.what}</div>
          <MemoryHook text={item.mem} />
        </Card>
      ))}
    </div>
  );
};

// ── ANTHEM & SYMBOLS ─────────────────────────────────────────
const AnthemTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🎵">National Anthem & Symbols</SectionTitle>
    <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f" }}>
      <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 4 }}>{ANTHEM.title}</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{ANTHEM.note}</div>
      <div style={{ background: "#111827", borderRadius: 10, padding: 16, borderLeft: "4px solid #1e3a5f" }}>
        {ANTHEM.words.map((line, i) => (
          <div key={i} style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 2, fontStyle: "italic" }}>{line}</div>
        ))}
      </div>
      <MemoryHook text={ANTHEM.memory} />
    </Card>
    <Card style={{ background: "#0f0a0a", border: "1px solid #7f1d1d" }}>
      <div style={{ fontWeight: 700, color: "#fca5a5", marginBottom: 10 }}>🇬🇧 The Union Jack</div>
      <div style={{ fontSize: 13, color: "#fecaca", lineHeight: 1.8 }}>
        • <strong>St George's Cross</strong> (England) — Red cross on white<br/>
        • <strong>St Andrew's Cross / Saltire</strong> (Scotland) — White diagonal cross on blue<br/>
        • <strong>St Patrick's Cross</strong> (N. Ireland) — Red diagonal cross on white<br/>
        • <strong>Wales NOT included</strong> — was already united with England when flag designed
      </div>
      <TrapAlert text="Wales has NO representation in the Union Jack. The Red Dragon is absent." />
    </Card>
    <Card style={{ background: "#0f170a", border: "1px solid #166534", marginTop: 12 }}>
      <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: 10 }}>💷 British Currency</div>
      <div style={{ fontSize: 13, color: "#bbf7d0", lineHeight: 1.8 }}>
        <strong>Pound sterling (£)</strong> — 100 pence in a pound<br/>
        <strong>Coins:</strong> 1p, 2p, 5p, 10p, 20p, 50p, £1, £2<br/>
        <strong>Notes:</strong> £5, £10, £20, £50
      </div>
    </Card>
    <Card style={{ background: "#0f0f1a", border: "1px solid #312e81", marginTop: 12 }}>
      <div style={{ fontWeight: 700, color: "#818cf8", marginBottom: 10 }}>⚖️ European Convention on Human Rights</div>
      {["Right to life","Prohibition of torture","Prohibition of slavery","Right to liberty and security","Right to a fair trial","Freedom of thought, conscience and religion","Freedom of expression (speech)"].map((r, i) => (
        <div key={i} style={{ fontSize: 13, color: "#c7d2fe", padding: "4px 0", borderBottom: i < 6 ? "1px solid #1e1b4b" : "none" }}>• {r}</div>
      ))}
    </Card>
  </div>
);

// ── QUICK FACTS ──────────────────────────────────────────────
const QuickFactsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="⚡">Quick Facts</SectionTitle>
    {QUICK_FACTS.map((section, si) => (
      <Card key={si} style={{ border: `1px solid ${section.color}33` }}>
        <div style={{ fontWeight: 700, color: section.color, marginBottom: 10, fontSize: 15 }}>{section.icon} {section.cat}</div>
        {section.facts.map((f, fi) => (
          <div key={fi} style={{ fontSize: 13, color: "var(--text)", padding: "5px 0", borderBottom: fi < section.facts.length-1 ? "1px solid #1f2937" : "none", lineHeight: 1.6 }}>
            <span style={{ color: section.color, marginRight: 6 }}>▸</span>{f}
          </div>
        ))}
      </Card>
    ))}
  </div>
);

// ── QUIZ ─────────────────────────────────────────────────────
const QuizTab = () => {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(24);
  const [questions, setQuestions] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const advanceRef = useRef(null);
  const { useEffect } = React;
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const FILTERS = [
    { id:"all", label:"All Topics", icon:"🎯" },
    { id:"star", label:"Exam Favourites", icon:"⭐" },
    { id:"pin", label:"Often Tested", icon:"📌" },
    { id:"bulb", label:"Good to Know", icon:"💡" },
  ];
  const filterQuestions = () => {
    if (filter === "all") return ALL_QUIZ;
    const prefix = { star:"⭐", pin:"📌", bulb:"💡" }[filter];
    return ALL_QUIZ.filter(q => q.tip.startsWith(prefix));
  };
  const startQuiz = () => {
    const pool = filterQuestions();
    const n = Math.min(count, pool.length);
    setQuestions(shuffle(pool).slice(0, n));
    setCurrent(0); setSelected(null); setConfirmed(false);
    setScore(0); setWrong([]); setFinished(false); setReviewMode(false);
    setStarted(true);
  };
  const handleSelect = (oi) => {
    if (confirmed) return;
    setSelected(oi); setConfirmed(true);
    if (oi === questions[current].a) setScore(s => s + 1);
    else setWrong(w => [...w, { ...questions[current], chosen: oi }]);
    if (advanceRef.current) clearTimeout(advanceRef.current);
    advanceRef.current = setTimeout(() => {
      if (current + 1 >= questions.length) { setFinished(true); return; }
      setCurrent(c => c + 1); setSelected(null); setConfirmed(false);
    }, 2500);
  };
  useEffect(() => { return () => { if (advanceRef.current) clearTimeout(advanceRef.current); }; }, []);
  const skipToNext = () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(c => c + 1); setSelected(null); setConfirmed(false);
  };

  if (!started) {
    const pool = filterQuestions();
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="🧠">Quiz Me!</SectionTitle>
        <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Test your knowledge!</div>
          <div style={{ color: "#9ca3af", fontSize: 14, marginBottom: 20 }}>{pool.length} questions available</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>Filter by frequency</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid", cursor: "pointer", fontSize: 13,
                    background: filter === f.id ? "#3b82f6" : "#1f2937", borderColor: filter === f.id ? "#3b82f6" : "#374151", color: "var(--text-strong)" }}>
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>How many questions?</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {[10, 24, 50, pool.length].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", cursor: "pointer",
                    background: count === n ? "#3b82f6" : "#1f2937", borderColor: count === n ? "#3b82f6" : "#374151", color: "var(--text-strong)", fontSize: 14 }}>
                  {n === pool.length ? `All (${n})` : n}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startQuiz} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Start Quiz →
          </button>
        </Card>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const pass = pct >= 75;
    return (
      <div style={{ padding: 20 }}>
        <Card style={{ textAlign: "center", border: `2px solid ${pass ? "#22c55e" : "#ef4444"}` }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{pass ? "🎉" : "📚"}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: pass ? "#4ade80" : "#f87171" }}>{pass ? "PASSED!" : "Keep Studying"}</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-strong)" }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 20, color: pass ? "#4ade80" : "#f87171", marginBottom: 16 }}>{pct}%</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={startQuiz} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 700 }}>Try Again</button>
            {wrong.length > 0 && <button onClick={() => setReviewMode(true)} style={{ background: "#ef444422", color: "#f87171", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 700 }}>Review {wrong.length} wrong</button>}
            <button onClick={() => setStarted(false)} style={{ background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}>Back</button>
          </div>
        </Card>
        {reviewMode && wrong.map((w, i) => (
          <Card key={i} style={{ border: "1px solid #7f1d1d", background: "#1a0a0a" }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", marginBottom: 8 }}>Q: {w.q}</div>
            <div style={{ color: "#f87171", marginBottom: 4 }}>✗ You chose: {w.opts[w.chosen]}</div>
            <div style={{ color: "#4ade80", marginBottom: 8 }}>✓ Correct: {w.opts[w.a]}</div>
            <MemoryHook text={w.tip} />
          </Card>
        ))}
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <Badge text={`${current+1} / ${questions.length}`} color="#6b7280" />
        <Badge text={`Score: ${score}`} color="#22c55e" />
      </div>
      <div style={{ background: "#1f2937", borderRadius: 6, height: 6, marginBottom: 16 }}>
        <div style={{ background: "#3b82f6", height: "100%", borderRadius: 6, width: `${((current+1)/questions.length)*100}%`, transition: "width 0.3s" }} />
      </div>
      <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f" }}>
        <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 17, lineHeight: 1.5 }}>{q.q}</div>
      </Card>
      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        {q.opts.map((opt, oi) => {
          let bg = "#111827", border = "#374151", color = "var(--text)";
          if (confirmed) {
            if (oi === q.a) { bg = "#0f1f0f"; border = "#22c55e"; color = "#4ade80"; }
            else if (oi === selected && oi !== q.a) { bg = "#1a0a0a"; border = "#ef4444"; color = "#f87171"; }
            else { bg = "#111827"; border = "#374151"; color = "var(--text-muted)"; }
          }
          return (
            <button key={oi} onClick={() => handleSelect(oi)}
              style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${border}`, cursor: confirmed ? "default" : "pointer",
                background: bg, color, textAlign: "left", fontSize: 14, transition: "all 0.15s" }}>
              <span style={{ marginRight: 8, opacity: 0.6 }}>{["A","B","C","D"][oi]}.</span>{opt}
              {confirmed && oi === q.a && " ✓"}
              {confirmed && oi === selected && oi !== q.a && " ✗"}
            </button>
          );
        })}
      </div>
      {confirmed && (
        <>
          <MemoryHook text={q.tip} />
          <button onClick={skipToNext}
            style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 10, background: "#22c55e22", color: "#4ade80", border: "1px solid #22c55e44", fontSize: 14, cursor: "pointer" }}>
            {current+1 < questions.length ? "Next →" : "See Results 🎯"}
          </button>
        </>
      )}
    </div>
  );
};

// ── RAPID FIRE ───────────────────────────────────────────────
const RapidFireTab = () => {
  const TOTAL = 10, TIME_PER_Q = 20;
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const { useEffect } = React;
  const timerRef = useRef(null);
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const startGame = () => {
    setQuestions(shuffle(ALL_QUIZ).slice(0, TOTAL));
    setCurrent(0); setSelected(null); setConfirmed(false);
    setScore(0); setResults([]); setFinished(false); setTimeLeft(TIME_PER_Q);
    setStarted(true);
  };

  const advance = (isCorrect, chosen, q) => {
    setResults(r => [...r, { ...q, chosen, correct: isCorrect }]);
    const next = current + 1;
    if (next >= TOTAL) { setFinished(true); setStarted(false); return; }
    setCurrent(next); setSelected(null); setConfirmed(false); setTimeLeft(TIME_PER_Q);
  };

  const handleSelect = (oi) => {
    if (confirmed) return;
    clearInterval(timerRef.current);
    const q = questions[current];
    const isCorrect = oi === q.a;
    if (isCorrect) setScore(s => s + 1);
    setSelected(oi); setConfirmed(true);
    setTimeout(() => advance(isCorrect, oi, q), 1000);
  };

  useEffect(() => {
    if (!started || confirmed || finished) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, current, confirmed, finished]);

  useEffect(() => {
    if (timeLeft === 0 && !confirmed && started && !finished) {
      clearInterval(timerRef.current);
      const q = questions[current];
      setConfirmed(true);
      setTimeout(() => advance(false, -1, q), 800);
    }
  }, [timeLeft]);

  if (!started && !finished) return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="🔥">Rapid Fire</SectionTitle>
      <Card style={{ background: "#0f172a", border: "1px solid #7f1d1d", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>⏱️</div>
        <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>10 Questions · 20 Seconds Each</div>
        <div style={{ color: "#9ca3af", fontSize: 14, marginBottom: 6 }}>Pick an answer before time runs out!</div>
        <div style={{ color: "#f59e0b", fontSize: 13, marginBottom: 24 }}>⚡ No time to think — go with your gut</div>
        <button onClick={startGame} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, padding: "14px 36px", fontSize: 17, fontWeight: 700, cursor: "pointer" }}>
          Start Rapid Fire 🔥
        </button>
      </Card>
    </div>
  );

  if (finished) {
    const pct = Math.round((score / TOTAL) * 100);
    const pass = pct >= 75;
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="🔥">Rapid Fire — Results</SectionTitle>
        <Card style={{ textAlign: "center", border: `2px solid ${pass ? "#22c55e" : "#ef4444"}` }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{pass ? "🏆" : "💪"}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: pass ? "#4ade80" : "#f87171" }}>{pass ? "On Fire!" : "Keep Practising"}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "var(--text-strong)", margin: "8px 0" }}>{score}/{TOTAL}</div>
          <div style={{ fontSize: 20, color: pass ? "#4ade80" : "#f87171", marginBottom: 20 }}>{pct}%</div>
          <button onClick={startGame} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Try Again 🔥</button>
          {" "}
          <button onClick={() => { setFinished(false); setStarted(false); }} style={{ background: "var(--card-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)", borderRadius: 8, padding: "12px 20px", cursor: "pointer", marginLeft: 6 }}>Back</button>
        </Card>
        {results.map((r, i) => (
          <Card key={i} style={{ border: `1px solid ${r.correct ? "#166534" : "#7f1d1d"}`, background: r.correct ? "#0f1f0f" : "#1a0808" }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Q{i + 1}</div>
            <div style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 13, marginBottom: 6 }}>{r.q}</div>
            <div style={{ fontSize: 13, color: r.correct ? "#4ade80" : "#f87171" }}>
              {r.correct ? "✓" : "✗"} {r.chosen === -1 ? "⏱️ Time ran out" : r.opts[r.chosen]}
            </div>
            {!r.correct && <div style={{ fontSize: 13, color: "#4ade80", marginTop: 2 }}>✓ {r.opts[r.a]}</div>}
          </Card>
        ))}
      </div>
    );
  }

  const q = questions[current];
  const timerPct = (timeLeft / TIME_PER_Q) * 100;
  const timerColor = timeLeft > 10 ? "#22c55e" : timeLeft > 5 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Badge text={`${current + 1} / ${TOTAL}`} color="#6b7280" />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <span style={{ fontSize: 26, fontWeight: 800, color: timerColor, minWidth: 32, textAlign: "center" }}>{timeLeft}</span>
        </div>
        <Badge text={`Score: ${score}`} color="#22c55e" />
      </div>
      <div style={{ background: "#1f2937", borderRadius: 6, height: 10, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ background: timerColor, height: "100%", borderRadius: 6, width: `${timerPct}%`, transition: "width 1s linear, background 0.3s" }} />
      </div>
      <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f", marginBottom: 12 }}>
        <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 17, lineHeight: 1.5 }}>{q.q}</div>
      </Card>
      <div style={{ display: "grid", gap: 8 }}>
        {q.opts.map((opt, oi) => {
          let bg = "var(--card-bg)", border = "var(--card-border)", color = "var(--text)";
          if (confirmed) {
            if (oi === q.a) { bg = "#0f1f0f"; border = "#22c55e"; color = "#4ade80"; }
            else if (oi === selected && oi !== q.a) { bg = "#1a0808"; border = "#ef4444"; color = "#f87171"; }
          } else if (selected === oi) { bg = "#1e3a5f"; border = "#3b82f6"; color = "#60a5fa"; }
          return (
            <button key={oi} onClick={() => handleSelect(oi)}
              style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${border}`, cursor: confirmed ? "default" : "pointer",
                background: bg, color, textAlign: "left", fontSize: 14, transition: "all 0.15s" }}>
              <span style={{ marginRight: 8, opacity: 0.6 }}>{["A","B","C","D"][oi]}.</span>{opt}
              {confirmed && oi === q.a && " ✓"}
              {confirmed && oi === selected && oi !== q.a && " ✗"}
            </button>
          );
        })}
      </div>
      {confirmed && timeLeft === 0 && (
        <div style={{ marginTop: 10, textAlign: "center", color: "#f59e0b", fontWeight: 700 }}>⏱️ Time's up!</div>
      )}
    </div>
  );
};

// ── ROOT ──────────────────────────────────────────────────────
const { useEffect } = React;
const App = () => {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  const toggleDark = () => setIsDark(d => !d);
  const renderTab = () => {
    switch (active) {
      case "home":          return <HomeTab setActive={setActive} />;
      case "timeline":      return <TimelineTab />;
      case "nations":       return <NationsTab />;
      case "confuse":       return <ConfuseTab />;
      case "inventors":     return <InventorsTab />;
      case "sports":        return <SportsTab />;
      case "figures":       return <FiguresTab />;
      case "religion":      return <ReligionTab />;
      case "landmarks":     return <LandmarksTab />;
      case "international": return <InternationalTab />;
      case "arts":          return <ArtsTab />;
      case "anthem":        return <AnthemTab />;
      case "quickfacts":    return <QuickFactsTab />;
      case "quiz":          return <QuizTab />;
      case "rapidfire":     return <RapidFireTab />;
      default:              return <HomeTab setActive={setActive} />;
    }
  };
  return (
    <div style={{ minHeight: "100vh", maxWidth: 900, margin: "0 auto" }}>
      <TabBar active={active} setActive={setActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} isDark={isDark} toggleDark={toggleDark} />
      <div className="tabcontent">{renderTab()}</div>
      <div style={{ textAlign: "center", padding: "24px 16px", borderTop: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: 12 }}>
        🔓 Open Source — Share Freely ·{" "}
        <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener"
          style={{ color: "#60a5fa", textDecoration: "none" }}>
          github.com/kanwalnainsingh/KNS-Life-In-UK-Test
        </a>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
