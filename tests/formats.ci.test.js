import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCSVString } from '../scripts/lib.js';
import { csvTestData } from './csv-test-data.js';

describe('Other Format Tests', () => {
  let csvColors;

  beforeAll(() => {
    // Load CSV data once for all tests
    csvTestData.load();
    csvColors = csvTestData.colors;
  });

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

  describe('TOON Output', () => {
    it('should generate TOON files alongside other formats', () => {
      const mainToon = fs.readFileSync(path.resolve('./dist/colornames.toon'), 'utf8');
      const bestofToon = fs.readFileSync(path.resolve('./dist/colornames.bestof.toon'), 'utf8');
      const shortToon = fs.readFileSync(path.resolve('./dist/colornames.short.toon'), 'utf8');

      expect(mainToon.length).toBeGreaterThan(0);
      expect(bestofToon.length).toBeGreaterThan(0);
      expect(shortToon.length).toBeGreaterThan(0);

      // Basic TOON shape: header with array length and fields, then indented rows
      expect(mainToon).toMatch(/colors\[\d+\]{name,hex}:/);
      expect(mainToon).toMatch(/\n  [^,]+,[0-9a-fA-F]{6}/);
    });
  });
});
