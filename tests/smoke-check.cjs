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
  assert(Array.isArray(data.STORY_CHAPTERS) && data.STORY_CHAPTERS.length >= 6, "Expected stable story chapters");
  assert(data.TABS.some((tab) => tab.id === "mock"), "Mock tab missing");
  assert(data.TABS.some((tab) => tab.id === "revise"), "Revise tab missing");
  assert(data.TABS.some((tab) => tab.id === "quickrev"), "Quick revision tab missing");
  assert(data.TABS.some((tab) => tab.id === "examtopics"), "Exam topics tab missing");
  assert(data.TABS.some((tab) => tab.id === "story"), "Story mode tab missing");
  assert(data.TABS.some((tab) => tab.id === "datesdrill"), "Dates drill tab missing");
  assert(data.TABS.some((tab) => tab.id === "wars"), "Wars tab missing");
  assert(data.TABS.some((tab) => tab.id === "daily10"), "Daily 10 tab missing");
  assert(data.TABS.some((tab) => tab.id === "sprint"), "Sprint tab missing");
  assert(data.TABS.some((tab) => tab.id === "cram"), "Cram tab missing");
  assert(data.TABS.some((tab) => tab.id === "tracker"), "Tracker tab missing");
  assert(/MockExamTab/.test(appSource), "Mock exam UI missing");
  assert(/ReviseTab/.test(appSource), "Revision UI missing");
  assert(/QuickRevisionTab/.test(appSource), "Quick revision UI missing");
  assert(/ExamTopicsModeTab/.test(appSource), "Exam topics UI missing");
  assert(/StoryModeTab/.test(appSource), "Story mode UI missing");
  assert(/DatesDrillTab/.test(appSource), "Dates drill UI missing");
  assert(/STORY_CHAPTERS/.test(appSource), "Story mode should use stable chapter data");
  assert(/WarsTab/.test(appSource), "Wars revision UI missing");
  assert(/DailyTenTab/.test(appSource), "Daily 10 UI missing");
  assert(/TrueFalseSprintTab/.test(appSource), "Sprint UI missing");
  assert(/CramSheetTab/.test(appSource), "Cram UI missing");
  assert(/TopicTrackerTab/.test(appSource), "Tracker UI missing");
  assert(/MOCK_PAPER_COUNT = 40/.test(appSource), "Expected 40 fixed mock papers");
  assert(/mockProgress/.test(appSource), "Mock progress storage missing");
  assert(/QUICK_REVISION_SESSION_OPTIONS/.test(appSource), "Quick revision session presets missing");
  assert(/QUICK_REVISION_FOCUS_OPTIONS/.test(appSource), "Quick revision focus presets missing");
  assert(/Topic filter/.test(appSource), "Quick revision topic filter missing");
  assert(/All topics/.test(appSource), "Quick revision all-topics option missing");
  assert(/Fresh mix/.test(appSource), "Fresh mix quick revision focus missing");
  assert(/Weak areas/.test(appSource), "Weak areas quick revision focus missing");
  assert(/Saved mock paper tracker/.test(appSource), "Mock tracker summary missing");
  assert(/Confirm finish/.test(appSource), "Mock finish confirmation missing");
  assert(/Quick cards, full-course coverage/.test(appSource), "Quick revision hero missing");
  assert(/Date-first memory flow/.test(appSource), "Story mode chapter hero missing");
  assert(/Dates and names to remember/.test(appSource), "Story mode memory anchor panel missing");
  assert(/Dates Drill/.test(appSource), "Dates drill heading missing");
  assert(/Year → event|Event → year/.test(appSource), "Dates drill mode options missing");
  assert(/Quick answer view/.test(appSource), "Quick revision auto-answer view missing");
  assert(/Show all now/.test(appSource), "Quick revision show-all action missing");
  assert(/Reset progress/.test(appSource), "Quick revision reset action missing");
  assert(/Review the ones you missed/.test(appSource), "Daily 10 wrong-answer review missing");
  assert(/<span>Menu<\/span>/.test(appSource), "Bottom menu label missing");
  assert(/Start here/.test(appSource), "Pass-focused start guidance missing");
  assert(/Pass guide/.test(appSource) && /Pass Plan/.test(appSource), "Saved pass plan UI missing");
  assert(/Exam Topics Course/.test(appSource), "Exam topics course heading missing");
  assert(/lifeuk-examtopic-mocks/.test(appSource), "Exam topic mock storage missing");
  assert(/Topic mock/.test(appSource), "Exam topic mock UI missing");
  assert(/Question coverage/.test(appSource), "Exam topic question coverage summary missing");
  assert(/mockCount: 8|mockCount: 10|mockCount: 12/.test(appSource), "Exam topic mock counts missing");
  assert(/buildExamTopicQuestionPool/.test(appSource), "Exam topic question pool helper missing");
  assert(/Saved facts/.test(appSource), "Saved facts quick revision flow missing");
  assert(/const scrollPageTop =/.test(appSource), "Shared session scroll-top helper missing");
  assert(/forceLatestAppReload/.test(appSource), "Forced refresh helper missing");
  assert(/↻ Check Update/.test(appSource), "Update-check button missing");
  assert(/registration\.update\(\)/.test(indexSource), "Service worker should check for updates on load");
  assert(/assets\/styles\.css/.test(indexSource), "Tailwind stylesheet link missing from template");
  assert(/classList\.toggle\("dark"/.test(indexSource), "Initial theme script should set dark class");
  assert(/updateViaCache:\s*"none"/.test(indexSource), "Service worker registration should bypass HTTP cache");
  assert(/controllerchange/.test(indexSource), "Service worker should reload when a new controller takes over");
  assert(/SKIP_WAITING/.test(indexSource), "Service worker registration should activate waiting workers");
  assert(/SKIP_WAITING/.test(serviceWorkerSource), "Service worker should support skip-waiting activation");
  assert(/Button/.test(appSource) && /UiCard/.test(appSource), "Shared shadcn-style UI primitives should be used");
  assert(/appVersion/.test(appSource), "Forced refresh should include an app version cache-buster");
  assert(/window\.__APP_VERSION__/.test(appSource) && /packageMeta\.version/.test(appSource), "App version should use build/runtime version with package fallback");
  assert(/Remembered up to here/.test(appSource), "Timeline checkpoint UI missing");
  assert(/CompactVisualStrip/.test(appSource), "Compact visual strip helper missing");
  assert(/Cache-Control/.test(indexSource), "No-cache meta hints missing");
  assert(/Back to quiz setup/.test(appSource), "Quiz back button missing");
  assert(/Go to home/.test(appSource), "Header home button missing");
  assert(/mobile-bottom-nav/.test(indexSource), "Mobile bottom nav styling missing");
  assert(/BottomNav/.test(appSource), "Bottom navigation component missing");
  assert(/MobileQuickPanel/.test(appSource), "Quick panel component missing");
  assert(/ScrollBottomButton/.test(appSource), "Scroll-to-bottom helper missing");
  assert(/mobile-scroll-bottom/.test(indexSource), "Scroll-to-bottom styling missing");
  assert(/scrollPageTop\(\);/.test(appSource), "Expected session start scroll-top calls");
  assert(/desktop-nav-panel/.test(indexSource), "Desktop grouped navigation styling missing");
  assert(/AppFooterBar/.test(appSource), "Footer version bar missing");
  assert(/Offline ready|Offline now|Online only/.test(appSource), "Offline footer status missing");
  assert(/Visual memory clues/.test(appSource), "Mnemonic home panel missing");
  assert(/Coverage checklist/.test(appSource), "Coverage checklist missing");
  assert(/SectionStudyActions/.test(appSource), "Section follow-up action rows missing");
  assert(/Use these nation facts right away/.test(appSource), "4 Nations follow-up actions missing");
  assert(/Quick Facts Course/.test(appSource), "Quick Facts course heading missing");
  assert(/Use Quick Facts as a course mode/.test(appSource), "Quick Facts course follow-up actions missing");
  assert(/Complete course/.test(appSource), "Quick Facts complete-course mode missing");
  assert(/Test this group/.test(appSource), "Quick Facts group check action missing");
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

  data.STORY_CHAPTERS.forEach((chapter, index) => {
    assert(typeof chapter.title === "string" && chapter.title.length > 8, `Story chapter ${index + 1} title invalid`);
    assert(Array.isArray(chapter.items) && chapter.items.length >= 4, `Story chapter ${index + 1} needs multiple cards`);
    chapter.items.forEach((item, itemIndex) => {
      assert(typeof item.title === "string" && item.title.length > 3, `Story chapter ${index + 1} item ${itemIndex + 1} title invalid`);
      assert(typeof item.fact === "string" && item.fact.length > 8, `Story chapter ${index + 1} item ${itemIndex + 1} fact invalid`);
      assert(typeof item.context === "string" && item.context.length > 8, `Story chapter ${index + 1} item ${itemIndex + 1} context invalid`);
      assert(typeof item.memory === "string" && item.memory.length > 4, `Story chapter ${index + 1} item ${itemIndex + 1} memory invalid`);
    });
  });

  console.log("Smoke check passed:");
  console.log(`- ${data.ALL_QUIZ.length} quiz questions validated`);
  console.log(`- ${data.CONFUSABLES.length} confusion pairs validated`);
  console.log(`- ${data.TABS.length} tabs validated`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
