import { describe, it, expect, beforeAll } from 'vitest';
import { csvTestData } from './csv-test-data.js';
import duplicateAllowlist from './duplicate-allowlist.json';
import duplicatePluralsAllowlist from './duplicate-plurals-allowlist.json';
import primaryDistanceAllowlist from './primary-distance-allowlist.json';
import protectedTargets from './protected-targets.json';
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

  it('should ensure all entries in primary-distance-allowlist.json exist in colornames.csv', () => {
    const missingEntries = primaryDistanceAllowlist.filter(name => !allColorNames.has(name));

    if (missingEntries.length) {
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} unused {items} in primary-distance-allowlist.json:',
          offenders: missingEntries,
          offenderLabel: 'entry',
          details: [
            'These names are listed in the allowlist but do not exist in src/colornames.csv.',
            'Please remove them from tests/primary-distance-allowlist.json to keep the list clean.',
          ],
        })
      );
    }
    expect(missingEntries.length).toBe(0);
  });

  it('should ensure protected-targets.json has valid, unique hex entries', () => {
    const offenders = [];
    const hexSet = new Set();
    const hexPattern = /^#[0-9a-f]{6}$/;

    protectedTargets.forEach((t, i) => {
      const index = i + 1;

      if (!t || typeof t !== 'object') {
        offenders.push(`Entry ${index}: must be an object`);
        return;
      }

      if (typeof t.name !== 'string' || !t.name.trim()) {
        offenders.push(`Entry ${index}: missing non-empty "name"`);
      }

      if (typeof t.hex !== 'string' || !hexPattern.test(t.hex)) {
        offenders.push(`Entry ${index}: invalid "hex" (${String(t.hex)})`);
      } else if (hexSet.has(t.hex)) {
        offenders.push(`Entry ${index}: duplicate "hex" (${t.hex})`);
      } else {
        hexSet.add(t.hex);
      }
    });

    if (offenders.length) {
      throw new Error(
        buildFailureMessage({
          title: 'Found {n} invalid {items} in protected-targets.json:',
          offenders,
          offenderLabel: 'entry',
          details: [
            'Each entry must be an object with { name, hex }.',
            'Hex must be lowercase and in the form "#rrggbb" and unique across the list.',
          ],
        })
      );
    }

    expect(offenders.length).toBe(0);
  });
});
