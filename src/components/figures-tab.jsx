import React from "react";
import { CollapsibleDetails, SectionStudyActions } from "./reference-tabs.jsx";

const CORE_FIGURES = new Set([
  "William the Conqueror",
  "King John",
  "Henry VIII",
  "Elizabeth I",
  "Oliver Cromwell",
  "Robert Walpole",
  "William Wilberforce",
  "Florence Nightingale",
  "Emmeline Pankhurst",
  "Winston Churchill",
  "Clement Attlee",
  "Aneurin (Nye) Bevan",
  "Queen Victoria",
]);

const FIGURE_HOOKS = {
  "William the Conqueror": ["1066", "Hastings", "Domesday Book"],
  "King John": ["1215", "Magna Carta", "king under law"],
  "Henry VII": ["1485", "Bosworth", "Tudors begin"],
  "Henry VIII": ["six wives", "1534", "Church of England"],
  "Elizabeth I": ["1588", "Armada", "Virgin Queen"],
  "James VI and I": ["1603", "crowns only", "not parliaments"],
  "Charles I": ["1649", "executed", "Civil War"],
  "Charles II": ["1660", "Restoration", "Royal Society"],
  "William of Orange": ["1688", "Glorious Revolution", "Bill of Rights"],
  "Robert Walpole": ["first PM", "1721", "cabinet government"],
  "William Wilberforce": ["1807", "trade abolished", "1833 later"],
  "Queen Victoria": ["1837", "Industrial Age", "Empire"],
  "Florence Nightingale": ["Crimean War", "Lady with the Lamp", "nursing"],
  "Mary Seacole": ["Crimean War", "Jamaica", "cared for soldiers"],
  "Emmeline Pankhurst": ["1903", "WSPU", "votes for women"],
  "Winston Churchill": ["WWII", "wartime PM", "1951 return"],
  "Clement Attlee": ["1945", "post-war", "NHS era"],
  "William Beveridge": ["1942", "five giants", "welfare blueprint"],
  "Aneurin (Nye) Bevan": ["1948", "NHS", "Health Minister"],
  "Margaret Thatcher": ["first woman PM", "1979", "Conservative"],
  "Isaac Newton": ["gravity", "laws of motion", "science"],
  "Alexander Fleming": ["1928", "penicillin", "antibiotic"],
  "Sir Tim Berners-Lee": ["1990", "World Wide Web", "computer science"],
};

const FIGURE_GROUPS = [
  { title: "Monarchs and state", color: "#3b82f6", match: /William the Conqueror|King John|Henry VII|Henry VIII|Elizabeth I|James VI and I|Charles I|Charles II|William of Orange|Queen Victoria|Queen Elizabeth II/ },
  { title: "Reform and welfare", color: "#10b981", match: /Wilberforce|Pankhurst|Beveridge|Bevan|Attlee|Thatcher/ },
  { title: "War and defence", color: "#f97316", match: /Boudicca|Robert the Bruce|Drake|Nelson|Wellington|Churchill|Nightingale|Seacole/ },
  { title: "Science and modern Britain", color: "#8b5cf6", match: /Newton|Fleming|Berners-Lee|Halley|Hawking|Guttmann|Cook|Sake Dean Mahomet/ },
];

const FigureSummaryCard = ({ Card, Badge, title, note, items, color }) => (
  <Card className="support-card">
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
      <div>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 16 }}>{title}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{note}</div>
      </div>
      <Badge text={`${items.length} anchors`} color={color} />
    </div>
    <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
      {items.map((item) => (
        <div key={item} className="subtle-panel" style={{ padding: 12, color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>
          {item}
        </div>
      ))}
    </div>
  </Card>
);

export const FiguresTabSection = ({
  setActive,
  SectionTitle,
  Card,
  Badge,
  MemoryHook,
  SectionMockPanel,
  launchQuickRevision,
  KEY_FIGURES,
  EXTRA_KEY_FIGURES,
  FIGURE_MEMORY,
}) => {
  const figureOrder = [
    "William the Conqueror",
    "King John",
    "Henry VII",
    "Henry VIII",
    "Elizabeth I",
    "James VI and I",
    "Charles I",
    "Charles II",
    "William of Orange",
    "Robert Walpole",
    "William Wilberforce",
    "Queen Victoria",
    "Florence Nightingale",
    "Mary Seacole",
    "Emmeline Pankhurst",
    "Winston Churchill",
    "William Beveridge",
    "Clement Attlee",
    "Aneurin (Nye) Bevan",
    "Margaret Thatcher",
    "Queen Elizabeth II",
    "Isaac Newton",
    "Alexander Fleming",
    "Sir Tim Berners-Lee",
    "Stephen Hawking",
    "Dr Ludwig Guttmann",
    "Boudicca",
    "Robert the Bruce",
    "Lord Nelson",
    "Duke of Wellington",
    "Sir Francis Drake",
    "James Cook",
    "Sir Edmund Halley",
    "Sake Dean Mahomet",
    "Alfred the Great",
    "Athelstan",
    "St Augustine",
  ];
  const orderMap = Object.fromEntries(figureOrder.map((name, index) => [name, index]));
  const figures = [...KEY_FIGURES, ...EXTRA_KEY_FIGURES]
    .filter((figure, index, arr) => arr.findIndex((item) => item.name === figure.name) === index)
    .sort((a, b) => {
      const coreDiff = Number(CORE_FIGURES.has(b.name)) - Number(CORE_FIGURES.has(a.name));
      if (coreDiff) return coreDiff;
      return (orderMap[a.name] ?? 999) - (orderMap[b.name] ?? 999);
    });
  const coreFigures = figures.filter((item) => CORE_FIGURES.has(item.name));
  const extraFigures = figures.filter((item) => !CORE_FIGURES.has(item.name));

  return (
    <div className="topic-page">
      <SectionTitle icon="👑" meta="Use this page as a one-stop revision sheet for the names most likely to appear in history, monarchy, reform, war, and NHS questions.">Key Historical Figures</SectionTitle>
      <Card className="support-card-strong">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Most tested figures first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Learn the direct exam names first, then use the rest of the page as support and context.</div>
          </div>
          <Badge text="Exam core" color="#ef4444" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {coreFigures.map((item) => <Badge key={item.name} text={item.name} color="#ef4444" />)}
        </div>
      </Card>

      <FigureSummaryCard
        Card={Card}
        Badge={Badge}
        title="Likely question patterns"
        note="These are the direct person-to-fact links that show up most often."
        color="#3b82f6"
        items={[
          "Who won Hastings in 1066? William the Conqueror.",
          "Who signed Magna Carta in 1215? King John.",
          "Who started the Tudors in 1485? Henry VII.",
          "Who broke with Rome in 1534? Henry VIII.",
          "Who defeated the Armada in 1588? Elizabeth I.",
          "Who was the first Prime Minister? Robert Walpole.",
          "Who campaigned against the slave trade? William Wilberforce.",
          "Who led the suffragettes? Emmeline Pankhurst.",
          "Who was PM during WWII? Winston Churchill.",
          "Who created the NHS in 1948? Aneurin Bevan under Attlee.",
        ]}
      />

      <FigureSummaryCard
        Card={Card}
        Badge={Badge}
        title="Dates to lock in with names"
        note="Treat these as fixed pairs. They save marks in mocks because they stop the common mix-ups."
        color="#f97316"
        items={[
          "1066 William the Conqueror",
          "1215 King John",
          "1485 Henry VII",
          "1534 Henry VIII",
          "1588 Elizabeth I",
          "1603 James VI and I",
          "1649 Charles I",
          "1660 Charles II",
          "1688 William of Orange",
          "1807 Wilberforce, 1942 Beveridge, 1948 Bevan",
        ]}
      />

      <Card className="setup-card">
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 10 }}>Figure groups for faster recall</div>
        <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {FIGURE_GROUPS.map((group) => (
            <div key={group.title} className="subtle-panel" style={{ border: `1px solid ${group.color}33`, padding: 12 }}>
              <div style={{ color: group.color, fontWeight: 800, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{group.title}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {figures.filter((figure) => group.match.test(figure.name)).slice(0, 8).map((figure) => (
                  <Badge key={figure.name} text={figure.name} color={group.color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SectionMockPanel sectionId="figures" />

      {coreFigures.map((f) => (
        <Card key={f.name} className="quick-revision-card" style={{ border: `1px solid ${f.color}33` }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</div>
                <Badge text={CORE_FIGURES.has(f.name) ? "Exam core" : "More detail"} color={CORE_FIGURES.has(f.name) ? "#ef4444" : "#64748b"} />
              </div>
              <div style={{ color: f.color, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{f.role}</div>
              {!!FIGURE_HOOKS[f.name]?.length && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {FIGURE_HOOKS[f.name].map((hook) => <Badge key={hook} text={hook} color={f.color} />)}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginBottom: 10, borderRadius: 12, padding: "10px 12px", background: `${f.color}12`, border: `1px solid ${f.color}33` }}>
            <div style={{ color: f.color, fontSize: 11, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Remember first</div>
            <div style={{ color: "var(--text-strong)", fontSize: 13, lineHeight: 1.55 }}>{f.facts[0]}</div>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {f.facts.map((fact, fi) => (
              <div key={fi} style={{ fontSize: 13, color: "var(--text)", padding: "6px 0", borderBottom: fi < f.facts.length - 1 ? "1px solid var(--card-border)" : "none", lineHeight: 1.6 }}>• {fact}</div>
            ))}
          </div>
          {FIGURE_MEMORY[f.name] && <MemoryHook text={FIGURE_MEMORY[f.name]} />}
        </Card>
      ))}
      {extraFigures.length > 0 && (
        <CollapsibleDetails
          Card={Card}
          Badge={Badge}
          title="More figure detail"
          note="Open this once the main rulers, reformers, and wartime figures are secure."
          badgeText={`${extraFigures.length} extra figures`}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {extraFigures.map((f) => (
              <Card key={f.name} className="quick-revision-card" style={{ marginBottom: 0, border: `1px solid ${f.color}33` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</div>
                      <Badge text="More detail" color="#64748b" />
                    </div>
                    <div style={{ color: f.color, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{f.role}</div>
                    {!!FIGURE_HOOKS[f.name]?.length && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                        {FIGURE_HOOKS[f.name].map((hook) => <Badge key={hook} text={hook} color={f.color} />)}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginBottom: 10, borderRadius: 12, padding: "10px 12px", background: `${f.color}12`, border: `1px solid ${f.color}33` }}>
                  <div style={{ color: f.color, fontSize: 11, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>Remember first</div>
                  <div style={{ color: "var(--text-strong)", fontSize: 13, lineHeight: 1.55 }}>{f.facts[0]}</div>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {f.facts.map((fact, fi) => (
                    <div key={fi} style={{ fontSize: 13, color: "var(--text)", padding: "6px 0", borderBottom: fi < f.facts.length - 1 ? "1px solid var(--card-border)" : "none", lineHeight: 1.6 }}>• {fact}</div>
                  ))}
                </div>
                {FIGURE_MEMORY[f.name] && <MemoryHook text={FIGURE_MEMORY[f.name]} />}
              </Card>
            ))}
          </div>
        </CollapsibleDetails>
      )}

      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Turn people into recall"
        note="After reading figures, move into quick revision or a mock so the names stay attached to the right dates and events."
        actions={[
          { label: "Quick Revise Key People", primary: true, onClick: () => launchQuickRevision(setActive, { focus: "fresh", topic: "Key People", sessionType: "short" }) },
          { label: "Open Story Mode", onClick: () => setActive("story") },
          { label: "Take a Mock", onClick: () => setActive("mock") },
        ]}
      />
    </div>
  );
};
