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
      stopwords: [
        'of', 'the', 'and', 'a', 'an',
        'in', 'on', 'at', 'to', 'for',
        'by', 'with', 'from', 'as', 'is',
        'it', 'this', 'that', 'these', 'those',
        'be', 'are', 'was', 'were', 'or'
      ],
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
          title: 'Found {n} duplicate-like {items} (case/accents/punctuation/stopwords-insensitive):',
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
    const items = [
      { name: 'Heart Gold' },
      { name: 'Heart of Gold' },
    ];
    const stopwords = [
      'of', 'the', 'and', 'a', 'an',
      'in', 'on', 'at', 'to', 'for',
      'by', 'with', 'from', 'as', 'is',
      'it', 'this', 'that', 'these', 'those',
      'be', 'are', 'was', 'were', 'or',
    ];

    const conflicts = findNearDuplicateNameConflicts(items, {
      foldStopwords: true,
      stopwords,
    });

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].entries.length).toBe(2);
  });
});
