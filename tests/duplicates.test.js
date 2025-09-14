import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { findNearDuplicateNameConflicts } from '../scripts/lib.js';
import allowlist from './duplicate-allowlist.json';

describe('Duplicate-like color names', () => {
  it('should not contain names that only differ by spacing/punctuation/case/accents', () => {
    const csvPath = path.resolve('./src/colornames.csv');
    const raw = fs.readFileSync(csvPath, 'utf8').replace(/\r\n/g, '\n').trimEnd();
    const lines = raw.split('\n');
    expect(lines.length).toBeGreaterThan(1);

    const header = lines.shift();
    expect(header.startsWith('name,hex')).toBe(true);

    const items = lines.map((l, idx) => {
      const lineNumber = idx + 2; // +1 for header, +1 because idx is 0-based
      if (!l.trim()) return null;
      const firstComma = l.indexOf(',');
      const name = firstComma === -1 ? l : l.slice(0, firstComma);
      return { name, lineNumber };
    }).filter(Boolean);

  const conflicts = findNearDuplicateNameConflicts(items, { allowlist });

    if (conflicts.length) {
      // Create a helpful error message with examples and hints.
      const msgLines = [
        'Found color names that normalize to the same key (case/accents/punctuation-insensitive):',
        '',
      ];
      conflicts
        // make message deterministic by sorting
        .sort((a, b) => a.norm.localeCompare(b.norm))
        .forEach(({ norm, entries }) => {
          const unique = [];
          const seen = new Set();
          // De-duplicate exact same name+line pairs in output
          for (const e of entries) {
            const key = `${e.name}@${e.lineNumber}`;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(e);
            }
          }
          // sort entries by line number for readability
          unique.sort((a, b) => a.lineNumber - b.lineNumber);
          msgLines.push(`  • ${norm}:`);
          unique.forEach((e) => msgLines.push(`      - line ${e.lineNumber}: "${e.name}"`));
        });

      msgLines.push(
        '',
        'This typically indicates near-duplicates that only differ by spacing/punctuation, like "Euro Linen" vs "Eurolinen".',
        'Please unify or remove duplicates to keep the dataset clean.',
        '',
        'Tip:',
        '  - Edit src/colornames.csv and keep a single preferred spelling.',
        '  - After changes, run: npm run sort-colors',
      );

      throw new Error(msgLines.join('\n'));
    }

    // If we reach here, no conflicts were found.
    expect(conflicts.length).toBe(0);
  });
});
