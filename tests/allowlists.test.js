import { describe, it, expect, beforeAll } from 'vitest';
import { csvTestData } from './csv-test-data.js';
import duplicateAllowlist from './duplicate-allowlist.json';
import duplicatePluralsAllowlist from './duplicate-plurals-allowlist.json';
import titleCaseAllowlist from './title-case-allowlist.json';
import { buildFailureMessage } from './_utils/report.js';

describe('Allowlists Validation', () => {
  beforeAll(() => {
    // Load CSV data once for all tests
    csvTestData.load();
  });

  const allColorNames = new Set();

  beforeAll(() => {
    csvTestData.data.values['name'].forEach(name => allColorNames.add(name));
  });

  it('should ensure all entries in duplicate-allowlist.json exist in colornames.csv', () => {
    const missingEntries = duplicateAllowlist.filter(name => !allColorNames.has(name));

    if (missingEntries.length) {
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} unused {items} in duplicate-allowlist.json:',
          offenders: missingEntries,
          offenderLabel: 'entry',
          details: [
            'These names are listed in the allowlist but do not exist in src/colornames.csv.',
            'Please remove them from tests/duplicate-allowlist.json to keep the list clean.',
          ],
        })
      );
    }
    expect(missingEntries.length).toBe(0);
  });

  it('should ensure all entries in duplicate-plurals-allowlist.json exist in colornames.csv', () => {
    const missingEntries = duplicatePluralsAllowlist.filter(name => !allColorNames.has(name));

    if (missingEntries.length) {
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} unused {items} in duplicate-plurals-allowlist.json:',
          offenders: missingEntries,
          offenderLabel: 'entry',
          details: [
            'These names are listed in the allowlist but do not exist in src/colornames.csv.',
            'Please remove them from tests/duplicate-plurals-allowlist.json to keep the list clean.',
          ],
        })
      );
    }
    expect(missingEntries.length).toBe(0);
  });

  it('should ensure all entries in title-case-allowlist.json exist in colornames.csv', () => {
    const missingEntries = titleCaseAllowlist.filter(name => !allColorNames.has(name));

    if (missingEntries.length) {
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} unused {items} in title-case-allowlist.json:',
          offenders: missingEntries,
          offenderLabel: 'entry',
          details: [
            'These names are listed in the allowlist but do not exist in src/colornames.csv.',
            'Please remove them from tests/title-case-allowlist.json to keep the list clean.',
          ],
        })
      );
    }
    expect(missingEntries.length).toBe(0);
  });
});
