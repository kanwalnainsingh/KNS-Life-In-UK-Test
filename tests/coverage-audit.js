const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("src/data.js", "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(`${source}\nthis.__out = { LANDMARKS, FESTIVALS, KEY_FIGURES, SPORTS_STARS, INVENTORS, ALL_QUIZ };`, context);
const data = context.__out;

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/\b(sir|dame|lord|lady|baroness)\b/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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
