import React, { useState } from "react";
import { Button } from "./ui/button.jsx";

const CORE_SPORT_EVENT_NAMES = new Set(["Wimbledon", "FA Cup", "Grand National", "Boat Race", "London Marathon"]);
const CORE_SPORT_STAR_NAMES = new Set([
  "Sir Roger Bannister",
  "Bobby Moore",
  "Jayne Torvill & Christopher Dean",
  "Sir Chris Hoy",
  "Andy Murray",
  "Mo Farah",
  "Jessica Ennis-Hill",
]);
const CORE_FESTIVAL_NAMES = new Set(["Christmas", "Easter", "Boxing Day", "Diwali", "Eid al-Fitr", "Vaisakhi", "Hanukkah"]);

const ExamFocusPanel = ({ Card, Badge, title, note, items, color = "#3b82f6" }) => (
  <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
      <div>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>{title}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{note}</div>
      </div>
      <Badge text={`${items.length} exam cues`} color={color} />
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

export const CollapsibleDetails = ({
  Card,
  Badge,
  title = "More detail",
  note = "Open this when you want extra support after the core facts.",
  badgeText,
  badgeColor = "#64748b",
  defaultOpen = false,
  children,
}) => (
  <details className="collapsible-panel" open={defaultOpen}>
    <summary className="collapsible-summary">
      <div>
        <div className="collapsible-title">{title}</div>
        <div className="collapsible-note">{note}</div>
      </div>
      {badgeText ? <Badge text={badgeText} color={badgeColor} /> : null}
    </summary>
    <div className="collapsible-content">
      <Card style={{ marginBottom: 0 }}>{children}</Card>
    </div>
  </details>
);

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

const PagePassPanel = ({
  Card,
  Badge,
  title = "Best route on this page",
  note,
  steps,
  color = "#3b82f6",
}) => (
  <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
      <div>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>{title}</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{note}</div>
      </div>
      <Badge text={`${steps.length} steps`} color={color} />
    </div>
    <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
      {steps.map((step, index) => (
        <div key={step.title} className="subtle-panel" style={{ padding: 12 }}>
          <div style={{ fontSize: 12, color, fontWeight: 800, marginBottom: 4 }}>STEP {index + 1}</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 700, marginBottom: 4 }}>{step.title}</div>
          <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{step.detail}</div>
        </div>
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
  SectionMockPanel,
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
  const extraVisible = filtered.filter((item) => !CORE_INVENTORS.has(item.who));
  const coreLinks = coreVisible.slice(0, 6).map((item) => `${item.who} = ${item.what}`);
  const likelyQuestions = {
    All: [
      "Who discovered penicillin? Alexander Fleming.",
      "Who invented the World Wide Web? Tim Berners-Lee.",
      "Who invented television? John Logie Baird.",
      "Who developed the theory of evolution? Charles Darwin.",
      "Who is linked with radar? Robert Watson-Watt.",
      "Think person + invention first, science field second.",
    ],
    Medicine: [
      "Fleming = penicillin.",
      "Jenner = first vaccine (smallpox).",
      "Macleod = insulin.",
      "Edwards and Steptoe = IVF.",
    ],
    Computing: [
      "Tim Berners-Lee = World Wide Web.",
      "Alan Turing = modern computing / Enigma / Turing Machine.",
      "James Goodfellow = ATM cash machine.",
    ],
    Engineering: [
      "James Watt = improved steam engine.",
      "Stephenson = Rocket / railway age.",
      "Whittle = jet engine.",
      "Brunel = bridges, railways, SS Great Britain.",
    ],
    Electronics: [
      "John Logie Baird = television.",
      "Robert Watson-Watt = radar.",
      "Alexander Graham Bell = telephone.",
    ],
    Physics: [
      "Isaac Newton = gravity and laws of motion.",
      "Bernard Lovell = Jodrell Bank radio telescope.",
    ],
    Biology: [
      "Charles Darwin = evolution.",
      "Crick and Watson = DNA double helix.",
      "Dolly the sheep = Wilmut and Campbell.",
    ],
  };
  const inventorMixUps = {
    All: [
      "Baird = television. Berners-Lee = World Wide Web.",
      "Fleming = penicillin. Jenner = vaccine.",
      "Newton = gravity. Darwin = evolution.",
      "Watt = steam engine. Stephenson = Rocket railway.",
      "Watson-Watt = radar. Bell = telephone.",
    ],
    Medicine: [
      "Fleming = penicillin. Jenner = vaccine.",
      "Macleod = insulin. Edwards and Steptoe = IVF.",
    ],
    Computing: [
      "Berners-Lee = WWW, not the whole internet.",
      "Turing = computing theory / Enigma, not the web.",
    ],
    Engineering: [
      "Watt = steam engine. Whittle = jet engine.",
      "Stephenson = railway Rocket. Brunel = engineering projects.",
    ],
    Electronics: [
      "Baird = television. Bell = telephone. Watson-Watt = radar.",
    ],
    Physics: [
      "Newton = laws of motion and gravity. Lovell = radio telescope.",
    ],
    Biology: [
      "Darwin = evolution. Crick and Watson = DNA.",
      "Wilmut and Campbell = Dolly the sheep cloning.",
    ],
  };

  return (
    <div className="topic-page">
      <SectionTitle icon="💡" meta="Questions here are usually short: match the person to the invention or discovery, then use the field as a backup clue.">British Inventors & Scientists</SectionTitle>
      <PagePassPanel
        Card={Card}
        Badge={Badge}
        color="#06b6d4"
        note="Treat this page as fixed person-to-discovery pairs, not as a long science reference list."
        steps={[
          { title: "Learn the core names first", detail: "Start with Fleming, Baird, Berners-Lee, Darwin, Newton, Watt, and Watson-Watt." },
          { title: "Use the section test", detail: "Run the inventors mock after the core names so the person-to-invention pairs become automatic." },
          { title: "Only then open more detail", detail: "Use the lower list as support after the exam-core pairs are secure." },
        ]}
      />
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
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Likely questions here"
        note="Most inventor questions are direct person-to-discovery matches with one strong memory pair."
        color="#0ea5e9"
        items={likelyQuestions[cat]}
      />
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Common mix-ups"
        note="These are the person-to-invention pairs most likely to get swapped under time pressure."
        color="#f59e0b"
        items={inventorMixUps[cat]}
      />
      <SectionMockPanel sectionId="inventors" />
      {coreVisible.map((inv) => (
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
      {extraVisible.length > 0 && (
        <CollapsibleDetails
          Card={Card}
          Badge={Badge}
          title="More inventor detail"
          note="Open for the wider science list after the exam-core names are secure."
          badgeText={`${extraVisible.length} extra names`}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {extraVisible.map((inv) => (
              <Card key={inv.who} style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ fontSize: 36, flexShrink: 0 }}>{inv.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{inv.who}</span>
                      <Badge text={inv.nation} color="#64748b" />
                      <Badge text={inv.link} color="#3b82f6" />
                      <Badge text="More detail" color="#64748b" />
                      {inv.when && <Badge text={inv.when} color="#d97706" />}
                    </div>
                    <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{inv.what}</div>
                    <MemoryHook text={inv.memory} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleDetails>
      )}
      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Turn inventors into quick recall"
        note="Inventors are easiest to keep if you lock in the core pairs first, then use the lower cards as support instead of trying to memorise the whole list in one go."
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
  SectionMockPanel,
  launchQuickRevision,
  SPORTS_FACTS,
  SPORTS_STARS,
}) => {
  const coreEvents = SPORTS_FACTS.filter((item) => CORE_SPORT_EVENT_NAMES.has(item.name));
  const coreStars = SPORTS_STARS.filter((item) => CORE_SPORT_STAR_NAMES.has(item.name));
  const extraEvents = SPORTS_FACTS.filter((item) => !CORE_SPORT_EVENT_NAMES.has(item.name));
  const extraStars = SPORTS_STARS.filter((item) => !CORE_SPORT_STAR_NAMES.has(item.name));
  const starGroups = [
    {
      title: "Most tested sports names",
      items: [
        "Roger Bannister = first sub-4-minute mile",
        "Bobby Moore = 1966 World Cup captain",
        "Torvill and Dean = 1984 Olympic gold",
        "Chris Hoy = six Olympic cycling golds",
        "Andy Murray = Wimbledon 2013",
      ],
    },
    {
      title: "Modern medal anchors",
      items: [
        "Mo Farah = 2012 double long-distance gold",
        "Jessica Ennis-Hill = 2012 heptathlon gold",
        "2012 London Olympics = UK finished 3rd in medal table",
        "UK hosted Olympics in 1908, 1948, and 2012",
      ],
    },
  ];

  return (
    <div className="topic-page">
      <SectionTitle icon="🏅" meta="Use event anchors first, then attach the star names and dates to them.">British Sport & Sports Stars</SectionTitle>
      <PagePassPanel
        Card={Card}
        Badge={Badge}
        color="#f97316"
        note="Sports revision works best as a short set of event anchors plus a few must-know names."
        steps={[
          { title: "Lock in event anchors", detail: "Start with Wimbledon, FA Cup, Grand National, Boat Race, and the London Marathon." },
          { title: "Add the medal/name pairs", detail: "Then learn Bannister, Bobby Moore, Torvill and Dean, Murray, Hoy, and Farah." },
          { title: "Use the mini test quickly", detail: "Test this page before opening the extra stars so the core marks are secure first." },
        ]}
      />
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
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Most tested sports names"
        note="These are the shortest sports facts most worth locking in for handbook-style questions."
        color="#ef4444"
        items={starGroups[0].items}
      />
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
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Likely questions here"
        note="Sports questions are usually event anchors, not deep sports trivia."
        color="#f59e0b"
        items={[
          "Wimbledon = tennis. FA Cup = football. Grand National = horse racing.",
          "Boat Race = Oxford vs Cambridge on the Thames.",
          "Rugby originated in England.",
          "Bobby Moore = England's 1966 World Cup captain.",
          "Roger Bannister = first person to run a mile in under 4 minutes.",
          "Torvill and Dean = 1984 Olympic gold medal pair.",
        ]}
      />
      <SectionMockPanel sectionId="sports" />
      {coreEvents.map((item) => (
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
      {coreStars.map((item) => (
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
      {(extraEvents.length > 0 || extraStars.length > 0) && (
        <CollapsibleDetails
          Card={Card}
          Badge={Badge}
          title="More sports detail"
          note="Open for the wider sports list after the core names and event anchors are fixed."
          badgeText={`${extraEvents.length + extraStars.length} extra entries`}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {extraEvents.map((item) => (
              <Card key={item.name} style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</div>
                      <Badge text="More detail" color="#64748b" />
                    </div>
                    <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{item.fact}</div>
                    <MemoryHook text={item.memory} />
                  </div>
                </div>
              </Card>
            ))}
            {extraStars.map((item) => (
              <Card key={item.name} style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</span>
                      <Badge text={item.sport} color="#f59e0b" />
                      <Badge text="More detail" color="#64748b" />
                      {item.year && <Badge text={item.year} color="#64748b" />}
                    </div>
                    <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{item.achievement}</div>
                    <MemoryHook text={item.memory} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CollapsibleDetails>
      )}
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Modern medal anchors"
        note="Use these as support after the classic event and name facts are secure."
        color="#8b5cf6"
        items={starGroups[1].items}
      />
      <SectionStudyActions
        Card={Card}
        Badge={Badge}
        title="Keep sports revision short"
        note="Sports is best revised as event anchors plus a short list of names. Treat the extra stars below as support, not your first priority."
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
  SectionMockPanel,
  launchQuickRevision,
  RELIGIONS,
  FESTIVALS,
}) => {
  const orderedFestivals = [...FESTIVALS].sort((a, b) => Number(CORE_FESTIVAL_NAMES.has(b.name)) - Number(CORE_FESTIVAL_NAMES.has(a.name)));
  const coreFestivals = orderedFestivals.filter((item) => CORE_FESTIVAL_NAMES.has(item.name));
  const extraFestivals = orderedFestivals.filter((item) => !CORE_FESTIVAL_NAMES.has(item.name));

  return (
    <div className="topic-page">
      <SectionTitle icon="⛪" meta="Most religion questions are short recall: biggest faith group, main Christian festivals, and key festival-to-faith matches.">Religion & Festivals</SectionTitle>
      <PagePassPanel
        Card={Card}
        Badge={Badge}
        color="#22c55e"
        note="Religion questions are usually quick faith-to-festival matches, so keep this page short and direct."
        steps={[
          { title: "Start with census order", detail: "Remember Christianity first, then no religion, then the next largest groups from the 2011 census." },
          { title: "Match the main festivals", detail: "Lock in Christmas, Easter, Diwali, Vaisakhi, Hanukkah, and the Eids before the wider list." },
          { title: "Use the page test straight away", detail: "Take the religion mini test while the faith-and-festival links are still fresh." },
        ]}
      />
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
          {coreFestivals.map((item) => <Badge key={item.name} text={item.name} color="#d97706" />)}
        </div>
        <MemoryHook text="Identify the faith first, then the clue: Diwali-lights, Vaisakhi-Sikh New Year, Hanukkah-lights, Eid al-Fitr-end of Ramadan." />
      </Card>
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Likely questions here"
        note="Religion questions are often short faith-to-festival matches."
        color="#d97706"
        items={[
          "Christianity was the largest religion in the 2011 census.",
          "Christmas and Easter = Christian festivals.",
          "Diwali = Hindu lights festival. Vaisakhi = Sikh New Year.",
          "Eid al-Fitr ends Ramadan.",
        ]}
      />
      <SectionMockPanel sectionId="religion" />
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
      {coreFestivals.map((item) => (
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
      {extraFestivals.length > 0 && (
        <CollapsibleDetails
          Card={Card}
          Badge={Badge}
          title="More festival detail"
          note="Open for the wider set of religious festivals once the highest-yield matches are secure."
          badgeText={`${extraFestivals.length} extra festivals`}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {extraFestivals.map((item) => (
              <Card key={item.name} style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge text={item.date} color="#d97706" />
                    <Badge text="More detail" color="#64748b" />
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{item.faith}</div>
                <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{item.detail}</div>
              </Card>
            ))}
          </div>
        </CollapsibleDetails>
      )}
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
  SectionMockPanel,
  launchQuickRevision,
  LANDMARKS,
  CORE_LANDMARK_NAMES,
}) => {
  const orderedLandmarks = [...LANDMARKS].sort((a, b) => Number(CORE_LANDMARK_NAMES.has(b.name)) - Number(CORE_LANDMARK_NAMES.has(a.name)));
  const coreLandmarks = orderedLandmarks.filter((item) => CORE_LANDMARK_NAMES.has(item.name));
  const extraLandmarks = orderedLandmarks.filter((item) => !CORE_LANDMARK_NAMES.has(item.name));

  return (
    <div className="topic-page">
      <SectionTitle icon="🏛️" meta="Use location + one distinctive clue for each landmark.">Landmarks & Places</SectionTitle>
      <PagePassPanel
        Card={Card}
        Badge={Badge}
        color="#0ea5e9"
        note="Landmark questions are usually won by one clue, so do not try to memorise the whole place list in one pass."
        steps={[
          { title: "Learn the exam favourites first", detail: "Start with Big Ben, Buckingham Palace, Windsor Castle, Stonehenge, Hadrian's Wall, and River Severn." },
          { title: "Use one clue per place", detail: "Think bell, London home, outside London, prehistoric, Roman wall, or longest river." },
          { title: "Test the page before more places", detail: "Use the landmarks test while the location clues are still easy to separate." },
        ]}
      />
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
          {coreLandmarks.map((item) => (
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
      <ExamFocusPanel
        Card={Card}
        Badge={Badge}
        title="Likely questions here"
        note="These place questions usually depend on one memorable clue."
        color="#0ea5e9"
        items={[
          "Big Ben = bell, not the tower.",
          "Buckingham Palace = monarch's official London home.",
          "Windsor Castle = oldest occupied royal castle, outside central London.",
          "River Severn = longest in the UK. Thames = longest in England.",
        ]}
      />
      <SectionMockPanel sectionId="landmarks" />
      {coreLandmarks.map((item) => (
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
      {extraLandmarks.length > 0 && (
        <CollapsibleDetails
          Card={Card}
          Badge={Badge}
          title="More places"
          note="Open for the wider place list after the core location clues are fixed."
          badgeText={`${extraLandmarks.length} extra places`}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {extraLandmarks.map((item) => (
              <Card key={item.name} style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge text={item.where} color="#64748b" />
                    <Badge text="More places" color="#64748b" />
                  </div>
                </div>
                <div style={{ color: "var(--text)", fontSize: 14, marginTop: 8, lineHeight: 1.7 }}>{item.fact}</div>
                <TrapAlert text={item.trap} />
              </Card>
            ))}
          </div>
        </CollapsibleDetails>
      )}
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
