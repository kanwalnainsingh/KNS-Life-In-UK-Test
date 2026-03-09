const path = require("path");
const { pathToFileURL } = require("url");

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/\b(sir|dame|lord|lady|baroness)\b/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

(async () => {
  const data = await import(`${pathToFileURL(path.resolve("src/data.js")).href}?t=${Date.now()}`);
  const quizText = normalize(
    data.ALL_QUIZ.map((q) => `${q.q} ${q.tip} ${q.opts.join(" ")}`).join("\n")
  );

  const present = (text) => quizText.includes(normalize(text));

  const checks = [
    ["Landmarks", data.LANDMARKS.map((x) => x.name)],
    ["Festivals", data.FESTIVALS.map((x) => x.name)],
    ["Key Figures", data.KEY_FIGURES.map((x) => x.name)],
    ["Sports", data.SPORTS_STARS.map((x) => x.name)],
    ["Inventors", data.INVENTORS.map((x) => x.who)],
  ];

  for (const [label, values] of checks) {
    const missing = values.filter((value) => value && !present(value.split("(")[0].trim())).slice(0, 12);
    console.log(`\n[${label}] likely uncovered in quiz (${missing.length})`);
    if (!missing.length) console.log("- none");
    else missing.forEach((item) => console.log(`- ${item}`));
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
