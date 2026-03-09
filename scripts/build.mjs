import fs from "fs";
import path from "path";
import esbuild from "esbuild";

const { build } = esbuild;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outdir = path.join(root, "docs");
const assetsDir = path.join(outdir, "assets");
const screenshotsSrc = path.join(root, "screenshots");
const screenshotsDest = path.join(outdir, "screenshots");

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
fs.mkdirSync(assetsDir, { recursive: true });

await build({
  entryPoints: [path.join(root, "src", "main.jsx")],
  outfile: path.join(assetsDir, "app.js"),
  bundle: true,
  format: "esm",
  jsx: "automatic",
  target: ["es2018"],
  minify: true,
  sourcemap: false,
});

for (const file of ["index.html", "service-worker.js", "robots.txt", "sitemap.xml", ".nojekyll"]) {
  fs.copyFileSync(path.join(root, file), path.join(outdir, file));
}

if (fs.existsSync(screenshotsSrc)) {
  fs.mkdirSync(screenshotsDest, { recursive: true });
  for (const file of fs.readdirSync(screenshotsSrc)) {
    fs.copyFileSync(path.join(screenshotsSrc, file), path.join(screenshotsDest, file));
  }
}

console.log("Build complete: docs/");
