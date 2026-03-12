const path = require("path");
const { pathToFileURL } = require("url");

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const MOCK_TOTAL = 24;
const MOCK_PAPER_COUNT = 40;
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

const REQUIRED_TRAP_TITLES = new Set([
  "Great Britain vs United Kingdom",
  "British Isles vs United Kingdom",
  "House of Commons vs House of Lords",
  "Church of England vs Church of Scotland",
  "1603 Union of Crowns vs 1707 Act of Union",
  "Slave Trade 1807 vs Slavery Abolished 1833",
  "Council of Europe vs European Union",
  "Big Ben vs Elizabeth Tower",
  "Magna Carta 1215 vs Model Parliament 1295",
  "General election vs local election",
]);

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
  if (/compare mode/.test(text)) return "traps";
  if (/war|battle|roman|norman|tudor|stuart|victoria|magna carta|boudicca|athelstan|alfred|domesday|hastings|reformation|beveridge|nhs|wilberforce|chartist|peterloo|suffragette|general strike|union of crowns|james i|charles i|waterloo|world war/.test(text)) return "history";
  if (/prime minister|monarch|commons|lords|parliament|speaker|democracy|vote|ballot|constituenc|jury|magistrate|law|equality act|rule of law|innocent|community|volunteer|bank of england|10 downing street|government|human rights|citizenship|settlement|life in the uk test/.test(text)) return "civics";
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
    if (/stonehenge|tower of london|windsor|buckingham|cenotaph|loch|river|wall|castle|palace|museum|giant|angel of the north|eden project/.test(text)) return "nations-places";
    return "nations-identity";
  }

  if (/christmas|easter|diwali|hanukkah|eid|vaisakhi|bonfire|remembrance|burns|hogmanay|mothering|faith|religion|festival|anthem|union jack|world wide web|penicillin|invention|invent|scientist|writer|wrote|author|artist|poet|playwright|beatles|fashion|sport|wimbledon|fa cup|marathon|olympic|paralympic|commonwealth|nato|united nations|council of europe|g7|canterbury tales/.test(text)) {
    return "culture-society";
  }

  return "culture-people";
};

const pickLeastUsedMockQuestions = (items, count, usageMap, usedQuestions, seed) => {
  if (!items.length || count <= 0) return [];
  const candidates = seededShuffle(items, seed)
    .sort((left, right) => {
      const leftUsage = usageMap.get(left.q) || 0;
      const rightUsage = usageMap.get(right.q) || 0;
      if (leftUsage !== rightUsage) return leftUsage - rightUsage;
      return left.q.localeCompare(right.q);
    });
  const picked = [];
  for (const item of candidates) {
    if (picked.length >= count) break;
    if (usedQuestions.has(item.q)) continue;
    picked.push(item);
    usedQuestions.add(item.q);
    usageMap.set(item.q, (usageMap.get(item.q) || 0) + 1);
  }
  return picked;
};

(async () => {
  const data = await import(`${pathToFileURL(path.resolve("src/data.js")).href}?t=${Date.now()}`);

  const buildConfusionDeck = () =>
    data.CONFUSABLES.map((item, index) => ({
      q: `${item.title} (${index + 1})`,
      opts: [item.left.label, item.right.label, "Both", "Neither"],
      a: 0,
      tip: "compare mode",
    }));

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
    [...data.ALL_QUIZ, ...buildConfusionDeck()].forEach((question, index) => {
      const key = classifyMockCategory(question);
      const subgroup = classifyMockSubgroup(question);
      const enriched = { ...question, mockKey: `${key}:${index}:${question.q}` };
      bucketed[key].push(enriched);
      bucketed[subgroup].push(enriched);
    });
    return bucketed;
  };

  const buildAllFixedMockPapers = () => {
    const buckets = buildMockBuckets();
    const usageMap = new Map();

    return Array.from({ length: MOCK_PAPER_COUNT }, (_, index) => {
      const paperNumber = index + 1;
      const usedQuestions = new Set();
      const questions = [];

      MOCK_SUBGROUP_DISTRIBUTION.forEach(({ id, count }, bucketIndex) => {
        questions.push(
          ...pickLeastUsedMockQuestions(
            buckets[id],
            count,
            usageMap,
            usedQuestions,
            4000 + paperNumber * 97 + bucketIndex * 17,
          ),
        );
      });

      if (questions.length < MOCK_TOTAL) {
        MOCK_DISTRIBUTION.forEach(({ id }, bucketIndex) => {
          if (questions.length >= MOCK_TOTAL) return;
          questions.push(
            ...pickLeastUsedMockQuestions(
              buckets[id],
              MOCK_TOTAL - questions.length,
              usageMap,
              usedQuestions,
              7000 + paperNumber * 83 + bucketIndex * 29,
            ),
          );
        });
      }

      if (questions.length < MOCK_TOTAL) {
        questions.push(
          ...pickLeastUsedMockQuestions(
            [...data.ALL_QUIZ, ...buildConfusionDeck()],
            MOCK_TOTAL - questions.length,
            usageMap,
            usedQuestions,
            9000 + paperNumber * 101,
          ),
        );
      }

      return seededShuffle(questions.slice(0, MOCK_TOTAL), 5000 + paperNumber)
        .map((question, questionIndex) => prepareQuestionVariant(question, 9000 + paperNumber * 100 + questionIndex));
    });
  };

  const answerCounts = [0, 0, 0, 0];
  const seenAcrossSeries = new Set();
  const papers = buildAllFixedMockPapers();

  papers.forEach((questions, index) => {
    const paperNumber = index + 1;
    assert(questions.length === MOCK_TOTAL, `Mock paper ${paperNumber} does not have ${MOCK_TOTAL} questions`);
    assert(new Set(questions.map((question) => question.q)).size === questions.length, `Mock paper ${paperNumber} has duplicate questions`);

    const counts = { history: 0, civics: 0, nations: 0, culture: 0, traps: 0 };
    questions.forEach((question) => {
      counts[classifyMockCategory(question)] += 1;
      answerCounts[question.a] += 1;
      seenAcrossSeries.add(question.q);
    });

    MOCK_DISTRIBUTION.forEach(({ id, count }) => {
      assert(counts[id] === count, `Mock paper ${paperNumber} has ${counts[id]} ${id} questions, expected ${count}`);
    });
  });

  const allQuizQuestions = new Set(data.ALL_QUIZ.map((question) => question.q));
  const missingQuizAcrossSeries = [...allQuizQuestions].filter((question) => !seenAcrossSeries.has(question));
  assert(missingQuizAcrossSeries.length === 0, `Mock paper series is missing ${missingQuizAcrossSeries.length} quiz questions across the full run`);

  const confusionDeck = buildConfusionDeck();
  const requiredTrapQuestions = confusionDeck
    .filter((question) => REQUIRED_TRAP_TITLES.has(question.q.replace(/ \(\d+\)$/, "")))
    .map((question) => question.q);
  const missingRequiredTraps = requiredTrapQuestions.filter((question) => !seenAcrossSeries.has(question));
  assert(missingRequiredTraps.length === 0, `Mock paper series is missing ${missingRequiredTraps.length} required mix-up cards across the full run`);

  const totalAnswers = answerCounts.reduce((sum, count) => sum + count, 0);
  answerCounts.forEach((count, index) => {
    const ratio = count / totalAnswers;
    assert(ratio >= 0.15 && ratio <= 0.35, `Answer position ${index} is too skewed: ${count}/${totalAnswers}`);
  });

  console.log("Mock balance check passed:");
  console.log(`- ${MOCK_PAPER_COUNT} fixed papers validated`);
  console.log(`- ${MOCK_TOTAL} questions per paper with balanced coverage`);
  console.log(`- all ${allQuizQuestions.size} quiz questions appear at least once across the series`);
  console.log(`- all ${requiredTrapQuestions.length} highest-yield mix-up cards appear across the series`);
  console.log(`- answer positions distributed across A/B/C/D = ${answerCounts.join("/")}`);
})();
