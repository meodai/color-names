import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCSVString } from '../scripts/lib.js';

describe('Other Format Tests', () => {
  // Load CSV data for comparison
  const csvSource = fs.readFileSync(path.resolve('./src/colornames.csv'), 'utf8').toString();
  const csvData = parseCSVString(csvSource);
  const csvColors = csvData.entries.map(entry => ({
    name: entry.name,
    hex: entry.hex
  }));

  describe('CSV Output', () => {
    it('should correctly generate CSV files', () => {
      const mainCsv = fs.readFileSync(path.resolve('./dist/colornames.csv'), 'utf8');
      const bestofCsv = fs.readFileSync(path.resolve('./dist/colornames.bestof.csv'), 'utf8');
      const shortCsv = fs.readFileSync(path.resolve('./dist/colornames.short.csv'), 'utf8');

      // Check that the files are not empty
      expect(mainCsv.length).toBeGreaterThan(0);
      expect(bestofCsv.length).toBeGreaterThan(0);
      expect(shortCsv.length).toBeGreaterThan(0);

      // Verify headers
      expect(mainCsv).toMatch(/^name,hex/);
      expect(bestofCsv).toMatch(/^name,hex/);
      expect(shortCsv).toMatch(/^name,hex/);

      // Parse the CSV files
      const mainData = parseCSVString(mainCsv);
      const bestofData = parseCSVString(bestofCsv);
      const shortData = parseCSVString(shortCsv);

      // Verify data integrity
      expect(mainData.entries.length).toBe(csvColors.length);
      expect(bestofData.entries.length).toBeLessThan(csvColors.length);
      expect(shortData.entries.length).toBeLessThan(bestofData.entries.length);

      // Verify structure
      expect(mainData.entries[0]).toHaveProperty('name');
      expect(mainData.entries[0]).toHaveProperty('hex');
    });
  });
});
