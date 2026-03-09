const path = require("path");
const { pathToFileURL } = require("url");

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const normalizeQuestion = (text) =>
  text
    .toLowerCase()
    .replace(/['’"]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

(async () => {
  const data = await import(`${pathToFileURL(path.resolve("src/data.js")).href}?t=${Date.now()}`);

  const seenQuestions = new Map();
  data.ALL_QUIZ.forEach((question, index) => {
    const key = normalizeQuestion(question.q);
    const firstSeen = seenQuestions.get(key);
    assert(!firstSeen, `Duplicate quiz question detected at ${firstSeen} and ${index + 1}: ${question.q}`);
    seenQuestions.set(key, index + 1);
  });

  const chapterIds = new Set();
  data.STORY_CHAPTERS.forEach((chapter, index) => {
    assert(!chapterIds.has(chapter.id), `Duplicate story chapter id: ${chapter.id}`);
    chapterIds.add(chapter.id);
    assert(Array.isArray(chapter.recap) && chapter.recap.length >= 3, `Story chapter ${index + 1} recap is too thin`);
  });

  const mustCover = [
    "What is the United Kingdom?",
    "Which church is Presbyterian and does NOT have the monarch as its head?",
    "Which organisation created the European Convention on Human Rights?",
    "What is the name of the tower that contains Big Ben?",
  ];

  for (const expected of mustCover) {
    assert(data.ALL_QUIZ.some((question) => question.q === expected), `Missing key comparison question: ${expected}`);
  }

  console.log("Regression check passed:");
  console.log(`- ${data.ALL_QUIZ.length} unique quiz questions`);
  console.log(`- ${data.STORY_CHAPTERS.length} story chapters with recap coverage`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
