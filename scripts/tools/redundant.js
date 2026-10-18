// Names that only add a color word to another name on the list, "Hunter" and "Hunter Green":
// a pair each, the closest colors first, as the likeliest to be one color named twice.
// On demand only, nothing runs it:
//
//   npm run redundant              every pair
//   npm run redundant -- green     only pairs whose extra word is one of these
//
// Pairs meant to stay, both names kept, are in redundant-keep.json as "Name | Longer Name".

import fs from 'fs';
import { listFrom } from '../site.js';

const keep = new Set(JSON.parse(fs.readFileSync(new URL('./redundant-keep.json', import.meta.url), 'utf8')));

const WORDS = `red orange yellow green blue purple violet pink brown black white grey gray
  cyan magenta teal turquoise beige tan cream ivory gold golden silver bronze copper
  maroon navy olive lime indigo lavender lilac mauve rose ochre umber sienna khaki
  aqua azure scarlet crimson amber coral salmon peach mint jade emerald ruby sapphire
  burgundy plum charcoal slate sand rust blush`.split(/\s+/);

const only = process.argv.slice(2).map((w) => w.toLowerCase());
const extra = new Set(only.length ? only : WORDS);

// sRGB to OKLab, for how far apart two colors look
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklab(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787995 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const apart = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i])) * 100;

const list = listFrom();
const byName = new Map(list.map((it) => [it.name.toLowerCase(), it]));
const pairs = [];
for (const it of list) {
  const words = it.name.split(' ');
  if (words.length < 2) continue;
  // the color word at either end: "Hunter Green", "Green Hunter"
  for (const [word, rest] of [
    [words.at(-1), words.slice(0, -1)],
    [words[0], words.slice(1)],
  ]) {
    const short = byName.get(rest.join(' ').toLowerCase());
    if (extra.has(word.toLowerCase()) && short && !keep.has(`${short.name} | ${it.name}`)) pairs.push({ short, long: it, d: apart(short.hex, it.hex) });
  }
}
pairs.sort((a, b) => a.d - b.d);
for (const { short, long, d } of pairs)
  console.log(`${d.toFixed(1).padStart(5)}  ${short.name} ${short.hex}  ·  ${long.name} ${long.hex}`);
console.error(`${pairs.length} pairs; the number is how far apart the two colors look (OKLab × 100, under ~3 hard to tell apart)`);
