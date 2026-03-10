/* =============================================================
   app.jsx — React UI for Life in the UK Study Guide
   Edit data.js to change content. Edit this file for UI changes.
   ============================================================= */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import packageMeta from "../package.json";
import { Button } from "./components/ui/button.jsx";
import {
  Card as UiCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card.jsx";
import { Badge as UiBadge } from "./components/ui/badge.jsx";
import { Progress } from "./components/ui/progress.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet.jsx";
import { cn } from "./lib/utils.js";
import {
  ALL_QUIZ,
  ANTHEM,
  ARTS,
  BATTLES_AND_WARS,
  CONFUSABLES,
  EXTRA_KEY_FIGURES,
  FESTIVALS,
  FIGURE_MEMORY,
  INT_ORGS,
  INVENTORS,
  KEY_FIGURES,
  LANDMARKS,
  NATIONS,
  QUICK_FACTS,
  RELIGIONS,
  SPORTS_FACTS,
  SPORTS_STARS,
  STORY_CHAPTERS,
  TABS,
  TIMELINE,
  VISUAL_MNEMONICS,
} from "./data.js";

const STORAGE_KEYS = {
  theme: "lifeuk-theme",
  activeTab: "lifeuk-active-tab",
  wrongQuestions: "lifeuk-wrong-questions",
  mockHistory: "lifeuk-mock-history",
  mockProgress: "lifeuk-mock-progress",
  recentQuiz: "lifeuk-recent-quiz",
  recentMock: "lifeuk-recent-mock",
  recentRapid: "lifeuk-recent-rapid",
  recentQuickRev: "lifeuk-recent-quickrev",
  recentDaily10: "lifeuk-recent-daily10",
  recentSprint: "lifeuk-recent-sprint",
  quickRevState: "lifeuk-quickrev-state",
  quickRevRatings: "lifeuk-quickrev-ratings",
  topicTracker: "lifeuk-topic-tracker",
  timelineCheckpoint: "lifeuk-timeline-checkpoint",
  storyChapter: "lifeuk-story-chapter",
  storyCompleted: "lifeuk-story-completed",
};

const APP_VERSION = `v${packageMeta.version}`;

const SEO_COPY = {
  home: {
    title: "Life in the UK Test Practice for ILR and Citizenship",
    description: "Free Life in the UK test revision app with mock tests, practice questions, memory clues, history timeline, and UK citizenship study topics.",
  },
  quickrev: { title: "Quick Revision Cards | Life in the UK Test Practice" },
  story: { title: "Story Mode Revision | Life in the UK Test Practice" },
  daily10: { title: "Daily 10 Revision | Life in the UK Test Practice" },
  sprint: { title: "True or False Sprint | Life in the UK Test Practice" },
  cram: { title: "One Page Cram Sheet | Life in the UK Test Practice" },
  tracker: { title: "Topic Completion Tracker | Life in the UK Test Practice" },
  quiz: { title: "Quiz Practice | Life in the UK Test Practice" },
  mock: { title: "Mock Test | Life in the UK Test Practice" },
  rapidfire: { title: "Rapid Fire Revision | Life in the UK Test Practice" },
  timeline: { title: "History Timeline | Life in the UK Test Practice" },
  wars: { title: "Wars and Battles Revision | Life in the UK Test Practice" },
  nations: { title: "4 Nations Revision | Life in the UK Test Practice" },
  confuse: { title: "Confusing Topics and Comparisons | Life in the UK Test Practice" },
  quickfacts: { title: "Quick Facts | Life in the UK Test Practice" },
  landmarks: { title: "Landmarks and Places | Life in the UK Test Practice" },
  religion: { title: "Religion and Festivals | Life in the UK Test Practice" },
  figures: { title: "Key Historical Figures | Life in the UK Test Practice" },
};

const PRIMARY_DESKTOP_TABS = ["home", "quickrev", "story", "quiz", "mock", "timeline"];
const NAV_GROUPS = [
  { title: "Study Modes", hint: "Start here for revision and practice", ids: ["home", "quickrev", "story", "daily10", "sprint", "mock", "cram", "tracker", "quiz", "rapidfire", "revise"] },
  { title: "History & Society", hint: "Timeline, wars, nations, law, traps, landmarks", ids: ["timeline", "wars", "nations", "quickfacts", "confuse", "landmarks", "international"] },
  { title: "People & Culture", hint: "Figures, religion, inventors, sports, arts", ids: ["figures", "religion", "inventors", "sports", "arts", "anthem"] },
];
const COVERAGE_AREAS = [
  { title: "History and timeline", detail: "Ancient Britain to modern Britain", tab: "timeline", icon: "📅" },
  { title: "Wars and battles", detail: "Major conflicts, battle dates, WWI and WWII anchors", tab: "wars", icon: "⚔️" },
  { title: "Government and Parliament", detail: "Constitution, Commons, Lords, elections", tab: "quickfacts", icon: "🏛️" },
  { title: "Laws, rights and values", detail: "Rule of law, courts, equality, British values", tab: "quickfacts", icon: "⚖️" },
  { title: "Countries, geography and landmarks", detail: "Capitals, rivers, mountains, places", tab: "nations", icon: "🗺️" },
  { title: "Religion and festivals", detail: "Major faiths, census facts, festivals", tab: "religion", icon: "⛪" },
  { title: "People, culture and sport", detail: "Writers, scientists, arts, sport", tab: "figures", icon: "🎭" },
  { title: "Symbols and everyday life", detail: "Anthem, currency, identity, practical facts", tab: "anthem", icon: "🎵" },
  { title: "International organisations", detail: "UN, NATO, Commonwealth, Council of Europe", tab: "international", icon: "🌍" },
  { title: "Community and participation", detail: "Volunteering, jury service, magistrates, respect", tab: "quickfacts", icon: "🤝" },
];

const STORY_TESTED_POINTS = {
  "britain-begins": [
    "55 BC vs 43 AD is the first big date trap: Caesar fails, Claudius succeeds.",
    "597 AD Augustine and 927 Athelstan are strong early-England anchors.",
    "Hadrian's Wall = Roman, 122 AD, northern England.",
  ],
  "conquest-crown-law": [
    "1066, 1215, 1295, 1534, 1603, and 1707 are core chapter dates.",
    "Magna Carta = nobody above the law.",
    "1603 is crowns; 1707 is parliament and Great Britain.",
  ],
  "nations-symbols-places": [
    "UK = GB + Northern Ireland.",
    "England has no separate parliament.",
    "Scotland uses Highers; Northern Ireland needs photo ID at polling stations.",
  ],
  "rights-duties-everyday": [
    "Speaker = secret ballot, neutral, still an MP.",
    "18 + FPTP + jury service + rule of law are core civic anchors.",
    "National Insurance and emergency numbers are easy marks.",
    "Civil servants are neutral officials; coalition means two parties govern together.",
  ],
  "faith-community": [
    "59%, 25%, 4.8% are the census numbers to lock in.",
    "Christmas, Easter, Diwali, Vaisakhi, Eid al-Fitr, and Hanukkah are the high-yield festivals.",
    "Good citizenship includes volunteering, participation, and respect.",
  ],
  "people-who-shaped-britain": [
    "William = 1066, John = 1215, Churchill = WWII.",
    "Pankhurst = votes, Beveridge = welfare, Bevan = NHS.",
    "Nightingale and Seacole are the Crimean War pair.",
    "Henry VIII = six wives, 1534, monasteries, and Wales laws.",
  ],
  "culture-sport-arts": [
    "Wimbledon and the FA Cup are the two strongest event anchors.",
    "Shakespeare, Dickens, Burns, Beatles, and McQueen are broad recognition names.",
    "Use place clues like Liverpool, Stratford-upon-Avon, and Royal Albert Hall.",
    "Milton = Paradise Lost and Handel = Messiah are useful extra culture anchors.",
  ],
  "wars-modern-britain": [
    "Trafalgar = Nelson, Waterloo = Wellington.",
    "WWI = 1914–1918, Armistice = 11 November 1918.",
    "WWII sequence = 1939 start, 1940 defend, 1944 D-Day, 1945 end.",
  ],
  "citizenship-settlement-basics": [
    "The test matters for citizenship or settlement applications.",
    "Knowledge requirement = language + life in the UK.",
    "Under 18 or 65+ are exempt because of age.",
  ],
  "world-stage": [
    "UN = peace, NATO = defence, Commonwealth = voluntary, Council of Europe = rights.",
    "Council of Europe and ECHR are not the EU.",
    "1947 and 1960 matter for decolonisation context.",
  ],
};

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

const getInitialTheme = () => {
  const saved = readStore(STORAGE_KEYS.theme, null);
  if (typeof saved === "boolean") return saved;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return true;
};

const forceLatestAppReload = async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(async (registration) => {
        try {
          await registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        } catch (err) {
          // Ignore update-check failures and continue with cleanup.
        }
        return registration.unregister();
      }));
    }
  } catch (err) {
    // Ignore service worker cleanup failures and still force a hard reload path.
  }

  try {
    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } catch (err) {
    // Ignore cache API failures and still force a hard reload path.
  }

  const target = new URL(window.location.href);
  target.search = "";
  target.searchParams.set("refresh", String(Date.now()));
  target.searchParams.set("appVersion", APP_VERSION);
  window.location.replace(target.toString());
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

const COVERAGE_CONTEXT = {
  timeline: "Key test anchors include 43 AD, 1066, 1215, 1534, 1603/1707, 1918/1928/1969, and 1948. Use the timeline for dates, people, and compare traps.",
  wars: "Use this section for battle names, war dates, wartime leaders, and WWI/WWII sub-topics like Armistice Day, the Blitz, Dunkirk, and D-Day.",
  quickfacts: "This area links Parliament, law, rights, voting, daily life, and community duties. Expect short factual questions and principle-based questions.",
  nations: "Know capitals, saints, flowers, languages, and devolved parliaments. England has no separate parliament, and Wales is not in the Union Jack.",
  religion: "Focus on the 2011 census, the largest groups, and major festivals like Christmas, Easter, Diwali, Vaisakhi, Hanukkah, and the Eids.",
  figures: "These people unlock many history and society questions: rulers, reformers, wartime leaders, scientists, and welfare-state figures.",
  anthem: "Includes the national anthem, Union Jack parts, and identity facts that often appear as short memory questions.",
  international: "The biggest traps are Council of Europe vs EU and voluntary bodies vs military alliances.",
};

const CRAM_SECTIONS = [
  {
    title: "Anchor dates",
    color: "#f97316",
    facts: [
      "43 AD = Roman invasion under Claudius",
      "1066 = Battle of Hastings",
      "1215 = Magna Carta",
      "1534 = Henry VIII creates Church of England",
      "1707 = Act of Union creates Great Britain",
      "1948 = NHS begins",
    ],
  },
  {
    title: "4 nations",
    color: "#3b82f6",
    facts: [
      "London, Edinburgh, Cardiff, Belfast",
      "St George, St Andrew, St David, St Patrick",
      "Rose, thistle, daffodil, shamrock",
      "England has no separate parliament",
      "Holyrood = 129 MSPs, Senedd = 60 SMs, Stormont = 90 MLAs",
    ],
  },
  {
    title: "Government and law",
    color: "#22c55e",
    facts: [
      "Commons = elected, Lords = appointed",
      "650 MPs in the House of Commons",
      "Speaker chosen by secret ballot",
      "Rule of law = everyone is subject to the law",
      "Jury service and obeying the law are public duties",
    ],
  },
  {
    title: "Wars and history",
    color: "#ef4444",
    facts: [
      "Trafalgar = Nelson = 1805",
      "Waterloo = Wellington = 1815",
      "WWI = 1914–18, Armistice = 11 November 1918",
      "WWII = 1939–45, Churchill in war, Attlee after war",
      "Battle of Britain = air battle, Blitz = bombing, Dunkirk = evacuation, D-Day = 1944 landing",
    ],
  },
  {
    title: "Religion and festivals",
    color: "#a855f7",
    facts: [
      "2011 census: 59% Christian, 25% no religion, 4.8% Muslim",
      "Christmas and Easter are main Christian festivals",
      "Diwali = festival of lights",
      "Vaisakhi = 14 April",
      "Eid al-Fitr ends Ramadan",
    ],
  },
  {
    title: "People and places",
    color: "#0ea5e9",
    facts: [
      "William the Conqueror = 1066, King John = Magna Carta",
      "Emmeline Pankhurst = votes for women",
      "Beveridge 1942, Bevan 1948 NHS",
      "Big Ben = bell, not tower",
      "Severn = longest in UK, Thames = longest in England",
    ],
  },
  {
    title: "Inventors, symbols and world orgs",
    color: "#8b5cf6",
    facts: [
      "Berners-Lee = World Wide Web, Baird = television, Fleming = penicillin",
      "God Save the King = national anthem, Britannia = female figure with shield and trident",
      "Union Jack = St George + St Andrew + St Patrick",
      "UN = peace, NATO = defence, Commonwealth = voluntary, Council of Europe = rights",
      "Council of Europe is not the EU",
    ],
  },
  {
    title: "Arts and sport",
    color: "#f59e0b",
    facts: [
      "Shakespeare, Dickens, Burns, Milton, and Rowling are strong literature anchors",
      "Handel = Messiah, Elgar = Land of Hope and Glory, Vaughan Williams = folk influence",
      "Wimbledon and FA Cup are core sports event facts",
      "Torvill and Dean = ice dancing gold 1984, Murray = Wimbledon 2013",
      "Tate Britain = British art, Tate Modern = modern art, Turner Prize = contemporary art",
    ],
  },
];

const TRACKER_SECTIONS = [
  { id: "timeline", label: "History timeline", detail: "Dates, rulers, reforms, and era anchors", tab: "timeline", icon: "📅" },
  { id: "wars", label: "Wars and battles", detail: "Battle names, dates, WWI and WWII", tab: "wars", icon: "⚔️" },
  { id: "nations", label: "4 nations", detail: "Capitals, saints, flowers, parliaments", tab: "nations", icon: "🏴" },
  { id: "quickfacts", label: "Government and law", detail: "Parliament, voting, rights, duties, daily life", tab: "quickfacts", icon: "⚖️" },
  { id: "figures", label: "Key people", detail: "Rulers, reformers, wartime leaders, welfare figures", tab: "figures", icon: "👑" },
  { id: "religion", label: "Religion and festivals", detail: "2011 census and key festival facts", tab: "religion", icon: "⛪" },
  { id: "landmarks", label: "Landmarks and places", detail: "Palaces, walls, rivers, mountains, museums", tab: "landmarks", icon: "🏛️" },
  { id: "international", label: "World organisations", detail: "UN, NATO, Commonwealth, Council of Europe", tab: "international", icon: "🌍" },
  { id: "inventors", label: "Inventors and science", detail: "Web, TV, radar, penicillin, vaccines", tab: "inventors", icon: "💡" },
  { id: "arts", label: "Arts and culture", detail: "Writers, music, art, architecture, galleries", tab: "arts", icon: "🎭" },
  { id: "sports", label: "Sports and events", detail: "Stars, Wimbledon, FA Cup, marathon, cricket", tab: "sports", icon: "🏅" },
  { id: "symbols", label: "Symbols and anthem", detail: "Anthem, Union Jack, Britannia, nation clues", tab: "anthem", icon: "🎵" },
  { id: "traps", label: "Compare traps", detail: "High-yield side-by-side confusion cards", tab: "confuse", icon: "⚠️" },
];

const buildQuickFactContext = (section, factIndex) => {
  const previous = section.facts[factIndex - 1];
  const next = section.facts[factIndex + 1];
  const related = [previous, next].filter(Boolean).slice(0, 2).join(" ");
  return related || `${section.cat} is usually tested as short factual recall, so connect this fact to the other points in the same section.`;
};

const buildLandmarkContext = (landmark) => {
  if (/Big Ben|Elizabeth Tower/.test(landmark.name)) return "Classic exam trap: Big Ben is the bell, not the tower. Link it with Westminster and Elizabeth II.";
  if (/Windsor Castle|Buckingham Palace/.test(landmark.name)) return "Royal-residence questions usually test official London home versus weekend or ceremonial residence.";
  if (/River Severn|Loch Ness|Loch Lomond|Snowdonia|Hadrian's Wall/.test(landmark.name)) return "These place questions are often mixed with longest/highest/location compare traps.";
  return "Landmark questions usually test one location plus one standout clue such as who built it, what it contains, or why it is famous.";
};

const buildComparisonContext = (item) => {
  const left = item.left.points.slice(0, 2).join(" ");
  const right = item.right.points.slice(0, 2).join(" ");
  return `${left} ${right}`;
};

const buildQuickRevisionDeck = () => {
  const deck = [];

  VISUAL_MNEMONICS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.title}`,
      back: `${item.code}: ${item.clue}`,
      context: "Use this as a compression code for fast recall before a mock or rapid-fire run.",
      memory: item.visual,
      topic: "Memory Clue",
      color: item.color,
    });
  });

  COVERAGE_AREAS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.title}`,
      back: item.detail,
      context: COVERAGE_CONTEXT[item.tab] || `This area is covered in ${TABS.find((tab) => tab.id === item.tab)?.label || item.tab}.`,
      memory: `Use ${TABS.find((tab) => tab.id === item.tab)?.label || item.tab} for the fuller fact list and compare points.`,
      topic: "Coverage",
      color: "#64748b",
    });
  });

  TIMELINE.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.year}`,
      back: item.event,
      context: buildTimelineDetails(item).slice(0, 2).join(" "),
      memory: item.memory,
      topic: "History",
      color: item.color,
    });
  });

  BATTLES_AND_WARS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.name}`,
      back: `${item.years} · ${item.fact}`,
      context: item.context,
      memory: item.memory,
      topic: "Wars",
      color: item.color,
    });
  });

  NATIONS.forEach((item) => {
    deck.push({
      front: `${item.flag} ${item.name}: capital + saint`,
      back: `${item.capital} · ${item.saint} · ${item.day}`,
      context: `${item.flower}. ${item.parliament}. Population share: ${item.pop}.`,
      memory: item.tricks.slice(0, 2).join(" "),
      topic: "4 Nations",
      color: item.color,
    });
    deck.push({
      front: `${item.flag} ${item.name}: language + parliament`,
      back: `${item.lang} · ${item.parliament}`,
      context: `Food clue: ${item.food}. Key cities: ${item.cities}.`,
      memory: item.tricks.slice(2).join(" "),
      topic: "4 Nations",
      color: item.color,
    });
  });

  QUICK_FACTS.forEach((section) => {
    section.facts.forEach((fact, factIndex) => {
      deck.push({
        front: `${section.icon} ${section.cat}`,
        back: fact,
        context: buildQuickFactContext(section, factIndex),
        memory: fact.includes("Memory clue:") ? fact.replace("Memory clue:", "").trim() : section.cat,
        topic: section.cat,
        color: section.color,
      });
    });
  });

  INVENTORS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.who}`,
      back: `${item.what} · ${item.when}`,
      context: `${item.nation}. Category: ${item.link}.`,
      memory: item.memory,
      topic: "Inventors",
      color: "#06b6d4",
    });
  });

  SPORTS_STARS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.name}`,
      back: item.achievement,
      context: `${item.sport}. Key year: ${item.year}.`,
      memory: item.memory,
      topic: "Sports",
      color: "#8b5cf6",
    });
  });

  SPORTS_FACTS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.name}`,
      back: item.fact,
      context: "These are the sport-event anchors that show up more often than long lists of players or clubs.",
      memory: item.memory,
      topic: "Sports",
      color: "#8b5cf6",
    });
  });

  Object.entries(ARTS).forEach(([group, items]) => {
    items.forEach((item) => {
      deck.push({
        front: `${item.who}`,
        back: item.what,
        context: `Arts topic: ${group}. Use one title, work, or place clue to lock this in quickly.`,
        memory: item.mem,
        topic: "Arts",
        color: "#f59e0b",
      });
    });
  });

  RELIGIONS.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.faith}`,
      back: `${item.pct} of the UK population (2011 census)`,
      context: item.note,
      memory: `${item.faith} = ${item.pct}.`,
      topic: "Religion",
      color: item.color,
    });
  });

  FESTIVALS.forEach((item) => {
    deck.push({
      front: `${item.faith.split(" ")[1] || "🎉"} ${item.name}`,
      back: `${item.date} · ${item.faith}`,
      context: item.detail,
      memory: `${item.name} = ${item.date}.`,
      topic: "Festivals",
      color: "#f59e0b",
    });
  });

  LANDMARKS.forEach((item) => {
    deck.push({
      front: item.name,
      back: `${item.where} · ${item.fact}`,
      context: buildLandmarkContext(item),
      memory: item.trap,
      topic: "Landmarks",
      color: "#0ea5e9",
    });
  });

  INT_ORGS.forEach((item) => {
    deck.push({
      front: item.name,
      back: `${item.members} · ${item.power}`,
      context: `${item.purpose} UK role: ${item.ukRole}`,
      memory: item.memory,
      topic: "World Orgs",
      color: "#10b981",
    });
  });

  [...KEY_FIGURES, ...EXTRA_KEY_FIGURES]
    .filter((figure, index, arr) => arr.findIndex((item) => item.name === figure.name) === index)
    .forEach((item) => {
      deck.push({
        front: `${item.icon} ${item.name}`,
        back: item.role,
        context: item.facts.join(" "),
        memory: FIGURE_MEMORY[item.name] || item.facts[0],
        topic: "Key People",
        color: item.color,
      });
    });

  CONFUSABLES.forEach((item) => {
    deck.push({
      front: `${item.icon} ${item.title}`,
      back: `${item.left.label} vs ${item.right.label}`,
      context: buildComparisonContext(item),
      memory: item.memory,
      topic: "Comparisons",
      color: "#7c3aed",
    });
  });

  deck.push(
    { front: "🏛️ House of Commons", back: "Elected MPs. More powerful. Controls money bills.", context: "650 MPs. Commons is the chamber that usually decides who forms the government.", memory: "Commons = chosen by the public.", topic: "Parliament", color: "#22c55e" },
    { front: "🏛️ House of Lords", back: "Appointed members. Reviews and delays laws.", context: "Usually revises bills and asks the Commons to think again, but is less powerful.", memory: "Lords = not elected.", topic: "Parliament", color: "#ef4444" },
    { front: "🗳️ Voting basics", back: "Voting age 18. Secret ballot. FPTP in general elections.", context: "Good one-card summary for most democracy questions.", memory: "18 + secret ballot + FPTP.", topic: "Elections", color: "#3b82f6" },
    { front: "⚖️ Justice basics", back: "Rule of law. Innocent until proven guilty. Equality before the law.", context: "These ideas appear across courts, values, and citizenship questions.", memory: "Law applies to everyone.", topic: "Law", color: "#10b981" },
    { front: "🤝 Community role", back: "Volunteering, fundraising, jury service and local participation all matter.", context: "Useful for questions about what good citizenship looks like in practice.", memory: "Community = take part, do not just observe.", topic: "Community", color: "#8b5cf6" },
    { front: "🗺️ UK capitals", back: "London, Edinburgh, Cardiff, Belfast.", context: "These are among the easiest marks in the test, but also easy to mix up under pressure.", memory: "LECB mnemonic.", topic: "Geography", color: "#06b6d4" },
    { front: "📜 Anchor dates", back: "43, 1066, 1215, 1534, 1948.", context: "Roman invasion, Hastings, Magna Carta, Church of England, NHS.", memory: "Use these as a history spine for the whole course.", topic: "History", color: "#f97316" },
    { front: "🌍 World organisations", back: "UN, NATO, Commonwealth, Council of Europe.", context: "The most common trap is Council of Europe versus EU.", memory: "Council of Europe ≠ EU.", topic: "International", color: "#0ea5e9" },
    { front: "🎵 National anthem", back: ANTHEM.title, context: ANTHEM.note, memory: ANTHEM.memory, topic: "Symbols", color: "#3b82f6" },
    { front: "🇬🇧 Union Jack", back: "St George + St Andrew + St Patrick", context: "The Union Jack combines three crosses. Wales is not shown separately because it was already united with England when the first Union Flag was created.", memory: "Union Jack = 3 crosses. Wales not shown separately.", topic: "Symbols", color: "#3b82f6" },
    { front: "🪙 Britannia", back: "Female symbol of Britain with shield and trident.", context: "Britannia appears on coins and works as a short identity/symbol question.", memory: "Britannia = Britain personified.", topic: "Symbols", color: "#3b82f6" },
  );

  return deck.map((item, index) => ({
    ...item,
    id: item.id || `qr-${item.topic}-${index}`,
  }));
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
    "England shares one legal system with Wales.",
    "1066 Battle of Hastings = William the Conqueror and the Norman Conquest.",
    "Stonehenge, Tower of London, Buckingham Palace, and Windsor Castle are major England place anchors.",
    "Shakespeare and Henry VIII are strong England person links for culture and Tudor history.",
  ],
  SCOTLAND: [
    "Capital = Edinburgh, but Glasgow is the largest city.",
    "Scottish Parliament = Holyrood, 129 MSPs, elected by proportional representation.",
    "Saint = St Andrew, day = 30 November, flower = thistle, animal = unicorn.",
    "Church of Scotland is Presbyterian and the monarch is not its head.",
    "Scotland has a separate legal system with courts like the Court of Session and Sheriff Courts.",
    "1314 Bannockburn = Robert the Bruce and Scottish independence in that period.",
    "Culloden 1746 = final Jacobite defeat and a major Scotland date anchor.",
    "Edinburgh, Loch Lomond, Loch Ness, and Skara Brae are strong Scotland place clues.",
  ],
  WALES: [
    "Capital = Cardiff. Welsh Parliament = Senedd, 60 SMs.",
    "Saint = St David, day = 1 March, symbols = daffodil or leek.",
    "Welsh is widely spoken alongside English, by around a quarter of the population.",
    "Wales is not shown separately in the Union Jack because it was already joined with England.",
    "Wales has the Senedd, but in handbook-style questions it shares one legal system with England.",
    "Edward I annexed Wales in 1284, and Henry VIII's Acts of Union later linked Wales more fully with England.",
    "Cardiff, Snowdonia, Bodnant Gardens, and the Millennium Stadium are useful Wales place anchors.",
    "The Welsh language is one of the strongest Wales-specific clues in the test.",
  ],
  "N. IRELAND": [
    "Capital = Belfast. NI Assembly = Stormont, 90 MLAs.",
    "Saint = St Patrick, day = 17 March, symbol = shamrock.",
    "Good Friday Agreement 1998 is key background for the current Assembly.",
    "Giant's Causeway and Belfast are common Northern Ireland exam anchors.",
    "Northern Ireland has a separate legal system and requires photo ID at polling stations.",
    "1690 Battle of the Boyne is a major Northern Ireland / Stuart-period memory anchor.",
    "Stormont, Belfast, and Giant's Causeway are the strongest Northern Ireland place links.",
    "Use St Patrick and the shamrock as the fastest Northern Ireland identity clue.",
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

const TOP_TRAP_TITLES = new Set([
  "Great Britain vs United Kingdom",
  "British Isles vs United Kingdom",
  "House of Commons vs House of Lords",
  "Church of England vs Church of Scotland",
  "1603 Union of Crowns vs 1707 Act of Union",
  "Slave Trade 1807 vs Slavery Abolished 1833",
  "Council of Europe vs European Union",
  "Big Ben vs Elizabeth Tower",
]);

const getConfusableGroup = (title) => {
  if (TOP_TRAP_TITLES.has(title)) return "Top Exam Traps";
  if (/great britain|united kingdom|british isles|saints|crown dependencies|highers|a-levels|westminster|devolved|england and wales legal system/i.test(title)) return "Nations and Identity";
  if (/prime minister|monarch|pcc|councillor|commonwealth & irish voting rights|voting rights|commons|lords|national insurance|council tax/i.test(title)) return "Government, Law and Voting";
  return "History, Dates and Places";
};

const getConfusableLevel = (title) => {
  if (TOP_TRAP_TITLES.has(title)) return { text: "Exam favourite", color: "#ef4444" };
  if (/criminal courts|civil courts|youth court|children's hearing|highers|a-levels|river severn|river thames|battle of britain|blitz|dunkirk|d-day|trafalgar|waterloo/i.test(title)) {
    return { text: "Common mix-up", color: "#f59e0b" };
  }
  return { text: "Good to know", color: "#64748b" };
};

const CONFUSABLE_GROUP_ORDER = [
  "Top Exam Traps",
  "Nations and Identity",
  "Government, Law and Voting",
  "History, Dates and Places",
];

const QUICK_FACT_CATEGORY_PRIORITY = {
  "Government & Parliament": { order: 1, label: "Must know first", color: "#ef4444" },
  "Law & Courts": { order: 2, label: "Must know first", color: "#ef4444" },
  "Rights & Everyday Life": { order: 3, label: "Easy marks", color: "#22c55e" },
  "4 Nations & Places": { order: 4, label: "Easy marks", color: "#22c55e" },
  "Citizenship & Settlement": { order: 5, label: "Important context", color: "#3b82f6" },
  "Community & Participation": { order: 6, label: "Good to know", color: "#64748b" },
  "Currency & Finance": { order: 7, label: "Easy marks", color: "#22c55e" },
  "Britain Beyond the UK": { order: 8, label: "Common mix-up", color: "#f59e0b" },
  "Population & Geography": { order: 9, label: "Good to know", color: "#64748b" },
  "History Extras": { order: 10, label: "Good to know", color: "#64748b" },
};

const CORE_FIGURES = new Set([
  "William the Conqueror",
  "King John",
  "Henry VIII",
  "Elizabeth I",
  "Emmeline Pankhurst",
  "Winston Churchill",
  "William Beveridge",
  "Aneurin (Nye) Bevan",
  "Clement Attlee",
  "Margaret Thatcher",
]);

const CORE_INVENTORS = new Set([
  "Alexander Fleming",
  "Tim Berners-Lee",
  "John Logie Baird",
  "Frank Whittle",
  "Alan Turing",
  "James Watt",
  "Isaac Newton",
  "Edward Jenner",
]);

const CORE_LANDMARK_NAMES = new Set([
  "Big Ben 🔔",
  "Buckingham Palace 👑",
  "Windsor Castle 🏰",
  "Stonehenge 🗿",
  "Tower of London 🏯",
  "Hadrian's Wall 🧱",
  "River Severn 🌊",
  "Loch Ness 🐉",
  "Cenotaph 🌺",
]);

const CORE_INT_ORGS = new Set([
  "Commonwealth 🌐",
  "United Nations 🕊️",
  "NATO 🛡️",
  "Council of Europe ⚖️",
]);

const ARTS_CORE_BY_SECTION = {
  literature: new Set(["William Shakespeare", "Charles Dickens", "Robert Burns", "Agatha Christie"]),
  music: new Set(["George Frideric Handel", "Sir Edward Elgar", "The Beatles", "BBC Proms"]),
  art: new Set(["Joseph Turner", "John Constable", "Henry Moore", "David Hockney"]),
  architecture: new Set(["Sir Christopher Wren", "Sir Edwin Lutyens", "Gothic Revival (19th century)"]),
  fashion: new Set(["Mary Quant", "Alexander McQueen", "Vivienne Westwood"]),
  film: new Set(["Charlie Chaplin", "Sir Laurence Olivier", "Sir Alfred Hitchcock"]),
};

const pickRandom = (items, count) => [...items].sort(() => Math.random() - 0.5).slice(0, count);

const saveWrongQuestions = (items) => {
  if (!items.length) return;
  const existing = readStore(STORAGE_KEYS.wrongQuestions, []);
  const merged = [...items, ...existing]
    .filter((item, index, arr) => arr.findIndex((x) => x.q === item.q) === index)
    .slice(0, 60);
  writeStore(STORAGE_KEYS.wrongQuestions, merged);
};

const normalizeMockHistory = (history = []) =>
  history
    .filter((entry) => entry && Number.isInteger(entry.paperId) && typeof entry.score === "number")
    .map((entry) => ({
      date: entry.date || new Date(0).toISOString(),
      paperId: entry.paperId,
      paperTitle: entry.paperTitle || `Mock Test ${entry.paperId}`,
      score: entry.score,
      percent: typeof entry.percent === "number" ? entry.percent : Math.round((entry.score / MOCK_TOTAL) * 100),
      passed: typeof entry.passed === "boolean" ? entry.passed : entry.score >= 18,
      wrong: typeof entry.wrong === "number" ? entry.wrong : Math.max(0, MOCK_TOTAL - entry.score),
      flagged: typeof entry.flagged === "number" ? entry.flagged : 0,
      answerMode: entry.answerMode || "instant",
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

const buildMockProgress = (history = []) =>
  normalizeMockHistory(history).reduce((acc, entry) => {
    const current = acc[entry.paperId] || {
      paperId: entry.paperId,
      paperTitle: entry.paperTitle,
      attempts: 0,
      bestScore: 0,
      bestPercent: 0,
      lastScore: 0,
      lastPercent: 0,
      passed: false,
      flagged: 0,
      wrong: MOCK_TOTAL,
      lastDate: "",
    };
    const isNewer = !current.lastDate || new Date(entry.date) > new Date(current.lastDate);
    current.attempts += 1;
    current.bestScore = Math.max(current.bestScore, entry.score);
    current.bestPercent = Math.max(current.bestPercent, entry.percent);
    current.passed = current.passed || entry.passed;
    if (isNewer) {
      current.lastScore = entry.score;
      current.lastPercent = entry.percent;
      current.flagged = entry.flagged;
      current.wrong = entry.wrong;
      current.lastDate = entry.date;
    }
    acc[entry.paperId] = current;
    return acc;
  }, {});

const loadMockHistory = () => normalizeMockHistory(readStore(STORAGE_KEYS.mockHistory, []));

const loadMockProgress = () => {
  const saved = readStore(STORAGE_KEYS.mockProgress, {});
  const history = loadMockHistory();
  const computed = buildMockProgress(history);
  const merged = { ...saved, ...computed };
  writeStore(STORAGE_KEYS.mockProgress, merged);
  return merged;
};

const saveMockResult = (entry) => {
  const history = [{ ...entry }, ...loadMockHistory()].slice(0, 80);
  writeStore(STORAGE_KEYS.mockHistory, history);
  writeStore(STORAGE_KEYS.mockProgress, buildMockProgress(history));
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

const pickQuickRevisionCards = (items, count, storageKey = STORAGE_KEYS.recentQuickRev, recentLimit = 220) => {
  const prepared = items.map((item, index) => ({ ...item, q: item.id || `${item.topic}|${item.front}|${index}` }));
  return pickRandomNoRepeat(prepared, count, storageKey, recentLimit).map(({ q, ...item }) => item);
};

const isPassCoreCard = (item) => {
  const text = `${item.topic} ${item.front} ${item.back} ${item.context} ${item.memory}`.toLowerCase();
  return /history|wars|4 nations|parliament|elections|law|religion|festivals|landmarks|world orgs|key people|comparisons|symbols|geography|government & parliament|rights & everyday life|britain beyond the uk|anchor dates|world organisations|uk capitals|justice basics|voting basics|house of commons|house of lords|great britain|united kingdom|crown dependencies|overseas territories|council of europe|magna carta|1066|nhs|church of england|big ben/.test(text);
};

const isTrapCard = (item) => {
  const text = `${item.topic} ${item.front} ${item.back} ${item.context} ${item.memory}`.toLowerCase();
  return /comparison|trap|vs |versus|great britain|united kingdom|british isles|crown dependenc|channel islands|overseas territories|big ben|elizabeth tower|church of england|church of scotland|council of europe|eu|commonwealth|nato|thames|severn|highers|a-level|dunkirk|d-day|battle of britain|blitz/.test(text);
};

const QUICK_REVISION_SESSION_OPTIONS = [
  { id: "short", label: "5 min", count: 8, detail: "Very short fresh burst." },
  { id: "medium", label: "10 min", count: 14, detail: "Balanced quick revision." },
  { id: "long", label: "15 min", count: 20, detail: "Deeper but still phone-friendly." },
];

const QUICK_REVISION_FOCUS_OPTIONS = [
  { id: "fresh", label: "Fresh mix", detail: "Balanced coverage across the course with new cards first." },
  { id: "core", label: "Pass core", detail: "Highest-yield facts to pass quickly." },
  { id: "weak", label: "Weak areas", detail: "Cards you marked hard or struggle with most." },
  { id: "traps", label: "Common traps", detail: "Comparison cards and high-confusion facts." },
  { id: "dates", label: "Dates only", detail: "Timeline, wars, and major year anchors." },
  { id: "nations", label: "4 Nations", detail: "Capitals, saints, parliaments, symbols, and places." },
];

const getQuickRevisionBucket = (item) => {
  if (isTrapCard(item)) return "Traps";
  if (/history|wars/.test(item.topic.toLowerCase()) || /\b\d{3,4}\b|ad|bc/.test(`${item.front} ${item.back}`.toLowerCase())) return "History";
  if (/4 nations|geography|landmarks|symbols/.test(item.topic.toLowerCase())) return "Nations";
  if (/parliament|law|community|government|rights|everyday|elections|coverage/.test(item.topic.toLowerCase())) return "Civics";
  if (/world orgs|international|inventors/.test(item.topic.toLowerCase())) return "World & Science";
  return "People & Culture";
};

const isDateHeavyCard = (item) =>
  /\b\d{2,4}\b|ad|bc|hastings|magna carta|act of union|church of england|world war|armistice|beveridge|nhs|battle/i
    .test(`${item.front} ${item.back} ${item.context}`);

const getQuickRevisionFocusPool = (deck, focus, ratings) => {
  if (focus === "core") return deck.filter(isPassCoreCard);
  if (focus === "traps") return deck.filter(isTrapCard);
  if (focus === "dates") return deck.filter(isDateHeavyCard);
  if (focus === "nations") return deck.filter((item) => ["4 Nations", "Geography", "Landmarks", "Symbols"].includes(item.topic));
  if (focus === "weak") {
    const weak = deck
      .filter((item) => (ratings[item.id]?.hard || 0) > 0 || (ratings[item.id]?.seen || 0) > 0)
      .sort((a, b) => ((ratings[b.id]?.hard || 0) - (ratings[b.id]?.easy || 0)) - ((ratings[a.id]?.hard || 0) - (ratings[a.id]?.easy || 0)));
    return weak.length ? weak : deck.filter(isPassCoreCard);
  }
  return deck;
};

const buildQuickRevisionSession = (deck, focus, count, ratings = {}) => {
  const pool = getQuickRevisionFocusPool(deck, focus, ratings);
  const recent = readStore(STORAGE_KEYS.recentQuickRev, []);
  const target = Math.min(count, pool.length || count);

  if (!pool.length) return { cards: [], newCount: 0, reviewCount: 0, buckets: {} };

  let cards = [];
  if (focus === "fresh" || focus === "core") {
    const buckets = ["History", "Civics", "Nations", "People & Culture", "World & Science", "Traps"];
    const grouped = Object.fromEntries(buckets.map((bucket) => [bucket, shuffleList(pool.filter((item) => getQuickRevisionBucket(item) === bucket))]));
    const used = new Set();
    let guard = 0;
    while (cards.length < target && guard < target * 8) {
      buckets.forEach((bucket) => {
        if (cards.length >= target) return;
        const next = grouped[bucket]?.find((item) => !used.has(item.id) && !recent.includes(item.id));
        if (next) {
          cards.push(next);
          used.add(next.id);
        }
      });
      guard += 1;
      if (cards.length < target && guard > 2) {
        buckets.forEach((bucket) => {
          if (cards.length >= target) return;
          const fallback = grouped[bucket]?.find((item) => !used.has(item.id));
          if (fallback) {
            cards.push(fallback);
            used.add(fallback.id);
          }
        });
      }
    }
    if (cards.length < target) {
      const fallback = shuffleList(pool).filter((item) => !used.has(item.id)).slice(0, target - cards.length);
      cards = [...cards, ...fallback];
    }
  } else if (focus === "weak") {
    cards = pool.slice(0, target);
  } else {
    cards = pickQuickRevisionCards(pool, target);
  }

  const normalized = cards.map((item) => ({ ...item, bucket: getQuickRevisionBucket(item) }));
  const updatedRecent = [...normalized.map((item) => item.id), ...recent]
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, 260);
  writeStore(STORAGE_KEYS.recentQuickRev, updatedRecent);
  const buckets = normalized.reduce((acc, item) => {
    acc[item.bucket] = (acc[item.bucket] || 0) + 1;
    return acc;
  }, {});
  return {
    cards: normalized,
    newCount: normalized.filter((item) => !recent.includes(item.id)).length,
    reviewCount: normalized.filter((item) => recent.includes(item.id) || (ratings[item.id]?.seen || 0) > 0).length,
    buckets,
  };
};

const getMockNextPaper = (progress = {}) => {
  const attemptedIds = new Set(Object.keys(progress).map((key) => Number(key)));
  return MOCK_PAPERS.find((paper) => !attemptedIds.has(paper.id)) || MOCK_PAPERS.find((paper) => (progress[paper.id]?.lastPercent || 0) < 75) || MOCK_PAPERS[0];
};

const formatAttemptDate = (value) => {
  if (!value) return "Not started";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not started";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// ── HELPERS ──────────────────────────────────────────────────
const getBadgeVariant = (color) => {
  if (["#22c55e", "#10b981", "#16a34a"].includes(color)) return "success";
  if (["#f59e0b", "#f97316", "#eab308"].includes(color)) return "warning";
  if (["#ef4444", "#dc2626", "#f87171"].includes(color)) return "destructive";
  if (["#64748b", "#94a3b8"].includes(color)) return "secondary";
  return "default";
};

const Badge = ({ text, color = "#3b82f6" }) => (
  <UiBadge className="app-badge text-[10px] font-bold tracking-[0.18em]" variant={getBadgeVariant(color)}>{text}</UiBadge>
);

const Card = ({ children, style = {}, className = "", ...props }) => (
  <UiCard
    {...props}
    className={cn("app-card mb-3 rounded-[18px] border bg-card/90 p-4 shadow-soft", className)}
    style={style}
  >
    {children}
  </UiCard>
);

const SectionTitle = ({ children, icon, meta }) => (
  <div className="section-title-wrap mb-4">
    <h2 className="flex items-center gap-2 text-[22px] font-extrabold text-foreground">
      {icon && <span>{icon}</span>}{children}
    </h2>
    {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
  </div>
);

const MemoryHook = ({ text }) => (
  <div className="memory-hook mt-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-[13px] text-emerald-800 dark:text-emerald-200">
    <span className="font-extrabold text-emerald-600 dark:text-emerald-300">💡 Memory: </span>{text}
  </div>
);

const TrapAlert = ({ text }) => (
  <div className="trap-alert mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-[13px] text-red-800 dark:text-red-200">
    <span className="font-extrabold text-red-600 dark:text-red-300">🚨 Exam trap: </span>{text}
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

const CompactVisualStrip = ({ title, items, accent = "#3b82f6" }) => (
  <div className="mb-3 rounded-[14px] border border-border bg-secondary/70 p-2.5">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <div className="text-sm font-extrabold text-foreground">{title}</div>
      <Badge text="Visual clue" color={accent} />
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs leading-[1.3] text-foreground">
          <span className="text-[15px]">{item.icon}</span>
          <span><strong className="text-foreground">{item.label}</strong>{item.text ? ` · ${item.text}` : ""}</span>
        </div>
      ))}
    </div>
  </div>
);

const StatTile = ({ label, value, color }) => (
  <div className="rounded-2xl border border-border bg-secondary/70 p-3.5">
    <div style={{ color }} className="text-[22px] font-extrabold">{value}</div>
    <div className="mt-1 text-xs text-muted-foreground">{label}</div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <Button onClick={onClick} variant={active ? "default" : "secondary"} size="sm" className="rounded-full text-xs">
    {children}
  </Button>
);

const SettingGroup = ({ label, options, value, onChange }) => (
  <div className="mb-3">
    <div className="mb-2 text-xs text-muted-foreground">{label}</div>
    <div className="flex flex-wrap gap-2">
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
        className="focus-ring flex min-w-[54px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold"
        onClick={onBack}
        style={{ border: "none", background: "none", color: canGoBack ? "var(--text-strong)" : "var(--text-muted)", cursor: canGoBack ? "pointer" : "default" }}
      >
        <span className="text-lg">←</span>
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
            color: active === item.id ? "var(--accent-text)" : "var(--text-muted)",
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
        <span style={{ fontSize: 18 }}>☰</span>
        <span>Menu</span>
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
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <SheetContent side="bottom" hideClose className="mobile-sheet overflow-y-auto p-4">
        <SheetHeader className="mb-3 pr-14">
          <SheetTitle>Quick access</SheetTitle>
          <SheetDescription>Move around without scrolling.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-3">
          <Button
            variant="secondary"
            className="h-auto w-full justify-between rounded-2xl px-4 py-3 text-left"
            onClick={() => { if (canGoBack) onBack(); onClose(); }}
          >
            <span>← Back</span>
            <span className="text-xs text-muted-foreground">{canGoBack ? "Previous screen" : "No history yet"}</span>
          </Button>
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-1 text-xs font-bold text-muted-foreground">{group.title}</div>
              <div className="mb-2 text-[11px] text-muted-foreground">{group.hint}</div>
              <div className="mobile-sheet-grid">
                {group.ids.map((id) => {
                  const item = TABS.find((tab) => tab.id === id);
                  if (!item) return null;
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "focus-ring rounded-2xl border px-3 py-3 text-left transition-colors",
                        active === item.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary/70 text-foreground"
                      )}
                      onClick={() => { setActive(item.id); onClose(); }}
                    >
                      <div className="mb-1.5 text-xl">{item.icon}</div>
                      <div className="text-sm font-bold">{item.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const QuestionCard = ({ question, selected, confirmed, onSelect }) => (
  <>
    <Card className="border-border bg-gradient-to-b from-secondary/70 to-card">
      <div className="text-[17px] font-extrabold leading-7 text-foreground">{question.q}</div>
      <div className="mt-3"><Badge text={inferTopic(question)} color="#60a5fa" /></div>
    </Card>
    <div className="grid gap-2">
      {question.opts.map((opt, oi) => {
        let bg = "var(--card-bg)";
        let border = "var(--card-border)";
        let color = "var(--text)";
        if (confirmed) {
          if (oi === question.a) { bg = "#0f1f0f"; border = "#22c55e"; color = "#4ade80"; }
          else if (oi === selected && oi !== question.a) { bg = "#220d0d"; border = "#ef4444"; color = "#fca5a5"; }
          else { color = "var(--text-muted)"; }
        } else if (selected === oi) {
          bg = "var(--accent-soft)"; border = "var(--accent)"; color = "var(--accent-text)";
        }
        return (
          <button key={oi} className="focus-ring rounded-2xl px-4 py-3.5 text-left text-sm font-medium transition-all" onClick={() => onSelect(oi)}
            style={{ border: `2px solid ${border}`, cursor: confirmed ? "default" : "pointer", background: bg, color }}>
            <span className="mr-2 font-bold opacity-70">{["A", "B", "C", "D"][oi]}.</span>{opt}
            {confirmed && oi === question.a && " ✓"}
            {confirmed && oi === selected && oi !== question.a && " ✗"}
          </button>
        );
      })}
    </div>
  </>
);

const MOCK_TOTAL = 24;
const MOCK_LIMIT_SECONDS = 45 * 60;
const MOCK_PAPER_COUNT = 40;

const MOCK_CATEGORY_META = {
  history: { label: "History", icon: "📜", color: "#f97316", hint: "Kings, wars, reform, dates, and welfare-state anchors." },
  civics: { label: "Government & Law", icon: "⚖️", color: "#22c55e", hint: "Parliament, voting, values, rights, duties, courts, and citizenship." },
  nations: { label: "4 Nations & Places", icon: "🗺️", color: "#0ea5e9", hint: "Capitals, saints, parliaments, symbols, and geography." },
  culture: { label: "People & Culture", icon: "🎭", color: "#8b5cf6", hint: "Religion, festivals, inventors, arts, sport, landmarks, and famous people." },
  traps: { label: "Compare Traps", icon: "⚠️", color: "#ef4444", hint: "Common mix-ups that often cost easy marks under pressure." },
};

const MOCK_DISTRIBUTION = [
  { id: "history", count: 7 },
  { id: "civics", count: 7 },
  { id: "nations", count: 5 },
  { id: "culture", count: 4 },
  { id: "traps", count: 1 },
];

const MOCK_SUBGROUP_DISTRIBUTION = [
  { id: "history-early", count: 3 },
  { id: "history-modern", count: 2 },
  { id: "history-conflicts", count: 2 },
  { id: "civics-government", count: 3 },
  { id: "civics-law", count: 2 },
  { id: "civics-everyday", count: 2 },
  { id: "nations-identity", count: 3 },
  { id: "nations-places", count: 2 },
  { id: "culture-people", count: 2 },
  { id: "culture-society", count: 2 },
  { id: "traps", count: 1 },
];

const createSeededRandom = (seed) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const seededShuffle = (items, seed) => {
  const random = createSeededRandom(seed);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const hashText = (text) =>
  [...text].reduce((sum, char, index) => ((sum * 31) + char.charCodeAt(0) + index) >>> 0, 0);

const prepareQuestionVariant = (question, seed = 0) => {
  if (!question?.opts || question.opts.length < 2) return question;
  const indexed = question.opts.map((opt, index) => ({ opt, index }));
  const shuffled = seededShuffle(indexed, seed + hashText(question.q));
  return {
    ...question,
    opts: shuffled.map((item) => item.opt),
    a: shuffled.findIndex((item) => item.index === question.a),
  };
};

const classifyMockCategory = (question) => {
  const text = `${question.q} ${question.tip}`.toLowerCase();
  if (/compare mode|trap|vs |versus|great britain|big ben|elizabeth tower|union of crowns|act of union|church of england|church of scotland|council of europe|river severn|river thames|slave trade|women's vote|british isles|republic of ireland|crown dependenc|channel islands|overseas territor/.test(text)) return "traps";
  if (/war|battle|roman|norman|tudor|stuart|victoria|magna carta|boudicca|athelstan|alfred|domesday|hastings|reformation|beveridge|nhs|wilberforce|chartist|peterloo|suffragette|general strike|union of crowns|james i|charles i|waterloo|world war/.test(text)) return "history";
  if (/prime minister|monarch|commons|lords|parliament|speaker|democracy|vote|ballot|constituenc|jury|magistrate|law|equality act|rule of law|innocent|community|volunteer|bank of england|10 downing street|government|human rights/.test(text)) return "civics";
  if (/england|scotland|wales|northern ireland|belfast|cardiff|edinburgh|london|saint|shamrock|daffodil|thistle|rose|senedd|holyrood|stormont|union jack|capital city|loch|snowdonia|river|wall|castle|palace|museum|stonehenge|tower of london|windsor|buckingham|cenotaph|welsh|gaelic|jersey|guernsey|isle of man/.test(text)) return "nations";
  return "culture";
};

const classifyMockSubgroup = (question) => {
  const text = `${question.q} ${question.tip}`.toLowerCase();
  const category = classifyMockCategory(question);

  if (category === "traps") return "traps";

  if (category === "history") {
    if (/world war|trafalgar|waterloo|armada|crimean|boer|dunkirk|blitz|d-day|boyne|culloden|bannockburn|agincourt|bosworth|hastings|battle/.test(text)) return "history-conflicts";
    if (/reform|vote|suffragette|chartist|peterloo|general strike|beveridge|nhs|wind of change|industrial revolution|butler act|decolonisation|eec|brexit|devolution|olympics/.test(text)) return "history-modern";
    return "history-early";
  }

  if (category === "civics") {
    if (/jury|magistrate|court|crime|criminal|civil|habeas corpus|equality act|innocent|rule of law|human rights/.test(text)) return "civics-law";
    if (/national insurance|council tax|lottery|drive|driving|moped|school|education|training|blood donation|community|volunteer|charity|census|photo id|language requirement|citizenship|settlement/.test(text)) return "civics-everyday";
    return "civics-government";
  }

  if (category === "nations") {
    if (/stonehenge|tower of london|windsor|buckingham|cenotaph|loch|river|wall|castle|museum|palace|giant|angel of the north|eden project/.test(text)) return "nations-places";
    return "nations-identity";
  }

  if (/christmas|easter|diwali|hanukkah|eid|vaisakhi|bonfire|remembrance|burns|hogmanay|mothering|faith|religion|festival|anthem|union jack|world wide web|penicillin|invention|invent|scientist|writer|artist|poet|playwright|beatles|fashion|sport|wimbledon|fa cup|marathon|olympic|paralympic|commonwealth|nato|united nations|council of europe|g7/.test(text)) {
    return "culture-society";
  }
  return "culture-people";
};

const buildMockBuckets = () => {
  const bucketed = {
    history: [],
    civics: [],
    nations: [],
    culture: [],
    traps: [],
    "history-early": [],
    "history-modern": [],
    "history-conflicts": [],
    "civics-government": [],
    "civics-law": [],
    "civics-everyday": [],
    "nations-identity": [],
    "nations-places": [],
    "culture-people": [],
    "culture-society": [],
  };
  [...ALL_QUIZ, ...buildConfusionDeck()].forEach((question, index) => {
    const key = classifyMockCategory(question);
    const subgroup = classifyMockSubgroup(question);
    const enriched = { ...question, mockKey: `${key}:${index}:${question.q}` };
    bucketed[key].push(enriched);
    bucketed[subgroup].push(enriched);
  });
  return bucketed;
};

const takeFixedQuestions = (items, count, startIndex, used) => {
  if (!items.length) return [];
  const picked = [];
  let offset = 0;
  while (picked.length < count && offset < items.length * 2) {
    const item = items[(startIndex + offset) % items.length];
    if (!used.has(item.q)) {
      picked.push(item);
      used.add(item.q);
    }
    offset += 1;
  }
  return picked;
};

const buildFixedMockPaper = (paperNumber) => {
  const buckets = buildMockBuckets();
  const used = new Set();
  const questions = [];

  MOCK_SUBGROUP_DISTRIBUTION.forEach(({ id, count }, bucketIndex) => {
    const items = buckets[id];
    const startIndex = ((paperNumber - 1) * (count + bucketIndex + 2)) % items.length;
    questions.push(...takeFixedQuestions(items, count, startIndex, used));
  });

  if (questions.length < MOCK_TOTAL) {
    const fallbackGroups = MOCK_DISTRIBUTION.flatMap(({ id }) => seededShuffle(buckets[id], 2000 + paperNumber + id.length));
    fallbackGroups.forEach((question) => {
      if (questions.length >= MOCK_TOTAL || used.has(question.q)) return;
      questions.push(question);
      used.add(question.q);
    });
  }

  if (questions.length < MOCK_TOTAL) {
    const fallback = seededShuffle([...ALL_QUIZ, ...buildConfusionDeck()], 1000 + paperNumber);
    fallback.forEach((question) => {
      if (questions.length >= MOCK_TOTAL || used.has(question.q)) return;
      questions.push(question);
      used.add(question.q);
    });
  }

  return seededShuffle(questions.slice(0, MOCK_TOTAL), 5000 + paperNumber)
    .map((question, index) => prepareQuestionVariant(question, 9000 + paperNumber * 100 + index));
};

const MOCK_PAPERS = Array.from({ length: MOCK_PAPER_COUNT }, (_, index) => ({
  id: index + 1,
  title: `Mock Test ${index + 1}`,
  note: index < 5 ? "Start with these for broad balanced recall." : index < 10 ? "Good second round once the basics feel steady." : index < 15 ? "More pressure from traps and mixed recall." : "Final stretch papers before the real test.",
  accent: ["#f97316", "#3b82f6", "#22c55e", "#8b5cf6", "#ef4444"][index % 5],
  questions: buildFixedMockPaper(index + 1),
}));

const formatCountdown = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const buildMockAnswerContext = (question) => {
  const category = classifyMockCategory(question);
  if (category === "history") return "Pin this to a date or reign. In the test, history errors usually come from mixing two similar years or rulers.";
  if (category === "civics") return "These questions test how the UK works today: laws, rights, voting, government, and your role in public life.";
  if (category === "nations") return "Anchor these with a place link: nation, capital, symbol, parliament, or landmark. Geography marks should feel quick and confident.";
  if (category === "traps") return "Treat this as a comparison question. The easiest way to remember it is to hold both sides in your head at the same time.";
  return "This area is usually tested as short factual recall. Link the answer to one person, place, event, or visible clue so it sticks.";
};

const buildMockCategoryBreakdown = (questions, answers) =>
  Object.entries(MOCK_CATEGORY_META)
    .map(([key, meta]) => {
      const total = questions.filter((question) => classifyMockCategory(question) === key).length;
      const correct = questions.reduce((sum, question, index) => sum + ((classifyMockCategory(question) === key && answers[index] === question.a) ? 1 : 0), 0);
      return { ...meta, total, correct };
    })
    .filter((row) => row.total > 0);

// ── TAB BAR ──────────────────────────────────────────────────
const TabBar = ({ active, setActive, menuOpen, setMenuOpen, isDark, toggleDark, openQuickPanel, isMobile }) => {
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

  const handleMenuButton = () => {
    if (isMobile) {
      openQuickPanel();
      return;
    }
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="sticky top-0 z-[100] border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3">
        <button aria-label={isMobile ? "Open quick panel" : menuOpen ? "Close topics menu" : "Open topics menu"} className="focus-ring rounded-xl border border-border bg-card px-3 py-2 text-lg text-foreground shadow-sm" onClick={handleMenuButton}>
          ☰
        </button>
        <button aria-label="Go to home" className="focus-ring rounded-xl bg-transparent px-0 text-lg font-extrabold text-primary" onClick={() => setActive("home")} style={{ border: "none", cursor: "pointer" }}>
          🇬🇧 Life in the UK
        </button>
        <div className="ml-auto flex items-center gap-2">
          <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener"
            className="hidden whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground no-underline shadow-sm sm:inline-flex">
            ⭐ GitHub
          </a>
          <button aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} className="focus-ring rounded-xl border border-border bg-card px-3 py-2 text-[15px] text-foreground shadow-sm" onClick={toggleDark} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            {isDark ? "☀️" : "🌙"}
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
      </div>
      {!isMobile && menuOpen && (
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

const AppFooterBar = ({ onForceRefresh, offlineReady, isOffline }) => (
  <div className="px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-2">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/80 px-3 py-3 shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <Badge text={`Release ${APP_VERSION}`} color="#64748b" />
        <Badge text={isOffline ? "Offline now" : offlineReady ? "Offline ready" : "Online only"} color={isOffline ? "#f59e0b" : offlineReady ? "#22c55e" : "#64748b"} />
      </div>
      <Button
        aria-label="Get latest app version"
        variant="secondary"
        onClick={onForceRefresh}
        title="Reload latest version"
        className="h-10 whitespace-nowrap rounded-xl text-xs font-extrabold"
      >
        ↻ Latest
      </Button>
    </div>
  </div>
);

// ── HOME ─────────────────────────────────────────────────────
const HomeTab = ({ setActive, wrongQuestions, mockHistory, mockProgress }) => {
  const latestMock = mockHistory[0];
  const completedPapers = Object.keys(mockProgress).length;
  const nextPaper = getMockNextPaper(mockProgress);
  const bestPaperScore = completedPapers ? Math.max(...Object.values(mockProgress).map((item) => item.bestPercent)) : 0;
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
    <div className="px-4 py-5 sm:px-5">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <CardTitle className="text-2xl font-black text-foreground">Life in the UK test practice for ILR and citizenship</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6">
                Free revision for the Life in the UK test with topic study, common confusions, mock exams, and memory clues for British citizenship and Indefinite Leave to Remain preparation.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" className="bg-orange-500 hover:bg-orange-500/90" onClick={() => setActive("mock")}>Mock Test</Button>
              <Button variant="secondary" onClick={() => setActive("daily10")}>Daily 10</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 0 }}>
          <Badge text="24 questions" color="#3b82f6" />
          <Badge text="45 minutes" color="#10b981" />
          <Badge text="75% to pass" color="#f59e0b" />
          <Badge text={`${ALL_QUIZ.length} quiz prompts`} color="#ef4444" />
        </div>
        </CardContent>
      </Card>

      <div className="stats-grid" style={{ display: "grid", gap: 10, marginBottom: 14 }}>
        <StatTile label="Wrong answers saved" value={wrongQuestions.length} color="#ef4444" />
        <StatTile label="Mock attempts saved" value={mockHistory.length} color="#3b82f6" />
        <StatTile label="Mock papers done" value={completedPapers} color="#8b5cf6" />
        <StatTile label="Last mock score" value={latestMock ? `${latestMock.score}/24` : "0/24"} color="#10b981" />
        <StatTile label="Best paper result" value={completedPapers ? `${bestPaperScore}%` : "0%"} color="#f59e0b" />
      </div>
      <Card style={{ border: "1px solid color-mix(in srgb, #8b5cf6 35%, var(--card-border))", background: "color-mix(in srgb, #8b5cf6 8%, var(--card-bg))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Mock progress saved on this device</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>
              Your completed papers, best scores, and last results stay in local storage, so they still work after new app releases.
            </div>
          </div>
          <Badge text={`${completedPapers}/${MOCK_PAPERS.length} papers tried`} color="#8b5cf6" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <Badge text={`Next paper: #${nextPaper.id}`} color={nextPaper.accent} />
          <Badge text={latestMock ? `Last score ${latestMock.score}/24` : "No paper done yet"} color="#10b981" />
        </div>
        <button className="focus-ring" onClick={() => setActive("mock")} style={{ background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent)", borderRadius: 12, padding: "10px 14px", fontWeight: 800, cursor: "pointer" }}>
          Open Mock Tracker
        </button>
      </Card>

      <Card style={{ border: "1px solid #334155" }}>
        <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>What this app covers for the Life in the UK test</div>
        <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7 }}>
          This free Life in the UK study guide is built for people preparing for the official test as part of British citizenship or ILR applications. It covers British history, the 4 nations, government and Parliament, British values, religion and festivals, landmarks, key historical figures, world organisations, and exam-style practice questions.
        </div>
      </Card>

      <Card style={{ background: "linear-gradient(135deg, var(--surface-soft), color-mix(in srgb, #0ea5e9 12%, var(--card-bg)))", border: "1px solid color-mix(in srgb, #0ea5e9 45%, var(--card-border))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Visual memory clues</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Short codes from the revision pack, now built into the app</div>
          </div>
          <Badge text={`${VISUAL_MNEMONICS.length} memory packs`} color="#06b6d4" />
        </div>
        <div className="study-mode-grid" style={{ display: "grid", gap: 8 }}>
          {VISUAL_MNEMONICS.map((item) => (
            <div key={item.code} style={{ background: item.color + "14", border: `1px solid ${item.color}30`, borderRadius: 16, padding: 11 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.icon} {item.title}</div>
                <Badge text={item.code} color={item.color} />
              </div>
              <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>{item.clue}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>{item.visual}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Coverage checklist</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Handbook-style areas organised for quick navigation</div>
          </div>
          <Badge text={`${COVERAGE_AREAS.length} areas covered`} color="#22c55e" />
        </div>
        <div className="study-mode-grid" style={{ display: "grid", gap: 8 }}>
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

      <div className="study-mode-grid" style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {[
          { id: "mock", icon: "📝", title: "Mock Test", desc: "Real exam format: 24 questions, 45 minutes, results at the end.", color: "#f97316" },
          { id: "daily10", icon: "🔟", title: "Daily 10", desc: "Fresh 10-question set for quick phone practice.", color: "#10b981" },
          { id: "sprint", icon: "⚡", title: "True/False Sprint", desc: "Fast mobile revision with simple true/false calls.", color: "#0ea5e9" },
          { id: "confuse", icon: "⚖️", title: "Compare Confusions", desc: "Side-by-side answers for the facts learners mix up most.", color: "#7c3aed" },
          { id: "cram", icon: "📄", title: "One-Page Cram", desc: "Night-before summary of the highest-yield facts.", color: "#f59e0b" },
          { id: "tracker", icon: "✅", title: "Topic Tracker", desc: "Mark what feels done and see full-course progress.", color: "#22c55e" },
          { id: "timeline", icon: "📅", title: "Timeline Drill", desc: "Use date anchors and memory cues to fix history quickly.", color: "#3b82f6" },
        ].map((item) => (
          <button key={item.id} className="focus-ring" onClick={() => setActive(item.id)} style={{ background: "var(--card-bg)", border: `1px solid ${item.color}30`, borderRadius: 18, padding: 15, textAlign: "left", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 26 }}>{item.icon}</div>
              <Badge text="Study mode" color={item.color} />
            </div>
            <div style={{ color: "var(--text-strong)", fontSize: 16, fontWeight: 800, marginBottom: 5 }}>{item.title}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
          </button>
        ))}
      </div>

      <Card style={{ background: "var(--success-surface)", border: "1px solid var(--success-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--success-text)" }}>🎯 Top 10 Most-Tested Facts</div>
            <div style={{ fontSize: 13, color: "var(--success-muted)", marginTop: 4 }}>Refresh for a new mix or move to the next batch.</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={refreshFacts} style={{ background: "#166534", color: "#ecfdf5", border: "1px solid #22c55e", borderRadius: 12, padding: "9px 12px", cursor: "pointer", fontWeight: 700 }}>Refresh facts</button>
            <button className="focus-ring" onClick={nextFacts} style={{ background: "var(--surface-strong)", color: "var(--success-text)", border: "1px solid var(--success-border)", borderRadius: 12, padding: "9px 12px", cursor: "pointer", fontWeight: 700 }}>Next 10</button>
          </div>
        </div>
        {visibleFacts.map((fact, index) => (
          <div key={fact} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: index < 9 ? "1px solid rgba(74,222,128,0.15)" : "none" }}>
            <div style={{ color: "#4ade80", fontWeight: 800, minWidth: 22 }}>{index + 1}.</div>
            <div style={{ color: "var(--success-text)", fontSize: 14, lineHeight: 1.5 }}>{fact}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};

const DailyTenTab = () => {
  const topics = useMemo(() => ["All", ...Array.from(new Set(ALL_QUIZ.map((item) => inferTopic(item))))], []);
  const [topic, setTopic] = useState("All");
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const buildSession = () => {
    const pool = topic === "All" ? ALL_QUIZ : ALL_QUIZ.filter((item) => inferTopic(item) === topic);
    const picked = pickRandomNoRepeat(pool, Math.min(10, pool.length), STORAGE_KEYS.recentDaily10, 80)
      .map((question, index) => prepareQuestionVariant(question, 12000 + index));
    setSession(picked);
    setIndex(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  };

  useEffect(() => {
    buildSession();
  }, [topic]);

  if (!session.length) return null;

  const question = session[index];
  const next = () => {
    if (index + 1 >= session.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setConfirmed(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="🔟" meta="Fresh 10-question phone practice for short sessions.">Daily 10</SectionTitle>
      {!finished ? (
        <>
          <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>Pick a topic and start fast</div>
                <div style={{ color: "var(--text-muted)", fontSize: 12 }}>A new set is generated each time you change topic or restart.</div>
              </div>
              <Badge text={`${score}/${session.length}`} color="#10b981" />
            </div>
            <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
              {topics.map((item) => <TabButton key={item} active={topic === item} onClick={() => setTopic(item)}>{item}</TabButton>)}
            </div>
            <button className="focus-ring" onClick={buildSession} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
              Refresh 10
            </button>
          </Card>
          <Badge text={`${index + 1} of ${session.length}`} color="#64748b" />
          <div style={{ height: 10 }} />
          <QuestionCard question={question} selected={selected} confirmed={confirmed} onSelect={(choice) => {
            if (confirmed) return;
            setSelected(choice);
            setConfirmed(true);
            if (choice === question.a) setScore((value) => value + 1);
          }} />
          {confirmed && (
            <>
              <MemoryHook text={question.tip} />
              <button className="focus-ring" onClick={next} style={{ width: "100%", marginTop: 12, padding: "12px 14px", borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent)", fontWeight: 800, cursor: "pointer" }}>
                {index + 1 >= session.length ? "See Daily 10 results" : "Next question"}
              </button>
            </>
          )}
        </>
      ) : (
        <Card style={{ textAlign: "center", border: `2px solid ${score >= 8 ? "#22c55e" : "#f59e0b"}` }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{score >= 8 ? "✅" : "📚"}</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 24, marginBottom: 8 }}>Daily 10 complete</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 12 }}>{topic} practice set</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text-strong)", marginBottom: 16 }}>{score}/10</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={buildSession} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontWeight: 800, cursor: "pointer" }}>New 10</button>
            <button className="focus-ring" onClick={() => setTopic("All")} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 18px", cursor: "pointer" }}>All topics</button>
          </div>
        </Card>
      )}
    </div>
  );
};

const CramSheetTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="📄" meta="Use this the night before the test or while waiting outside the test centre.">One-Page Cram Sheet</SectionTitle>
    <Card style={{ background: "color-mix(in srgb, #f59e0b 10%, var(--card-bg))", border: "1px solid color-mix(in srgb, #f59e0b 35%, var(--card-border))" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>How to use this page</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • Read this page top to bottom once<br />
        • Focus on dates, compare traps, and names you still mix up<br />
        • If one area feels weak, jump back to that full tab afterwards
      </div>
      <MemoryHook text="This page is for compression, not first-time learning. Use it to tighten what you already studied." />
    </Card>
    {CRAM_SECTIONS.map((section) => (
      <Card key={section.title} style={{ border: `1px solid ${section.color}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 16 }}>{section.title}</div>
          <Badge text={`${section.facts.length} checks`} color={section.color} />
        </div>
        {section.facts.map((fact, index) => (
          <div key={fact} style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.7, padding: "6px 0", borderBottom: index < section.facts.length - 1 ? "1px solid var(--card-border)" : "none" }}>
            <span style={{ color: section.color, marginRight: 6 }}>▸</span>{fact}
          </div>
        ))}
      </Card>
    ))}
  </div>
);

const TopicTrackerTab = ({ setActive }) => {
  const [progress, setProgress] = useState(() => readStore(STORAGE_KEYS.topicTracker, {}));
  const completed = TRACKER_SECTIONS.filter((item) => progress[item.id]).length;
  const percent = Math.round((completed / TRACKER_SECTIONS.length) * 100);

  const toggle = (id) => {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    writeStore(STORAGE_KEYS.topicTracker, next);
  };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="✅" meta="Track what feels done and what still needs another pass.">Topic Completion Tracker</SectionTitle>
      <Card style={{ border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Full-course progress</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Simple local tracker stored on this device.</div>
          </div>
          <Badge text={`${completed}/${TRACKER_SECTIONS.length} complete`} color="#22c55e" />
        </div>
        <div style={{ background: "var(--surface-muted)", borderRadius: 999, height: 10, marginBottom: 8 }}>
          <div style={{ background: "#22c55e", borderRadius: 999, height: "100%", width: `${percent}%` }} />
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{percent}% complete</div>
      </Card>
      {TRACKER_SECTIONS.map((item) => (
        <Card key={item.id} style={{ border: `1px solid ${progress[item.id] ? "#22c55e55" : "var(--card-border)"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <div>
              <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.icon} {item.label}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{item.detail}</div>
            </div>
            <Badge text={progress[item.id] ? "Done" : "Open"} color={progress[item.id] ? "#22c55e" : "#64748b"} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={() => toggle(item.id)} style={{ background: progress[item.id] ? "color-mix(in srgb, #22c55e 12%, var(--card-bg))" : "var(--chip-bg)", color: progress[item.id] ? "#16a34a" : "var(--text)", border: `1px solid ${progress[item.id] ? "#22c55e" : "var(--card-border)"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
              {progress[item.id] ? "Mark as not done" : "Mark complete"}
            </button>
            <button className="focus-ring" onClick={() => setActive(item.tab)} style={{ background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
              Open topic
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};

const TrueFalseSprintTab = () => {
  const buildRound = () => pickRandomNoRepeat(ALL_QUIZ, 18, STORAGE_KEYS.recentSprint, 120).map((question, index) => {
    const prepared = prepareQuestionVariant(question, 14000 + index);
    const useTrue = index % 2 === 0;
    const wrongOptions = prepared.opts.filter((_, optionIndex) => optionIndex !== prepared.a);
    const displayed = useTrue ? prepared.opts[prepared.a] : wrongOptions[index % wrongOptions.length];
    return {
      ...prepared,
      statement: `For this question, the correct answer is: ${displayed}`,
      isTrue: useTrue,
      shownAnswer: displayed,
    };
  });

  const [round, setRound] = useState(() => buildRound());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = round[index];

  const restart = () => {
    setRound(buildRound());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const answer = (value) => {
    if (selected !== null) return;
    setSelected(value);
    if (value === current.isTrue) setScore((s) => s + 1);
    setTimeout(() => {
      if (index + 1 >= round.length) {
        setFinished(true);
        return;
      }
      setIndex((v) => v + 1);
      setSelected(null);
    }, 1100);
  };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="⚡" meta="Very fast mobile revision. Read the statement and call it true or false.">True / False Sprint</SectionTitle>
      {!finished ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <Badge text={`${index + 1}/${round.length}`} color="#64748b" />
            <Badge text={`Score ${score}`} color="#22c55e" />
          </div>
          <Card style={{ border: "1px solid #1e3a5f", background: "linear-gradient(180deg, rgba(15,23,42,0.92), rgba(8,12,20,0.94))" }}>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>{current.q}</div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18, lineHeight: 1.6 }}>{current.statement}</div>
          </Card>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            <button className="focus-ring" onClick={() => answer(true)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #22c55e", background: selected === true ? "#0f1f0f" : "color-mix(in srgb, #22c55e 10%, var(--card-bg))", color: "#16a34a", fontWeight: 800, cursor: "pointer" }}>True</button>
            <button className="focus-ring" onClick={() => answer(false)} style={{ padding: "14px 16px", borderRadius: 14, border: "1px solid #ef4444", background: selected === false ? "#220d0d" : "color-mix(in srgb, #ef4444 10%, var(--card-bg))", color: "#dc2626", fontWeight: 800, cursor: "pointer" }}>False</button>
          </div>
          {selected !== null && (
            <Card style={{ border: `1px solid ${selected === current.isTrue ? "#22c55e" : "#ef4444"}` }}>
              <div style={{ color: selected === current.isTrue ? "#16a34a" : "#dc2626", fontWeight: 800, marginBottom: 6 }}>
                {selected === current.isTrue ? "Correct" : "Incorrect"}
              </div>
              <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.7 }}>
                Correct answer: {current.opts[current.a]}
              </div>
              <MemoryHook text={current.tip} />
            </Card>
          )}
        </>
      ) : (
        <Card style={{ textAlign: "center", border: `2px solid ${score >= 14 ? "#22c55e" : "#f59e0b"}` }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{score >= 14 ? "⚡" : "📚"}</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 24, marginBottom: 8 }}>Sprint finished</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text-strong)", marginBottom: 16 }}>{score}/{round.length}</div>
          <button className="focus-ring" onClick={restart} style={{ background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontWeight: 800, cursor: "pointer" }}>
            New sprint
          </button>
        </Card>
      )}
    </div>
  );
};

const QuickRevisionTab = ({ setActive }) => {
  const deck = useMemo(() => buildQuickRevisionDeck(), []);
  const [focus, setFocus] = useState("fresh");
  const [sessionType, setSessionType] = useState("medium");
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [sessionMeta, setSessionMeta] = useState({ newCount: 0, reviewCount: 0, buckets: {} });
  const [ratings, setRatings] = useState(() => readStore(STORAGE_KEYS.quickRevRatings, {}));
  const current = session[index];

  const selectedSession = QUICK_REVISION_SESSION_OPTIONS.find((item) => item.id === sessionType) || QUICK_REVISION_SESSION_OPTIONS[1];
  const selectedFocus = QUICK_REVISION_FOCUS_OPTIONS.find((item) => item.id === focus) || QUICK_REVISION_FOCUS_OPTIONS[0];
  const persistQuickRevisionState = (next) => writeStore(STORAGE_KEYS.quickRevState, next);
  const clearQuickRevisionState = () => writeStore(STORAGE_KEYS.quickRevState, null);

  const startSession = (overrideFocus = focus, overrideType = sessionType) => {
    const length = (QUICK_REVISION_SESSION_OPTIONS.find((item) => item.id === overrideType) || QUICK_REVISION_SESSION_OPTIONS[1]).count;
    const built = buildQuickRevisionSession(deck, overrideFocus, length, ratings);
    setFocus(overrideFocus);
    setSessionType(overrideType);
    setSession(built.cards);
    setIndex(0);
    setCompleted(0);
    setHardCount(0);
    setRevealed(false);
    setSessionMeta({ newCount: built.newCount, reviewCount: built.reviewCount, buckets: built.buckets });
    persistQuickRevisionState({
      focus: overrideFocus,
      sessionType: overrideType,
      sessionIds: built.cards.map((item) => item.id),
      index: 0,
      completed: 0,
      hardCount: 0,
      revealed: false,
      sessionMeta: { newCount: built.newCount, reviewCount: built.reviewCount, buckets: built.buckets },
    });
  };

  const moveToNext = () => {
    setIndex((value) => value + 1);
    setCompleted((value) => value + 1);
    setRevealed(false);
  };

  const markCard = (result) => {
    if (!current) return;
    const nextRatings = {
      ...ratings,
      [current.id]: {
        seen: (ratings[current.id]?.seen || 0) + 1,
        hard: (ratings[current.id]?.hard || 0) + (result === "hard" ? 1 : 0),
        okay: (ratings[current.id]?.okay || 0) + (result === "okay" ? 1 : 0),
        easy: (ratings[current.id]?.easy || 0) + (result === "easy" ? 1 : 0),
      },
    };
    setRatings(nextRatings);
    writeStore(STORAGE_KEYS.quickRevRatings, nextRatings);
    if (result === "hard") {
      setSession((items) => [...items, current]);
      setHardCount((value) => value + 1);
    }
    moveToNext();
  };

  const moveCard = (direction) => {
    if (!session.length) return;
    setIndex((value) => {
      if (direction === "next") return (value + 1) % session.length;
      return (value - 1 + session.length) % session.length;
    });
    setRevealed(false);
  };
  const jumpRandomCard = () => {
    if (!session.length) return;
    setIndex(Math.floor(Math.random() * session.length));
    setRevealed(false);
  };

  const remaining = Math.max(session.length - index, 0);
  const isFinished = session.length > 0 && index >= session.length;

  useEffect(() => {
    const saved = readStore(STORAGE_KEYS.quickRevState, null);
    if (!saved?.sessionIds?.length) return;
    const restoredCards = saved.sessionIds
      .map((id) => deck.find((item) => item.id === id))
      .filter(Boolean);
    if (!restoredCards.length) return;
    setSession(restoredCards);
    setFocus(saved.focus || "fresh");
    setSessionType(saved.sessionType || "medium");
    setIndex(Math.min(saved.index || 0, Math.max(restoredCards.length - 1, 0)));
    setCompleted(saved.completed || 0);
    setHardCount(saved.hardCount || 0);
    setRevealed(Boolean(saved.revealed));
    setSessionMeta(saved.sessionMeta || { newCount: 0, reviewCount: 0, buckets: {} });
  }, [deck]);

  useEffect(() => {
    if (!session.length || isFinished) {
      clearQuickRevisionState();
      return;
    }
    persistQuickRevisionState({
      focus,
      sessionType,
      sessionIds: session.map((item) => item.id),
      index,
      completed,
      hardCount,
      revealed,
      sessionMeta,
    });
  }, [focus, sessionType, session, index, completed, hardCount, revealed, sessionMeta, isFinished]);

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="↔️" meta="Short fresh revision sessions that mix the full course over time.">Quick Revision</SectionTitle>
      <Card style={{ background: "linear-gradient(135deg, var(--surface-soft), color-mix(in srgb, #0ea5e9 12%, var(--card-bg)))", border: "1px solid color-mix(in srgb, #0ea5e9 45%, var(--card-border))" }}>
        <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Small sessions, fresh coverage</div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
          Use this when you only have a few minutes. Each session gives a fresh set, spreads coverage across the course, and remembers which cards felt hard so weaker facts can come back later.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge text={`${deck.length} cards total`} color="#06b6d4" />
          <Badge text={selectedFocus.label} color="#8b5cf6" />
          <Badge text={`${selectedSession.count} cards this session`} color="#3b82f6" />
          <Badge text="New cards + smart review" color="#22c55e" />
        </div>
      </Card>
      <Card>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>Session length</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {QUICK_REVISION_SESSION_OPTIONS.map((item) => (
            <TabButton key={item.id} active={sessionType === item.id} onClick={() => setSessionType(item.id)}>
              {item.label}
            </TabButton>
          ))}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          {selectedSession.detail}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>Focus</div>
        <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
          {QUICK_REVISION_FOCUS_OPTIONS.map((item) => <TabButton key={item.id} active={focus === item.id} onClick={() => setFocus(item.id)}>{item.label}</TabButton>)}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          {selectedFocus.detail}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="focus-ring" onClick={() => startSession(focus, sessionType)} style={{ border: "1px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent-text)", borderRadius: 999, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
            Start fresh session
          </button>
        </div>
      </Card>
      {!session.length && (
        <Card style={{ border: "1px solid var(--card-border)", textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>🧠</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Start a quick revision run</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            Pick a short session and a focus, then come back later for a new mix without losing your progress.
          </div>
          <button className="focus-ring" onClick={() => startSession(focus, sessionType)} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontWeight: 800 }}>
            Start now
          </button>
        </Card>
      )}
      {isFinished ? (
        <Card style={{ textAlign: "center", border: "1px solid color-mix(in srgb, #22c55e 35%, var(--card-border))" }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>✅</div>
          <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 24, marginBottom: 6 }}>Session complete</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
            You went through {completed} cards. {hardCount > 0 ? `${hardCount} cards were marked hard and will become easier to revisit later.` : "No cards were marked hard in this session."}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <Badge text={`${sessionMeta.newCount} new`} color="#22c55e" />
            <Badge text={`${sessionMeta.reviewCount} review`} color="#3b82f6" />
            {Object.entries(sessionMeta.buckets || {}).slice(0, 4).map(([bucket, total]) => <Badge key={bucket} text={`${bucket} ${total}`} color="#64748b" />)}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={() => startSession(focus, sessionType)} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontWeight: 800 }}>New fresh session</button>
            <button className="focus-ring" onClick={() => startSession("weak", "short")} style={{ background: "color-mix(in srgb, #f59e0b 12%, var(--card-bg))", color: "#b45309", border: "1px solid color-mix(in srgb, #f59e0b 35%, var(--card-border))", borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontWeight: 700 }}>Review hard cards</button>
            <button className="focus-ring" onClick={() => setActive("home")} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontWeight: 700 }}>Back home</button>
          </div>
        </Card>
      ) : current && (
      <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <Badge text={`${index + 1} / ${session.length}`} color={current.color} />
        <Badge text={`${remaining} left`} color="#64748b" />
        <Badge text={`${completed} done`} color="#22c55e" />
        <Badge text={`${sessionMeta.newCount} new in this run`} color="#3b82f6" />
        {hardCount > 0 && <Badge text={`${hardCount} marked hard`} color="#f59e0b" />}
        <div style={{ marginLeft: "auto" }}>
          <button className="focus-ring" onClick={() => startSession(focus, sessionType)} style={{ border: "1px solid var(--card-border)", background: "var(--chip-bg)", color: "var(--text)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>New mix</button>
        </div>
      </div>
      <Card className="quick-revision-card" style={{ border: `1px solid ${current.color}66`, background: `linear-gradient(135deg, ${current.color}12, var(--surface-soft))`, userSelect: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <Badge text={current.topic} color={current.color} />
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{revealed ? "Answer shown" : "Question only"} · {current.bucket}</div>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ background: "var(--panel-bg)", borderRadius: 14, padding: "12px 13px" }}>
            <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, marginBottom: 5 }}>PROMPT</div>
            <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 24, lineHeight: 1.35 }}>{current.front}</div>
          </div>
          {!revealed && (
            <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, padding: "2px 2px 0" }}>
              Think of the answer first, then use <strong style={{ color: "var(--text-strong)" }}>Show answer</strong> to check yourself.
            </div>
          )}
          {revealed && (
            <>
              <div style={{ background: "color-mix(in srgb, var(--accent) 10%, var(--panel-bg))", borderRadius: 14, padding: "12px 13px", border: "1px solid color-mix(in srgb, var(--accent) 22%, var(--card-border))" }}>
                <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, marginBottom: 5 }}>ANSWER</div>
                <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 20, lineHeight: 1.45 }}>{current.back}</div>
              </div>
              <div style={{ background: "var(--panel-bg)", borderRadius: 14, padding: "10px 12px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>WHY THIS MATTERS</div>
                <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.65 }}>{current.context}</div>
              </div>
              <MemoryHook text={current.memory} />
            </>
          )}
        </div>
        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={() => setRevealed((value) => !value)} style={{ flex: 1, minWidth: 160, border: "1px solid var(--accent)", background: "var(--accent-soft)", color: "var(--accent-text)", borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontWeight: 800 }}>
              {revealed ? "Hide details" : "Show details"}
            </button>
            <button className="focus-ring" onClick={() => moveCard("prev")} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontWeight: 700 }}>
              ← Previous
            </button>
            <button className="focus-ring" onClick={jumpRandomCard} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontWeight: 700 }}>
              Random
            </button>
            <button className="focus-ring" onClick={() => moveCard("next")} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontWeight: 700 }}>
              Next →
            </button>
          </div>
          {revealed ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="focus-ring" onClick={() => markCard("hard")} style={{ flex: 1, minWidth: 140, background: "color-mix(in srgb, #f59e0b 12%, var(--card-bg))", color: "#b45309", border: "1px solid color-mix(in srgb, #f59e0b 35%, var(--card-border))", borderRadius: 14, padding: "12px 14px", cursor: "pointer", fontWeight: 800 }}>Hard</button>
              <button className="focus-ring" onClick={() => markCard("okay")} style={{ flex: 1, minWidth: 140, background: "color-mix(in srgb, #38bdf8 12%, var(--card-bg))", color: "#0369a1", border: "1px solid color-mix(in srgb, #38bdf8 35%, var(--card-border))", borderRadius: 14, padding: "12px 14px", cursor: "pointer", fontWeight: 800 }}>Okay</button>
              <button className="focus-ring" onClick={() => markCard("easy")} style={{ flex: 1, minWidth: 140, background: "color-mix(in srgb, #22c55e 12%, var(--card-bg))", color: "#15803d", border: "1px solid color-mix(in srgb, #22c55e 35%, var(--card-border))", borderRadius: 14, padding: "12px 14px", cursor: "pointer", fontWeight: 800 }}>Easy</button>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
              Think first, then use <strong style={{ color: "var(--text-strong)" }}>Show details</strong> to reveal the answer, why it matters, and the memory clue.
            </div>
          )}
        </div>
      </Card>
      </>
      )}
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

const StoryModeTab = ({ setActive }) => {
  const chapters = useMemo(() => STORY_CHAPTERS, []);
  const [chapterIndex, setChapterIndex] = useState(() => readStore(STORAGE_KEYS.storyChapter, 0));
  const [completedChapters, setCompletedChapters] = useState(() => readStore(STORAGE_KEYS.storyCompleted, {}));
  const current = chapters[chapterIndex];

  useEffect(() => {
    writeStore(STORAGE_KEYS.storyChapter, chapterIndex);
  }, [chapterIndex]);

  if (!current) return null;

  const testedPoints = STORY_TESTED_POINTS[current.id] || current.recap || [];
  const completedCount = Object.values(completedChapters).filter(Boolean).length;
  const isCurrentComplete = Boolean(completedChapters[current.id]);
  const toggleChapterComplete = () => {
    setCompletedChapters((existing) => {
      const next = { ...existing, [current.id]: !existing[current.id] };
      writeStore(STORAGE_KEYS.storyCompleted, next);
      return next;
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="📚" meta="Read the course as short chapters so you can revise the full test more naturally.">Story Mode</SectionTitle>
      <Card style={{ background: "linear-gradient(135deg, var(--surface-soft), color-mix(in srgb, #f97316 10%, var(--card-bg)))", border: "1px solid color-mix(in srgb, #f97316 30%, var(--card-border))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 20 }}>{current.icon} {current.title}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginTop: 6 }}>{current.intro}</div>
          </div>
          <Badge text={`${chapterIndex + 1} / ${chapters.length}`} color={current.color} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge text={`${current.items.length} fact cards`} color="#64748b" />
          <Badge text="Short narrative chapters" color="#22c55e" />
          <Badge text={`${completedCount}/${chapters.length} chapters done`} color="#8b5cf6" />
          {isCurrentComplete && <Badge text="Completed" color="#22c55e" />}
          <button className="focus-ring" onClick={() => setActive(current.tab)} style={{ border: "1px solid var(--card-border)", background: "var(--chip-bg)", color: "var(--text)", borderRadius: 999, padding: "8px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
            Open related section
          </button>
        </div>
      </Card>

      <Card>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>Chapters</div>
        <div className="noscroll" style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {chapters.map((chapter, index) => (
            <TabButton key={chapter.id} active={index === chapterIndex} onClick={() => setChapterIndex(index)}>
              {chapter.icon} {index + 1}{completedChapters[chapter.id] ? " ✓" : ""}
            </TabButton>
          ))}
        </div>
      </Card>

      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 17 }}>Most tested in this chapter</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Use these first if you want the shortest version of the chapter.</div>
          </div>
          <Badge text={`${testedPoints.length} exam anchors`} color={current.color} />
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {testedPoints.map((point) => (
            <div key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>
              <span style={{ color: current.color, fontWeight: 800 }}>•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gap: 12 }}>
        {current.items.map((item, index) => (
          <Card key={`${current.id}-${index}`} style={{ border: `1px solid ${current.color}44`, background: `linear-gradient(135deg, ${current.color}10, var(--card-bg))` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
              <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>{index + 1}. {item.title}</div>
              <Badge text={current.title.replace("Chapter ", "")} color={current.color} />
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ background: "var(--panel-bg)", borderRadius: 14, padding: "12px 13px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>FACT</div>
                <div style={{ color: "var(--text-strong)", fontWeight: 700, fontSize: 16, lineHeight: 1.6 }}>{item.fact}</div>
              </div>
              <div style={{ background: "color-mix(in srgb, var(--accent) 8%, var(--panel-bg))", borderRadius: 14, padding: "11px 12px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>WHY IT MATTERS</div>
                <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.65 }}>{item.context}</div>
              </div>
              <MemoryHook text={item.memory} />
            </div>
          </Card>
        ))}
      </div>

      {Array.isArray(current.recap) && current.recap.length > 0 && (
        <Card style={{ border: `1px solid ${current.color}44`, background: "var(--surface-strong)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 17 }}>Chapter recap</div>
            <Badge text={`${current.recap.length} lock-in points`} color={current.color} />
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {current.recap.map((point) => (
              <div key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>
                <span style={{ color: current.color, fontWeight: 800 }}>•</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="focus-ring"
            onClick={() => setChapterIndex((value) => Math.max(0, value - 1))}
            disabled={chapterIndex === 0}
            style={{ border: "1px solid var(--card-border)", background: "var(--chip-bg)", color: chapterIndex === 0 ? "var(--text-muted)" : "var(--text)", borderRadius: 12, padding: "12px 14px", cursor: chapterIndex === 0 ? "default" : "pointer", fontWeight: 700 }}
          >
            ← Previous chapter
          </button>
          <button className="focus-ring" onClick={toggleChapterComplete} style={{ border: "1px solid var(--card-border)", background: isCurrentComplete ? "color-mix(in srgb, #22c55e 14%, var(--card-bg))" : "var(--panel-bg)", color: isCurrentComplete ? "#15803d" : "var(--text)", borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontWeight: 700 }}>
            {isCurrentComplete ? "Mark as not done" : "Mark chapter done"}
          </button>
          <button className="focus-ring" onClick={() => setActive("quickrev")} style={{ border: "1px solid var(--card-border)", background: "var(--panel-bg)", color: "var(--text)", borderRadius: 12, padding: "12px 14px", cursor: "pointer", fontWeight: 700 }}>
            Mix with Quick Revision
          </button>
          <button
            className="focus-ring"
            onClick={() => setChapterIndex((value) => Math.min(chapters.length - 1, value + 1))}
            disabled={chapterIndex === chapters.length - 1}
            style={{ border: "none", background: chapterIndex === chapters.length - 1 ? "var(--chip-bg)" : "var(--accent)", color: chapterIndex === chapters.length - 1 ? "var(--text-muted)" : "#fff", borderRadius: 12, padding: "12px 14px", cursor: chapterIndex === chapters.length - 1 ? "default" : "pointer", fontWeight: 800 }}
          >
            Next chapter →
          </button>
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
  const [checkpoint, setCheckpoint] = useState(() => readStore(STORAGE_KEYS.timelineCheckpoint, null));
  const [pendingJumpId, setPendingJumpId] = useState(null);
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

  useEffect(() => {
    if (!pendingJumpId) return;
    const element = document.getElementById(pendingJumpId);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setPendingJumpId(null);
  }, [pendingJumpId, era, search]);

  const saveCheckpoint = (ev) => {
    const id = `timeline-${TIMELINE.indexOf(ev)}`;
    const nextCheckpoint = { id, year: ev.year, era: ev.era, event: ev.event };
    setCheckpoint(nextCheckpoint);
    writeStore(STORAGE_KEYS.timelineCheckpoint, nextCheckpoint);
  };

  const jumpToCheckpoint = () => {
    if (!checkpoint) return;
    setSearch("");
    setEra("All");
    setPendingJumpId(checkpoint.id);
  };

  const clearCheckpoint = () => {
    setCheckpoint(null);
    writeStore(STORAGE_KEYS.timelineCheckpoint, null);
  };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="📅" meta="Use short date anchors first, then the memory clue.">British History Timeline</SectionTitle>
      <Card style={{ background: "color-mix(in srgb, #3b82f6 10%, var(--card-bg))", border: "1px solid color-mix(in srgb, #3b82f6 35%, var(--card-border))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Remembered up to here</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
              {checkpoint ? `${checkpoint.year} · ${checkpoint.event}` : "Set a checkpoint on any timeline card so you can come back to the same point later."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={jumpToCheckpoint} disabled={!checkpoint} style={{ background: checkpoint ? "var(--accent)" : "var(--chip-bg)", color: checkpoint ? "#fff" : "var(--text-muted)", border: "none", borderRadius: 12, padding: "10px 14px", cursor: checkpoint ? "pointer" : "default", fontWeight: 800 }}>
              Jump to checkpoint
            </button>
            {checkpoint && (
              <button className="focus-ring" onClick={clearCheckpoint} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>
      <Card style={{ background: "linear-gradient(135deg, var(--surface-soft), var(--surface-strong))", border: "1px solid var(--card-border)" }}>
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
      <CompactVisualStrip
        title="Date spine"
        accent="#3b82f6"
        items={[
          { icon: "🦅", label: "55 BC", text: "Caesar fails" },
          { icon: "🛡️", label: "43 AD", text: "Claudius succeeds" },
          { icon: "🏰", label: "1066", text: "Normans" },
          { icon: "📜", label: "1215", text: "Carta" },
          { icon: "👑", label: "1603", text: "Crowns" },
          { icon: "🏥", label: "1948", text: "NHS" },
        ]}
      />
      <input className="focus-ring" placeholder="Search events, years, or people..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--input-border)", borderRadius: 14, padding: "11px 14px", color: "var(--text-strong)", marginBottom: 12, fontSize: 14 }} />
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {eras.map((value) => <TabButton key={value} active={era === value} onClick={() => setEra(value)}>{value}</TabButton>)}
      </div>
      <Card style={{ background: "color-mix(in srgb, var(--surface-strong) 86%, var(--card-bg))", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 16 }}>
            {era === "All" ? "Cross-era revision points" : `${era} revision points`}
          </div>
          <Badge text={`${revisionByEra[era].length} quick reminders`} color="#22c55e" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
          {revisionByEra[era].map((item) => (
            <div key={item} style={{ borderRadius: 14, padding: 12, background: "var(--surface-strong)", border: "1px solid var(--card-border)", color: "var(--text)", fontSize: 14, lineHeight: 1.5 }}>
              {item}
            </div>
          ))}
        </div>
      </Card>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>{filtered.length} events</div>
      {filtered.map((ev, i) => {
        const timelineId = `timeline-${TIMELINE.indexOf(ev)}`;
        const isCheckpoint = checkpoint?.id === timelineId;
        return (
        <div id={timelineId} key={`${ev.year}-${i}`} className="timeline-item" style={{ display: "grid", gridTemplateColumns: "90px 26px 1fr", gap: 12, marginBottom: 14, alignItems: "flex-start", scrollMarginTop: 90 }}>
          <div className="timeline-year" style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: ev.color }}>{ev.year}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 3 }}>{ev.era}</div>
          </div>
          <div style={{ width: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: ev.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>{ev.icon}</div>
            <div style={{ width: 2, flexGrow: 1, background: "var(--surface-muted)", marginTop: 2, minHeight: 38 }} />
          </div>
          <Card style={{ marginBottom: 0, background: "color-mix(in srgb, var(--surface-soft) 88%, var(--card-bg))", border: `1px solid ${isCheckpoint ? "#3b82f6" : `${ev.color}33`}` }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <Badge text={ev.era} color={ev.color} />
              <Badge text={ev.year} color="#64748b" />
              {isCheckpoint && <Badge text="Your checkpoint" color="#3b82f6" />}
            </div>
            <div style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 14, lineHeight: 1.6 }}>{ev.event}</div>
            <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
              {buildTimelineDetails(ev).map((point) => (
                <div key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 13, lineHeight: 1.55 }}>
                  <span style={{ color: ev.color, fontWeight: 800 }}>•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            <MemoryHook text={ev.memory} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button className="focus-ring" onClick={() => saveCheckpoint(ev)} style={{ background: isCheckpoint ? "#1d4ed8" : "var(--chip-bg)", color: isCheckpoint ? "#fff" : "var(--text)", border: `1px solid ${isCheckpoint ? "#3b82f6" : "var(--card-border)"}`, borderRadius: 12, padding: "9px 12px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
                {isCheckpoint ? "Checkpoint saved" : "Set checkpoint here"}
              </button>
            </div>
          </Card>
        </div>
      )})}
    </div>
  );
};

// ── WARS ─────────────────────────────────────────────────────
const WarsTab = () => {
  const battleCards = BATTLES_AND_WARS.filter((item) => /battle|revolt|armada|dunkirk|blitz|d-day/i.test(item.name));
  const widerWarCards = BATTLES_AND_WARS.filter((item) => !battleCards.includes(item));
  const warComparisons = [
    {
      title: "Trafalgar vs Waterloo",
      left: "Trafalgar = sea battle = Nelson = 1805",
      right: "Waterloo = land battle = Wellington = 1815",
      memory: "Sea = Nelson. Land = Wellington.",
    },
    {
      title: "WWI vs WWII",
      left: "WWI = 1914–1918 = Armistice 11 November 1918",
      right: "WWII = 1939–1945 = Churchill in war, Attlee after war",
      memory: "First war ends 1918. Second war ends 1945.",
    },
    {
      title: "Battle of Britain vs Blitz",
      left: "Battle of Britain = air battle defending Britain",
      right: "Blitz = bombing of British cities",
      memory: "Air battle vs bombing campaign.",
    },
    {
      title: "Dunkirk vs D-Day",
      left: "Dunkirk = 1940 evacuation from France",
      right: "D-Day = 1944 landing in Normandy",
      memory: "Evacuation first, landing later.",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="⚔️" meta="Use war anchors as a separate memory spine: battle name, year, person, and why it mattered.">Wars & Battles</SectionTitle>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>War memory spine</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `1066` = Hastings = William the Conqueror<br />
          • `1588` = Spanish Armada = Elizabeth I / Francis Drake<br />
          • `1805` = Trafalgar = Nelson<br />
          • `1815` = Waterloo = Wellington<br />
          • `1914–18` = WWI = Armistice on 11 November 1918<br />
          • `1939–45` = WWII = Churchill in war, Attlee after war
        </div>
        <MemoryHook text="When a war question appears, first lock the date, then attach the person: Hastings-William, Trafalgar-Nelson, Waterloo-Wellington." />
      </Card>
      <Card style={{ background: "color-mix(in srgb, #ef4444 10%, var(--card-bg))", border: "1px solid color-mix(in srgb, #ef4444 35%, var(--card-border))" }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>WWII quick anchors</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `1939` = war begins after Germany invades Poland<br />
          • `1940` = Dunkirk, Battle of Britain, Blitz<br />
          • `1944` = D-Day in Normandy<br />
          • `1945` = war ends
        </div>
        <MemoryHook text="WWII sequence: 1939 start, 1940 defend and evacuate, 1944 land in Normandy, 1945 end." />
      </Card>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Battle compare tip</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `Trafalgar` = sea battle = Nelson<br />
          • `Waterloo` = land battle = Wellington<br />
          • `Battle of Britain` = air battle = 1940<br />
          • `Dunkirk` = evacuation, not the Normandy landing
        </div>
        <MemoryHook text="Sea = Nelson. Land = Wellington. Air = Battle of Britain. Evacuation = Dunkirk." />
      </Card>
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 18 }}>Battle comparisons</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Use these compare cards for the battle traps that are easiest to mix up.</div>
      </div>
      <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {warComparisons.map((item) => (
          <Card key={item.title} style={{ border: "1px solid var(--card-border)" }}>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 10 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, marginBottom: 8 }}>{item.left}</div>
            <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, marginBottom: 10 }}>{item.right}</div>
            <MemoryHook text={item.memory} />
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 18 }}>Key Battles</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Each battle card gives the date, what happened, why it matters for the test, and a memory tip.</div>
      </div>
      {battleCards.map((item) => (
        <Card key={item.name} style={{ border: `1px solid ${item.color}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</div>
                <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.years}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge text={item.type} color="#64748b" />
              <Badge text={item.years} color={item.color} />
            </div>
          </div>
          <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{item.fact}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{item.context}</div>
          {Array.isArray(item.points) && item.points.length > 0 && (
            <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              {item.points.map((point) => (
                <div key={point} style={{ display: "flex", gap: 8, alignItems: "flex-start", color: "var(--text)", fontSize: 13, lineHeight: 1.55 }}>
                  <span style={{ color: item.color, fontWeight: 800 }}>•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}
          <MemoryHook text={item.memory} />
        </Card>
      ))}

      <div style={{ marginTop: 20, marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 18 }}>Wider Wars & Wartime Anchors</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Use these cards for the bigger conflict picture behind the named battles.</div>
      </div>
      {widerWarCards.map((item) => (
        <Card key={item.name} style={{ border: `1px solid ${item.color}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{item.name}</div>
                <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.years}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Badge text={item.type} color="#64748b" />
              <Badge text={item.years} color={item.color} />
            </div>
          </div>
          <div style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{item.fact}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{item.context}</div>
          <MemoryHook text={item.memory} />
        </Card>
      ))}
    </div>
  );
};

// ── 4 NATIONS ────────────────────────────────────────────────
const NationsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏴" meta="Use comparison blocks to separate nation facts quickly.">The 4 Nations</SectionTitle>
    <Card style={{ background: "linear-gradient(135deg, color-mix(in srgb, #3b82f6 12%, var(--card-bg)), color-mix(in srgb, #ef4444 10%, var(--card-bg)))", border: "1px solid var(--card-border)" }}>
      <div className="compare-grid" style={{ display: "grid", gap: 10 }}>
        <div style={{ background: "color-mix(in srgb, #3b82f6 12%, var(--panel-bg))", borderRadius: 14, padding: 12 }}>
          <div style={{ fontWeight: 800, color: "var(--accent-text)", marginBottom: 6 }}>Great Britain</div>
          <div style={{ color: "var(--text)", fontSize: 14 }}>England + Scotland + Wales = 3 nations</div>
        </div>
        <div style={{ background: "color-mix(in srgb, #ef4444 12%, var(--panel-bg))", borderRadius: 14, padding: 12 }}>
          <div style={{ fontWeight: 800, color: "#fecaca", marginBottom: 6 }}>United Kingdom</div>
          <div style={{ color: "var(--text)", fontSize: 14 }}>Great Britain + Northern Ireland = 4 nations</div>
        </div>
      </div>
      <MemoryHook text="UK = GB + Northern Ireland. One extra nation." />
    </Card>
    <Card style={{ background: "color-mix(in srgb, var(--surface-strong) 88%, var(--card-bg))", border: "1px solid var(--card-border)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <div>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>4 Nations quick compare</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Best for capitals, saints, symbols, parliaments, and cross-nation rule differences.</div>
        </div>
        <Badge text="High-yield nation facts" color="#22c55e" />
      </div>
      <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
        {[
          "LECB = London, Edinburgh, Cardiff, Belfast.",
          "England has no separate parliament. The other 3 nations have devolved bodies.",
          "St George, St Andrew, St David, St Patrick = key nation-day sequence.",
          "Rose, thistle, daffodil, shamrock = nation flowers.",
          "England and Wales share one legal system. Scotland and Northern Ireland have separate systems.",
          "Scotland = Highers. England, Wales and Northern Ireland = A-levels.",
          "Scotland = Church of Scotland. England = Church of England.",
          "Northern Ireland = photo ID at polling station.",
        ].map((item) => (
          <div key={item} style={{ borderRadius: 14, padding: 12, background: "var(--surface-strong)", border: "1px solid var(--card-border)", color: "var(--text)", fontSize: 14, lineHeight: 1.55 }}>
            {item}
          </div>
        ))}
      </div>
    </Card>
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <div>
          <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Cross-nation compare pack</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>These are the nation facts people often mix because the names look similar but the systems differ.</div>
        </div>
        <Badge text="System differences" color="#3b82f6" />
      </div>
      <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
        {[
          {
            title: "Legal systems",
            points: [
              "England and Wales share one legal system.",
              "Scotland has a separate legal system.",
              "Northern Ireland also has a separate legal system.",
            ],
          },
          {
            title: "Courts and justice",
            points: [
              "Scotland = Court of Session for highest civil court.",
              "Scotland = Children's Hearing System instead of Youth Court wording.",
              "England, Wales and Northern Ireland use Crown Court / High Court wording more often in the handbook.",
            ],
          },
          {
            title: "Education",
            points: [
              "Scotland uses Highers.",
              "England, Wales and Northern Ireland use A-levels.",
              "Do not assume one school qualification name fits the whole UK.",
            ],
          },
          {
            title: "Voting and church",
            points: [
              "Northern Ireland requires photo ID at polling stations.",
              "Monarch is head of Church of England.",
              "Monarch is not head of Church of Scotland.",
            ],
          },
        ].map((item) => (
          <div key={item.title} style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)" }}>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, marginBottom: 8 }}>{item.title}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {item.points.map((point) => (
                <div key={point} style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.55 }}>• {point}</div>
              ))}
            </div>
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
        <div style={{ background: "var(--surface-strong)", borderRadius: 12, padding: 10, marginBottom: 8 }}>
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
const ConfuseTab = () => {
  const grouped = CONFUSABLE_GROUP_ORDER.map((group) => ({
    group,
    items: CONFUSABLES.filter((item) => getConfusableGroup(item.title) === group),
  })).filter((entry) => entry.items.length > 0);

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="⚠️" meta="These side-by-side cards are the fastest way to stop mixing common exam traps.">Don't Confuse These</SectionTitle>
      <Card style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(15,23,42,0.9))", border: "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          <div>
            <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>Comparison revision pack</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Grouped by the areas people actually mix up in the test, with the highest-risk traps first.</div>
          </div>
          <Badge text={`${CONFUSABLES.length} comparison cards`} color="#f97316" />
        </div>
        <div className="fact-grid-two" style={{ display: "grid", gap: 10, marginBottom: 10 }}>
          {[
            "Top Exam Traps = start here if you only have a few minutes.",
            "Nations and Identity = UK/GB, saints, parliaments, systems, and symbols.",
            "Government, Law and Voting = public roles, courts, law, tax, and election traps.",
            "History, Dates and Places = dates, reforms, battles, and place-based mixes.",
          ].map((item) => (
            <div key={item} style={{ borderRadius: 14, padding: 12, background: "var(--surface-strong)", border: "1px solid var(--card-border)", color: "var(--text)", fontSize: 14, lineHeight: 1.55 }}>
              {item}
            </div>
          ))}
        </div>
        <MemoryHook text="Use these in pairs: read the left side, cover the right side, then say the difference out loud before checking." />
      </Card>
      {grouped.map(({ group, items }) => (
        <div key={group} style={{ display: "grid", gap: 12 }}>
          <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "var(--text-strong)", fontWeight: 800, fontSize: 18 }}>{group}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
                  {group === "Top Exam Traps"
                    ? "Start here first. These are the comparisons most likely to cost easy marks."
                    : group === "Nations and Identity"
                      ? "Nation names, systems, parliaments, symbols, and location-based confusion points."
                      : group === "Government, Law and Voting"
                        ? "Public roles, courts, elections, duties, and everyday public-system differences."
                        : "Dates, reforms, battles, and places that are easy to swap under pressure."}
                </div>
              </div>
              <Badge text={`${items.length} cards`} color={group === "Top Exam Traps" ? "#ef4444" : "#3b82f6"} />
            </div>
          </Card>
          {items.map((c, i) => {
            const level = getConfusableLevel(c.title);
            return (
              <Card key={`${group}-${i}`} style={{ border: "1px solid #374151" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>{c.icon} {c.title}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge text={group} color="#64748b" />
                    <Badge text={level.text} color={level.color} />
                  </div>
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
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── INVENTORS ────────────────────────────────────────────────
const InventorsTab = () => {
  const cats = ["All", "Medicine", "Computing", "Engineering", "Electronics", "Physics", "Biology"];
  const [cat, setCat] = useState("All");
  const filtered = INVENTORS
    .filter((i) => cat === "All" || i.link === cat)
    .sort((a, b) => Number(CORE_INVENTORS.has(b.who)) - Number(CORE_INVENTORS.has(a.who)));
  const coreVisible = filtered.filter((item) => CORE_INVENTORS.has(item.who));
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="💡" meta="Inventors are easier to remember by category and visual icon.">British Inventors & Scientists</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {cats.map((c) => <TabButton key={c} active={cat === c} onClick={() => setCat(c)}>{c}</TabButton>)}
      </div>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Must know inventors first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>These are the names most worth locking in before the longer science list.</div>
          </div>
          <Badge text={cat === "All" ? "Core inventors" : `${cat} core`} color="#ef4444" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {coreVisible.map((item) => <Badge key={item.who} text={item.who} color="#ef4444" />)}
        </div>
      </Card>
      {filtered.map((inv, i) => (
        <Card key={i}>
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
    </div>
  );
};

// ── SPORTS ───────────────────────────────────────────────────
const SportsTab = () => (
  <div style={{ padding: 20 }}>
    <SectionTitle icon="🏅" meta="Use event anchors first, then attach the star names and dates to them.">British Sport & Sports Stars</SectionTitle>
    <Card style={{ background: "#0f1f0f", border: "1px solid #166534", marginBottom: 16 }}>
      <div style={{ fontWeight: 800, color: "#4ade80", marginBottom: 8 }}>🏟️ Olympics Key Facts</div>
      <div style={{ color: "#d1fae5", fontSize: 14, lineHeight: 1.8 }}>
        • UK hosted Olympics 3 times: 1908, 1948, 2012<br />
        • 2012: UK finished 3rd in the medal table<br />
        • Scotland has 5 ski resorts
      </div>
      <MemoryHook text="Three times: 1908, 1948, 2012." />
    </Card>
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)", marginBottom: 16 }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Classic sports event anchors</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • `Wimbledon` = oldest tennis tournament in the world<br />
        • `FA Cup` = oldest football competition in the world<br />
        • `Grand National` = horse race at Aintree<br />
        • `Boat Race` = Oxford vs Cambridge on the Thames<br />
        • `London Marathon` = major charity and mass-participation race
      </div>
      <MemoryHook text="If the question is about British sport rather than a person, think event first: Wimbledon, FA Cup, Grand National, Boat Race." />
    </Card>
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)", marginBottom: 16 }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Quick sports recall</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • `Mo Farah` = double long-distance Olympic gold in 2012<br />
        • `Jessica Ennis-Hill` = heptathlon gold in London 2012<br />
        • `Andy Murray` = first British men's Wimbledon winner in 77 years (2013)<br />
        • `Bradley Wiggins` = first British Tour de France winner (2012)
      </div>
      <MemoryHook text="2012 Olympics is the easiest sports memory spine: Farah, Ennis-Hill, Wiggins, then Murray in 2013." />
    </Card>
    {SPORTS_FACTS.map((item) => (
      <Card key={item.name}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15, marginBottom: 4 }}>{item.name}</div>
            <div style={{ color: "var(--text)", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>{item.fact}</div>
            <MemoryHook text={item.memory} />
          </div>
        </div>
      </Card>
    ))}
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
    .sort((a, b) => {
      const coreDiff = Number(CORE_FIGURES.has(b.name)) - Number(CORE_FIGURES.has(a.name));
      if (coreDiff) return coreDiff;
      return (orderMap[a.name] ?? 999) - (orderMap[b.name] ?? 999);
    });
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
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Most tested figures first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Learn the high-frequency names first, then use the rest as supporting context.</div>
          </div>
          <Badge text="Exam core" color="#ef4444" />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {figures.filter((item) => CORE_FIGURES.has(item.name)).map((item) => <Badge key={item.name} text={item.name} color="#ef4444" />)}
        </div>
      </Card>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Figure date anchors</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `1066` William the Conqueror<br />
          • `1215` King John and Magna Carta<br />
          • `1534` Henry VIII and Church of England<br />
          • `1918 / 1928` Emmeline Pankhurst and votes for women<br />
          • `1942 / 1948` Beveridge and Bevan
        </div>
        <MemoryHook text="Link people to dates, not just names. Date-linked people are much easier to recall in mocks." />
      </Card>
      {figures.map((f) => (
        <Card key={f.name} style={{ border: `1px solid ${f.color}33` }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</div>
                <Badge text={CORE_FIGURES.has(f.name) ? "Exam core" : "More detail"} color={CORE_FIGURES.has(f.name) ? "#ef4444" : "#64748b"} />
              </div>
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
    <SectionTitle icon="⛪" meta="This section is mostly short factual recall: census proportions, major Christian dates, and key non-Christian festivals.">Religion & Festivals</SectionTitle>
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
      <div style={{ fontWeight: 800, color: "#60a5fa", marginBottom: 12 }}>📊 2011 Census — Religious Identity</div>
      {RELIGIONS.map((r) => (
        <div key={r.faith} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15 }}>{r.icon} <span style={{ color: "var(--text-strong)", fontWeight: 700 }}>{r.faith}</span></span>
            <Badge text={r.pct} color={r.color} />
          </div>
          <div style={{ background: "var(--surface-muted)", borderRadius: 999, height: 10, overflow: "hidden" }}>
            <div className="bar-fill" style={{ height: "100%", borderRadius: 999, background: r.color, width: `${Math.min(r.bar, 100)}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{r.note}</div>
        </div>
      ))}
    </Card>
    <Card style={{ background: "color-mix(in srgb, #f59e0b 10%, var(--card-bg))", border: "1px solid color-mix(in srgb, #f59e0b 35%, var(--card-border))" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Festival memory clues</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • `Christmas` and `Easter` are the main Christian festivals<br />
        • `Boxing Day` = 26 December public holiday after Christmas<br />
        • `Diwali` = festival of lights<br />
        • `Vaisakhi` = Sikh New Year / Khalsa<br />
        • `Hanukkah` = Jewish festival of lights<br />
        • `Eid al-Fitr` ends Ramadan
      </div>
      <MemoryHook text="If a festival name appears in a question, first identify the faith, then the key clue or season." />
    </Card>
    {FESTIVALS.map((f, i) => (
      <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{f.name}</span>
          <Badge text={f.date} color="#d97706" />
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>{f.faith}</div>
        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{f.detail}</div>
      </Card>
    ))}
  </div>
);

// ── LANDMARKS ────────────────────────────────────────────────
const LandmarksTab = () => (
  <div style={{ padding: 20 }}>
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
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Landmark anchor clues</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • `Big Ben` = bell, not tower<br />
        • `Buckingham Palace` = monarch's London home<br />
        • `Windsor Castle` = outside London, weekends and ceremonies<br />
        • `Severn` = longest in UK, `Thames` = longest in England<br />
        • `Hadrian's Wall` = Roman, not Norman or Tudor
      </div>
      <MemoryHook text="For landmarks, pair each place with one test clue: location, superlative, or why it is famous." />
    </Card>
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Must know landmarks first</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>These are the places most worth locking in before the longer list.</div>
        </div>
        <Badge text="Exam favourites first" color="#ef4444" />
      </div>
      <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
        {LANDMARKS.filter((item) => CORE_LANDMARK_NAMES.has(item.name)).map((item) => (
          <div key={item.name} style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.name}</div>
              <Badge text="Exam favourite" color="#ef4444" />
            </div>
            <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{item.trap}</div>
          </div>
        ))}
      </div>
    </Card>
    {LANDMARKS.sort((a, b) => Number(CORE_LANDMARK_NAMES.has(b.name)) - Number(CORE_LANDMARK_NAMES.has(a.name))).map((l, i) => (
      <Card key={i}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 15 }}>{l.name}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Badge text={l.where} color="#64748b" />
            <Badge text={CORE_LANDMARK_NAMES.has(l.name) ? "Exam favourite" : "More places"} color={CORE_LANDMARK_NAMES.has(l.name) ? "#ef4444" : "#64748b"} />
          </div>
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
    <SectionTitle icon="🌍" meta="Most questions here are compare traps: voluntary group, military alliance, human-rights body, or UN role.">International Organisations</SectionTitle>
    <TrapAlert text="Council of Europe ≠ EU. Council has 47 members and cannot make laws. EU has 27 and can." />
    <CompactVisualStrip
      title="Organisation map"
      accent="#10b981"
      items={[
        { icon: "🕊️", label: "UN", text: "peace" },
        { icon: "🛡️", label: "NATO", text: "defence" },
        { icon: "🌐", label: "Commonwealth", text: "voluntary" },
        { icon: "⚖️", label: "Council", text: "rights only" },
      ]}
    />
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Must know first</div>
      <div className="fact-grid-two" style={{ display: "grid", gap: 10 }}>
        {INT_ORGS.filter((item) => CORE_INT_ORGS.has(item.name)).map((item) => (
          <div key={item.name} style={{ borderRadius: 14, padding: 12, background: "var(--panel-bg)", border: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.name}</div>
              <Badge text="Exam favourite" color="#ef4444" />
            </div>
            <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6 }}>{item.memory}</div>
          </div>
        ))}
      </div>
      <MemoryHook text="Ask one question first: military alliance, voluntary association, global peace body, or human-rights organisation?" />
    </Card>
    <div style={{ marginTop: 16 }}>
      {INT_ORGS.sort((a, b) => Number(CORE_INT_ORGS.has(b.name)) - Number(CORE_INT_ORGS.has(a.name))).map((o, i) => (
        <Card key={i}>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 16, marginBottom: 6 }}>{o.name}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <Badge text={o.members} color="#3b82f6" />
            <Badge text={o.power} color={o.power.includes("CANNOT") ? "#ef4444" : "#10b981"} />
            <Badge text={CORE_INT_ORGS.has(o.name) ? "Exam favourite" : "More detail"} color={CORE_INT_ORGS.has(o.name) ? "#ef4444" : "#64748b"} />
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4, lineHeight: 1.6 }}><strong style={{ color: "var(--text-muted)" }}>Purpose:</strong> {o.purpose}</div>
          <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 8, lineHeight: 1.6 }}><strong style={{ color: "var(--text-muted)" }}>UK's role:</strong> {o.ukRole}</div>
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
  const activeCore = ARTS_CORE_BY_SECTION[active] || new Set();
  const orderedItems = [...(ARTS[active] || [])].sort((a, b) => Number(activeCore.has(b.who)) - Number(activeCore.has(a.who)));
  return (
    <div style={{ padding: 20 }}>
      <SectionTitle icon="🎭" meta="This section works best through anchor names: one writer, one composer, one artist, one architect, one fashion name, one film clue.">Arts & Culture</SectionTitle>
      <div className="noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16 }}>
        {sections.map((s) => <TabButton key={s.key} active={active === s.key} onClick={() => setActive(s.key)}>{s.label}</TabButton>)}
      </div>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Arts memory anchors</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `Shakespeare` = plays and Stratford-upon-Avon<br />
          • `Dickens` = Victorian poverty<br />
          • `Burns` = Scotland and Burns Night<br />
          • `Beatles` = Liverpool<br />
          • `BAFTA` = British film and television awards
        </div>
        <MemoryHook text="If you forget an arts fact, first place it under literature, music, art, architecture, fashion, or film." />
      </Card>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Arts places and event anchors</div>
        <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
          • `Stratford-upon-Avon` = Shakespeare<br />
          • `Royal Albert Hall` = BBC Proms<br />
          • `Edinburgh` = Fringe, largest arts festival in the world<br />
          • `West End` = The Mousetrap since 1952<br />
          • `Liverpool` = Beatles
        </div>
        <MemoryHook text="A lot of arts questions become easy if you remember the place or event attached to the person." />
      </Card>
      <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", fontSize: 17 }}>Most important names first</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>Start with the big recognition names in this category, then use the rest as extra support.</div>
          </div>
          <Badge text={sec ? sec.label : "Arts"} color={sec ? sec.color : "#64748b"} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[...(ARTS[active] || []).filter((item) => activeCore.has(item.who)).map((item) => (
            <Badge key={item.who} text={item.who} color="#ef4444" />
          ))]}
        </div>
      </Card>
      {orderedItems.map((item, i) => (
        <Card key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <div style={{ fontWeight: 800, color: sec ? sec.color : "#f9fafb", fontSize: 14 }}>{item.who}</div>
            <Badge text={activeCore.has(item.who) ? "Exam core" : "More detail"} color={activeCore.has(item.who) ? "#ef4444" : "#64748b"} />
          </div>
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
    <SectionTitle icon="🎵" meta="Keep this section very compressed: anthem, monarch wording, Union Jack crosses, and why Wales is not shown.">National Anthem & Symbols</SectionTitle>
    <CompactVisualStrip
      title="Symbol memory"
      accent="#3b82f6"
      items={[
        { icon: "🎵", label: "Anthem", text: "King / Queen" },
        { icon: "🇬🇧", label: "Union Jack", text: "3 crosses" },
        { icon: "🏴", label: "Wales", text: "not shown" },
      ]}
    />
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
      <div style={{ fontWeight: 800, color: "#60a5fa", marginBottom: 4 }}>{ANTHEM.title}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>{ANTHEM.note}</div>
      <div style={{ background: "var(--surface-soft)", borderRadius: 14, padding: 16, borderLeft: "4px solid var(--accent)" }}>
        {ANTHEM.words.map((line, i) => (
          <div key={i} style={{ color: "var(--text)", fontSize: 15, lineHeight: 2, fontStyle: "italic" }}>{line}</div>
        ))}
      </div>
      <MemoryHook text={ANTHEM.memory} />
    </Card>
    <Card style={{ background: "var(--surface-strong)", border: "1px solid var(--card-border)" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Symbols quick recall</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • `God Save the King` changes to `Queen` depending on the monarch<br />
        • Union Jack = St George + St Andrew + St Patrick<br />
        • Wales is not separately shown because it was already united with England
      </div>
      <MemoryHook text="Song = monarch's gender. Flag = three crosses. Wales = already joined to England." />
    </Card>
    <Card style={{ background: "color-mix(in srgb, #ef4444 8%, var(--card-bg))", border: "1px solid color-mix(in srgb, #ef4444 35%, var(--card-border))" }}>
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
    <SectionTitle icon="⚡" meta="These are the fast marks: government jobs, law basics, voting, school, driving, taxes, and daily-life rules.">Quick Facts</SectionTitle>
    <Card style={{ background: "color-mix(in srgb, #22c55e 10%, var(--card-bg))", border: "1px solid color-mix(in srgb, #22c55e 35%, var(--card-border))" }}>
      <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 8 }}>Fast civic recall</div>
      <div style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.8 }}>
        • `Hansard` = official written record of Parliament<br />
        • `PMQs` = Wednesday when Parliament is sitting<br />
        • `National Insurance` = NHS, state pension, benefits<br />
        • `Council tax` = local services<br />
        • `999 / 112` = emergency, `101` = non-emergency police
      </div>
      <MemoryHook text="Use one keyword per fact: Hansard-record, PMQs-Wednesday, NI-benefits, council tax-local, 999-emergency." />
    </Card>
    {[...QUICK_FACTS]
      .sort((a, b) => (QUICK_FACT_CATEGORY_PRIORITY[a.cat]?.order ?? 99) - (QUICK_FACT_CATEGORY_PRIORITY[b.cat]?.order ?? 99))
      .map((section, si) => (
      <Card key={si} style={{ border: `1px solid ${section.color}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ fontWeight: 800, color: section.color, fontSize: 15 }}>{section.icon} {section.cat}</div>
          <Badge text={QUICK_FACT_CATEGORY_PRIORITY[section.cat]?.label || "Reference"} color={QUICK_FACT_CATEGORY_PRIORITY[section.cat]?.color || "#64748b"} />
        </div>
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
    setQuestions(
      pickRandomNoRepeat(pool, n, STORAGE_KEYS.recentQuiz, 120)
        .map((question, index) => prepareQuestionVariant(question, 16000 + index)),
    );
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
      <div style={{ background: "var(--surface-muted)", borderRadius: 999, height: 8, marginBottom: 16 }}>
        <div style={{ background: "#3b82f6", height: "100%", borderRadius: 999, width: `${((current + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
      </div>
      <QuestionCard question={q} selected={selected} confirmed={confirmed} onSelect={handleSelect} />
      {confirmed && answerMode === "instant" && (
        <>
          {showContext && <MemoryHook text={q.tip} />}
          <button className="focus-ring" onClick={skipToNext}
            style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 14, background: "color-mix(in srgb, #22c55e 12%, var(--card-bg))", color: "#16a34a", border: "1px solid color-mix(in srgb, #22c55e 35%, var(--card-border))", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
            {current + 1 < questions.length ? "Next" : "See Results"}
          </button>
        </>
      )}
      {answerMode === "deferred" && (
        <button className="focus-ring" onClick={skipToNext}
          style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent)", fontSize: 14, cursor: "pointer", fontWeight: 700 }}>
          {current + 1 < questions.length ? "Lock answer and continue" : "Finish and review"}
        </button>
      )}
    </div>
  );
};

// ── MOCK EXAM ────────────────────────────────────────────────
const MockExamTab = () => {
  const [selectedPaperId, setSelectedPaperId] = useState(1);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState(MOCK_LIMIT_SECONDS);
  const [answerMode, setAnswerMode] = useState("instant");
  const [showContext, setShowContext] = useState(true);
  const [timerMode, setTimerMode] = useState("strict");
  const [reviewFilter, setReviewFilter] = useState("wrong");
  const [finishConfirm, setFinishConfirm] = useState(false);
  const [mockHistory, setMockHistory] = useState(() => loadMockHistory());
  const [mockProgress, setMockProgress] = useState(() => loadMockProgress());
  const timerRef = useRef(null);

  const selectedPaper = MOCK_PAPERS.find((paper) => paper.id === selectedPaperId) || MOCK_PAPERS[0];
  const currentQuestion = questions[current];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const score = questions.reduce((sum, question, index) => sum + (answers[index] === question.a ? 1 : 0), 0);
  const breakdown = buildMockCategoryBreakdown(questions, answers);
  const reviewItems = questions
    .map((question, index) => ({ ...question, chosen: answers[index], index }))
    .filter((item) => {
      if (reviewFilter === "all") return true;
      if (reviewFilter === "flagged") return flagged[item.index];
      return item.chosen !== item.a;
    });

  const startPaper = (paperId = selectedPaperId) => {
    const paper = MOCK_PAPERS.find((entry) => entry.id === paperId) || MOCK_PAPERS[0];
    setSelectedPaperId(paper.id);
    setQuestions(paper.questions);
    setAnswers({});
    setFlagged({});
    setCurrent(0);
    setTimeLeft(MOCK_LIMIT_SECONDS);
    setReviewFilter("wrong");
    setFinishConfirm(false);
    setStarted(true);
    setFinished(false);
  };

  useEffect(() => {
    if (!started || finished || timerMode !== "strict") return undefined;
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
  }, [started, finished, timerMode]);

  useEffect(() => {
    if (started && !finished && timerMode === "strict" && timeLeft === 0) setFinished(true);
  }, [started, finished, timerMode, timeLeft]);

  useEffect(() => {
    if (!finished || !questions.length) return;
    const wrong = questions
      .map((question, index) => ({ ...question, chosen: answers[index] }))
      .filter((question, index) => answers[index] !== question.a);
    saveWrongQuestions(wrong);
    saveMockResult({
      date: new Date().toISOString(),
      paperId: selectedPaper.id,
      paperTitle: selectedPaper.title,
      score,
      percent: Math.round((score / MOCK_TOTAL) * 100),
      passed: score >= 18,
      wrong: wrong.length,
      flagged: flaggedCount,
      answerMode,
    });
    setMockHistory(loadMockHistory());
    setMockProgress(loadMockProgress());
  }, [finished, questions, answers, score, selectedPaper, flaggedCount, answerMode]);

  if (!started) {
    const latestMock = mockHistory[0];
    const completedPapers = Object.keys(mockProgress).length;
    const nextPaper = getMockNextPaper(mockProgress);
    const passedPapers = Object.values(mockProgress).filter((item) => item.passed).length;
    const strongestPaper = completedPapers ? Math.max(...Object.values(mockProgress).map((item) => item.bestPercent)) : 0;
    const groupedPapers = Array.from({ length: Math.ceil(MOCK_PAPERS.length / 5) }, (_, index) => {
      const start = index * 5;
      const end = start + 5;
      return { title: `Papers ${start + 1}-${Math.min(end, MOCK_PAPERS.length)}`, items: MOCK_PAPERS.slice(start, end) };
    });

    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="📝" meta="40 fixed mock papers, each with 24 questions and a more exam-like spread across history, government, nations, culture, and a smaller number of compare traps.">Mock Test</SectionTitle>
        <Card style={{ background: "linear-gradient(135deg, color-mix(in srgb, #f97316 12%, var(--card-bg)), color-mix(in srgb, #0f172a 14%, var(--surface-soft)))", border: "1px solid color-mix(in srgb, #f97316 35%, var(--card-border))" }}>
          <div className="study-mode-grid" style={{ display: "grid", gap: 14, alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--text-strong)", fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Balanced fixed mock papers</div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
                Use these like proper papers. Each set stays fixed, covers the core handbook areas, and gives detailed review with memory tips after you finish.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <Badge text="40 fixed papers" color="#f97316" />
                <Badge text="24 questions each" color="#3b82f6" />
                <Badge text="45:00 official timer" color="#ef4444" />
                <Badge text="18 needed to pass" color="#22c55e" />
              </div>
              <div className="study-mode-grid" style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
                <StatTile label="Attempts saved" value={mockHistory.length} color="#3b82f6" />
                <StatTile label="Papers completed" value={completedPapers} color="#8b5cf6" />
                <StatTile label="Last result" value={latestMock ? `${latestMock.score}/24` : "0/24"} color="#22c55e" />
                <StatTile label="Best paper" value={strongestPaper ? `${strongestPaper}%` : "0%"} color="#f59e0b" />
              </div>
            </div>
            <HeroIllustration variant="mock" />
          </div>
        </Card>
        <Card style={{ border: "1px solid color-mix(in srgb, #8b5cf6 30%, var(--card-border))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 800, color: "var(--text-strong)" }}>Saved mock paper tracker</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>
                Each paper keeps its attempts, best score, last score, and last attempt date on this device. Updates to the app keep this progress.
              </div>
            </div>
            <Badge text={`${passedPapers} papers at pass standard`} color="#22c55e" />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge text={`Next suggested paper: #${nextPaper.id}`} color={nextPaper.accent} />
            <Badge text={latestMock ? `Last attempt ${formatAttemptDate(latestMock.date)}` : "No attempts yet"} color="#64748b" />
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 10 }}>Mock settings</div>
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
            label="Show context and memory tips?"
            value={showContext ? "yes" : "no"}
            onChange={(value) => setShowContext(value === "yes")}
            options={[
              { value: "yes", label: "With context" },
              { value: "no", label: "Answers only" },
            ]}
          />
          <SettingGroup
            label="Timer mode"
            value={timerMode}
            onChange={setTimerMode}
            options={[
              { value: "strict", label: "45 min timer" },
              { value: "practice", label: "Practice mode" },
            ]}
          />
        </Card>
        {Object.entries(MOCK_CATEGORY_META).length > 0 && (
          <Card>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>Balanced paper structure</div>
            <div className="study-mode-grid" style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              {MOCK_DISTRIBUTION.map(({ id, count }) => {
                const meta = MOCK_CATEGORY_META[id];
                return (
                  <div key={id} style={{ borderRadius: 16, border: `1px solid ${meta.color}33`, background: `${meta.color}10`, padding: 14 }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{meta.icon}</div>
                    <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 4 }}>{meta.label}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{meta.hint}</div>
                    <Badge text={`${count} questions`} color={meta.color} />
                  </div>
                );
              })}
            </div>
          </Card>
        )}
        {groupedPapers.map((group) => (
          <Card key={group.title}>
            <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>{group.title}</div>
            <div className="study-mode-grid" style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
              {group.items.map((paper) => {
                const paperProgress = mockProgress[paper.id];
                return (
                <button
                  key={paper.id}
                  className="focus-ring"
                  onClick={() => startPaper(paper.id)}
                  style={{ textAlign: "left", border: selectedPaperId === paper.id ? `1px solid ${paper.accent}` : "1px solid var(--card-border)", background: selectedPaperId === paper.id ? `${paper.accent}14` : "var(--panel-bg)", borderRadius: 18, padding: 14, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{paper.title}</div>
                    <Badge text="24" color={paper.accent} />
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{paper.note}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Badge text="Balanced" color="#22c55e" />
                    <Badge text="Fixed paper" color="#64748b" />
                    {paperProgress ? <Badge text={`${paperProgress.bestScore}/24 best`} color={paperProgress.passed ? "#22c55e" : paper.accent} /> : <Badge text="New paper" color={paper.accent} />}
                    {paperProgress?.attempts ? <Badge text={`${paperProgress.attempts} tries`} color="#8b5cf6" /> : null}
                  </div>
                  {paperProgress && (
                    <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>
                      Last: {paperProgress.lastScore}/24 on {formatAttemptDate(paperProgress.lastDate)}
                    </div>
                  )}
                </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / MOCK_TOTAL) * 100);
    const passed = score >= 18;

    return (
      <div style={{ padding: 20 }}>
        <SectionTitle icon="📝" meta="Review your answers, check weak areas, and use the memory clues to lock in corrections.">Mock Results</SectionTitle>
        <Card style={{ textAlign: "center", border: `2px solid ${passed ? "#22c55e" : "#ef4444"}` }}>
          <div style={{ fontSize: 54, marginBottom: 8 }}>{passed ? "✅" : "📘"}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 4 }}>{selectedPaper.title}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: passed ? "#22c55e" : "#ef4444" }}>{passed ? "Pass standard reached" : "Below pass mark"}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "var(--text-strong)", marginTop: 8 }}>{score}/24</div>
          <div style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 10 }}>{percent}%</div>
          <div style={{ color: passed ? "#16a34a" : "#dc2626", fontSize: 14, marginBottom: 16 }}>
            {passed ? "You cleared the real test threshold of 18 correct answers." : `You need ${18 - score} more correct answers to reach the pass mark.`}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={() => startPaper(selectedPaper.id)} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 800, cursor: "pointer" }}>Retake same paper</button>
            <button className="focus-ring" onClick={() => { setStarted(false); setFinished(false); }} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 20px", cursor: "pointer" }}>Back to paper list</button>
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>Topic breakdown</div>
          <div className="study-mode-grid" style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            {breakdown.map((item) => (
              <div key={item.label} style={{ borderRadius: 16, border: `1px solid ${item.color}33`, background: `${item.color}10`, padding: 14 }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ color: "var(--text-strong)", fontWeight: 800 }}>{item.label}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 12, margin: "6px 0 8px" }}>{item.correct}/{item.total} correct</div>
                <div style={{ background: "var(--surface-muted)", borderRadius: 999, height: 8 }}>
                  <div style={{ background: item.color, height: "100%", borderRadius: 999, width: `${(item.correct / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 800, color: "var(--text-strong)" }}>Review this paper</div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Use the detailed review to turn wrong answers into memory anchors.</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <TabButton active={reviewFilter === "wrong"} onClick={() => setReviewFilter("wrong")}>Wrong only</TabButton>
              <TabButton active={reviewFilter === "flagged"} onClick={() => setReviewFilter("flagged")}>Flagged</TabButton>
              <TabButton active={reviewFilter === "all"} onClick={() => setReviewFilter("all")}>All 24</TabButton>
            </div>
          </div>
          {!reviewItems.length && <div style={{ color: "var(--text-muted)", fontSize: 14 }}>No questions match this review filter.</div>}
          {reviewItems.map((item) => {
            const category = MOCK_CATEGORY_META[classifyMockCategory(item)];
            const correct = item.chosen === item.a;
            return (
              <div key={`${item.q}-${item.index}`} style={{ padding: "12px 0", borderBottom: item.index < reviewItems.length - 1 ? "1px solid var(--card-border)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ color: "var(--text-strong)", fontWeight: 700, fontSize: 14 }}>{item.q}</div>
                  <Badge text={`${category.icon} ${category.label}`} color={category.color} />
                </div>
                <div style={{ color: correct ? "#16a34a" : "#dc2626", fontSize: 13, marginBottom: 4 }}>
                  {correct ? `Correct: ${item.opts[item.a]}` : `Your answer: ${item.chosen === undefined ? "No answer" : item.opts[item.chosen]}`}
                </div>
                {!correct && <div style={{ color: "#16a34a", fontSize: 13, marginBottom: 8 }}>Correct answer: {item.opts[item.a]}</div>}
                {showContext && (
                  <div style={{ borderRadius: 14, border: `1px solid ${category.color}33`, background: `${category.color}10`, padding: 12 }}>
                    <div style={{ color: "var(--text-strong)", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Why this matters</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>{buildMockAnswerContext(item)}</div>
                    <MemoryHook text={item.tip} />
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge text={selectedPaper.title} color={selectedPaper.accent} />
          <Badge text={`Question ${current + 1} of ${MOCK_TOTAL}`} color="#64748b" />
          <Badge text={`${answeredCount} answered`} color="#22c55e" />
          {flaggedCount > 0 && <Badge text={`${flaggedCount} flagged`} color="#f59e0b" />}
        </div>
        <Badge text={timerMode === "strict" ? formatCountdown(timeLeft) : "Practice mode"} color={timerMode === "strict" ? (timeLeft > 600 ? "#22c55e" : timeLeft > 300 ? "#f59e0b" : "#ef4444") : "#3b82f6"} />
      </div>
      <div style={{ background: "var(--surface-muted)", borderRadius: 999, height: 8, marginBottom: 14 }}>
        <div style={{ background: selectedPaper.accent, height: "100%", borderRadius: 999, width: `${(answeredCount / MOCK_TOTAL) * 100}%`, transition: "width 0.2s" }} />
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <button className="focus-ring" onClick={() => { setStarted(false); setFinished(false); }} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}>← Back to papers</button>
        <button className="focus-ring" onClick={() => setFlagged((prev) => ({ ...prev, [current]: !prev[current] }))} style={{ background: flagged[current] ? "color-mix(in srgb, #f59e0b 16%, var(--card-bg))" : "var(--chip-bg)", color: flagged[current] ? "#d97706" : "var(--text)", border: `1px solid ${flagged[current] ? "#f59e0b" : "var(--card-border)"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer" }}>
          {flagged[current] ? "★ Flagged" : "☆ Flag for review"}
        </button>
      </div>
      <div className="study-mode-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", alignItems: "start" }}>
        <div>
          <QuestionCard
            question={currentQuestion}
            selected={answers[current]}
            confirmed={answerMode === "instant" && answers[current] !== undefined}
            onSelect={(choice) => {
              if (answerMode === "instant" && answers[current] !== undefined) return;
              setAnswers((prev) => ({ ...prev, [current]: choice }));
            }}
          />
          {answerMode === "instant" && answers[current] !== undefined && (
            <Card style={{ marginTop: 12, border: `1px solid ${MOCK_CATEGORY_META[classifyMockCategory(currentQuestion)].color}33`, background: `${MOCK_CATEGORY_META[classifyMockCategory(currentQuestion)].color}12` }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
                <div style={{ color: answers[current] === currentQuestion.a ? "#16a34a" : "#dc2626", fontWeight: 800 }}>
                  {answers[current] === currentQuestion.a ? "Correct" : `Correct answer: ${currentQuestion.opts[currentQuestion.a]}`}
                </div>
                <Badge text={`${MOCK_CATEGORY_META[classifyMockCategory(currentQuestion)].icon} ${MOCK_CATEGORY_META[classifyMockCategory(currentQuestion)].label}`} color={MOCK_CATEGORY_META[classifyMockCategory(currentQuestion)].color} />
              </div>
              {showContext && (
                <>
                  <div style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>{buildMockAnswerContext(currentQuestion)}</div>
                  <MemoryHook text={currentQuestion.tip} />
                </>
              )}
            </Card>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button className="focus-ring" onClick={() => setCurrent((value) => Math.max(0, value - 1))} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 16px", cursor: "pointer" }}>Previous</button>
            <button
              className="focus-ring"
              onClick={() => {
                if (current + 1 >= MOCK_TOTAL) {
                  setFinished(true);
                  return;
                }
                setCurrent((value) => Math.min(MOCK_TOTAL - 1, value + 1));
              }}
              style={{ background: "var(--accent-soft)", color: "var(--accent-text)", border: "1px solid var(--accent)", borderRadius: 12, padding: "10px 16px", cursor: "pointer", fontWeight: 800 }}
            >
              {current + 1 >= MOCK_TOTAL ? "Finish paper" : "Next"}
            </button>
          </div>
          <Card style={{ marginTop: 12, border: `1px solid ${finishConfirm ? "#ef4444" : "var(--card-border)"}`, background: finishConfirm ? "color-mix(in srgb, #ef4444 10%, var(--card-bg))" : "var(--panel-bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={{ color: "var(--text-strong)", fontWeight: 800, marginBottom: 4 }}>Finish this paper</div>
                <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>
                  {finishConfirm ? "Tap confirm only if you are ready to end the paper and see results." : "End the paper whenever you are ready to see results."}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {finishConfirm && (
                  <button className="focus-ring" onClick={() => setFinishConfirm(false)} style={{ background: "var(--chip-bg)", color: "var(--text)", border: "1px solid var(--card-border)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700 }}>
                    Keep going
                  </button>
                )}
                <button
                  className="focus-ring"
                  onClick={() => {
                    if (!finishConfirm) {
                      setFinishConfirm(true);
                      return;
                    }
                    setFinished(true);
                  }}
                  style={{ background: finishConfirm ? "#ef4444" : "color-mix(in srgb, #ef4444 10%, var(--card-bg))", color: finishConfirm ? "#fff" : "#dc2626", border: `1px solid ${finishConfirm ? "#ef4444" : "color-mix(in srgb, #ef4444 35%, var(--card-border))"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}
                >
                  {finishConfirm ? "Confirm finish" : "Finish paper"}
                </button>
              </div>
            </div>
          </Card>
        </div>
        <Card>
          <div style={{ fontWeight: 800, color: "var(--text-strong)", marginBottom: 10 }}>Paper navigator</div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.7, marginBottom: 12 }}>
            Jump to any question. Green means answered. Amber means flagged for review.
          </div>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {questions.map((question, index) => {
              const answered = answers[index] !== undefined;
              const isCurrent = current === index;
              const isFlagged = flagged[index];
              return (
                <button
                  key={`${question.q}-${index}`}
                  className="focus-ring"
                  onClick={() => setCurrent(index)}
                  style={{
                    minHeight: 50,
                    borderRadius: 14,
                    border: `1px solid ${isCurrent ? selectedPaper.accent : isFlagged ? "#f59e0b" : answered ? "#22c55e" : "var(--card-border)"}`,
                    background: isCurrent ? `${selectedPaper.accent}20` : isFlagged ? "color-mix(in srgb, #f59e0b 12%, var(--card-bg))" : answered ? "color-mix(in srgb, #22c55e 12%, var(--card-bg))" : "var(--panel-bg)",
                    color: isCurrent ? "var(--text-strong)" : isFlagged ? "#d97706" : answered ? "#16a34a" : "var(--text-muted)",
                    cursor: "pointer",
                    fontWeight: 800,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </Card>
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
    setSession(
      pickRandom(questions, Math.min(questions.length, 12))
        .map((question, index) => prepareQuestionVariant(question, 18000 + index)),
    );
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
        <SectionTitle icon="🧩" meta="Your wrong answers appear here for targeted revision.">Revise Mistakes</SectionTitle>
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
    setQuestions(
      pickRandomNoRepeat(pool, total, STORAGE_KEYS.recentRapid, 180)
        .map((question, index) => prepareQuestionVariant(question, 20000 + index)),
    );
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
      <Progress value={timerPct} className="mb-4 h-2.5" indicatorClassName="transition-transform duration-1000" />
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
  const [isDark, setIsDark] = useState(() => getInitialTheme());
  const [wrongQuestions, setWrongQuestions] = useState(() => readStore(STORAGE_KEYS.wrongQuestions, []));
  const [mockHistory, setMockHistory] = useState(() => loadMockHistory());
  const [mockProgress, setMockProgress] = useState(() => loadMockProgress());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [tabHistory, setTabHistory] = useState([]);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(() => Boolean(window.__offlineReady));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    writeStore(STORAGE_KEYS.theme, isDark);
  }, [isDark]);

  useEffect(() => {
    writeStore(STORAGE_KEYS.activeTab, active);
    if (window.location.hash !== `#${active}`) {
      window.history.replaceState(null, "", `#${active}`);
    }
    const seo = SEO_COPY[active] || SEO_COPY.home;
    document.title = seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && seo.description) metaDescription.setAttribute("content", seo.description);
    setWrongQuestions(readStore(STORAGE_KEYS.wrongQuestions, []));
    setMockHistory(loadMockHistory());
    setMockProgress(loadMockProgress());
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

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    const onOfflineReady = () => setOfflineReady(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("lifeuk-offline-ready", onOfflineReady);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("lifeuk-offline-ready", onOfflineReady);
    };
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
      case "home": return <HomeTab setActive={navigateTo} wrongQuestions={wrongQuestions} mockHistory={mockHistory} mockProgress={mockProgress} />;
      case "quickrev": return <QuickRevisionTab setActive={navigateTo} />;
      case "story": return <StoryModeTab setActive={navigateTo} />;
      case "daily10": return <DailyTenTab />;
      case "sprint": return <TrueFalseSprintTab />;
      case "cram": return <CramSheetTab />;
      case "tracker": return <TopicTrackerTab setActive={navigateTo} />;
      case "timeline": return <TimelineTab />;
      case "wars": return <WarsTab />;
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
      default: return <HomeTab setActive={navigateTo} wrongQuestions={wrongQuestions} mockHistory={mockHistory} mockProgress={mockProgress} />;
    }
  };

  return (
    <div className="app-shell" style={{ minHeight: "100vh" }}>
    <div className="mx-auto max-w-[1120px]" style={{ paddingBottom: isMobile ? 112 : 12 }}>
      <TabBar active={active} setActive={navigateTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} isDark={isDark} toggleDark={toggleDark} openQuickPanel={() => setQuickPanelOpen(true)} isMobile={isMobile} />
      <div className="tabcontent">{renderTab()}</div>
      <AppFooterBar onForceRefresh={forceLatestAppReload} offlineReady={offlineReady} isOffline={isOffline} />
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        Open Source — Share Freely ·{" "}
        <a href="https://github.com/kanwalnainsingh/KNS-Life-In-UK-Test" target="_blank" rel="noopener" className="text-primary no-underline">
          github.com/kanwalnainsingh/KNS-Life-In-UK-Test
        </a>
      </div>
      {isMobile && <BottomNav active={active} setActive={navigateTo} openQuickPanel={() => setQuickPanelOpen(true)} onBack={handleBack} canGoBack={tabHistory.length > 0} />}
      {isMobile && <ScrollTopButton visible={showScrollTop} />}
      {isMobile && <MobileQuickPanel open={quickPanelOpen} active={active} setActive={navigateTo} onClose={() => setQuickPanelOpen(false)} onBack={handleBack} canGoBack={tabHistory.length > 0} />}
    </div>
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
