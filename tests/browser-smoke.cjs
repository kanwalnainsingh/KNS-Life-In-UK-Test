const fs = require("fs");
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const getChromePath = () => {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean);

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    if (!process.env.CI) {
      console.log("Browser smoke test skipped: no supported Chrome/Chromium executable found locally.");
      return null;
    }
    throw new Error("No supported Chrome/Chromium executable found for browser smoke test.");
  }
  return found;
};

const captureScreenshot = async (page, baseUrl) => {
  const targetPath = process.env.SCREENSHOT_PATH;
  if (!targetPath) return;
  const targetHash = process.env.SCREENSHOT_HASH || "#figures";
  const targetTheme = process.env.SCREENSHOT_THEME || "light";
  const targetAction = process.env.SCREENSHOT_ACTION || "";
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/${targetHash}`, { waitUntil: "networkidle0" });
  if (targetTheme === "dark") {
    await page.evaluate(() => {
      localStorage.setItem("lifeuk-theme", "true");
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    });
    await page.reload({ waitUntil: "networkidle0" });
  }
  if (targetAction === "menu") {
    await clickByAriaLabel(page, "Open topics");
    await waitForText(page, "Primary navigation");
  }
  await page.screenshot({ path: targetPath, fullPage: false });
};

const startServer = () => {
  const server = http.createServer((req, res) => {
    const requestPath = decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\/+/, "");
    const filePath = path.join(DOCS_DIR, requestPath || "index.html");
    const safePath = filePath.startsWith(DOCS_DIR) ? filePath : path.join(DOCS_DIR, "index.html");
    const target = fs.existsSync(safePath) && fs.statSync(safePath).isFile() ? safePath : path.join(DOCS_DIR, "index.html");
    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(fs.readFileSync(target));
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        server,
        url: `http://127.0.0.1:${port}`,
      });
    });
  });
};

const waitForText = async (page, text) => {
  await page.waitForFunction(
    (value) => document.body && document.body.innerText.includes(value),
    { timeout: 30000 },
    text,
  );
};

const clickByText = async (page, text) => {
  const handles = await page.$x(`//button[contains(normalize-space(.), "${text}")]`);
  assert(handles.length > 0, `Could not find button with text: ${text}`);
  await handles[0].evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "center" });
    element.click();
  });
};

const clickByAriaLabel = async (page, label) => {
  const handle = await page.$(`button[aria-label="${label}"]`);
  assert(handle, `Could not find button with aria-label: ${label}`);
  await handle.evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "center" });
    element.click();
  });
};

const clickFirstAnswerOption = async (page) => {
  const handles = await page.$x(`//button[contains(@class, "option-button")]`);
  assert(handles.length > 0, "Could not find any quiz option buttons");
  await handles[0].evaluate((element) => {
    element.scrollIntoView({ block: "center", inline: "center" });
    element.click();
  });
};

(async () => {
  assert(fs.existsSync(path.join(DOCS_DIR, "index.html")), "Built docs/ output is required. Run npm run build first.");

  const chromePath = getChromePath();
  if (!chromePath) return;

  const { server, url } = await startServer();

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    page.on("pageerror", (error) => console.error("Page error:", error.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.error("Console error:", msg.text());
    });

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "TODAY'S NEXT STEP");
    await waitForText(page, "Study path");
    await waitForText(page, "Browse topics");

    await page.goto(`${url}/#guide`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "How to Pass the Life in the UK Test");
    await waitForText(page, "24 questions");
    await waitForText(page, "7-day pass plan");
    await waitForText(page, "Do I need to create an account?");

    await page.goto(`${url}/#examtopics`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Exam Topics Course");
    await waitForText(page, "British Values, Principles & Traditions");
    await waitForText(page, "Important People & Events");
    await waitForText(page, "Question coverage");
    await clickByText(page, "Values mock");
    await waitForText(page, "Question 1 of");
    await clickFirstAnswerOption(page);
    await waitForText(page, "Why this question matters");
    await clickByText(page, "Next question");
    await waitForText(page, "Question 2 of");

    await page.goto(`${url}/#quickrev`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Quick Revision");
    await waitForText(page, "Swipe left for Hard");
    await waitForText(page, "SESSION");
    await waitForText(page, "Why it matters");

    await page.goto(`${url}/#audio`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Audio Mode");
    await waitForText(page, "Hands-free revision for the whole test");
    await waitForText(page, "Driving cram");
    await waitForText(page, "Weak areas audio");
    await waitForText(page, "Question drill");
    await waitForText(page, "Play audio");
    await clickByText(page, "Driving view");
    await waitForText(page, "Driving audio view");
    await waitForText(page, "Back to full view");

    await page.goto(`${url}/#story`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Story Mode");
    await waitForText(page, "Dates and names to remember");
    await clickByText(page, "Test this chapter");
    await page.waitForFunction(() => window.location.hash === "#quickrev", { timeout: 30000 });
    await waitForText(page, "Why it matters");

    await page.goto(`${url}/#datesdrill`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Dates Drill");
    await waitForText(page, "Year → event");
    await clickFirstAnswerOption(page);
    await waitForText(page, "Next date");

    await page.goto(`${url}/#quickfacts`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Quick Facts Course");
    await waitForText(page, "Complete course");
    await clickByText(page, "Test this group");
    await waitForText(page, "Question 1 of");

    await page.goto(`${url}/#mock`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Mock Test");
    await clickByText(page, "Mock Test 1");
    await waitForText(page, "Question 1 of 24");

    await page.goto(`${url}/#wars`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Wars & Battles");
    await waitForText(page, "Most tested first");
    await waitForText(page, "One-glance war compare table");
    await clickByText(page, "Start test");
    await waitForText(page, "Question 1 of");

    await page.goto(`${url}/#rapidfire`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Rapid Fire");
    await waitForText(page, "Reset progress");
    await waitForText(page, "Start Rapid Fire");

    await page.goto(`${url}/#landmarks`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "Turn places into quick recall");

    await page.goto(`${url}/#inventors`, { waitUntil: "networkidle0", timeout: 30000 });
    await waitForText(page, "British Inventors & Scientists");
    await clickByText(page, "Start inventors mock");
    await waitForText(page, "Question 1 of");
    await clickFirstAnswerOption(page);
    await waitForText(page, "Correct answer:");

    await captureScreenshot(page, url);

    console.log("Browser smoke test passed:");
    console.log("- home loads with pass-guide shortcuts");
    console.log("- user guide page renders with test facts and study paths");
    console.log("- exam topics course renders");
    console.log("- quick revision topic filter and card flow render");
    console.log("- story mode chapter handoff to quick revision works");
    console.log("- quick facts course group check renders");
    console.log("- mock paper flow starts in the browser");
    console.log("- wars section compare table and mini test render");
    console.log("- rapid fire reset control renders");
    console.log("- topic-page follow-up actions render");
    console.log("- section-specific page mocks render and review answers");
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
