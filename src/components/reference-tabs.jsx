import React, { useState } from "react";
import { Button } from "./ui/button.jsx";

const CORE_SPORT_EVENT_NAMES = new Set(["Wimbledon", "FA Cup", "Grand National", "Boat Race", "London Marathon"]);
const CORE_SPORT_STAR_NAMES = new Set(["Mo Farah", "Jessica Ennis-Hill", "Andy Murray", "Bradley Wiggins", "Jayne Torvill and Christopher Dean"]);
const CORE_FESTIVAL_NAMES = new Set(["Christmas", "Easter", "Boxing Day", "Diwali", "Eid al-Fitr", "Vaisakhi", "Hanukkah"]);

export const SectionStudyActions = ({
  title = "Study this next",
  note = "When you finish reading, move straight into recall while the facts are still fresh.",
  actions = [],
  Card,
  Badge,
}) => (
  <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
      <div>
        <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 17 }}>{title}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{note}</div>
      </div>
      <Badge text={`${actions.length} next steps`} color="#3b82f6" />
    </div>
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button key={action.label} variant={action.primary ? "default" : "secondary"} className={action.primary ? "bg-orange-500 hover:bg-orange-500/90" : ""} onClick={action.onClick}>
          {action.label}
        </Button>
      ))}
    </div>
  </Card>
);

export const InventorsTab = ({
  setActive,
  SectionTitle,
  Card,
  Badge,
  MemoryHook,
  TabButton,
  launchQuickRevision,
  INVENTORS,
  CORE_INVENTORS,
}) => {
  const cats = ["All", "Medicine", "Computing", "Engineering", "Electronics", "Physics", "Biology"];
  const [cat, setCat] = useState("All");
  const filtered = INVENTORS
    .filter((item) => cat === "All" || item.link === cat)
    .sort((a, b) => Number(CORE_INVENTORS.has(b.who)) - Number(CORE_INVENTORS.has(a.who)));
  const coreVisible = filtered.filter((item) => CORE_INVENTORS.has(item.who));
  const coreLinks = coreVisible.slice(0, 6).map((item) => `${item.who} = ${item.what}`);

  return (
    <div className="topic-page">
      <SectionTitle icon="💡" meta="Questions here are usually short: match the person to the invention or discovery, then use the field as a backup clue.">British Inventors & Scientists</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {cats.map((item) => <TabButton key={item} active={cat === item} onClick={() => setCat(item)}>{item}</TabButton>)}
      </div>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Must know inventors first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Learn the exam-core names first, then use the wider science list as support.</div>
          </div>
          <Badge text={cat === "All" ? "Core inventors" : `${cat} core`} color="#ef4444" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {coreVisible.map((item) => <Badge key={item.who} text={item.who} color="#ef4444" />)}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {coreLinks.map((item) => (
            <div key={item} style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)", color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>
              {item}
            </div>
          ))}
        </div>
        <MemoryHook text="Inventor questions are easiest if you remember person + invention as a fixed pair: Fleming-penicillin, Baird-TV, Berners-Lee-world wide web." />
      </Card>
      {filtered.map((inv) => (
        <Card key={inv.who}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ fontSize: 36, flexShrink: 0 }}>{inv.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{inv.who}</span>
                <Badge text={inv.nation} color="#64748b" />
                <Badge text={inv.link} color="#3b82f6" />
                <Badge text={CORE_INVENTORS.has(inv.who) ? "Exam core" : "More detail"} color={CORE_INVENTORS.has(inv.who) ? "#ef4444" : "#64748b"} />
                {inv.when && <Badge text={inv.when} color="#d97706" />}
              </div>
              <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{inv.what}</div>
              <MemoryHook text={inv.memory} />
            </div>
          </div>
        </Card>
      ))}
      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Turn inventors into quick recall"
        note="Inventors are easiest to keep if you follow them with a short topic-focused run instead of trying to memorise the full list in one go."
        actions={[
          { label: "Quick Revise Inventors", primary: true, onClick: () => launchQuickRevision(setActive, { focus: "fresh", topic: "Inventors", sessionType: "short" }) },
          { label: "Daily 10", onClick: () => setActive("daily10") },
          { label: "Back to Home", onClick: () => setActive("home") },
        ]}
      />
    </div>
  );
};

export const SportsTab = ({
  setActive,
  SectionTitle,
  Card,
  Badge,
  MemoryHook,
  launchQuickRevision,
  SPORTS_FACTS,
  SPORTS_STARS,
}) => {
  const coreEvents = SPORTS_FACTS.filter((item) => CORE_SPORT_EVENT_NAMES.has(item.name));
  const coreStars = SPORTS_STARS.filter((item) => CORE_SPORT_STAR_NAMES.has(item.name));

  return (
    <div className="topic-page">
      <SectionTitle icon="🏅" meta="Use event anchors first, then attach the star names and dates to them.">British Sport & Sports Stars</SectionTitle>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Must know first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>The test usually expects a few event anchors plus a handful of names rather than deep sports knowledge.</div>
          </div>
          <Badge text="Easy marks" color="#ef4444" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10, marginBottom: 10 }}>
          {coreEvents.map((item) => (
            <div key={item.name} style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)" }}>
              <div style={{ color: "var(--text-strong)", fontWeight: 800, marginBottom: 6 }}>{item.name}</div>
              <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{item.fact}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {coreStars.map((item) => <Badge key={item.name} text={item.name} color="#f59e0b" />)}
        </div>
        <MemoryHook text="Think event first: Wimbledon, FA Cup, Grand National, Boat Race. Then attach the names: Farah, Ennis-Hill, Murray, Wiggins, Torvill and Dean." />
      </Card>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)", marginBottom: 16 }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Olympics and major event anchors</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `UK hosted Olympics 3 times` = 1908, 1948, 2012<br />
          • `2012` = UK finished `3rd` in the medal table<br />
          • `Scotland has 5 ski resorts`<br />
          • `Rugby originated in England`
        </div>
        <MemoryHook text="Three Olympic years is the main numbers clue: 1908, 1948, 2012." />
      </Card>
      {SPORTS_FACTS.map((item) => (
        <Card key={item.name}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</div>
                <Badge text={CORE_SPORT_EVENT_NAMES.has(item.name) ? "Exam favourite" : "More detail"} color={CORE_SPORT_EVENT_NAMES.has(item.name) ? "#ef4444" : "#64748b"} />
              </div>
              <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{item.fact}</div>
              <MemoryHook text={item.memory} />
            </div>
          </div>
        </Card>
      ))}
      {SPORTS_STARS.map((item) => (
        <Card key={item.name}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</span>
                <Badge text={item.sport} color="#f59e0b" />
                <Badge text={CORE_SPORT_STAR_NAMES.has(item.name) ? "Exam core" : "More detail"} color={CORE_SPORT_STAR_NAMES.has(item.name) ? "#ef4444" : "#64748b"} />
                {item.year && <Badge text={item.year} color="#64748b" />}
              </div>
              <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{item.achievement}</div>
              <MemoryHook text={item.memory} />
            </div>
          </div>
        </Card>
      ))}
      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Keep sports revision short"
        note="Sports is best revised as event anchors plus a few names, then tested quickly before the details fade."
        actions={[
          { label: "Quick Revise Sports", primary: true, onClick: () => launchQuickRevision(setActive, { focus: "fresh", topic: "Sports", sessionType: "short" }) },
          { label: "Daily 10", onClick: () => setActive("daily10") },
          { label: "Take a Mock", onClick: () => setActive("mock") },
        ]}
      />
    </div>
  );
};

export const ReligionTab = ({
  setActive,
  SectionTitle,
  Card,
  Badge,
  MemoryHook,
  launchQuickRevision,
  RELIGIONS,
  FESTIVALS,
}) => {
  const orderedFestivals = [...FESTIVALS].sort((a, b) => Number(CORE_FESTIVAL_NAMES.has(b.name)) - Number(CORE_FESTIVAL_NAMES.has(a.name)));

  return (
    <div className="topic-page">
      <SectionTitle icon="⛪" meta="Most religion questions are short recall: biggest faith group, main Christian festivals, and key festival-to-faith matches.">Religion & Festivals</SectionTitle>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Must know first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Get the census order and the highest-yield festivals fixed first.</div>
          </div>
          <Badge text="Short recall" color="#ef4444" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10, marginBottom: 10 }}>
          <div style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)", color: "var(--text)", fontSize: 13, lineHeight: 1.7 }}>
            `Christianity` was the largest religion in the 2011 census. `No religion` was the second largest response.
          </div>
          <div style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)", color: "var(--text)", fontSize: 13, lineHeight: 1.7 }}>
            Main Christian festivals = `Christmas` and `Easter`. `Boxing Day` = 26 December public holiday after Christmas.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {orderedFestivals.filter((item) => CORE_FESTIVAL_NAMES.has(item.name)).map((item) => <Badge key={item.name} text={item.name} color="#d97706" />)}
        </div>
        <MemoryHook text="Identify the faith first, then the clue: Diwali-lights, Vaisakhi-Sikh New Year, Hanukkah-lights, Eid al-Fitr-end of Ramadan." />
      </Card>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ fontWeight: 800, color: "#60a5fa", marginBottom: 12 }}>2011 Census — religious identity</div>
        {RELIGIONS.map((item) => (
          <div key={item.faith} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15 }}>{item.icon} <span style={{ color: "var(--text-strong)", fontWeight: 700 }}>{item.faith}</span></span>
              <Badge text={item.pct} color={item.color} />
            </div>
            <div style={{ background: "var(--surface-muted)", borderRadius: 999, height: 10, overflow: "hidden" }}>
              <div className="bar-fill" style={{ height: "100%", borderRadius: 999, background: item.color, width: `${Math.min(item.bar, 100)}%` }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{item.note}</div>
          </div>
        ))}
      </Card>
      {orderedFestivals.map((item) => (
        <Card key={item.name}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge text={item.date} color="#d97706" />
              <Badge text={CORE_FESTIVAL_NAMES.has(item.name) ? "Exam favourite" : "More detail"} color={CORE_FESTIVAL_NAMES.has(item.name) ? "#ef4444" : "#64748b"} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{item.faith}</div>
          <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{item.detail}</div>
        </Card>
      ))}
      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Turn festivals into quick marks"
        note="Religion questions are usually short recall. Move into a quick run while the faith and festival links are still in your head."
        actions={[
          { label: "Quick Revise Religion", primary: true, onClick: () => launchQuickRevision(setActive, { focus: "fresh", topic: "Religion", sessionType: "short" }) },
          { label: "Daily 10", onClick: () => setActive("daily10") },
          { label: "Take a Mock", onClick: () => setActive("mock") },
        ]}
      />
    </div>
  );
};

export const LandmarksTab = ({
  setActive,
  SectionTitle,
  Card,
  Badge,
  MemoryHook,
  TrapAlert,
  CompactVisualStrip,
  launchQuickRevision,
  LANDMARKS,
  CORE_LANDMARK_NAMES,
}) => {
  const orderedLandmarks = [...LANDMARKS].sort((a, b) => Number(CORE_LANDMARK_NAMES.has(b.name)) - Number(CORE_LANDMARK_NAMES.has(a.name)));

  return (
    <div className="topic-page">
      <SectionTitle icon="🏛️" meta="Use location + one distinctive clue for each landmark.">Landmarks & Places</SectionTitle>
      <CompactVisualStrip
        title="Place clues"
        accent="#0ea5e9"
        items={[
          { icon: "🔔", label: "Big Ben", text: "bell" },
          { icon: "🗿", label: "Stonehenge", text: "prehistoric" },
          { icon: "👑", label: "Buckingham", text: "London home" },
          { icon: "🏰", label: "Windsor", text: "outside London" },
        ]}
      />
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Must know landmarks first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Lock in the highest-yield place names before the longer list.</div>
          </div>
          <Badge text="Exam favourites first" color="#ef4444" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10, marginBottom: 10 }}>
          {orderedLandmarks.filter((item) => CORE_LANDMARK_NAMES.has(item.name)).map((item) => (
            <div key={item.name} style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.name}</div>
                <Badge text="Exam favourite" color="#ef4444" />
              </div>
              <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{item.trap}</div>
            </div>
          ))}
        </div>
        <MemoryHook text="Landmark questions are usually won by one clue: bell not tower, London home, outside London, longest river, Roman wall." />
      </Card>
      {orderedLandmarks.map((item) => (
        <Card key={item.name}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge text={item.where} color="#64748b" />
              <Badge text={CORE_LANDMARK_NAMES.has(item.name) ? "Exam favourite" : "More places"} color={CORE_LANDMARK_NAMES.has(item.name) ? "#ef4444" : "#64748b"} />
            </div>
          </div>
          <div style={{ color: "var(--text)", fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>{item.fact}</div>
          <TrapAlert text={item.trap} />
        </Card>
      ))}
      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Turn places into quick recall"
        note="Landmark questions usually depend on one clue like location, bell vs tower, or longest river. Switch into short recall while those anchors are fresh."
        actions={[
          { label: "Quick Revise Landmarks", primary: true, onClick: () => launchQuickRevision(setActive, { focus: "fresh", topic: "Landmarks", sessionType: "short" }) },
          { label: "Open Traps", onClick: () => setActive("confuse") },
          { label: "Start Quiz", onClick: () => setActive("quiz") },
        ]}
      />
    </div>
  );
};
