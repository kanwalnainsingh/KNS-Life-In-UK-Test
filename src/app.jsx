/* =============================================================
   app.jsx — React UI for Life in the UK Study Guide
   Edit data.js to change content. Edit this file for UI changes.
   ============================================================= */

const { useEffect, useMemo, useRef, useState } = React;

const STORAGE_KEYS = {
  theme: "lifeuk-theme",
  activeTab: "lifeuk-active-tab",
  wrongQuestions: "lifeuk-wrong-questions",
  mockHistory: "lifeuk-mock-history",
  recentQuiz: "lifeuk-recent-quiz",
  recentMock: "lifeuk-recent-mock",
  recentRapid: "lifeuk-recent-rapid",
};

const PRIMARY_DESKTOP_TABS = ["home", "quickrev", "quiz", "mock", "rapidfire", "timeline"];
const PRIMARY_MOBILE_TABS = ["home", "quickrev", "quiz", "mock", "timeline"];
const NAV_GROUPS = [
  { title: "Study Modes", hint: "Start here for revision and practice", ids: ["home", "quickrev", "quiz", "mock", "rapidfire", "revise"] },
  { title: "History & Society", hint: "Timeline, nations, law, traps, landmarks", ids: ["timeline", "nations", "quickfacts", "confuse", "landmarks", "international"] },
  { title: "People & Culture", hint: "Figures, religion, inventors, sports, arts", ids: ["figures", "religion", "inventors", "sports", "arts", "anthem"] },
];
const COVERAGE_AREAS = [
  { title: "History and timeline", detail: "Ancient Britain to modern Britain", tab: "timeline", icon: "📅" },
  { title: "Government and Parliament", detail: "Constitution, Commons, Lords, elections", tab: "quickfacts", icon: "🏛️" },
  { title: "Laws, rights and values", detail: "Rule of law, courts, equality, British values", tab: "quickfacts", icon: "⚖️" },
  { title: "Countries, geography and landmarks", detail: "Capitals, rivers, mountains, places", tab: "nations", icon: "🗺️" },
  { title: "Religion and festivals", detail: "Major faiths, census facts, festivals", tab: "religion", icon: "⛪" },
  { title: "People, culture and sport", detail: "Writers, scientists, arts, sport", tab: "figures", icon: "🎭" },
  { title: "Symbols and everyday life", detail: "Anthem, currency, identity, practical facts", tab: "anthem", icon: "🎵" },
  { title: "International organisations", detail: "UN, NATO, Commonwealth, Council of Europe", tab: "international", icon: "🌍" },
  { title: "Community and participation", detail: "Volunteering, jury service, magistrates, respect", tab: "quickfacts", icon: "🤝" },
];

const useViewportMobile = () => {
  const getValue = () => window.matchMedia("(max-width: 820px)").matches;
  const [isMobile, setIsMobile] = useState(getValue);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 820px)");
    const handler = (event) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    if (media.addEventListener) media.addEventListener("change", handler);
    else media.addListener(handler);
    return () => {
      if (media.removeEventListener) media.removeEventListener("change", handler);
      else media.removeListener(handler);
    };
  }, []);

  return isMobile;
};

const readStore = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
};

const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    /* ignore storage failures */
  }
};

const inferTopic = (question) => {
  const text = `${question.q} ${question.tip}`.toLowerCase();
  if (/roman|tudor|stuart|victoria|battle|carta|parliament|hastings|empire|war|union|nhs|revolution/.test(text)) return "History";
  if (/england|scotland|wales|ireland|union jack|capital|saint|flower|senedd|msp|mla/.test(text)) return "4 Nations";
  if (/church|religion|festival|easter|christmas|diwali|eid|hanukkah|vaisakhi/.test(text)) return "Religion";
  if (/invent|develop|scientist|theory|engine|radar|web|vaccine|ivf|dna/.test(text)) return "Inventors";
  if (/olympic|wimbledon|cricket|football|golf|ashes|rugby|cyclist/.test(text)) return "Sports";
  if (/museum|stonehenge|castle|palace|wall|river|lake|park|london|landmark|cenotaph/.test(text)) return "Landmarks";
  if (/council|europe|commonwealth|nato|un|g7|human rights|echr/.test(text)) return "World Orgs";
  return "General";
};

const buildRevisionBuckets = (items) => {
  const grouped = items.reduce((acc, item) => {
    const topic = inferTopic(item);
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(item);
    return acc;
  }, {});
  return Object.entries(grouped)
    .map(([topic, questions]) => ({ topic, questions }))
    .sort((a, b) => b.questions.length - a.questions.length);
};

const buildQuickRevisionDeck = () => {
  const deck = [];
  VISUAL_MNEMONICS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.title}`,
      back: `${item.code}: ${item.clue}`,
      memory: item.visual,
      topic: "Memory Clue",
      color: item.color,
    });
  });
  COVERAGE_AREAS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.title}`,
      back: item.detail,
      memory: `Covered in ${TABS.find((tab) => tab.id === item.tab)?.label || item.tab}`,
      topic: "Coverage",
      color: "#64748b",
    });
  });
  [
    { front: "🏛️ House of Commons", back: "Elected MPs. More powerful. Controls money bills.", memory: "Commons = chosen by the public.", topic: "Parliament", color: "#22c55e" },
    { front: "🏛️ House of Lords", back: "Appointed members. Reviews and delays laws.", memory: "Lords = not elected.", topic: "Parliament", color: "#ef4444" },
    { front: "🗳️ Voting basics", back: "Voting age 18. Secret ballot. FPTP in general elections.", memory: "18 + secret ballot + FPTP.", topic: "Elections", color: "#3b82f6" },
    { front: "⚖️ Justice basics", back: "Rule of law. Innocent until proven guilty. Equality before the law.", memory: "Law applies to everyone.", topic: "Law", color: "#10b981" },
    { front: "🤝 Community role", back: "Volunteering, fundraising, jury service and local participation all matter.", memory: "Community = take part, do not just observe.", topic: "Community", color: "#8b5cf6" },
    { front: "🗺️ UK capitals", back: "London, Edinburgh, Cardiff, Belfast.", memory: "LECB mnemonic.", topic: "Geography", color: "#06b6d4" },
    { front: "📜 Anchor dates", back: "43, 1066, 1215, 1534, 1948.", memory: "Roman invasion, Hastings, Magna Carta, Church of England, NHS.", topic: "History", color: "#f97316" },
    { front: "🌍 World organisations", back: "UN, NATO, Commonwealth, Council of Europe.", memory: "Council of Europe ≠ EU.", topic: "International", color: "#0ea5e9" },
  ].forEach((item) => deck.push(item));
  return deck;
};

const buildConfusionDeck = () =>
  CONFUSABLES.flatMap((pair) => {
    const left = pair.left.label.split("—").pop().trim();
    const right = pair.right.label.split("—").pop().trim();
    return [{
      q: `${pair.title}: which side matches "${pair.left.points[0]}"?`,
      opts: [left, right, "Both", "Neither"],
      a: 0,
      tip: `⭐ Compare mode — ${pair.memory}`,
    }];
  });

const shuffleList = (items) => [...items].sort(() => Math.random() - 0.5);

const TIMELINE_KEY_POINTS = {
  "55 BC": ["Julius Caesar only ATTEMPTED invasion.", "Romans did not settle Britain in 55 BC.", "Compare with 43 AD under Claudius."],
  "43 AD": ["Claudius led the SUCCESSFUL Roman invasion.", "Roman rule lasts for nearly 400 years.", "High-value compare date against 55 BC."],
  "60–61 AD": ["Boudicca was queen of the Iceni.", "Her revolt attacked Roman settlements such as Londinium.", "Romans still kept control afterwards."],
  "122 AD": ["Built across northern England.", "Marked the Roman Empire's northern frontier.", "Often linked with Romans rather than Normans or Tudors."],
  "597 AD": ["St Augustine came from Rome to Kent.", "Helps explain how Christianity spread in England.", "Important church-history anchor before the Reformation."],
  "927 AD": ["Athelstan is treated as first king of a united England.", "Useful before 1066 when tracing English kingship.", "Anglo-Saxon, not Norman or Tudor."],
  "1066": ["Battle of Hastings: William defeats Harold.", "Last successful invasion of England.", "Norman rule follows immediately."],
  "1086": ["William I orders the Domesday Book survey.", "Land and property were recorded for tax and control.", "Directly linked to Norman administration."],
  "1215": ["Signed by King John at Runnymede.", "No one, not even the king, is above the law.", "Law-and-rights anchor often tested with democracy history."],
  "1295": ["Edward I's Model Parliament.", "Represents an early step toward modern Parliament.", "Useful compare with later Commons/Lords questions."],
  "1485": ["Henry VII wins at Bosworth.", "Wars of the Roses end.", "Tudor period begins."],
  "1534": ["Henry VIII breaks from Rome.", "Church of England is created.", "Monarch becomes head of the Church of England."],
  "1536–1543": ["Acts of Union link Wales to England in law and administration.", "Explains why Wales is not separately represented in the Union Jack.", "Often confused with 1707 and 1801 unions."],
  "1560": ["Scottish Reformation is separate from Henry VIII's break with Rome.", "Church of Scotland becomes Presbyterian.", "Monarch is not head of the Church of Scotland."],
  "1588": ["Spanish Armada defeated under Elizabeth I.", "Francis Drake co-commanded the English fleet.", "Major Tudor military victory."],
  "1603": ["James VI of Scotland becomes James I of England.", "Crowns unite but parliaments stay separate.", "Compare carefully with 1707."],
  "1605": ["Guy Fawkes and Catholic conspirators fail to blow up Parliament.", "Remember Bonfire Night = 5 November.", "Exam trap for Stuart history."],
  "1642": ["Roundheads supported Parliament.", "Cavaliers supported the king.", "Civil War is about power between Crown and Parliament."],
  "1649": ["Charles I is executed.", "Britain becomes a republic for a short period.", "Only British monarch to be tried and executed."],
  "1660": ["Charles II is restored to the throne.", "Ends the republic period.", "Restoration follows Cromwell era."],
  "1688": ["Glorious Revolution removes James II.", "Parliament's power becomes more secure.", "Linked directly to Bill of Rights 1689."],
  "1689": ["Bill of Rights limits royal power.", "Constitutional monarchy is reinforced.", "Important law-and-Parliament anchor."],
  "1707": ["England and Scotland's parliaments merge.", "Great Britain is created.", "Do not confuse with 1603 crowns union."],
  "1714": ["George I spoke poor English and relied on ministers.", "Robert Walpole becomes first Prime Minister in 1721.", "Important for early PM history."],
  "1801": ["Act of Union with Ireland creates the United Kingdom.", "Current Union Flag form dates from this union.", "Compare with 1707 = Great Britain only."],
  "1807": ["Slave TRADE banned.", "Owning enslaved people was still legal.", "Compare with 1833 abolition of slavery."],
  "1815": ["Duke of Wellington defeats Napoleon at Waterloo.", "Ends the long French wars.", "Wellington later becomes Prime Minister."],
  "1832": ["Reform Act removes rotten boroughs.", "Industrial towns gain more representation.", "Key step before wider voting reforms."],
  "1833": ["Slavery abolished across the British Empire.", "Not the same as the 1807 slave-trade ban.", "Linked to William Wilberforce's campaign."],
  "1830s–40s": ["Chartists wanted votes for working men.", "Also wanted secret ballots and pay for MPs.", "Important reform movement before later voting changes."],
  "1851": ["Great Exhibition held at Crystal Palace in Hyde Park.", "Showcased British industry and invention.", "Strong Victorian-era anchor date."],
  "1903": ["Emmeline Pankhurst founds the WSPU.", "Suffragettes push for women's votes.", "Useful before 1918 and 1928 voting dates."],
  "1914–18": ["World War I begins in 1914 and ends in 1918.", "Armistice Day = 11 November 1918.", "Often paired with the first extension of women's voting rights."],
  "1918": ["Women over 30 gain the vote, with conditions.", "Men and women are not yet on equal terms.", "Compare with 1928 and 1969."],
  "1922": ["Ireland splits: 6 counties remain in UK as Northern Ireland.", "Rest becomes Irish Free State.", "Important background for later NI politics."],
  "1928": ["Women get voting equality at age 21.", "Property qualification is removed.", "Compare with 1918 partial reform."],
  "1939": ["Britain enters WW2 after Germany invades Poland.", "Use with 1940, 1944, and 1945 as wartime anchors.", "Start of modern wartime sequence."],
  "1940": ["Battle of Britain is an air battle.", "The Blitz is bombing of British cities.", "Dunkirk evacuation is another key 1940 fact."],
  "1942": ["Beveridge Report identifies major social problems.", "Blueprint for post-war welfare reforms.", "Leads into NHS and welfare-state questions."],
  "1944": ["D-Day landings in Normandy.", "Turning point in liberation of Europe.", "Important WW2 anchor after Battle of Britain."],
  "1945": ["WW2 ends.", "Labour wins election and Attlee becomes PM.", "Leads into welfare state and NHS reforms."],
  "1948": ["NHS is founded by Aneurin Bevan.", "Windrush arrives in the same year.", "London also hosts the Olympic Games."],
  "1953": ["Elizabeth II is crowned.", "First coronation shown on television.", "Useful modern monarchy anchor."],
  "1969": ["Voting age falls from 21 to 18.", "The Troubles begin in Northern Ireland.", "Important double-date for politics and NI history."],
  "1973": ["UK joins the EEC.", "EEC is forerunner of the EU.", "Compare with Brexit and 2020 exit."],
  "1998": ["Good Friday Agreement is the NI peace deal.", "Creates the NI Assembly at Stormont.", "Often tested modern politics date."],
  "1999": ["Scottish Parliament and Welsh devolved institutions open.", "Hereditary peers lose automatic right to sit in Lords.", "Key devolution date."],
  "2009": ["Supreme Court replaces the Law Lords.", "Highest court in the UK.", "Modern law-and-courts anchor."],
  "2010": ["Conservative-Lib Dem coalition government formed.", "Equality Act 2010 protects 9 characteristics.", "Useful modern politics and law date."],
  "2012": ["London hosts Olympics for the third time.", "Held in Stratford, East London.", "UK finishes third in medal table."],
  "2016": ["Brexit referendum votes to leave the EU.", "Referendum date is not the same as formal exit date.", "Compare with 2020."],
  "2020": ["UK formally leaves the European Union.", "Brexit becomes legally complete.", "Keep separate from the 2016 referendum."],
};

const buildTimelineDetails = (ev) => {
  if (TIMELINE_KEY_POINTS[ev.year]) return TIMELINE_KEY_POINTS[ev.year];
  const lower = ev.event.toLowerCase();
  const details = [];
  if (/battle|war|defeat|invasion|revolt|armada|plot|blitz/.test(lower)) details.push("Military / conflict anchor in the timeline.");
  if (/parliament|bill of rights|magna carta|habeas corpus|reform act|vote|union/.test(lower)) details.push("Important for Parliament, law, union, or voting questions.");
  if (/church|christianity|pope|reformation|jews/.test(lower)) details.push("Religion / church change point often linked with later compare questions.");
  if (/queen|king|monarch|prime minister|crowns/.test(lower)) details.push("Useful for monarchy and government revision.");
  if (/nhs|welfare|eec|eu|court|rights|equality/.test(lower)) details.push("Modern citizenship / law anchor.");
  if (/radio|tv|web|radar|locomotive|film/.test(lower)) details.push("Technology / modern Britain link.");
  if (!details.length) details.push(`Key ${ev.era.toLowerCase()} date for ordering events correctly.`);
  details.push(ev.memory.replace(/\s+/g, " ").trim());
  return details.slice(0, 3);
};

const NATION_KEY_POINTS = {
  ENGLAND: [
    "Capital = London. England has no separate parliament of its own.",
    "Saint = St George, day = 23 April, flower = rose.",
    "Largest nation by population: about 84% of the UK.",
    "Church of England is the established church and the monarch is its head.",
  ],
  SCOTLAND: [
    "Capital = Edinburgh, but Glasgow is the largest city.",
    "Scottish Parliament = Holyrood, 129 MSPs, elected by proportional representation.",
    "Saint = St Andrew, day = 30 November, flower = thistle, animal = unicorn.",
    "Church of Scotland is Presbyterian and the monarch is not its head.",
  ],
  WALES: [
    "Capital = Cardiff. Welsh Parliament = Senedd, 60 SMs.",
    "Saint = St David, day = 1 March, symbols = daffodil or leek.",
    "Welsh is widely spoken alongside English, by around a quarter of the population.",
    "Wales is not shown separately in the Union Jack because it was already joined with England.",
  ],
  "N. IRELAND": [
    "Capital = Belfast. NI Assembly = Stormont, 90 MLAs.",
    "Saint = St Patrick, day = 17 March, symbol = shamrock.",
    "Good Friday Agreement 1998 is key background for the current Assembly.",
    "Giant's Causeway and Belfast are common Northern Ireland exam anchors.",
  ],
};

const TOP_TESTED_FACTS = [
  "1066 = Battle of Hastings. LAST invasion. William the Conqueror.",
  "1603 = Crowns join only. 1707 = Parliaments merge (Great Britain).",
  "1807 = slave TRADE banned. 1833 = slavery fully ABOLISHED.",
  "1918 = women over 30 vote. 1928 = equal age 21. 1969 = age 18.",
  "Great Britain = 3 nations. United Kingdom = 4 (add N. Ireland).",
  "Church of England = Monarch IS head. Church of Scotland = NO role.",
  "Council of Europe (47) ≠ EU (27). Council CANNOT make laws.",
  "House of Commons = ELECTED. House of Lords = APPOINTED.",
  "NHS = 1948. Aneurin Bevan = Minister. Attlee = PM.",
  "Big Ben = THE BELL. Tower = Elizabeth Tower.",
  "55 BC = Julius Caesar FAILS. 43 AD = Claudius SUCCEEDS.",
  "River Severn = longest in UK. Thames = longest in England only.",
  "St David = 1 Mar. St Patrick = 17 Mar. St George = 23 Apr. St Andrew = 30 Nov.",
  "British values = DRIM: Democracy, Rule of law, Individual liberty, Mutual respect and tolerance.",
  "Crown Court jury = 12. Scotland Sheriff Court can be up to 15.",
  "Westminster = UK Parliament. Holyrood, Senedd, Stormont = devolved bodies.",
  "1942 Beveridge Report = welfare-state blueprint. 1948 NHS = delivery.",
  "Boudicca fought the Romans around AD 60. Hadrian's Wall = AD 122.",
  "Commonwealth = voluntary association. NATO = military alliance.",
  "PM = head of government. Monarch = head of state.",
];

const pickRandom = (items, count) => [...items].sort(() => Math.random() - 0.5).slice(0, count);

const saveWrongQuestions = (items) => {
  if (!items.length) return;
  const existing = readStore(STORAGE_KEYS.wrongQuestions, []);
  const merged = [...items, ...existing]
    .filter((item, index, arr) => arr.findIndex((x) => x.q === item.q) === index)
    .slice(0, 60);
  writeStore(STORAGE_KEYS.wrongQuestions, merged);
};

const saveMockResult = (entry) => {
  const existing = readStore(STORAGE_KEYS.mockHistory, []);
  writeStore(STORAGE_KEYS.mockHistory, [entry, ...existing].slice(0, 8));
};

const pickRandomNoRepeat = (items, count, storageKey, recentLimit = 80) => {
  const unique = items.filter((item, index, arr) => arr.findIndex((x) => x.q === item.q) === index);
  const recent = readStore(storageKey, []);
  const freshPool = unique.filter((item) => !recent.includes(item.q));
  const source = freshPool.length >= count ? freshPool : unique;
  const picked = [...source].sort(() => Math.random() - 0.5).slice(0, Math.min(count, source.length));
  const updatedRecent = [...picked.map((item) => item.q), ...recent].filter((value, index, arr) => arr.indexOf(value) === index).slice(0, recentLimit);
  writeStore(storageKey, updatedRecent);
  return picked;
};

// ── HELPERS ──────────────────────────────────────────────────
const Badge = ({ text, color = "#3b82f6" }) => (
  <span className="app-badge" style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3, fontFamily: "monospace" }}>{text}</span>
);

const Card = ({ children, style = {}, className = "", ...props }) => (
  <div {...props} className={`app-card ${className}`.trim()} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: "0 16px 40px rgba(0,0,0,0.12)", ...style }}>{children}</div>
);

const SectionTitle = ({ children, icon, meta }) => (
  <div className="section-title-wrap" style={{ marginBottom: 16 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-strong)", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
      {icon && <span>{icon}</span>}{children}
    </h2>
    {meta && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{meta}</p>}
  </div>
);

const MemoryHook = ({ text }) => (
  <div className="memory-hook" style={{ background: "linear-gradient(135deg, #10261a, #152f21)", border: "1px solid #166534", borderRadius: 12, padding: "10px 12px", marginTop: 8, fontSize: 13, color: "#bbf7d0" }}>
    <span style={{ color: "#4ade80", fontWeight: 800 }}>💡 Memory: </span>{text}
  </div>
);

const TrapAlert = ({ text }) => (
  <div className="trap-alert" style={{ background: "linear-gradient(135deg, #331515, #281010)", border: "1px solid #991b1b", borderRadius: 12, padding: "10px 12px", marginTop: 8, fontSize: 13, color: "#fecaca" }}>
    <span style={{ color: "#f87171", fontWeight: 800 }}>🚨 Exam trap: </span>{text}
  </div>
);

const HeroIllustration = ({ variant = "study" }) => {
  const palette = {
    study: { a: "#2563eb", b: "#0f172a", c: "#f59e0b", d: "#0ea5e9" },
    mock: { a: "#dc2626", b: "#1f2937", c: "#f59e0b", d: "#4ade80" },
    compare: { a: "#7c3aed", b: "#0f172a", c: "#f97316", d: "#60a5fa" },
  }[variant];

  return (
    <svg viewBox="0 0 360 220" role="img" aria-label={`${variant} illustration`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id={`bg-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.b} />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect width="360" height="220" rx="28" fill={`url(#bg-${variant})`} />
      <circle cx="280" cy="48" r="24" fill={palette.a} opacity="0.25" />
      <circle cx="68" cy="54" r="14" fill={palette.c} opacity="0.5" />
      <rect x="40" y="52" width="124" height="132" rx="18" fill="#ffffff" opacity="0.08" />
      <rect x="64" y="74" width="78" height="10" rx="5" fill={palette.a} />
      <rect x="64" y="95" width="54" height="10" rx="5" fill="#94a3b8" opacity="0.7" />
      <rect x="64" y="116" width="70" height="10" rx="5" fill="#94a3b8" opacity="0.5" />
      <rect x="64" y="140" width="56" height="28" rx="12" fill={palette.c} />
      <rect x="196" y="66" width="118" height="36" rx="16" fill={palette.a} opacity="0.25" stroke={palette.a} />
      <rect x="196" y="114" width="118" height="36" rx="16" fill={palette.d} opacity="0.18" stroke={palette.d} />
      <rect x="196" y="162" width="74" height="18" rx="9" fill={palette.c} opacity="0.8" />
      <text x="220" y="89" fill="#e2e8f0" fontSize="14" fontWeight="700">Compare</text>
      <text x="225" y="138" fill="#e2e8f0" fontSize="14" fontWeight="700">Revise</text>
      <text x="74" y="159" fill="#0f172a" fontSize="16" fontWeight="800">GO</text>
    </svg>
  );
};

const StatTile = ({ label, value, color }) => (
  <div style={{ borderRadius: 16, padding: 14, background: color + "14", border: `1px solid ${color}33` }}>
    <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} className="focus-ring" style={{ padding: "9px 14px", borderRadius: 999, border: "1px solid", cursor: "pointer", fontSize: 13, fontWeight: 700, background: active ? "#2563eb" : "var(--chip-bg)", borderColor: active ? "#3b82f6" : "var(--card-border)", color: active ? "#fff" : "var(--text)" }}>
    {children}
  </button>
);

const SettingGroup = ({ label, options, value, onChange }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 8 }}>{label}</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((option) => (
        <TabButton key={option.value} active={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </TabButton>
      ))}
    </div>
  </div>
);

const BottomNav = ({ active, setActive, openQuickPanel, onBack, canGoBack }) => {
  const items = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "quickrev", icon: "↔️", label: "Quick" },
    { id: "mock", icon: "📝", label: "Mock" },
    { id: "quiz", icon: "🧠", label: "Quiz" },
  ];

  return (
    <div className="mobile-bottom-nav">
      <button
        className="focus-ring"
        onClick={onBack}
        style={{ border: "none", background: "none", color: canGoBack ? "#f8fafc" : "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, fontWeight: 700, cursor: canGoBack ? "pointer" : "default", minWidth: 54 }}
      >
        <span style={{ fontSize: 18 }}>←</span>
        <span>Back</span>
      </button>
      {items.map((item) => (
        <button
          key={item.id}
          className="focus-ring"
          onClick={() => setActive(item.id)}
          style={{
            border: "none",
            background: "none",
            color: active === item.id ? "#60a5fa" : "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: active === item.id ? 800 : 600,
            cursor: "pointer",
            minWidth: 54,
          }}
        >
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
      <button
        className="focus-ring"
        onClick={openQuickPanel}
        style={{ border: "none", background: "none", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 11, fontWeight: 700, cursor: "pointer", minWidth: 54 }}
      >
        <span style={{ fontSize: 18 }}>⋯</span>
        <span>Panel</span>
      </button>
    </div>
  );
};

const ScrollTopButton = ({ visible }) => (
  <button
    className="focus-ring mobile-scroll-top"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    style={{
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      transform: visible ? "translateY(0)" : "translateY(12px)",
    }}
  >
    ↑ Top
  </button>
);

const getHashTab = () => {
  const hash = window.location.hash.replace(/^#/, "").trim();
  return TABS.some((tab) => tab.id === hash) ? hash : null;
};

const MobileQuickPanel = ({ open, active, setActive, onClose, onBack, canGoBack }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mobile-sheet-backdrop" onClick={onClose}>
      <div className="mobile-sheet" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Quick actions">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 17 }}>Quick access</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Move around without scrolling</div>
          </div>
          <button className="focus-ring" onClick={onClose} style={{ border: "1px solid var(--card-border)", background: "var(--chip-bg)", color: "var(--text)", borderRadius: 999, padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}>
            Close
          </button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <button
            className="focus-ring"
            onClick={() => { if (canGoBack) onBack(); onClose(); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid var(--card-border)", background: canGoBack ? "var(--chip-bg)" : "var(--panel-bg)", color: canGoBack ? "var(--text-strong)" : "var(--text-muted)", borderRadius: 14, padding: "12px 14px", cursor: canGoBack ? "pointer" : "default" }}
          >
            <span>← Back</span>
            <span style={{ fontSize: 12 }}>{canGoBack ? "Previous screen" : "No history yet"}</span>
          </button>
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{group.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 8 }}>{group.hint}</div>
              <div className="mobile-sheet-grid">
                {group.ids.map((id) => {
                  const item = TABS.find((tab) => tab.id === id);
                  if (!item) return null;
                  return (
                    <button
                      key={item.id}
                      className="focus-ring"
                      onClick={() => { setActive(item.id); onClose(); }}
                      style={{ border: active === item.id ? "1px solid #3b82f6" : "1px solid var(--card-border)", background: active === item.id ? "#1d4ed822" : "var(--chip-bg)", color: active === item.id ? "#60a5fa" : "var(--text)", borderRadius: 14, padding: "12px 10px", cursor: "pointer", textAlign: "left" }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, selected, confirmed, onSelect }) => (
  <>
    <Card style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(8,12,20,0.92))", border: "1px solid #1e3a5f" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17, lineHeight: 1.5 }}>{question.q}</div>
      <div style={{ marginTop: 10 }}><Badge text={inferTopic(question)} color="#60a5fa" /></div>
    </Card>
    <div style={{ display: "grid", gap: 8 }}>
      {question.opts.map((opt, oi) => {
        let bg = "var(--card-bg)";
        let border = "var(--card-border)";
        let color = "var(--text)";
        if (confirmed) {
          if (oi === question.a) { bg = "#0f1f0f"; border = "#22c55e"; color = "#4ade80"; }
          else if (oi === selected && oi !== question.a) { bg = "#220d0d"; border = "#ef4444"; color = "#fca5a5"; }
          else { color = "var(--text-muted)"; }
        } else if (selected === oi) {
          bg = "#1d4ed822"; border = "#3b82f6"; color = "#bfdbfe";
        }
        return (
          <button key={oi} className="focus-ring" onClick={() => onSelect(oi)}
            style={{ padding: "14px 16px", borderRadius: 14, border: `2px solid ${border}`, cursor: confirmed ? "default" : "pointer", background: bg, color, textAlign: "left", fontSize: 14, transition: "all 0.15s" }}>
            <span style={{ marginRight: 8, opacity: 0.7, fontWeight: 700 }}>{["A", "B", "C", "D"][oi]}.</span>{opt}
            {confirmed && oi === question.a && " ✓"}
            {confirmed && oi === selected && oi !== question.a && " ✗"}
          </button>
        );
      })}
    </div>
  </>
);

// ── TAB BAR ──────────────────────────────────────────────────
const TabBar = ({ active, setActive, menuOpen, setMenuOpen, isDark, toggleDark, onBack, canGoBack, openQuickPanel }) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <div style={{ borderBottom: "1px solid var(--card-border)", background: "var(--header-bg)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px" }}>
        <button aria-label={menuOpen ? "Close topics menu" : "Open topics menu"} className="focus-ring" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-strong)", borderRadius: 12, padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>
          ☰
        </button>
        <button aria-label="Go back" className="focus-ring" onClick={onBack} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: canGoBack ? "#f8fafc" : "var(--text-muted)", borderRadius: 12, padding: "8px 12px", cursor: canGoBack ? "pointer" : "default", fontSize: 15, fontWeight: 800 }}>
          ←
        </button>
        <button aria-label="Go to home" className="focus-ring" onClick={() => setActive("home")} style={{ background: "none", border: "none", color: "#60a5fa", fontWeight: 800, fontSize: 18, cursor: "pointer", padding: 0 }}>
          🇬🇧 Life in the UK
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener"
            style={{ color: "var(--text-muted)", fontSize: 12, textDecoration: "none", padding: "6px 10px", borderRadius: 999, border: "1px solid var(--card-border)", background: "var(--card-bg)", whiteSpace: "nowrap" }}>
            ⭐ GitHub
          </a>
          <button aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="focus-ring" onClick={toggleDark} title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-strong)", borderRadius: 12, padding: "6px 10px", cursor: "pointer", fontSize: 15 }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <button aria-label="Open quick panel" className="focus-ring mobile-only" onClick={openQuickPanel} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-strong)", borderRadius: 12, padding: "6px 10px", cursor: "pointer", fontSize: 15 }}>
            ⋯
          </button>
        </div>
        </div>
        <div className="desktop-nav-panel desktop-only">
          <div className="desktop-nav-group">
            <div className="desktop-nav-label">Main</div>
            <div className="desktop-nav-row">
              {TABS.filter((tab) => PRIMARY_DESKTOP_TABS.includes(tab.id)).map((tab) => (
                <button
                  key={tab.id}
                  className="focus-ring desktop-nav-chip"
                  onClick={() => setActive(tab.id)}
                  data-active={active === tab.id ? "true" : "false"}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              <button
                className="focus-ring desktop-nav-chip"
                onClick={() => setMenuOpen(true)}
                data-active={menuOpen ? "true" : "false"}
              >
                ☰ All Topics
              </button>
            </div>
          </div>
          {NAV_GROUPS.slice(1).map((group) => (
            <div key={group.title} className="desktop-nav-group">
              <div className="desktop-nav-label">{group.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>{group.hint}</div>
              <div className="desktop-nav-row">
                {group.ids.map((id) => {
                  const tab = TABS.find((item) => item.id === id);
                  if (!tab) return null;
                  return (
                    <button
                      key={tab.id}
                      className="focus-ring desktop-nav-chip"
                      onClick={() => setActive(tab.id)}
                      data-active={active === tab.id ? "true" : "false"}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mobile-primary-strip mobile-only noscroll">
          {TABS.filter((tab) => PRIMARY_MOBILE_TABS.includes(tab.id)).map((tab) => (
            <button
              key={tab.id}
              className="focus-ring mobile-primary-chip"
              onClick={() => setActive(tab.id)}
              data-active={active === tab.id ? "true" : "false"}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <button className="focus-ring mobile-primary-chip" onClick={openQuickPanel}>
            ☰ Topics
          </button>
        </div>
      </div>
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Topics menu" style={{ position: "fixed", inset: 0, background: "#020617cc", zIndex: 200 }} onClick={() => setMenuOpen(false)}>
          <div style={{ background: "var(--card-bg)", width: 340, maxWidth: "86vw", height: "100%", overflowY: "auto", padding: 18, borderRight: "1px solid var(--card-border)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ color: "#60a5fa", fontWeight: 800, marginBottom: 6, fontSize: 18 }}>🇬🇧 Study navigation</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>Main study flows first, then grouped topic sections.</div>
            {NAV_GROUPS.map((group) => (
              <div key={group.title} style={{ marginBottom: 14 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{group.title}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 8 }}>{group.hint}</div>
                {group.ids.map((id) => {
                  const t = TABS.find((tab) => tab.id === id);
                  if (!t) return null;
                  return (
                    <button key={t.id} className="focus-ring" onClick={() => { setActive(t.id); setMenuOpen(false); }}
                      style={{ display: "block", width: "100%", padding: "12px 16px", background: active === t.id ? "#1e3a5f" : "none", border: "none", cursor: "pointer", textAlign: "left", color: active === t.id ? "#bfdbfe" : "var(--text)", borderRadius: 12, marginBottom: 4, fontSize: 15 }}>
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ── HOME ─────────────────────────────────────────────────────
const HomeTab = ({ setActive, wrongQuestions, mockHistory }) => {
  const latestMock = mockHistory[0];
  const [factOrder, setFactOrder] = useState(() => shuffleList(TOP_TESTED_FACTS));
  const [factPage, setFactPage] = useState(0);
  const visibleFacts = useMemo(() => {
    const start = factPage * 10;
    const slice = factOrder.slice(start, start + 10);
    return slice.length === 10 ? slice : [...slice, ...factOrder.slice(0, Math.max(0, 10 - slice.length))];
  }, [factOrder, factPage]);
  const refreshFacts = () => {
    setFactOrder(shuffleList(TOP_TESTED_FACTS));
    setFactPage(0);
  };
  const nextFacts = () => {
    const pages = Math.max(1, Math.ceil(factOrder.length / 10));
    setFactPage((value) => (value + 1) % pages);
  };

  return (
    <div style={{ padding: 20 }}>
      <Card style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,95,0.7))", border: "1px solid #1d4ed8" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#eff6ff", fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Life in the UK revision hub</div>
            <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>Study by topic, compare traps, run mocks, and revise mistakes quickly.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={() => setActive("mock")} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", fontWeight: 800, cursor: "pointer" }}>Mock Test</button>
            <button className="focus-ring" onClick={() => setActive("quickrev")} style={{ background: "#1d4ed822", color: "#bfdbfe", border: "1px solid #3b82f6", borderRadius: 12, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}>Quick Revise</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <Badge text="24 questions" color="#3b82f6" />
          <Badge text="45 minutes" color="#10b981" />
          <Badge text="75% to pass" color="#f59e0b" />
          <Badge text={`${ALL_QUIZ.length} quiz prompts`} color="#ef4444" />
        </div>
      </Card>

      <div className="stats-grid" style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        <StatTile label="Wrong answers saved" value={wrongQuestions.length} color="#ef4444" />
        <StatTile label="Mock attempts saved" value={mockHistory.length} color="#3b82f6" />
        <StatTile label="Last mock score" value={latestMock ? `${latestMock.score}/24` : "0/24"} color="#10b981" />
        <StatTile label="Best recent result" value={mockHistory.length ? `${Math.max(...mockHistory.map((x) => x.percent))}%` : "0%"} color="#f59e0b" />
      </div>

      <Card style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(8,145,178,0.16))", border: "1px solid #0ea5e9" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <div style={{ color: "#e0f2fe", fontWeight: 800, fontSize: 18 }}>Visual memory clues</div>
            <div style={{ color: "#bae6fd", fontSize: 13 }}>Short codes from the revision pack, now built into the app</div>
          </div>
          <Badge text={`${VISUAL_MNEMONICS.length} memory packs`} color="#06b6d4" />
        </div>
        <div className="study-mode-grid" style={{ display: "grid", gap: 10 }}>
          {VISUAL_MNEMONICS.map((item) => (
            <div key={item.code} style={{ background: item.color + "18", border: `1px solid ${item.color}44`, borderRadius: 16, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.icon} {item.title}</div>
                <Badge text={item.code} color={item.color} />
              </div>
              <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>{item.clue}</div>
              <div style={{ color: "#bae6fd", fontSize: 12, lineHeight: 1.6 }}>{item.visual}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ border: "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Coverage checklist</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Handbook-style areas organised for quick navigation</div>
          </div>
          <Badge text={`${COVERAGE_AREAS.length} areas covered`} color="#22c55e" />
        </div>
        <div className="study-mode-grid" style={{ display: "grid", gap: 10 }}>
          {COVERAGE_AREAS.map((item) => (
            <button key={item.title} className="focus-ring" onClick={() => setActive(item.tab)} style={{ border: "1px solid var(--card-border)", background: "var(--panel-bg)", color: "var(--text)", borderRadius: 16, padding: 12, textAlign: "left", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 14 }}>{item.icon} {item.title}</div>
                <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 13 }}>✓</span>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{item.detail}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="study-mode-grid" style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        {[
          { id: "mock", icon: "📝", title: "Mock Test", desc: "Real exam format: 24 questions, 45 minutes, results at the end.", color: "#f97316" },
          { id: "confuse", icon: "⚖️", title: "Compare Confusions", desc: "Side-by-side answers for the facts learners mix up most.", color: "#7c3aed" },
          { id: "revise", icon: "🧩", title: "Revise Mistakes", desc: "Retry only the questions you previously got wrong.", color: "#ef4444" },
          { id: "timeline", icon: "📅", title: "Timeline Drill", desc: "Use date anchors and memory cues to fix history quickly.", color: "#3b82f6" },
        ].map((item) => (
          <button key={item.id} className="focus-ring" onClick={() => setActive(item.id)} style={{ background: "var(--card-bg)", border: `1px solid ${item.color}44`, borderRadius: 18, padding: 18, textAlign: "left", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 26 }}>{item.icon}</div>
              <Badge text="Study mode" color={item.color} />
            </div>
            <div style={{ color: "var(--text-strong)", fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{item.title}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
          </button>
        ))}
      </div>

      <Card style={{ background: "linear-gradient(135deg, #10261a, #111827)", border: "1px solid #166534" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#4ade80" }}>🎯 Top 10 Most-Tested Facts</div>
            <div style={{ fontSize: 13, color: "#a7f3d0", marginTop: 4 }}>Refresh for a new mix or move to the next batch.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={refreshFacts} style={{ background: "#166534", color: "#ecfdf5", border: "1px solid #22c55e", borderRadius: 12, padding: "9px 12px", cursor: "pointer", fontWeight: 700 }}>Refresh facts</button>
            <button className="focus-ring" onClick={nextFacts} style={{ background: "#0f172a", color: "#bbf7d0", border: "1px solid #166534", borderRadius: 12, padding: "9px 12px", cursor: "pointer", fontWeight: 700 }}>Next 10</button>
          </div>
        </div>
        {visibleFacts.map((fact, index) => (
          <div key={fact} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: index < 9 ? "1px solid rgba(74,222,128,0.15)" : "none" }}>
            <div style={{ color: "#4ade80", fontWeight: 800, minWidth: 22 }}>{index + 1}.</div>
            <div style={{ color: "#d1fae5", fontSize: 14, lineHeight: 1.5 }}>{fact}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

const QuickRevisionTab = ({ setActive }) => {
  const deck = useMemo(() => buildQuickRevisionDeck(), []);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const touchStartRef = useRef(null);
  const current = deck[index];

  const move = (direction) => {
    setIndex((value) => {
      if (direction === "next") return (value + 1) % deck.length;
      return (value - 1 + deck.length) % deck.length;
    });
    setFlipped(false);
  };

  const onTouchStart = (event) => {
    touchStartRef.current = event.changedTouches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartRef.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(delta) > 45) move(delta < 0 ? "next" : "prev");
    touchStartRef.current = null;
  };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="↔️" meta="Swipe left or right for fast all-topic revision. Tap the card to flip it.">Quick Revision</SectionTitle>
      <Card style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(14,165,233,0.18))", border: "1px solid #0ea5e9" }}>
        <div style={{ color: "#e0f2fe", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>All-topic rapid recap</div>
        <div style={{ color: "#bae6fd", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
          Flip each card for the answer. Swipe left or right to move through the deck quickly.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge text={`${deck.length} cards`} color="#06b6d4" />
          <Badge text="Flip card" color="#3b82f6" />
          <Badge text="All core topics covered" color="#22c55e" />
        </div>
      </Card>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button className="focus-ring" onClick={() => move("prev")} style={{ border: "1px solid var(--card-border)", background: "var(--chip-bg)", color: "var(--text)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>← Previous</button>
        <button className="focus-ring" onClick={() => setFlipped((v) => !v)} style={{ border: "1px solid #3b82f6", background: "#1d4ed822", color: "#bfdbfe", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>{flipped ? "Show front" : "Flip card"}</button>
        <button className="focus-ring" onClick={() => move("next")} style={{ border: "1px solid var(--card-border)", background: "var(--chip-bg)", color: "var(--text)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>Next →</button>
        <div style={{ marginLeft: "auto" }}><Badge text={`${index + 1} / ${deck.length}`} color={current.color} /></div>
      </div>
      <Card
        className="quick-revision-card"
        onClick={() => setFlipped((v) => !v)}
        style={{ border: `1px solid ${current.color}66`, background: `linear-gradient(135deg, ${current.color}1f, rgba(15,23,42,0.96))`, cursor: "pointer", userSelect: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <Badge text={current.topic} color={current.color} />
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{flipped ? "Back of card" : "Front of card"}</div>
        </div>
        <div style={{ minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: flipped ? 24 : 28, lineHeight: 1.35, marginBottom: 10 }}>
            {flipped ? current.back : current.front}
          </div>
          <div style={{ color: flipped ? "#cbd5e1" : "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>
            {flipped ? current.memory : "Tap to reveal the answer or swipe to move on."}
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 10 }}>Coverage checklist</div>
        <div className="study-mode-grid" style={{ display: "grid", gap: 8 }}>
          {COVERAGE_AREAS.map((item) => (
            <button key={item.title} className="focus-ring" onClick={() => setActive(item.tab)} style={{ border: "1px solid var(--card-border)", background: "var(--panel-bg)", color: "var(--text)", borderRadius: 14, padding: "12px 14px", cursor: "pointer", textAlign: "left" }}>
              <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 4 }}>{item.icon} {item.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{item.detail}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ── TIMELINE ─────────────────────────────────────────────────
const TimelineTab = () => {
  const eras = ["All", "Ancient", "Roman", "Medieval", "Tudor", "Stuart", "Georgian", "Victorian", "Modern"];
  const [era, setEra] = useState("All");
  const [search, setSearch] = useState("");
  const anchors = [
    { year: "55 BC", clue: "Caesar fails", color: "#7c3aed" },
    { year: "43 AD", clue: "Claudius succeeds", color: "#b45309" },
    { year: "1066", clue: "Norman Conquest", color: "#dc2626" },
    { year: "1215", clue: "Magna Carta", color: "#d97706" },
    { year: "1603 / 1707", clue: "Crowns vs Union", color: "#065f46" },
    { year: "1918 / 1928 / 1969", clue: "Votes timeline", color: "#be185d" },
  ];
  const revisionByEra = {
    All: [
      "55 BC vs 43 AD: Caesar fails, Claudius succeeds",
      "1603 vs 1707 vs 1801: crowns, Great Britain, then United Kingdom",
      "1918 vs 1928 vs 1969: partial vote, equal vote, then age 18",
    ],
    Ancient: [
      "Neolithic farmers arrive after Britain becomes an island",
      "Stonehenge is prehistoric and often paired with Bronze/Iron Age questions",
    ],
    Roman: [
      "Caesar failed in 55 BC, Claudius succeeded in 43 AD",
      "Boudicca fought the Romans, but the Romans stayed in Britain",
      "Hadrian's Wall is Roman, northern England, 122 AD",
    ],
    Medieval: [
      "Augustine = Christianity in England, Athelstan = united England",
      "1066 is the last successful invasion of England",
      "Magna Carta and Model Parliament are law-and-democracy anchors",
    ],
    Tudor: [
      "Henry VIII = Church of England and union laws for Wales",
      "Scotland's Reformation is separate from England's break with Rome",
      "Elizabeth I + Armada 1588 is a classic test date",
    ],
    Stuart: [
      "1603 crowns joined, but parliaments stayed separate until 1707",
      "Civil War: Roundheads = Parliament, Cavaliers = King",
      "1688–89 Glorious Revolution and Bill of Rights limit royal power",
    ],
    Georgian: [
      "1707 creates Great Britain; 1801 creates the United Kingdom",
      "Walpole = first PM, Nelson = Trafalgar, Wellington = Waterloo",
      "1807 ends the slave trade, but 1833 ends slavery itself",
    ],
    Victorian: [
      "1832 Reform Act, Chartists, and later votes reforms are linked",
      "Victoria's era is industrial, imperial, and reform-heavy",
      "Great Exhibition and Crimean War are frequent revision anchors",
    ],
    Modern: [
      "Votes timeline: 1918, 1928, 1969",
      "WW2 anchors: 1939, 1940, 1944, 1945, then Beveridge/NHS/Windrush",
      "Modern politics anchors: 1973 EEC, 1998 Good Friday, 1999 devolution, 2020 Brexit",
    ],
  };
  const filtered = TIMELINE.filter((e) =>
    (era === "All" || e.era === era) &&
    (!search || e.event.toLowerCase().includes(search.toLowerCase()) || e.year.toString().includes(search))
  );

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="📅" meta="Use short date anchors first, then the memory clue.">British History Timeline</SectionTitle>
      <Card style={{ background: "linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.9))", border: "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>History anchors to memorise first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>These dates unlock a lot of common compare questions in the test.</div>
          </div>
          <Badge text={`${TIMELINE.length} timeline facts`} color="#38bdf8" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
          {anchors.map((item) => (
            <div key={item.year} style={{ borderRadius: 14, padding: 12, background: `${item.color}14`, border: `1px solid ${item.color}33` }}>
              <div style={{ color: item.color, fontWeight: 800, fontSize: 13 }}>{item.year}</div>
              <div style={{ color: "var(--text-strong)", fontWeight: 700, marginTop: 4 }}>{item.clue}</div>
            </div>
          ))}
        </div>
        <MemoryHook text="Work in pairs: 55 BC vs 43 AD, 1603 vs 1707, and 1918 vs 1928 vs 1969 are classic exam traps." />
      </Card>
      <input className="focus-ring" placeholder="Search events, years, or people..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 14, padding: "11px 14px", color: "var(--text-strong)", marginBottom: 12, fontSize: 14 }} />
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {eras.map((value) => <TabButton key={value} active={era === value} onClick={() => setEra(value)}>{value}</TabButton>)}
      </div>
      <Card style={{ background: "rgba(15,23,42,0.74)", border: "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 16 }}>
            {era === "All" ? "Cross-era revision points" : `${era} revision points`}
          </div>
          <Badge text={`${revisionByEra[era].length} quick reminders`} color="#22c55e" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
          {revisionByEra[era].map((item) => (
            <div key={item} style={{ borderRadius: 14, padding: 12, background: "#0f172a", border: "1px solid #1e293b", color: "var(--text)", fontSize: 14, lineHeight: 1.5 }}>
              {item}
            </div>
          ))}
        </div>
      </Card>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{filtered.length} events</div>
      {filtered.map((ev, i) => (
        <div key={`${ev.year}-${i}`} className="timeline-item" style={{ display: "grid", gridTemplateColumns: "90px 26px 1fr", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
          <div className="timeline-year" style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: ev.color }}>{ev.year}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{ev.era}</div>
          </div>
          <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: ev.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>{ev.icon}</div>
            <div style={{ width: 2, flexGrow: 1, background: "#1f2937", marginTop: 2, minHeight: 38 }} />
          </div>
          <Card style={{ marginBottom: 0, background: "rgba(15,23,42,0.72)", border: `1px solid ${ev.color}33` }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <Badge text={ev.era} color={ev.color} />
              <Badge text={ev.year} color="#64748b" />
            </div>
            <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 14, lineHeight: 1.6 }}>{ev.event}</div>
            <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
              {buildTimelineDetails(ev).map((point) => (
                <div key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "#cbd5e1", fontSize: 13, lineHeight: 1.55 }}>
                  <span style={{ color: ev.color, fontWeight: 800 }}>•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <MemoryHook text={ev.memory} />
          </Card>
        </div>
      ))}
    </div>
  );
};

// ── 4 NATIONS ────────────────────────────────────────────────
const NationsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏴" meta="Use comparison blocks to separate nation facts quickly.">The 4 Nations</SectionTitle>
    <Card style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(220,38,38,0.1))", border: "1px solid #334155" }}>
      <div className="compare-grid" style={{ display: "grid", gap: 10 }}>
        <div style={{ background: "#1e3a5f33", borderRadius: 14, padding: 12 }}>
          <div style={{ fontWeight: 800, color: "#93c5fd", marginBottom: 6 }}>Great Britain</div>
          <div style={{ color: "var(--text)", fontSize: 14 }}>England + Scotland + Wales = 3 nations</div>
        </div>
        <div style={{ background: "#dc262633", borderRadius: 14, padding: 12 }}>
          <div style={{ fontWeight: 800, color: "#fecaca", marginBottom: 6 }}>United Kingdom</div>
          <div style={{ color: "var(--text)", fontSize: 14 }}>Great Britain + Northern Ireland = 4 nations</div>
        </div>
      </div>
      <MemoryHook text="UK = GB + Northern Ireland. One extra nation." />
    </Card>
    <Card style={{ background: "rgba(15,23,42,0.78)", border: "1px solid #334155" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <div>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>4 Nations quick compare</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Best for capitals, saints, symbols, and parliament differences.</div>
        </div>
        <Badge text="High-yield nation facts" color="#22c55e" />
      </div>
      <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
        {[
          "LECB = London, Edinburgh, Cardiff, Belfast.",
          "England has no separate parliament. The other 3 nations have devolved bodies.",
          "St George, St Andrew, St David, St Patrick = key nation-day sequence.",
          "Rose, thistle, daffodil, shamrock = nation flowers.",
        ].map((item) => (
          <div key={item} style={{ borderRadius: 14, padding: 12, background: "#0f172a", border: "1px solid #1e293b", color: "var(--text)", fontSize: 14, lineHeight: 1.55 }}>
            {item}
          </div>
        ))}
      </div>
    </Card>
    {NATIONS.map((n) => (
      <Card key={n.name} style={{ border: `1px solid ${n.color}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{n.flag}</span>
          <div>
            <h3 style={{ color: n.color, fontWeight: 800, fontSize: 22 }}>{n.name}</h3>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{n.pop} of UK population</div>
          </div>
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          {[["🙏 Saint", n.saint], ["📅 Day", n.day], ["🌸 Flower", n.flower], ["🏙️ Capital", n.capital], ["🗣️ Language", n.lang], ["🍽️ Food", n.food]].map(([label, val]) => (
            <div key={label} style={{ background: "var(--panel-bg)", borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13, color: "var(--text-strong)", fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#818cf8", fontWeight: 800, marginBottom: 4 }}>🏛️ Parliament</div>
          <div style={{ fontSize: 13, color: "#c7d2fe", lineHeight: 1.6 }}>{n.parliament}</div>
        </div>
        <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
          {NATION_KEY_POINTS[n.name].map((point) => (
            <div key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 13, lineHeight: 1.55, background: "var(--panel-bg)", borderRadius: 12, padding: "10px 12px" }}>
              <span style={{ color: n.color, fontWeight: 800 }}>•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
        {n.tricks.map((t, i) => (
          <div key={i} style={{ fontSize: 13, color: "#fde68a", padding: "5px 0", borderBottom: i < n.tricks.length - 1 ? "1px solid #27272a" : "none" }}>⚡ {t}</div>
        ))}
      </Card>
    ))}
  </div>
);

// ── CONFUSABLES ──────────────────────────────────────────────
const ConfuseTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="⚠️" meta="These side-by-side cards are the fastest way to stop mixing common exam traps.">Don't Confuse These</SectionTitle>
    <Card style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(15,23,42,0.9))", border: "1px solid #334155" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <div>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Comparison revision pack</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Best for facts that are similar enough to confuse, but different enough to cost marks.</div>
        </div>
        <Badge text={`${CONFUSABLES.length} comparison cards`} color="#f97316" />
      </div>
      <MemoryHook text="Use these in pairs: read the left side, cover the right side, then say the difference out loud before checking." />
    </Card>
    {CONFUSABLES.map((c, i) => (
      <Card key={i} style={{ border: "1px solid #374151" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>{c.icon} {c.title}</div>
          <Badge text="Exam trap comparison" color="#f97316" />
        </div>
        <div className="compare-grid" style={{ display: "grid", gap: 10, marginBottom: 10 }}>
          {[c.left, c.right].map((side, si) => (
            <div key={si} style={{ background: side.color + "11", border: `1px solid ${side.color}44`, borderRadius: 14, padding: 12 }}>
              <div style={{ fontWeight: 800, color: side.color, marginBottom: 8, fontSize: 13 }}>{side.label}</div>
              {side.points.map((p, pi) => (
                <div key={pi} style={{ fontSize: 13, color: "var(--text)", padding: "5px 0", borderBottom: pi < side.points.length - 1 ? `1px solid ${side.color}22` : "none", lineHeight: 1.55 }}>{p}</div>
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
  const cats = ["All", "Medicine", "Computing", "Engineering", "Electronics", "Physics", "Biology"];
  const [cat, setCat] = useState("All");
  const filtered = INVENTORS.filter((i) => cat === "All" || i.link === cat);
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="💡" meta="Inventors are easier to remember by category and visual icon.">British Inventors & Scientists</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {cats.map((c) => <TabButton key={c} active={cat === c} onClick={() => setCat(c)}>{c}</TabButton>)}
      </div>
      {filtered.map((inv, i) => (
        <Card key={i}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{inv.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{inv.who}</span>
                <Badge text={inv.nation} color="#64748b" />
                <Badge text={inv.link} color="#3b82f6" />
                {inv.when && <Badge text={inv.when} color="#d97706" />}
              </div>
              <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{inv.what}</div>
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
      <div style={{ fontWeight: 800, color: "#4ade80", marginBottom: 8 }}>🏟️ Olympics Key Facts</div>
      <div style={{ color: "#d1fae5", fontSize: 14, lineHeight: 1.8 }}>
        • UK hosted Olympics 3 times: 1908, 1948, 2012<br />
        • 2012: UK finished 3rd in the medal table<br />
        • Scotland has 5 ski resorts
      </div>
      <MemoryHook text="Three times: 1908, 1948, 2012." />
    </Card>
    {SPORTS_STARS.map((s, i) => (
      <Card key={i}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontSize: 32, flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{s.name}</span>
              <Badge text={s.sport} color="#f59e0b" />
              {s.year && <Badge text={s.year} color="#64748b" />}
            </div>
            <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{s.achievement}</div>
            <MemoryHook text={s.memory} />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// ── KEY FIGURES ──────────────────────────────────────────────
const FiguresTab = () => {
  const figureOrder = [
    "Boudicca",
    "St Augustine",
    "Alfred the Great",
    "Athelstan",
    "William the Conqueror",
    "King John",
    "Edward I",
    "Robert the Bruce",
    "Henry VIII",
    "Elizabeth I",
    "James VI and I",
    "Oliver Cromwell",
    "Sir Edmund Halley",
    "Robert Walpole",
    "Lord Nelson",
    "Duke of Wellington",
    "William Wilberforce",
    "Sake Dean Mahomet",
    "Florence Nightingale",
    "Mary Seacole",
    "Queen Victoria",
    "Emmeline Pankhurst",
    "Winston Churchill",
    "William Beveridge",
    "Clement Attlee",
    "Aneurin (Nye) Bevan",
    "Dr Ludwig Guttmann",
    "Margaret Thatcher",
    "Queen Elizabeth II",
    "James Cook",
    "Stephen Hawking",
  ];
  const orderMap = Object.fromEntries(figureOrder.map((name, index) => [name, index]));
  const figures = [...KEY_FIGURES, ...EXTRA_KEY_FIGURES]
    .filter((figure, index, arr) => arr.findIndex((item) => item.name === figure.name) === index)
    .sort((a, b) => (orderMap[a.name] ?? 999) - (orderMap[b.name] ?? 999));
  const figureGroups = [
    { title: "Rulers & union", color: "#3b82f6", items: ["Alfred", "Athelstan", "William", "Henry VIII", "James VI and I"] },
    { title: "Rights & reform", color: "#10b981", items: ["King John", "Wilberforce", "Pankhurst", "Beveridge", "Bevan"] },
    { title: "War & defence", color: "#f97316", items: ["Boudicca", "Robert the Bruce", "Nelson", "Wellington", "Churchill"] },
    { title: "Science & culture", color: "#a855f7", items: ["Halley", "Cook", "Hawking", "Sake Dean Mahomet", "Guttmann"] },
  ];

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="👑" meta="High-yield people for the test, ordered for faster revision and comparison.">Key Historical Figures</SectionTitle>
      <Card style={{ background: "linear-gradient(135deg, rgba(29,78,216,0.18), rgba(15,23,42,0.96))", border: "1px solid #1d4ed866" }}>
        <div style={{ fontWeight: 800, color: "#bfdbfe", marginBottom: 8, fontSize: 15 }}>Quick figure map</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
          Use the groups below to remember who belongs to conquest, rights, war, welfare, and science. These links reduce mix-ups in mocks.
        </div>
        <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {figureGroups.map((group) => (
            <div key={group.title} style={{ background: "var(--panel-bg)", border: `1px solid ${group.color}44`, borderRadius: 16, padding: 12 }}>
              <div style={{ color: group.color, fontWeight: 800, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{group.title}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {group.items.map((item) => <Badge key={item} text={item} color={group.color} />)}
              </div>
            </div>
          ))}
        </div>
      </Card>
      {figures.map((f) => (
        <Card key={f.name} style={{ border: `1px solid ${f.color}33` }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</div>
              <div style={{ color: f.color, fontSize: 12, fontWeight: 700 }}>{f.role}</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {f.facts.map((fact, fi) => (
              <div key={fi} style={{ fontSize: 13, color: "var(--text)", padding: "5px 0", borderBottom: fi < f.facts.length - 1 ? "1px solid #1f2937" : "none", lineHeight: 1.6 }}>• {fact}</div>
            ))}
          </div>
          {FIGURE_MEMORY[f.name] && <MemoryHook text={FIGURE_MEMORY[f.name]} />}
        </Card>
      ))}
    </div>
  );
};

// ── RELIGION ─────────────────────────────────────────────────
const ReligionTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="⛪">Religion & Festivals</SectionTitle>
    <Card style={{ background: "#0f172a", border: "1px solid #1e3a5f" }}>
      <div style={{ fontWeight: 800, color: "#60a5fa", marginBottom: 12 }}>📊 2011 Census — Religious Identity</div>
      {RELIGIONS.map((r) => (
        <div key={r.faith} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15 }}>{r.icon} <span style={{ color: "var(--text-strong)", fontWeight: 700 }}>{r.faith}</span></span>
            <Badge text={r.pct} color={r.color} />
          </div>
          <div style={{ background: "#1f2937", borderRadius: 999, height: 10, overflow: "hidden" }}>
            <div className="bar-fill" style={{ height: "100%", borderRadius: 999, background: r.color, width: `${Math.min(r.bar, 100)}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{r.note}</div>
        </div>
      ))}
    </Card>
    {FESTIVALS.map((f, i) => (
      <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</span>
          <Badge text={f.date} color="#d97706" />
        </div>
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>{f.faith}</div>
        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{f.detail}</div>
      </Card>
    ))}
  </div>
);

// ── LANDMARKS ────────────────────────────────────────────────
const LandmarksTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏛️" meta="Use location + one distinctive clue for each landmark.">Landmarks & Places</SectionTitle>
    {LANDMARKS.map((l, i) => (
      <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{l.name}</div>
          <Badge text={l.where} color="#64748b" />
        </div>
        <div style={{ color: "var(--text)", fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>{l.fact}</div>
        <TrapAlert text={l.trap} />
      </Card>
    ))}
  </div>
);

// ── INTERNATIONAL ────────────────────────────────────────────
const InternationalTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🌍">International Organisations</SectionTitle>
    <TrapAlert text="Council of Europe ≠ EU. Council has 47 members and cannot make laws. EU has 27 and can." />
    <div style={{ marginTop: 16 }}>
      {INT_ORGS.map((o, i) => (
        <Card key={i}>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 16, marginBottom: 6 }}>{o.name}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <Badge text={o.members} color="#3b82f6" />
            <Badge text={o.power} color={o.power.includes("CANNOT") ? "#ef4444" : "#10b981"} />
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4, lineHeight: 1.6 }}><strong style={{ color: "#9ca3af" }}>Purpose:</strong> {o.purpose}</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.6 }}><strong style={{ color: "#9ca3af" }}>UK's role:</strong> {o.ukRole}</div>
          <MemoryHook text={o.memory} />
        </Card>
      ))}
    </div>
  </div>
);

// ── ARTS ─────────────────────────────────────────────────────
const ArtsTab = () => {
  const sections = [
    { key: "literature", label: "📚 Literature", color: "#3b82f6" },
    { key: "music", label: "🎵 Music", color: "#8b5cf6" },
    { key: "art", label: "🎨 Art", color: "#ec4899" },
    { key: "architecture", label: "🏛️ Architecture", color: "#f59e0b" },
    { key: "fashion", label: "👗 Fashion", color: "#10b981" },
    { key: "film", label: "🎬 Film", color: "#ef4444" },
  ];
  const [active, setActive] = useState("literature");
  const sec = sections.find((s) => s.key === active);
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="🎭">Arts & Culture</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {sections.map((s) => <TabButton key={s.key} active={active === s.key} onClick={() => setActive(s.key)}>{s.label}</TabButton>)}
      </div>
      {(ARTS[active] || []).map((item, i) => (
        <Card key={i}>
          <div style={{ fontWeight: 800, color: sec ? sec.color : "#f9fafb", fontSize: 14, marginBottom: 4 }}>{item.who}</div>
          <div style={{ color: "var(--text)", fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>{item.what}</div>
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
      <div style={{ fontWeight: 800, color: "#60a5fa", marginBottom: 4 }}>{ANTHEM.title}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{ANTHEM.note}</div>
      <div style={{ background: "#111827", borderRadius: 14, padding: 16, borderLeft: "4px solid #1e3a5f" }}>
        {ANTHEM.words.map((line, i) => (
          <div key={i} style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 2, fontStyle: "italic" }}>{line}</div>
        ))}
      </div>
      <MemoryHook text={ANTHEM.memory} />
    </Card>
    <Card style={{ background: "#0f0a0a", border: "1px solid #7f1d1d" }}>
      <div style={{ fontWeight: 800, color: "#fca5a5", marginBottom: 10 }}>🇬🇧 The Union Jack</div>
      <div style={{ fontSize: 13, color: "#fecaca", lineHeight: 1.8 }}>
        • St George's Cross (England) — red cross on white<br />
        • St Andrew's Cross (Scotland) — white diagonal cross on blue<br />
        • St Patrick's Cross (N. Ireland) — red diagonal cross on white<br />
        • Wales is not included because it was already united with England
      </div>
      <TrapAlert text="Wales has no representation in the Union Jack." />
    </Card>
  </div>
);

// ── QUICK FACTS ──────────────────────────────────────────────
const QuickFactsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="⚡">Quick Facts</SectionTitle>
    {QUICK_FACTS.map((section, si) => (
      <Card key={si} style={{ border: `1px solid ${section.color}33` }}>
        <div style={{ fontWeight: 800, color: section.color, marginBottom: 10, fontSize: 15 }}>{section.icon} {section.cat}</div>
        {section.facts.map((f, fi) => (
          <div key={fi} style={{ fontSize: 13, color: "var(--text)", padding: "5px 0", borderBottom: fi < section.facts.length - 1 ? "1px solid #1f2937" : "none", lineHeight: 1.6 }}>
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
  const [answerMode, setAnswerMode] = useState("instant");
  const [showContext, setShowContext] = useState(true);
  const advanceRef = useRef(null);

  const filters = [
    { id: "all", label: "All Topics", icon: "🎯" },
    { id: "star", label: "Exam Favourites", icon: "⭐" },
    { id: "pin", label: "Often Tested", icon: "📌" },
    { id: "bulb", label: "Good to Know", icon: "💡" },
  ];

  const filterQuestions = () => {
    if (filter === "all") return ALL_QUIZ;
    const prefix = { star: "⭐", pin: "📌", bulb: "💡" }[filter];
    return ALL_QUIZ.filter((q) => q.tip.startsWith(prefix));
  };

  const resetFlow = (pool) => {
    const n = Math.min(count, pool.length);
    setQuestions(pickRandomNoRepeat(pool, n, STORAGE_KEYS.recentQuiz, 120));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setWrong([]);
    setFinished(false);
    setReviewMode(false);
    setStarted(true);
  };

  const startQuiz = () => resetFlow(filterQuestions());

  const handleSelect = (oi) => {
    if (confirmed || selected !== null) return;
    setSelected(oi);
    if (answerMode === "instant") {
      setConfirmed(true);
      if (oi === questions[current].a) setScore((s) => s + 1);
      else setWrong((w) => [...w, { ...questions[current], chosen: oi }]);
      if (advanceRef.current) clearTimeout(advanceRef.current);
      advanceRef.current = setTimeout(() => {
        if (current + 1 >= questions.length) {
          setFinished(true);
          return;
        }
        setCurrent((c) => c + 1);
        setSelected(null);
        setConfirmed(false);
      }, 2200);
    }
  };

  useEffect(() => () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
  }, []);

  useEffect(() => {
    if (finished) saveWrongQuestions(wrong);
  }, [finished, wrong]);

  const skipToNext = () => {
    if (advanceRef.current) clearTimeout(advanceRef.current);
    if (!confirmed && answerMode === "deferred" && selected !== null) {
      const q = questions[current];
      if (selected === q.a) setScore((s) => s + 1);
      else setWrong((w) => [...w, { ...q, chosen: selected }]);
    }
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setConfirmed(false);
  };

  if (!started) {
    const pool = filterQuestions();
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="🧠" meta="Use this for broad recall with instant feedback.">Quiz Me</SectionTitle>
        <Card style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(29,78,216,0.18))", border: "1px solid #1e3a5f", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
              <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Test your knowledge</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>{pool.length} questions available</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10 }}>Filter by frequency</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                  {filters.map((f) => <TabButton key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.icon} {f.label}</TabButton>)}
                </div>
              </div>
              <SettingGroup
                label="When should answers be shown?"
                value={answerMode}
                onChange={setAnswerMode}
                options={[
                  { value: "instant", label: "Show now" },
                  { value: "deferred", label: "Show at end" },
                ]}
              />
              <SettingGroup
                label="Show memory tips and context?"
                value={showContext ? "yes" : "no"}
                onChange={(value) => setShowContext(value === "yes")}
                options={[
                  { value: "yes", label: "With context" },
                  { value: "no", label: "Answers only" },
                ]}
              />
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 10 }}>How many questions?</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {[10, 24, 50, pool.length].map((n) => <TabButton key={n} active={count === n} onClick={() => setCount(n)}>{n === pool.length ? `All (${n})` : n}</TabButton>)}
                </div>
              </div>
              <button className="focus-ring" onClick={startQuiz} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                Start Quiz
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
          <div style={{ fontSize: 24, fontWeight: 900, color: pass ? "#4ade80" : "#f87171" }}>{pass ? "Strong recall" : "Revision needed"}</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text-strong)" }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 20, color: pass ? "#4ade80" : "#f87171", marginBottom: 16 }}>{pct}%</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={startQuiz} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", cursor: "pointer", fontWeight: 800 }}>Try Again</button>
            {wrong.length > 0 && <button className="focus-ring" onClick={() => setReviewMode((v) => !v)} style={{ background: "#ef444422", color: "#f87171", border: "1px solid #ef4444", borderRadius: 12, padding: "10px 20px", cursor: "pointer", fontWeight: 800 }}>{reviewMode ? "Hide review" : `Review ${wrong.length} wrong`}</button>}
            <button className="focus-ring" onClick={() => setStarted(false)} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 20px", cursor: "pointer" }}>Back</button>
          </div>
        </Card>
        {answerMode === "deferred" && wrong.length === 0 && (
          <Card style={{ border: "1px solid #166534", background: "#0f1f0f" }}>
            <div style={{ color: "#bbf7d0", fontWeight: 700 }}>All answers were correct. Deferred review is ready when you miss questions.</div>
          </Card>
        )}
        {reviewMode && wrong.map((w, i) => (
          <Card key={i} style={{ border: "1px solid #7f1d1d", background: "#1a0a0a" }}>
            <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 8 }}>Q: {w.q}</div>
            <div style={{ color: "#fca5a5", marginBottom: 4 }}>✗ You chose: {w.opts[w.chosen]}</div>
            <div style={{ color: "#4ade80", marginBottom: 8 }}>✓ Correct: {w.opts[w.a]}</div>
            {showContext && <MemoryHook text={w.tip} />}
          </Card>
        ))}
      </div>
    );
  }

  const q = questions[current];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <Badge text={`${current + 1} / ${questions.length}`} color="#64748b" />
        <Badge text={`Score: ${score}`} color="#22c55e" />
      </div>
      <button className="focus-ring" onClick={() => setStarted(false)} style={{ marginBottom: 12, background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}>
        ← Back to quiz setup
      </button>
      <div style={{ background: "#1f2937", borderRadius: 999, height: 8, marginBottom: 16 }}>
        <div style={{ background: "#3b82f6", height: "100%", borderRadius: 999, width: `${((current + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
      </div>
      <QuestionCard question={q} selected={selected} confirmed={confirmed} onSelect={handleSelect} />
      {confirmed && answerMode === "instant" && (
        <>
          {showContext && <MemoryHook text={q.tip} />}
          <button className="focus-ring" onClick={skipToNext}
            style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 14, background: "#22c55e22", color: "#4ade80", border: "1px solid #22c55e44", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
            {current + 1 < questions.length ? "Next" : "See Results"}
          </button>
        </>
      )}
      {answerMode === "deferred" && (
        <button className="focus-ring" onClick={skipToNext}
          style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 14, background: "#1d4ed822", color: "#bfdbfe", border: "1px solid #3b82f6", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
          {current + 1 < questions.length ? "Lock answer and continue" : "Finish and review"}
        </button>
      )}
    </div>
  );
};

// ── MOCK EXAM ────────────────────────────────────────────────
const MockExamTab = () => {
  const TOTAL = 24;
  const LIMIT_SECONDS = 45 * 60;
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(LIMIT_SECONDS);
  const [answerMode, setAnswerMode] = useState("deferred");
  const [showContext, setShowContext] = useState(true);
  const timerRef = useRef(null);

  const score = questions.reduce((sum, q, index) => sum + (answers[index] === q.a ? 1 : 0), 0);

  const startMock = () => {
    setQuestions(pickRandomNoRepeat([...ALL_QUIZ, ...buildConfusionDeck()], TOTAL, STORAGE_KEYS.recentMock, 140));
    setAnswers({});
    setCurrent(0);
    setTimeLeft(LIMIT_SECONDS);
    setStarted(true);
    setFinished(false);
  };

  useEffect(() => {
    if (!started || finished) return undefined;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  useEffect(() => {
    if (timeLeft === 0 && started && !finished) setFinished(true);
  }, [timeLeft, started, finished]);

  useEffect(() => {
    if (!finished || !questions.length) return;
    const wrong = questions
      .map((q, index) => ({ ...q, chosen: answers[index] }))
      .filter((q, index) => answers[index] !== q.a);
    saveWrongQuestions(wrong);
    saveMockResult({
      date: new Date().toISOString(),
      score,
      percent: Math.round((score / TOTAL) * 100),
      passed: score >= 18,
    });
  }, [finished, questions, answers, score]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const currentQuestion = questions[current];

  if (!started) {
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="📝" meta="This matches the official test format: 24 questions, 45 minutes, no instant feedback.">Mock Test</SectionTitle>
        <Card style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.18), rgba(15,23,42,0.94))", border: "1px solid #dc2626" }}>
              <div style={{ color: "#fca5a5", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Proper exam practice</div>
              <div style={{ color: "#e2e8f0", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                24 questions. 45 minutes. Pass mark 18. Results only at the end. This is the closest mode to the real experience.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                <Badge text="24 questions" color="#f97316" />
                <Badge text="45:00 timer" color="#ef4444" />
                <Badge text="18 needed to pass" color="#22c55e" />
              </div>
              <SettingGroup
                label="When should answers be shown?"
                value={answerMode}
                onChange={setAnswerMode}
                options={[
                  { value: "deferred", label: "At end" },
                  { value: "instant", label: "After each" },
                ]}
              />
              <SettingGroup
                label="Show memory tips and context?"
                value={showContext ? "yes" : "no"}
                onChange={(value) => setShowContext(value === "yes")}
                options={[
                  { value: "yes", label: "With context" },
                  { value: "no", label: "Answers only" },
                ]}
              />
              <button className="focus-ring" onClick={startMock} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 14, padding: "14px 28px", fontWeight: 800, cursor: "pointer" }}>
                Start Mock Exam
              </button>
        </Card>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / TOTAL) * 100);
    const passed = score >= 18;
    const wrong = questions
      .map((q, index) => ({ ...q, chosen: answers[index] }))
      .filter((q, index) => answers[index] !== q.a);

    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="📝">Mock Test Results</SectionTitle>
        <Card style={{ textAlign: "center", border: `2px solid ${passed ? "#22c55e" : "#ef4444"}` }}>
          <div style={{ fontSize: 54, marginBottom: 8 }}>{passed ? "✅" : "📘"}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: passed ? "#4ade80" : "#f87171" }}>{passed ? "Pass standard reached" : "Below pass mark"}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "var(--text-strong)", marginTop: 8 }}>{score}/24</div>
          <div style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 10 }}>{percent}%</div>
          <div style={{ color: passed ? "#4ade80" : "#fca5a5", fontSize: 14, marginBottom: 16 }}>
            {passed ? "You cleared the real test threshold of 18 correct answers." : `You need ${18 - score} more correct answers to reach the pass mark.`}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={startMock} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 800, cursor: "pointer" }}>Retake Mock</button>
            <button className="focus-ring" onClick={() => { setStarted(false); setFinished(false); }} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 20px", cursor: "pointer" }}>Back</button>
          </div>
        </Card>
        {wrong.length > 0 && (
          <Card style={{ border: "1px solid #7f1d1d", background: "#1a0a0a" }}>
            <div style={{ fontWeight: 800, color: "#fca5a5", marginBottom: 12 }}>Revision targets from this mock</div>
            {wrong.map((item, index) => (
              <div key={`${item.q}-${index}`} style={{ padding: "10px 0", borderBottom: index < wrong.length - 1 ? "1px solid rgba(248,113,113,0.15)" : "none" }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.q}</div>
                <div style={{ color: "#fca5a5", fontSize: 13 }}>Your answer: {item.chosen === undefined ? "No answer" : item.opts[item.chosen]}</div>
                <div style={{ color: "#4ade80", fontSize: 13 }}>Correct answer: {item.opts[item.a]}</div>
                {showContext && <MemoryHook text={item.tip} />}
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <Badge text={`Question ${current + 1} of ${TOTAL}`} color="#64748b" />
        <Badge text={`${minutes}:${seconds}`} color={timeLeft > 600 ? "#22c55e" : timeLeft > 300 ? "#f59e0b" : "#ef4444"} />
      </div>
      <div style={{ background: "#1f2937", borderRadius: 999, height: 8, marginBottom: 16 }}>
        <div style={{ background: "#f97316", height: "100%", borderRadius: 999, width: `${(Object.keys(answers).length / TOTAL) * 100}%`, transition: "width 0.2s" }} />
      </div>
      <QuestionCard question={currentQuestion} selected={answers[current]} confirmed={answerMode === "instant" && answers[current] !== undefined} onSelect={(oi) => {
        if (answerMode === "instant" && answers[current] !== undefined) return;
        setAnswers((prev) => ({ ...prev, [current]: oi }));
      }} />
      {answerMode === "instant" && answers[current] !== undefined && (
        <>
          {showContext && <MemoryHook text={currentQuestion.tip} />}
          <div style={{ marginTop: 8, color: answers[current] === currentQuestion.a ? "#4ade80" : "#fca5a5", fontSize: 13, fontWeight: 700 }}>
            {answers[current] === currentQuestion.a ? "Correct" : `Correct answer: ${currentQuestion.opts[currentQuestion.a]}`}
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button className="focus-ring" onClick={() => setCurrent((c) => Math.max(0, c - 1))} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 16px", cursor: "pointer" }}>Previous</button>
        <button className="focus-ring" onClick={() => setCurrent((c) => Math.min(TOTAL - 1, c + 1))} style={{ background: "#1d4ed822", color: "#bfdbfe", border: "1px solid #3b82f6", borderRadius: 12, padding: "10px 16px", cursor: "pointer" }}>Next</button>
        <button className="focus-ring" onClick={() => setFinished(true)} style={{ marginLeft: "auto", background: "#f97316", color: "#fff", border: "none", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 800 }}>Finish Exam</button>
      </div>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 14 }}>
        {questions.map((_, index) => {
          const answered = answers[index] !== undefined;
          return (
            <button key={index} className="focus-ring" onClick={() => setCurrent(index)} style={{ minWidth: 40, height: 40, borderRadius: 999, border: `1px solid ${current === index ? "#f97316" : answered ? "#22c55e" : "#475569"}`, background: current === index ? "#f97316" : answered ? "#0f1f0f" : "var(--chip-bg)", color: current === index ? "#fff" : answered ? "#4ade80" : "var(--text-muted)", cursor: "pointer", fontWeight: 800 }}>
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── REVISE ───────────────────────────────────────────────────
const ReviseTab = () => {
  const [bank, setBank] = useState(() => readStore(STORAGE_KEYS.wrongQuestions, []));
  const [session, setSession] = useState([]);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState({});

  const buckets = useMemo(() => buildRevisionBuckets(bank), [bank]);

  const startRevision = (questions = bank) => {
    if (!questions.length) return;
    setSession(pickRandom(questions, Math.min(questions.length, 12)));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setSessionAnswers({});
    setStarted(true);
  };

  const clearBank = () => {
    writeStore(STORAGE_KEYS.wrongQuestions, []);
    setBank([]);
    setStarted(false);
  };

  const handleSelect = (oi) => {
    if (confirmed) return;
    setSelected(oi);
    setConfirmed(true);
    setSessionAnswers((prev) => ({ ...prev, [current]: oi }));
    if (oi === session[current].a) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    if (current + 1 >= session.length) {
      const finalAnswers = { ...sessionAnswers, [current]: selected };
      const corrected = session.filter((q, index) => finalAnswers[index] === q.a).map((q) => q.q);
      const updatedBank = bank.filter((item) => !corrected.includes(item.q));
      writeStore(STORAGE_KEYS.wrongQuestions, updatedBank);
      setStarted(false);
      setBank(updatedBank);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setConfirmed(false);
  };

  if (!bank.length) {
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="🧩" meta="This space fills automatically from quiz and mock mistakes.">Revise Mistakes</SectionTitle>
        <Card style={{ textAlign: "center", background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(15,23,42,0.9))", border: "1px solid #166534" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>No saved mistakes yet</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}>Finish a quiz or mock test and the wrong answers will appear here for targeted revision.</div>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="🧩" meta="Target the exact questions you previously missed.">Revise Mistakes</SectionTitle>
        <div className="stats-grid" style={{ display: "grid", gap: 12, marginBottom: 16 }}>
          <StatTile label="Saved wrong answers" value={bank.length} color="#ef4444" />
          <StatTile label="Topic groups" value={buckets.length} color="#3b82f6" />
          <StatTile label="Suggested session size" value={Math.min(bank.length, 12)} color="#22c55e" />
          <StatTile label="Hardest area" value={buckets[0] ? buckets[0].topic : "General"} color="#f59e0b" />
        </div>
        <Card style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.18), rgba(15,23,42,0.9))", border: "1px solid #991b1b" }}>
              <div style={{ color: "#fecaca", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Use mistakes as your revision syllabus</div>
              <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                Retake only the facts you missed, or start with the topic cluster that currently causes the most errors.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="focus-ring" onClick={() => startRevision(bank)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px", fontWeight: 800, cursor: "pointer" }}>Revise All Mistakes</button>
                <button className="focus-ring" onClick={clearBank} style={{ background: "transparent", color: "#fecaca", border: "1px solid #7f1d1d", borderRadius: 12, padding: "12px 18px", cursor: "pointer" }}>Clear Saved Mistakes</button>
              </div>
        </Card>
        {buckets.map((bucket) => (
          <Card key={bucket.topic}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 16 }}>{bucket.topic}</div>
              <button className="focus-ring" onClick={() => startRevision(bucket.questions)} style={{ background: "#1d4ed822", color: "#bfdbfe", border: "1px solid #3b82f6", borderRadius: 999, padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}>Revise {bucket.questions.length}</button>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{bucket.questions.slice(0, 3).map((item) => item.q).join(" • ")}</div>
          </Card>
        ))}
      </div>
    );
  }

  const q = session[current];
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="🧩">Mistake Revision Session</SectionTitle>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <Badge text={`${current + 1} / ${session.length}`} color="#64748b" />
        <Badge text={`Correct this round: ${score}`} color="#22c55e" />
      </div>
      <QuestionCard question={q} selected={selected} confirmed={confirmed} onSelect={handleSelect} />
      {confirmed && (
        <>
          <MemoryHook text={q.tip} />
          <button className="focus-ring" onClick={next} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 14, background: "#2563eb", color: "#fff", border: "none", fontSize: 14, cursor: "pointer", fontWeight: 800 }}>
            {current + 1 < session.length ? "Next mistake" : "Finish session"}
          </button>
        </>
      )}
    </div>
  );
};

// ── RAPID FIRE ───────────────────────────────────────────────
const RapidFireTab = () => {
  const [total, setTotal] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [answerMode, setAnswerMode] = useState("summary");
  const [includeCompare, setIncludeCompare] = useState("yes");
  const [showContext, setShowContext] = useState(true);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const advanceRef = useRef(null);

  const startGame = () => {
    clearInterval(timerRef.current);
    clearTimeout(advanceRef.current);
    const pool = includeCompare === "yes" ? [...ALL_QUIZ, ...buildConfusionDeck()] : ALL_QUIZ;
    setQuestions(pickRandomNoRepeat(pool, total, STORAGE_KEYS.recentRapid, 180));
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setResults([]);
    setFinished(false);
    setTimeLeft(timePerQuestion);
    setStarted(true);
  };

  const advance = (isCorrect, chosen, q) => {
    setResults((r) => [...r, { ...q, chosen, correct: isCorrect }]);
    const next = current + 1;
    if (next >= questions.length) {
      setFinished(true);
      setStarted(false);
      return;
    }
    setCurrent(next);
    setSelected(null);
    setConfirmed(false);
    setTimeLeft(timePerQuestion);
  };

  const scheduleAdvance = (isCorrect, chosen, q, timedOut = false) => {
    clearTimeout(advanceRef.current);
    const holdMs = answerMode !== "instant" ? (timedOut ? 3200 : 2600) : isCorrect ? 1000 : 3200;
    advanceRef.current = setTimeout(() => advance(isCorrect, chosen, q), holdMs);
  };

  const handleSelect = (oi) => {
    if (confirmed) return;
    clearInterval(timerRef.current);
    const q = questions[current];
    const isCorrect = oi === q.a;
    if (isCorrect) setScore((s) => s + 1);
    setSelected(oi);
    setConfirmed(true);
    scheduleAdvance(isCorrect, oi, q, false);
  };

  useEffect(() => {
    if (!started || confirmed || finished) return undefined;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, current, confirmed, finished, timePerQuestion]);

  useEffect(() => {
    if (timeLeft === 0 && !confirmed && started && !finished) {
      clearInterval(timerRef.current);
      const q = questions[current];
      setConfirmed(true);
      scheduleAdvance(false, -1, q, true);
    }
  }, [timeLeft, confirmed, started, finished, current, questions]);

  useEffect(() => {
    if (finished) saveWrongQuestions(results.filter((x) => !x.correct));
  }, [finished, results]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearTimeout(advanceRef.current);
  }, []);

  if (!started && !finished) {
    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="🔥" meta="Pressure practice for fast recall.">Rapid Fire</SectionTitle>
        <Card style={{ background: "linear-gradient(135deg, rgba(127,29,29,0.18), rgba(15,23,42,0.94))", border: "1px solid #7f1d1d", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>⏱️</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Fast recall with a bigger rotating pool</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 6 }}>Pick an answer before time runs out.</div>
          <div style={{ color: "#f59e0b", fontSize: 13, marginBottom: 18 }}>Uses recent-history avoidance so the same questions do not repeat too often.</div>
          <SettingGroup
            label="How many questions?"
            value={String(total)}
            onChange={(value) => setTotal(Number(value))}
            options={[
              { value: "10", label: "10" },
              { value: "24", label: "24" },
              { value: "50", label: "50" },
            ]}
          />
          <SettingGroup
            label="Time per question"
            value={String(timePerQuestion)}
            onChange={(value) => setTimePerQuestion(Number(value))}
            options={[
              { value: "10", label: "10s" },
              { value: "20", label: "20s" },
              { value: "30", label: "30s" },
            ]}
          />
          <SettingGroup
            label="Show answer after each question?"
            value={answerMode}
            onChange={setAnswerMode}
            options={[
              { value: "summary", label: "End only" },
              { value: "instant", label: "Show now" },
            ]}
          />
          <SettingGroup
            label="Show memory tips and context?"
            value={showContext ? "yes" : "no"}
            onChange={(value) => setShowContext(value === "yes")}
            options={[
              { value: "yes", label: "With context" },
              { value: "no", label: "Answers only" },
            ]}
          />
          <SettingGroup
            label="Include confusion/trap cards?"
            value={includeCompare}
            onChange={setIncludeCompare}
            options={[
              { value: "yes", label: "Include" },
              { value: "no", label: "Quiz only" },
            ]}
          />
          <button className="focus-ring" onClick={startGame} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 14, padding: "14px 36px", fontSize: 17, fontWeight: 800, cursor: "pointer" }}>
            Start Rapid Fire
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
        <SectionTitle icon="🔥">Rapid Fire Results</SectionTitle>
        <Card style={{ textAlign: "center", border: `2px solid ${pass ? "#22c55e" : "#ef4444"}` }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{pass ? "🏆" : "💪"}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: pass ? "#4ade80" : "#f87171" }}>{pass ? "On fire" : "Keep sharpening"}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "var(--text-strong)", margin: "8px 0" }}>{score}/{questions.length}</div>
          <div style={{ fontSize: 20, color: pass ? "#4ade80" : "#f87171", marginBottom: 20 }}>{pct}%</div>
          <button className="focus-ring" onClick={startGame} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", cursor: "pointer", fontWeight: 800, fontSize: 15 }}>Try Again</button>
          {" "}
          <button className="focus-ring" onClick={() => { setFinished(false); setStarted(false); }} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "12px 20px", cursor: "pointer", marginLeft: 6 }}>Back</button>
        </Card>
        {results.map((r, i) => (
          <Card key={i} style={{ border: `1px solid ${r.correct ? "#166534" : "#7f1d1d"}`, background: r.correct ? "#0f1f0f" : "#1a0808" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Q{i + 1}</div>
            <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 13, marginBottom: 6 }}>{r.q}</div>
            <div style={{ fontSize: 13, color: r.correct ? "#4ade80" : "#f87171" }}>
              {r.correct ? "✓" : "✗"} {r.chosen === -1 ? "Time ran out" : r.opts[r.chosen]}
            </div>
            {!r.correct && <div style={{ fontSize: 13, color: "#4ade80", marginTop: 2 }}>✓ {r.opts[r.a]}</div>}
            {showContext && <MemoryHook text={r.tip} />}
          </Card>
        ))}
      </div>
    );
  }

  const q = questions[current];
  const timerPct = (timeLeft / timePerQuestion) * 100;
  const timerColor = timeLeft > 10 ? "#22c55e" : timeLeft > 5 ? "#f59e0b" : "#ef4444";
  const isTimedOut = confirmed && selected === null && timeLeft === 0;
  const isWrong = confirmed && selected !== null && selected !== q.a;
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <Badge text={`${current + 1} / ${questions.length}`} color="#64748b" />
        <Badge text={`Score: ${score}`} color="#22c55e" />
        <Badge text={`${timeLeft}s`} color={timerColor} />
      </div>
      <div style={{ background: "#1f2937", borderRadius: 999, height: 10, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ background: timerColor, height: "100%", borderRadius: 999, width: `${timerPct}%`, transition: "width 1s linear, background 0.3s" }} />
      </div>
      <QuestionCard question={q} selected={selected} confirmed={confirmed} onSelect={handleSelect} />
      {answerMode === "instant" && confirmed && (
        <>
          <div style={{ marginTop: 10, textAlign: "center", color: isWrong || isTimedOut ? "#fca5a5" : "#86efac", fontWeight: 800 }}>
            {isTimedOut ? `Time's up. Correct answer: ${q.opts[q.a]}` : isWrong ? `Wrong. Correct answer: ${q.opts[q.a]}` : "Correct"}
          </div>
          {showContext && <MemoryHook text={q.tip} />}
          {(isWrong || isTimedOut) && (
            <div style={{ marginTop: 8, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              Holding a little longer so you can read the clue before the next question.
            </div>
          )}
        </>
      )}
      {answerMode !== "instant" && confirmed && (
        <>
          <div style={{ marginTop: 10, textAlign: "center", color: isTimedOut ? "#f59e0b" : selected === q.a ? "#86efac" : "#fca5a5", fontWeight: 800 }}>
            {isTimedOut ? `Time's up. Correct answer: ${q.opts[q.a]}` : selected === q.a ? "Correct" : `Wrong. Correct answer: ${q.opts[q.a]}`}
          </div>
          {showContext && <MemoryHook text={q.tip} />}
          <div style={{ marginTop: 8, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Next question starts automatically after a short review pause.
          </div>
        </>
      )}
    </div>
  );
};

// ── ROOT ──────────────────────────────────────────────────────
const App = () => {
  const isMobile = useViewportMobile();
  const [active, setActive] = useState(() => getHashTab() || readStore(STORAGE_KEYS.activeTab, "home"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => readStore(STORAGE_KEYS.theme, true));
  const [wrongQuestions, setWrongQuestions] = useState(() => readStore(STORAGE_KEYS.wrongQuestions, []));
  const [mockHistory, setMockHistory] = useState(() => readStore(STORAGE_KEYS.mockHistory, []));
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [tabHistory, setTabHistory] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    writeStore(STORAGE_KEYS.theme, isDark);
  }, [isDark]);

  useEffect(() => {
    writeStore(STORAGE_KEYS.activeTab, active);
    if (window.location.hash !== `#${active}`) {
      window.history.replaceState(null, "", `#${active}`);
    }
    setWrongQuestions(readStore(STORAGE_KEYS.wrongQuestions, []));
    setMockHistory(readStore(STORAGE_KEYS.mockHistory, []));
  }, [active]);

  useEffect(() => {
    const onHashChange = () => {
      const hashTab = getHashTab();
      if (hashTab) {
        setActive(hashTab);
        setMenuOpen(false);
        setQuickPanelOpen(false);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => setIsDark((d) => !d);
  const navigateTo = (nextTab) => {
    setActive((current) => {
      if (current !== nextTab) {
        setTabHistory((history) => [...history, current].slice(-24));
      }
      return nextTab;
    });
    setMenuOpen(false);
    setQuickPanelOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    let previous = null;
    setTabHistory((history) => {
      if (!history.length) return history;
      previous = history[history.length - 1];
      return history.slice(0, -1);
    });
    if (previous) {
      setActive(previous);
      setMenuOpen(false);
      setQuickPanelOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderTab = () => {
    switch (active) {
      case "home": return <HomeTab setActive={navigateTo} wrongQuestions={wrongQuestions} mockHistory={mockHistory} />;
      case "quickrev": return <QuickRevisionTab setActive={navigateTo} />;
      case "timeline": return <TimelineTab />;
      case "nations": return <NationsTab />;
      case "confuse": return <ConfuseTab />;
      case "inventors": return <InventorsTab />;
      case "sports": return <SportsTab />;
      case "figures": return <FiguresTab />;
      case "religion": return <ReligionTab />;
      case "landmarks": return <LandmarksTab />;
      case "international": return <InternationalTab />;
      case "arts": return <ArtsTab />;
      case "anthem": return <AnthemTab />;
      case "quickfacts": return <QuickFactsTab />;
      case "quiz": return <QuizTab />;
      case "mock": return <MockExamTab />;
      case "revise": return <ReviseTab />;
      case "rapidfire": return <RapidFireTab />;
      default: return <HomeTab setActive={navigateTo} wrongQuestions={wrongQuestions} mockHistory={mockHistory} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", maxWidth: 1120, margin: "0 auto", paddingBottom: isMobile ? 88 : 0 }}>
      <TabBar active={active} setActive={navigateTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} isDark={isDark} toggleDark={toggleDark} onBack={handleBack} canGoBack={tabHistory.length > 0} openQuickPanel={() => setQuickPanelOpen(true)} />
      <div className="tabcontent">{renderTab()}</div>
      <div style={{ textAlign: "center", padding: "24px 16px", borderTop: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: 12 }}>
        Open Source — Share Freely ·{" "}
        <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener" style={{ color: "#60a5fa", textDecoration: "none" }}>
          github.com/kanwalnainsingh/KNS-Life-In-UK-Test
        </a>
      </div>
      {isMobile && <BottomNav active={active} setActive={navigateTo} openQuickPanel={() => setQuickPanelOpen(true)} onBack={handleBack} canGoBack={tabHistory.length > 0} />}
      {isMobile && <ScrollTopButton visible={showScrollTop} />}
      {isMobile && <MobileQuickPanel open={quickPanelOpen} active={active} setActive={navigateTo} onClose={() => setQuickPanelOpen(false)} onBack={handleBack} canGoBack={tabHistory.length > 0} />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
