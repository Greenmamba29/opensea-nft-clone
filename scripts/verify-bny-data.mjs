#!/usr/bin/env node
// Data-integrity check for the BNY 50-storefronts program: every roster entry
// in research/bny-top50.json must appear in both src/lib/bnyRoster.ts and
// src/lib/bnyShowcase.ts, with a valid aisle slug. Exit 1 on any gap.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const roster = readFileSync(join(ROOT, "src/lib/bnyRoster.ts"), "utf8");
const showcase = readFileSync(join(ROOT, "src/lib/bnyShowcase.ts"), "utf8");
const json = JSON.parse(readFileSync(join(ROOT, "research/bny-top50.json"), "utf8"));

const AISLES = [
  "packaging", "fabrication", "electronics", "apparel-merch",
  "food-beverage", "office-services", "logistics", "local-brands",
];

let pass = 0;
const fail = [];
for (const e of json) {
  const inRoster = roster.includes(`"${e.slug}"`);
  const inShowcase = showcase.includes(`"${e.slug}"`);
  if (inRoster && inShowcase) pass++;
  else fail.push(`${e.slug}${inRoster ? "" : " [missing in roster]"}${inShowcase ? "" : " [missing in showcase]"}`);
}
const badAisles = json.filter((e) => !AISLES.includes(e.aisle)).map((e) => e.slug);

console.log(`JSON entries: ${json.length}`);
console.log(`Present in roster + showcase: ${pass}`);
console.log(`Missing: ${fail.length ? fail.join(", ") : "none"}`);
console.log(`Invalid aisles: ${badAisles.length ? badAisles.join(", ") : "none"}`);

process.exit(fail.length || badAisles.length || json.length !== 50 ? 1 : 0);
