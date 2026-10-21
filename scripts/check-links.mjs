#!/usr/bin/env node
/**
 * Checks the static export in /out: every internal link points to a page that exists,
 * every image and asset exists, and every page has one <h1> and a <title>.
 * External links are listed for a manual look (they are not fetched).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (n === "_next") continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (n.endsWith(".html") && !/^google[0-9a-f]+\.html$/.test(n)) files.push(p); // skip Search Console verification files
  }
})(OUT);

const problems = [];
const external = new Set();
const resolve = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return join(OUT, "index.html");
  const p = join(OUT, clean);
  if (clean.endsWith("/")) return join(p, "index.html");
  return p;
};

for (const f of files) {
  const html = readFileSync(f, "utf8");
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (url.startsWith("http")) {
      if (attr === "href" && !url.includes("fonts.g") && !url.startsWith("http://localhost")) external.add(url);
      continue;
    }
    if (url.startsWith("#") || url.startsWith("mailto:") || url.startsWith("data:")) continue;
    if (!existsSync(resolve(url))) problems.push(`${f}: missing ${attr} ${url}`);
  }
  // 404 pages and the admin (a client-only app) render their heading in the browser.
  const clientOnly = f.endsWith("404.html") || f.includes("_not-found") || f.startsWith(join(OUT, "admin"));
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${f}: no <title>`);
  if (!clientOnly) {
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) problems.push(`${f}: ${h1} <h1> elements`);
  }
}

console.log(`Checked ${files.length} pages.`);
console.log(`External links (check by hand once):\n  ${[...external].sort().join("\n  ")}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log("\nAll internal links, images and headings OK.");
