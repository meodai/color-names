// Where a name lives on names.color.pizza: the same slugs as the site's
// src/names.js, so a link made here opens that name's page.

import fs from 'fs';

export const SITE = 'https://names.color.pizza';

export const baseSlug = (name) =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'color';

const changed = (name, slug) => [...name.toLowerCase()].filter((ch) => !slug.includes(ch)).length;

// on a clash the fewest-changed name keeps the plain slug; others and hex-like slugs get -<hex>
export function slugsOf(items) {
  const groups = new Map();
  for (const it of items) {
    const base = baseSlug(it.name);
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push(it);
  }
  const slugs = new Map();
  for (const [base, group] of groups) {
    group.sort(
      (a, b) => changed(a.name, base) - changed(b.name, base) || (a.name < b.name ? -1 : 1)
    );
    group.forEach((it, k) => {
      const plain = k === 0 && !/^[0-9a-f]{6}$/.test(base);
      slugs.set(it.name, plain ? base : `${base}-${it.hex.replace('#', '')}`);
    });
  }
  return slugs;
}

// name,hex[,good name] lines
export const readList = (text) =>
  text
    .split('\n')
    .slice(1)
    .map((line) => line.split(','))
    .filter(([name, hex]) => name && /^#[0-9a-f]{6}$/i.test(hex))
    .map(([name, hex]) => ({ name, hex: hex.toLowerCase() }));

export const listFrom = (file = 'src/colornames.csv') => readList(fs.readFileSync(file, 'utf8'));

export const pageOf = (slug) => `${SITE}/color/${slug}/`;
