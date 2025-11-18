import { describe, it, expect, beforeAll } from 'vitest';
import { findNearDuplicateNameConflicts, findDuplicates } from '../scripts/lib.js';
import allowlist from './duplicate-allowlist.json';
import pluralAllowlist from './duplicate-plurals-allowlist.json';
import { csvTestData } from './csv-test-data.js';
import { buildFailureMessage } from './_utils/report.js';

describe('Duplicate-like color names', () => {
  beforeAll(() => {
    // Load CSV data once for all tests
    csvTestData.load();
  });

  // Shared stopwords for normalization across tests
  const STOPWORDS = [
    'of',
    'the',
    'and',
    'a',
    'an',
    'in',
    'on',
    'at',
    'to',
    'for',
    'by',
    'with',
    'from',
    'as',
    'is',
    'it',
    'this',
    'that',
    'these',
    'those',
    'be',
    'are',
    'was',
    'were',
    'or',
  ];

  // Helper: normalize a phrase similar to scripts/lib normalization but keeping token boundaries
  const normalize = (s) =>
    String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const tokenize = (name) => {
    const base = normalize(name);
    const tokens = base.match(/[a-z0-9]+/g) || [];
    const stopSet = new Set(STOPWORDS.map((w) => normalize(w)));
    return tokens.filter((t) => t && !stopSet.has(t));
  };

  // Detect two-word names that are exact reversals of each other (after stopword filtering)
  function findTwoWordReversedPairs(items) {
    const groups = new Map(); // key: sorted pair "a|b" -> list of { name, lineNumber, order: "a b" }

    for (const item of items) {
      if (!item || typeof item.name !== 'string') continue;
      const tokens = tokenize(item.name);
      if (tokens.length !== 2) continue; // only 2-token (after stopword removal)
      const [a, b] = tokens;
      if (!a || !b) continue;
      if (a === b) continue; // "blue blue" reversed is the same – ignore

      const key = [a, b].sort().join('|');
      const order = `${a} ${b}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ name: item.name, lineNumber: item.lineNumber, order });
    }

    // Build allowlist set once
    const allowSet = new Set(
      (Array.isArray(allowlist) ? allowlist : [])
        .filter((v) => typeof v === 'string' && v.trim().length)
        .map((v) => normalize(v))
    );

    const conflicts = [];
    for (const [key, entries] of groups.entries()) {
      // We have a potential conflict if we see both orders "a b" and "b a"
      const uniqOrders = [...new Set(entries.map((e) => e.order))];
      if (uniqOrders.length < 2) continue;

      const [t1, t2] = key.split('|');
      const forward = `${t1} ${t2}`;
      const backward = `${t2} ${t1}`;

      const hasForward = uniqOrders.includes(forward);
      const hasBackward = uniqOrders.includes(backward);

      if (hasForward && hasBackward) {
        // Keep entries unique by name@line and sorted by line number for stable output
        const seen = new Set();
        const unique = entries
          .filter((e) => {
            const k = `${e.name}@${e.lineNumber}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
          })
          .sort((a, b) => a.lineNumber - b.lineNumber);

        // Respect allowlist: check if any of the actual names are allowlisted
        const hasAllowlisted = unique.some((e) => allowSet.has(normalize(e.name)));
        if (hasAllowlisted) continue;

        conflicts.push({ key, tokens: [t1, t2], entries: unique });
      }
    }

    return conflicts;
  }

  it('should not contain the same name twice', () => {
    expect(csvTestData.lineCount).toBeGreaterThan(1);

    const duplicates = findDuplicates(csvTestData.data.values['name']);

    if (duplicates.length) {
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} duplicate {items}:',
          offenders: duplicates,
          offenderLabel: 'name',
          details: [
            'Exact duplicate names are not allowed.',
            'Please remove duplicates or consolidate to a single preferred name.',
          ],
          tips: [
            'Edit src/colornames.csv and keep only one entry per name',
            'When in doubt, prefer the most common or descriptive name',
          ],
        })
      );
    }

    expect(duplicates.length).toBe(0);
  });

  it('should not contain names that only differ by spacing/punctuation/case/accents/stopwords', () => {
    expect(csvTestData.lineCount).toBeGreaterThan(1);

    const conflicts = findNearDuplicateNameConflicts(csvTestData.items, {
      allowlist,
      foldPlurals: true,
      pluralAllowlist,
      foldStopwords: true,
      stopwords: STOPWORDS,
    });

    if (conflicts.length) {
      // Create a summary of all names across conflict groups
      const allOffendingNames = new Set();
      conflicts.forEach(({ entries }) => entries.forEach((e) => allOffendingNames.add(e.name)));

      // Build detailed section: groups with line numbers (stable + unique)
      const details = [];
      conflicts
        .sort((a, b) => a.norm.localeCompare(b.norm))
        .forEach(({ norm, entries }) => {
          const unique = [];
          const seen = new Set();
          for (const e of entries) {
            const key = `${e.name}@${e.lineNumber}`;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(e);
            }
          }
          unique.sort((a, b) => a.lineNumber - b.lineNumber);
          details.push(`  • ${norm}:`);
          unique.forEach((e) => details.push(`      - line ${e.lineNumber}: "${e.name}"`));
          details.push('');
        });

      throw new Error(
        buildFailureMessage({
          title:
            'Found {n} duplicate-like {items} (case/accents/punctuation/stopwords-insensitive):',
          offenders: [...allOffendingNames],
          offenderLabel: 'name',
          details: [
            ...details,
            'This typically indicates near-duplicates that only differ by spacing/punctuation, like "Snow Pink" vs "Snowpink".',
            'Please unify or remove duplicates to keep the dataset clean.',
          ],
          tips: [
            'Edit src/colornames.csv and keep a single preferred spelling. When in doubt, prefer the most common or simplest form or the British spelling.',
            'After changes, run: npm run sort-colors',
          ],
          count: conflicts.length,
        })
      );
    }

    // If we reach here, no conflicts were found.
    expect(conflicts.length).toBe(0);
  });

  it('should not contain duplicate hex codes', () => {
    // Find duplicates in hex values
    const hexDuplicates = findDuplicates(csvTestData.data.values['hex']);

    if (hexDuplicates.length) {
      const details = [];
      hexDuplicates.forEach((duplicateHex) => {
        const entriesWithHex = csvTestData.data.entries
          .map((entry, index) => ({ ...entry, lineNumber: index + 2 }))
          .filter((entry) => entry.hex === duplicateHex);

        details.push(`  • ${duplicateHex}:`);
        entriesWithHex.forEach((entry) => {
          details.push(`      - line ${entry.lineNumber}: "${entry.name}" (${entry.hex})`);
        });
        details.push('');
      });

      throw new Error(
        buildFailureMessage({
          title: 'Found {n} duplicate {items}:',
          offenders: hexDuplicates,
          offenderLabel: 'hex code',
          details: [
            ...details,
            'Duplicate hex codes indicate multiple color names pointing to the same exact color.',
            'Please remove duplicates or consolidate to a single preferred name.',
          ],
          tips: [
            'Edit src/colornames.csv and keep only one entry per hex code',
            'When in doubt, prefer the most common or descriptive name',
          ],
        })
      );
    }

    expect(hexDuplicates.length).toBe(0);
  });

  it('should detect names that only differ by stopwords when enabled', () => {
    const items = [{ name: 'Heart Gold' }, { name: 'Heart of Gold' }];
    const conflicts = findNearDuplicateNameConflicts(items, {
      foldStopwords: true,
      stopwords: STOPWORDS,
    });

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].entries.length).toBe(2);
  });

  it('should treat different forms of "and" as near-duplicates when stopword folding is enabled', () => {
    const items = [
      { name: 'Berries and Cream' },
      { name: 'Berries n Cream' },
      { name: 'Berries & Cream' },
      { name: 'Berries + Cream' },
    ];

    const conflicts = findNearDuplicateNameConflicts(items, {
      foldStopwords: true,
      stopwords: STOPWORDS,
    });

    // All variants should collapse into a single conflict group
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].entries.length).toBe(4);
  });

  it('should treat numeral/phonetic swaps (2/to, 4/for, u/you, r/are) as near-duplicates', () => {
    const items1 = [
      { name: 'Back to the Future' },
      { name: 'Back 2 the Future' },
    ];
    const items2 = [
      { name: 'Music for the People' },
      { name: 'Music 4 the People' },
    ];
    const items3 = [
      { name: 'Songs for You' },
      { name: 'Songs 4 U' },
    ];
    const items4 = [
      { name: 'We Are the Champions' },
      { name: 'We R the Champions' },
    ];

    const opts = { foldStopwords: true, stopwords: STOPWORDS };
    expect(findNearDuplicateNameConflicts(items1, opts).length).toBe(1);
    expect(findNearDuplicateNameConflicts(items2, opts).length).toBe(1);
    expect(findNearDuplicateNameConflicts(items3, opts).length).toBe(1);
    expect(findNearDuplicateNameConflicts(items4, opts).length).toBe(1);
  });

  it('should treat symbol/slashed forms (@/at, w//with, w/o/without) as near-duplicates', () => {
    const items1 = [
      { name: 'Meet at the Park' },
      { name: 'Meet @ the Park' },
    ];
    const items2 = [
      { name: 'Coffee with Cream' },
      { name: 'Coffee w/ Cream' },
    ];
    const items3 = [
      { name: 'Coffee without Sugar' },
      { name: 'Coffee w/o Sugar' },
    ];

    const opts = { foldStopwords: true, stopwords: STOPWORDS };
    expect(findNearDuplicateNameConflicts(items1, opts).length).toBe(1);
    expect(findNearDuplicateNameConflicts(items2, opts).length).toBe(1);
    expect(findNearDuplicateNameConflicts(items3, opts).length).toBe(1);
  });

  // Intentionally not normalizing marketing spellings (lite/thru/nite) or business suffixes globally

  it('should not contain two-word names that are exact reversals of each other', () => {
    expect(csvTestData.lineCount).toBeGreaterThan(1);

    const conflicts = findTwoWordReversedPairs(csvTestData.items);

    if (conflicts.length) {
      // Build helpful details with line numbers
      const details = [];
      const offenderNames = new Set();

      conflicts
        .sort((a, b) => a.tokens.join(' ').localeCompare(b.tokens.join(' ')))
        .forEach(({ tokens, entries }) => {
          const [a, b] = tokens;
          details.push(`  • ${a} / ${b}:`);
          entries.forEach((e) => {
            offenderNames.add(e.name);
            details.push(`      - line ${e.lineNumber}: "${e.name}"`);
          });
          details.push('');
        });

      throw new Error(
        buildFailureMessage({
          title: 'Found {n} word-order reversed {items}:',
          offenders: [...offenderNames],
          offenderLabel: 'name',
          details: [
            ...details,
            'Names that only differ by word order (e.g., "Beach Sand" vs "Sand Beach") should be unified.',
            'Please keep a single preferred order and remove the other.',
          ],
          tips: [
            'Edit src/colornames.csv and keep only one order for each two-word pair.',
            'After changes, run: npm run sort-colors',
          ],
          count: conflicts.length,
        })
      );
    }

    expect(conflicts.length).toBe(0);
  });
});
