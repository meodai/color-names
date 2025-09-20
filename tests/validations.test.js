import { describe, it, expect, beforeAll } from 'vitest';
import { csvTestData } from './csv-test-data.js';

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
      const msgLines = [
        `⛔ Found ${invalidHexCodes.length} invalid hex color code${invalidHexCodes.length === 1 ? '' : 's'}:`,
        '',
      ];

      // Create a quick summary
      const hexList = invalidHexCodes.map((item) => item.hex).join(', ');
      msgLines.push(`Offending hex code(s): ${hexList}`);
      msgLines.push('*-------------------------*');
      msgLines.push('');

      // Detailed breakdown
      invalidHexCodes.forEach(({ hex, name, lineNumber }) => {
        msgLines.push(`  • line ${lineNumber}: "${name}" -> ${hex}`);
      });

      msgLines.push(
        '',
        'Hex codes must be exactly 6 characters long (no shorthand) and contain only lowercase letters a-f and numbers 0-9.',
        'Examples of valid hex codes: #ff0000, #a1b2c3, #000000',
        'Examples of invalid hex codes: #f00 (too short), #FF0000 (uppercase), #gghhii (invalid characters)',
        '',
        'Tip:',
        '  - Edit src/colornames.csv and fix the hex values',
        '  - Use lowercase letters only: a-f',
        '  - Always use 6 characters: #rrggbb format',
        '  - After changes, run: npm run sort-colors',
        '',
        '*-------------------------*'
      );

      throw new Error(msgLines.join('\n'));
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
      const msgLines = [
        `⛔ Found ${invalidNames.length} color name${invalidNames.length === 1 ? '' : 's'} with invalid spacing:`,
        '',
      ];

      // Create a quick summary
      const nameList = invalidNames.map((item) => `"${item.name}"`).join(', ');
      msgLines.push(`Offending name(s): ${nameList}`);
      msgLines.push('*-------------------------*');
      msgLines.push('');

      // Detailed breakdown
      invalidNames.forEach(({ name, hex, lineNumber }) => {
        msgLines.push(`  • line ${lineNumber}: "${name}" (${hex})`);
      });

      msgLines.push(
        '',
        'Color names cannot have leading spaces, trailing spaces, or multiple consecutive spaces.',
        'This ensures consistent formatting and prevents parsing issues.',
        '',
        'Tip:',
        '  - Edit src/colornames.csv and remove extra spaces',
        '  - Use single spaces between words only',
        '  - After changes, run: npm run sort-colors',
        '',
        '*-------------------------*'
      );

      throw new Error(msgLines.join('\n'));
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
      const msgLines = [
        `⛔ Found ${invalidNames.length} color name${invalidNames.length === 1 ? '' : 's'} with quote characters:`,
        '',
      ];

      // Create a quick summary
      const nameList = invalidNames.map((item) => `"${item.name}"`).join(', ');
      msgLines.push(`Offending name(s): ${nameList}`);
      msgLines.push('*-------------------------*');
      msgLines.push('');

      // Detailed breakdown
      invalidNames.forEach(({ name, hex, lineNumber }) => {
        msgLines.push(`  • line ${lineNumber}: "${name}" (${hex})`);
      });

      msgLines.push(
        '',
        'Color names should not contain quote characters (", \', `).',
        "Use apostrophes (') instead of quotes for possessives or contractions.",
        '',
        'Tip:',
        '  - Edit src/colornames.csv and replace quote characters',
        '  - Use apostrophes (\') for possessives: "Artist\'s Blue" not "Artist"s Blue"',
        '  - After changes, run: npm run sort-colors',
        '',
        '*-------------------------*'
      );

      throw new Error(msgLines.join('\n'));
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
      const msgLines = [
        `⛔ Found ${invalidMarkers.length} invalid "good name" marker${invalidMarkers.length === 1 ? '' : 's'}:`,
        '',
      ];

      // Create a quick summary
      const markerList = invalidMarkers.map((item) => `"${item.marker}"`).join(', ');
      msgLines.push(`Offending marker(s): ${markerList}`);
      msgLines.push('*-------------------------*');
      msgLines.push('');

      // Group by issue type for better organization
      const spacingIssues = invalidMarkers.filter((item) => item.issue === 'invalid spacing');
      const valueIssues = invalidMarkers.filter((item) => item.issue === 'invalid value');

      if (spacingIssues.length) {
        msgLines.push('  Spacing issues:');
        spacingIssues.forEach(({ marker, name, lineNumber }) => {
          msgLines.push(`    • line ${lineNumber}: "${name}" -> "${marker}"`);
        });
        msgLines.push('');
      }

      if (valueIssues.length) {
        msgLines.push('  Invalid values:');
        valueIssues.forEach(({ marker, name, lineNumber }) => {
          msgLines.push(`    • line ${lineNumber}: "${name}" -> "${marker}"`);
        });
        msgLines.push('');
      }

      msgLines.push(
        '',
        'The "good name" column must contain either:',
        '  - lowercase "x" to mark a color as a good/recommended name',
        '  - empty string (blank) for regular colors',
        '',
        'No spaces, uppercase letters, or other characters are allowed.',
        '',
        'Tip:',
        '  - Edit src/colornames.csv and fix the "good name" column',
        '  - Use lowercase "x" or leave blank',
        '  - After changes, run: npm run sort-colors',
        '',
        '*-------------------------*'
      );

      throw new Error(msgLines.join('\n'));
    }

    expect(invalidMarkers.length).toBe(0);
  });
});
