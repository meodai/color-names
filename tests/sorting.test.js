import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Ensures that the source CSV file is already sorted alphabetically (case-insensitive)
 * by the color name. If not, it throws with a helpful message telling how to fix it.
 */
describe('Source CSV sorting', () => {
  it('colornames.csv should be sorted by name (case-insensitive)', () => {
    const csvPath = path.resolve('./src/colornames.csv');
    const raw = fs.readFileSync(csvPath, 'utf8').replace(/\r\n/g, '\n').trimEnd();
    const lines = raw.split('\n');
    expect(lines.length).toBeGreaterThan(1);

    const header = lines.shift();
    expect(header.startsWith('name,hex')).toBe(true);

    const entries = lines
      .filter((l) => l.trim().length)
      .map((l, idx) => {
        const [name, hex] = l.split(',');
        return { originalIndex: idx + 2, line: l, name, lower: name.toLowerCase(), hex };
      });

    for (let i = 1; i < entries.length; i++) {
      const prev = entries[i - 1];
      const curr = entries[i];
      if (prev.lower.localeCompare(curr.lower) > 0) {
        throw new Error(
          [
            'Source file src/colornames.csv is not sorted alphabetically by name.',
            `Out of order around lines ${prev.originalIndex} -> ${curr.originalIndex}:`,
            `  "${prev.name}" should come AFTER "${curr.name}"`,
            '',
            'To fix automatically run:',
            '  npm run sort-colors',
            '',
            'Commit the updated src/colornames.csv after sorting.'
          ].join('\n')
        );
      }
    }
  });
});
