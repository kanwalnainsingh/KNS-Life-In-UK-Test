const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

(async () => {
  const root = path.resolve(__dirname, "..");
  const dataPath = path.join(root, "src", "data.js");
  const appPath = path.join(root, "src", "app.jsx");
  const indexPath = path.join(root, "index.html");
  const serviceWorkerPath = path.join(root, "service-worker.js");

  const data = await import(`${pathToFileURL(dataPath).href}?t=${Date.now()}`);
  const appSource = fs.readFileSync(appPath, "utf8");
  const indexSource = fs.readFileSync(indexPath, "utf8");
  const serviceWorkerSource = fs.readFileSync(serviceWorkerPath, "utf8");

  assert(Array.isArray(data.ALL_QUIZ), "ALL_QUIZ should be defined");
  assert(data.ALL_QUIZ.length >= 250, "Expected at least 250 quiz questions");
  assert(Array.isArray(data.CONFUSABLES) && data.CONFUSABLES.length >= 6, "Expected confusion pairs");
  assert(Array.isArray(data.TABS) && data.TABS.length >= 16, "Expected expanded tab list");
  assert(Array.isArray(data.VISUAL_MNEMONICS) && data.VISUAL_MNEMONICS.length >= 4, "Expected mnemonic packs");
  assert(data.TABS.some((tab) => tab.id === "mock"), "Mock tab missing");
  assert(data.TABS.some((tab) => tab.id === "revise"), "Revise tab missing");
  assert(data.TABS.some((tab) => tab.id === "quickrev"), "Quick revision tab missing");
  assert(data.TABS.some((tab) => tab.id === "wars"), "Wars tab missing");
  assert(data.TABS.some((tab) => tab.id === "daily10"), "Daily 10 tab missing");
  assert(data.TABS.some((tab) => tab.id === "sprint"), "Sprint tab missing");
  assert(data.TABS.some((tab) => tab.id === "cram"), "Cram tab missing");
  assert(data.TABS.some((tab) => tab.id === "tracker"), "Tracker tab missing");
  assert(/MockExamTab/.test(appSource), "Mock exam UI missing");
  assert(/ReviseTab/.test(appSource), "Revision UI missing");
  assert(/QuickRevisionTab/.test(appSource), "Quick revision UI missing");
  assert(/WarsTab/.test(appSource), "Wars revision UI missing");
  assert(/DailyTenTab/.test(appSource), "Daily 10 UI missing");
  assert(/TrueFalseSprintTab/.test(appSource), "Sprint UI missing");
  assert(/CramSheetTab/.test(appSource), "Cram UI missing");
  assert(/TopicTrackerTab/.test(appSource), "Tracker UI missing");
  assert(/MOCK_PAPER_COUNT = 30/.test(appSource), "Expected 30 fixed mock papers");
  assert(/Confirm finish/.test(appSource), "Mock finish confirmation missing");
  assert(/Fresh rapid revision/.test(appSource), "Quick revision hero missing");
  assert(/Show details/.test(appSource), "Quick revision inline details control missing");
  assert(/forceLatestAppReload/.test(appSource), "Forced refresh helper missing");
  assert(/↻ Latest/.test(appSource), "Latest-version button missing");
  assert(/APP_VERSION = \"v/.test(appSource), "App version constant missing");
  assert(/Remembered up to here/.test(appSource), "Timeline checkpoint UI missing");
  assert(/CompactVisualStrip/.test(appSource), "Compact visual strip helper missing");
  assert(/Cache-Control/.test(indexSource), "No-cache meta hints missing");
  assert(/Back to quiz setup/.test(appSource), "Quiz back button missing");
  assert(/Go to home/.test(appSource), "Header home button missing");
  assert(/mobile-bottom-nav/.test(indexSource), "Mobile bottom nav styling missing");
  assert(/BottomNav/.test(appSource), "Bottom navigation component missing");
  assert(/MobileQuickPanel/.test(appSource), "Quick panel component missing");
  assert(/mobile-primary-strip/.test(indexSource), "Mobile primary strip styling missing");
  assert(/desktop-nav-panel/.test(indexSource), "Desktop grouped navigation styling missing");
  assert(/AppFooterBar/.test(appSource), "Footer version bar missing");
  assert(/Offline ready|Offline now|Online only/.test(appSource), "Offline footer status missing");
  assert(/Visual memory clues/.test(appSource), "Mnemonic home panel missing");
  assert(/Coverage checklist/.test(appSource), "Coverage checklist missing");
  assert(/focus-ring/.test(indexSource), "Focus-visible styling missing");
  assert(/@media \(max-width: 820px\)/.test(indexSource), "Responsive breakpoint missing");
  assert(/serviceWorker\.register/.test(indexSource), "Service worker registration missing");
  assert(/CACHE_VERSION/.test(serviceWorkerSource), "Service worker cache version missing");
  assert(/addEventListener\(\"fetch\"/.test(serviceWorkerSource) || /addEventListener\('fetch'/.test(serviceWorkerSource), "Service worker fetch handler missing");

  data.ALL_QUIZ.forEach((question, index) => {
    assert(typeof question.q === "string" && question.q.length > 10, `Question ${index + 1} text invalid`);
    assert(Array.isArray(question.opts) && question.opts.length === 4, `Question ${index + 1} must have 4 options`);
    assert(Number.isInteger(question.a) && question.a >= 0 && question.a < 4, `Question ${index + 1} answer index invalid`);
    assert(typeof question.tip === "string" && question.tip.length > 8, `Question ${index + 1} tip missing`);
  });

  data.CONFUSABLES.forEach((pair, index) => {
    assert(pair.left && pair.right, `Confusion pair ${index + 1} missing sides`);
    assert(Array.isArray(pair.left.points) && pair.left.points.length >= 3, `Confusion pair ${index + 1} left side incomplete`);
    assert(Array.isArray(pair.right.points) && pair.right.points.length >= 3, `Confusion pair ${index + 1} right side incomplete`);
  });

  console.log("Smoke check passed:");
  console.log(`- ${data.ALL_QUIZ.length} quiz questions validated`);
  console.log(`- ${data.CONFUSABLES.length} confusion pairs validated`);
  console.log(`- ${data.TABS.length} tabs validated`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
