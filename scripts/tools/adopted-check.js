// Adopted colors whose page would go away: a name renamed or removed, or one whose page moves
// to another address, loses its adoption on names.color.pizza (adoptions follow the page).
// Run by .github/workflows/adopted.yml; prints one line per adopted page lost, exits 1 if any.
//
//   node scripts/tools/adopted-check.js <before sha> <after sha>

import { execFileSync } from 'child_process';
import { readList, slugsOf, pageOf } from '../site.js';

const [before, after] = process.argv.slice(2);
const at = (sha) =>
  execFileSync('git', ['show', `${sha}:src/colornames.csv`], { encoding: 'utf8' });

const res = await fetch(`https://media.color.pizza/data/adopted.json?t=${Date.now()}`);
if (!res.ok) {
  console.log(`::warning::Could not read the adoptions (${res.status}); nothing checked.`);
  process.exit(0);
}
const adopted = await res.json();

const was = slugsOf(readList(at(before)));
const now = new Set(slugsOf(readList(at(after))).values());
const lost = [...was].filter(([, slug]) => adopted[slug] && !now.has(slug));

for (const [name, slug] of lost) {
  console.log(`::error file=src/colornames.csv::"${name}" is adopted, and its page ${pageOf(slug)} would go away. Keep the name, or move the adoption.`);
}
process.exit(lost.length ? 1 : 0);
