import { describe, it, expect, beforeAll } from 'vitest';
import { findNearDuplicateNameConflicts, findDuplicates } from '../scripts/lib.js';
import allowlist from './duplicate-allowlist.json';
import pluralAllowlist from './duplicate-plurals-allowlist.json';
import { csvTestData } from './csv-test-data.js';

describe('Duplicate-like color names', () => {
  beforeAll(() => {
    // Load CSV data once for all tests
    csvTestData.load();
  });

  it('should not contain names that only differ by spacing/punctuation/case/accents', () => {
    expect(csvTestData.lineCount).toBeGreaterThan(1);

    const conflicts = findNearDuplicateNameConflicts(csvTestData.items, {
      allowlist,
      foldPlurals: true,
      pluralAllowlist,
    });

    if (conflicts.length) {
      // Create a helpful error message with examples and hints.
      const groupCount = conflicts.length;
      const msgLines = [
        `⛔ Found ${groupCount} duplicate-like group${groupCount === 1 ? '' : 's'} (case/accents/punctuation-insensitive):`,
        '',
      ];

      // Create a quick summary like build.js does
      const allOffendingNames = [];
      conflicts.forEach(({ entries }) => {
        entries.forEach((e) => allOffendingNames.push(e.name));
      });
      const nameList = [...new Set(allOffendingNames)].join(', ');
      msgLines.push(`Offending name(s): ${nameList}`);
      msgLines.push('*-------------------------*');
      msgLines.push('');

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
          msgLines.push('');
        });

      msgLines.push(
        '',
        'This typically indicates near-duplicates that only differ by spacing/punctuation, like "Snow Pink" vs "Snowpink".',
        'Please unify or remove duplicates to keep the dataset clean.',
        '',
        'Tip:',
        '  - Edit src/colornames.csv and keep a single preferred spelling. When in doubt, prefer the most common or simplest form or the British spelling.',
        '  - After changes, run: npm run sort-colors',
        '',
        '*-------------------------*'
      );

      throw new Error(msgLines.join('\n'));
    }

    // If we reach here, no conflicts were found.
    expect(conflicts.length).toBe(0);
  });

  it('should not contain duplicate hex codes', () => {
    // Find duplicates in hex values
    const hexDuplicates = findDuplicates(csvTestData.data.values['hex']);

    if (hexDuplicates.length) {
      // Create detailed error message like build.js
      const msgLines = [
        `⛔ Found ${hexDuplicates.length} duplicate hex code${hexDuplicates.length === 1 ? '' : 's'}:`,
        '',
      ];

      // Create a quick summary
      const nameList = hexDuplicates.join(', ');
      msgLines.push(`Offending hex code(s): ${nameList}`);
      msgLines.push('*-------------------------*');
      msgLines.push('');

      // Find which entries have these duplicate hex codes
      hexDuplicates.forEach((duplicateHex) => {
        const entriesWithHex = csvTestData.data.entries
          .map((entry, index) => ({ ...entry, lineNumber: index + 2 })) // +2 for header and 0-based index
          .filter((entry) => entry.hex === duplicateHex);

        msgLines.push(`  • ${duplicateHex}:`);
        entriesWithHex.forEach((entry) => {
          msgLines.push(`      - line ${entry.lineNumber}: "${entry.name}" (${entry.hex})`);
        });
        msgLines.push('');
      });

      msgLines.push(
        '',
        'Duplicate hex codes indicate multiple color names pointing to the same exact color.',
        'Please remove duplicates or consolidate to a single preferred name.',
        '',
        'Tip:',
        '  - Edit src/colornames.csv and keep only one entry per hex code',
        '  - When in doubt, prefer the most common or descriptive name',
        '',
        '*-------------------------*'
      );

      throw new Error(msgLines.join('\n'));
    }

    expect(hexDuplicates.length).toBe(0);
  });
});
