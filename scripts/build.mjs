import fs from "fs";
import path from "path";
import crypto from "crypto";
import esbuild from "esbuild";

const { build } = esbuild;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outdir = path.join(root, "docs");
const assetsDir = path.join(outdir, "assets");
const screenshotsSrc = path.join(root, "screenshots");
const screenshotsDest = path.join(outdir, "screenshots");
const tempBundleDir = path.join(root, ".tmp-build");

const removeDir = (target) => {
  if (!fs.existsSync(target)) return;
  for (const entry of fs.readdirSync(target)) {
    const current = path.join(target, entry);
    const stats = fs.lstatSync(current);
    if (stats.isDirectory()) removeDir(current);
    else fs.unlinkSync(current);
  }
  fs.rmdirSync(target);
};

removeDir(outdir);
removeDir(tempBundleDir);
fs.mkdirSync(assetsDir, { recursive: true });

const buildResult = await build({
  entryPoints: [path.join(root, "src", "main.jsx")],
  outdir: tempBundleDir,
  write: false,
  bundle: true,
  format: "esm",
  jsx: "automatic",
  target: ["es2018"],
  minify: true,
  sourcemap: false,
});

const bundleOutput = buildResult.outputFiles.find((file) => file.path.endsWith(".js"));
if (!bundleOutput) throw new Error("Bundled app output missing");

const bundleBuffer = Buffer.from(bundleOutput.contents);
const bundleHash = crypto.createHash("sha256").update(bundleBuffer).digest("hex").slice(0, 10);
const bundleFileName = `app.${bundleHash}.js`;
const bundlePath = path.join(assetsDir, bundleFileName);
fs.writeFileSync(bundlePath, bundleBuffer);

const indexTemplate = fs.readFileSync(path.join(root, "index.html"), "utf8");
const builtIndex = indexTemplate.replace("./assets/app.js", `./assets/${bundleFileName}`);
fs.writeFileSync(path.join(outdir, "index.html"), builtIndex);

const serviceWorkerTemplate = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
const builtServiceWorker = serviceWorkerTemplate
  .replace(/lifeuk-static-v[0-9.]+/g, `lifeuk-static-${bundleHash}`)
  .replace(/"\.\/assets\/app\.js"/g, `"./assets/${bundleFileName}"`)
  .replace(/"\/assets\/app\.js"/g, `"/assets/${bundleFileName}"`);
fs.writeFileSync(path.join(outdir, "service-worker.js"), builtServiceWorker);

for (const file of ["robots.txt", "sitemap.xml", ".nojekyll"]) {
  fs.copyFileSync(path.join(root, file), path.join(outdir, file));
}

if (fs.existsSync(screenshotsSrc)) {
  fs.mkdirSync(screenshotsDest, { recursive: true });
  for (const file of fs.readdirSync(screenshotsSrc)) {
    fs.copyFileSync(path.join(screenshotsSrc, file), path.join(screenshotsDest, file));
  }
}

removeDir(tempBundleDir);

console.log("Build complete: docs/");
