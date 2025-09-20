import { describe, it, expect, beforeAll } from 'vitest';
import { csvTestData } from './csv-test-data.js';
import { buildFailureMessage } from './_utils/report.js';

describe('CSV Data Validations', () => {
  const bestOfKey = 'good name';

  // Validation patterns from build.js
  const hexColorValidation = /^#[0-9a-f]{6}$/;
  const spacesValidation = /^\s+|\s{2,}|\s$/;
  const quoteValidation = /"|'|`/;

  beforeAll(() => {
    // Load CSV data once for all tests
    csvTestData.load();
  });

  it('should contain only valid 6-character hex color codes', () => {
    const invalidHexCodes = [];

    csvTestData.data.values['hex'].forEach((hex, index) => {
      if (!hexColorValidation.test(hex)) {
        const entry = csvTestData.data.entries[index];
        invalidHexCodes.push({
          hex,
          name: entry.name,
          lineNumber: index + 2, // +2 for header and 0-based index
        });
      }
    });

    if (invalidHexCodes.length) {
      const details = invalidHexCodes.map(
        ({ hex, name, lineNumber }) => `  * line ${lineNumber}: "${name}" -> ${hex}`
      );
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} invalid hex color {items}:',
          offenders: invalidHexCodes.map((i) => i.hex),
          offenderLabel: 'code',
          details: [
            ...details,
            '',
            'Hex codes must be exactly 6 characters long (no shorthand) and contain only lowercase letters a-f and numbers 0-9.',
            'Examples of valid hex codes: #ff0000, #a1b2c3, #000000',
            'Examples of invalid hex codes: #f00 (too short), #FF0000 (uppercase), #gghhii (invalid characters)',
          ],
          tips: [
            'Edit src/colornames.csv and fix the hex values',
            'Use lowercase letters only: a-f',
            'Always use 6 characters: #rrggbb format',
            'After changes, run: npm run sort-colors',
          ],
        })
      );
    }

    expect(invalidHexCodes.length).toBe(0);
  });

  it('should not contain color names with invalid spacing', () => {
    const invalidNames = [];

    csvTestData.data.values['name'].forEach((name, index) => {
      if (spacesValidation.test(name)) {
        const entry = csvTestData.data.entries[index];
        invalidNames.push({
          name,
          hex: entry.hex,
          lineNumber: index + 2, // +2 for header and 0-based index
        });
      }
    });

    if (invalidNames.length) {
      const details = invalidNames.map(
        ({ name, hex, lineNumber }) => `  * line ${lineNumber}: "${name}" (${hex})`
      );
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} color {items} with invalid spacing:',
          offenders: invalidNames.map((i) => `"${i.name}"`),
          offenderLabel: 'name',
          details: [
            ...details,
            '',
            'Color names cannot have leading spaces, trailing spaces, or multiple consecutive spaces.',
            'This ensures consistent formatting and prevents parsing issues.',
          ],
          tips: [
            'Edit src/colornames.csv and remove extra spaces',
            'Use single spaces between words only',
            'After changes, run: npm run sort-colors',
          ],
        })
      );
    }

    expect(invalidNames.length).toBe(0);
  });

  it('should not contain color names with quote characters', () => {
    const invalidNames = [];

    csvTestData.data.values['name'].forEach((name, index) => {
      if (quoteValidation.test(name)) {
        const entry = csvTestData.data.entries[index];
        invalidNames.push({
          name,
          hex: entry.hex,
          lineNumber: index + 2, // +2 for header and 0-based index
        });
      }
    });

    if (invalidNames.length) {
      const details = invalidNames.map(
        ({ name, hex, lineNumber }) => `  * line ${lineNumber}: "${name}" (${hex})`
      );
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} color {items} with quote characters:',
          offenders: invalidNames.map((i) => `"${i.name}"`),
          offenderLabel: 'name',
          details: [
            ...details,
            '',
            'Color names should not contain double quotes or backticks.',
            'Use apostrophes instead of double quotes for possessives or contractions.',
          ],
          tips: [
            'Edit src/colornames.csv and replace quote characters',
            'Use apostrophes for possessives; avoid double quotes in names',
            'After changes, run: npm run sort-colors',
          ],
        })
      );
    }

    expect(invalidNames.length).toBe(0);
  });

  it('should have valid "good name" markers', () => {
    const invalidMarkers = [];

    if (csvTestData.data.values[bestOfKey]) {
      csvTestData.data.values[bestOfKey].forEach((marker, index) => {
        // Check for spacing issues
        if (spacesValidation.test(marker)) {
          const entry = csvTestData.data.entries[index];
          invalidMarkers.push({
            marker,
            name: entry.name,
            hex: entry.hex,
            lineNumber: index + 2,
            issue: 'invalid spacing',
          });
        }

        // Check for invalid values (must be 'x' or empty)
        if (!(marker === 'x' || marker === '')) {
          const entry = csvTestData.data.entries[index];
          invalidMarkers.push({
            marker,
            name: entry.name,
            hex: entry.hex,
            lineNumber: index + 2,
            issue: 'invalid value',
          });
        }
      });
    }

    if (invalidMarkers.length) {
      const spacingIssues = invalidMarkers.filter((item) => item.issue === 'invalid spacing');
      const valueIssues = invalidMarkers.filter((item) => item.issue === 'invalid value');

      const details = [];
      if (spacingIssues.length) {
        details.push('  Spacing issues:');
        spacingIssues.forEach(({ marker, name, lineNumber }) => {
          details.push(`    * line ${lineNumber}: "${name}" -> "${marker}"`);
        });
        details.push('');
      }
      if (valueIssues.length) {
        details.push('  Invalid values:');
        valueIssues.forEach(({ marker, name, lineNumber }) => {
          details.push(`    * line ${lineNumber}: "${name}" -> "${marker}"`);
        });
        details.push('');
      }

      throw new Error(
        buildFailureMessage({
          title: 'Found {n} invalid "good name" {items}:',
          offenders: invalidMarkers.map((m) => `"${m.marker}"`),
          offenderLabel: 'marker',
          details: [
            ...details,
            '',
            'The "good name" column must contain either:',
            '  - lowercase "x" to mark a color as a good/recommended name',
            '  - empty string (blank) for regular colors',
            '',
            'No spaces, uppercase letters, or other characters are allowed.',
          ],
          tips: [
            'Edit src/colornames.csv and fix the "good name" column',
            'Use lowercase "x" or leave blank',
            'After changes, run: npm run sort-colors',
          ],
        })
      );
    }

    expect(invalidMarkers.length).toBe(0);
  });
});
