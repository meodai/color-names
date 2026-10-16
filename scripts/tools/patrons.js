// The patrons who adopted a color on names.color.pizza: all of them in
// SUPPORTERS.md, the first five in the README between <!-- patrons --> marks.
// Ranked by what they gave (never shown); the anonymous each on their own.
//
//   node scripts/tools/patrons.js

import fs from 'fs';
import { listFrom, slugsOf, pageOf, SITE } from '../site.js';

const ADOPTED = `https://media.color.pizza/data/adopted.json?t=${Date.now()}`;
const TOP = 5;
// as in names.color.pizza's src/adopter.js
const PROFILES = {
  bluesky: (by) => `https://bsky.app/profile/${by}`,
  github: (by) => `https://github.com/${by}`,
  x: (by) => `https://x.com/${by}`,
  instagram: (by) => `https://www.instagram.com/${by}/`,
  tiktok: (by) => `https://www.tiktok.com/@${by}`,
  twitch: (by) => `https://www.twitch.tv/${by}`,
  linkedin: (by) => `https://www.linkedin.com/in/${by}/`,
  website: (by) => `https://${by}/`,
};
const handle = (by, on) =>
  on === 'name' || on === 'anonymous' || on === 'website' ? by : `@${by.replace(/^@/, '')}`;
const esc = (s) => String(s).replace(/[[\]<>|*_`]/g, (c) => `\\${c}`);

const res = await fetch(process.env.ADOPTED_URL || ADOPTED, { cache: 'no-store' });
// none yet is a 404, a broken answer leaves the files as they are
if (!res.ok && res.status !== 404) throw new Error(`adopted.json: ${res.status}`);
const adopted = res.ok ? await res.json() : {};

const list = listFrom();
const slugs = slugsOf(list);
const bySlug = new Map(list.map((it) => [slugs.get(it.name), it]));

const people = new Map();
for (const [slug, a] of Object.entries(adopted)) {
  if (!(a.amount >= 5)) continue;
  const key = a.on === 'anonymous' ? `anonymous:${slug}` : `${a.on}:${a.by}`;
  const p = people.get(key) || {
    by: a.by,
    on: a.on,
    avatar: a.avatar,
    total: 0,
    first: a.at,
    colors: [],
  };
  p.total += a.amount;
  p.avatar ||= a.avatar;
  p.founding ||= a.founding;
  if (a.at < p.first) p.first = a.at;
  const it = bySlug.get(slug);
  p.colors.push({ slug, name: it?.name || slug, hex: it?.hex || '' });
  people.set(key, p);
}
const rows = [...people.values()].sort((x, y) => y.total - x.total || (x.first < y.first ? -1 : 1));

const line = (p, k) => {
  const who = PROFILES[p.on]
    ? `[${esc(handle(p.by, p.on))}](${PROFILES[p.on](p.by)})`
    : esc(handle(p.by, p.on));
  const face = p.avatar ? `<img src="${p.avatar}" width="20" height="20" alt="" /> ` : '';
  const colors = p.colors.map((c) => `[${esc(c.name)}](${pageOf(c.slug)})`).join(', ');
  return `${k + 1}. ${face}${who}${p.founding ? ' (founding patron)' : ''}: ${colors}`;
};

const invite = `Nobody yet: [be the first patron](${SITE}/adopt/) of a color.`;
const top = rows.length
  ? [
      ...rows.slice(0, TOP).map(line),
      '',
      `[All patrons](SUPPORTERS.md) · [Adopt a color](${SITE}/adopt/)`,
    ].join('\n')
  : invite;

const readme = fs.readFileSync('README.md', 'utf8');
const marked = /<!-- patrons -->[\s\S]*?<!-- patrons -->/;
if (!marked.test(readme)) throw new Error('README.md has no <!-- patrons --> marks');
fs.writeFileSync('README.md', readme.replace(marked, `<!-- patrons -->\n${top}\n<!-- patrons -->`));

fs.writeFileSync(
  'SUPPORTERS.md',
  [
    '<!-- markdownlint-disable MD013 MD033 MD041 -->',
    '',
    '# Patrons',
    '',
    `Everyone who adopted a color on [names.color.pizza](${SITE}/adopt/), keeping the list, its API and the site free for everyone. Ranked by what they gave; every color has one patron.`,
    '',
    ...(rows.length ? rows.map(line) : [invite]),
    '',
  ].join('\n')
);
console.log(`patrons: ${rows.length}`);
