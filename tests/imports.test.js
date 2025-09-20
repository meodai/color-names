import { describe, it, expect, beforeAll } from 'vitest';

import * as esmColors from '../dist/colornames.esm.js';
import * as esmBestOfColors from '../dist/colornames.bestof.esm.js';
import * as esmShortColors from '../dist/colornames.short.esm.js';

// Import JSON files directly
import jsonColors from '../dist/colornames.json' assert { type: 'json' };
import jsonBestOfColors from '../dist/colornames.bestof.json' assert { type: 'json' };
import jsonShortColors from '../dist/colornames.short.json' assert { type: 'json' };

// Import minified JSON files
import jsonMinColors from '../dist/colornames.min.json' assert { type: 'json' };
import jsonMinBestOfColors from '../dist/colornames.bestof.min.json' assert { type: 'json' };
import jsonMinShortColors from '../dist/colornames.short.min.json' assert { type: 'json' };

// Also import the source CSV file for verification
import { csvTestData } from './csv-test-data.js';

describe('Color Names Import Tests', () => {
  let csvColors;

  beforeAll(() => {
    // Load CSV data for comparison
    csvTestData.load();
    csvColors = csvTestData.colors;
  });

  describe('JSON Files', () => {
    it('should import main JSON file correctly', () => {
      expect(jsonColors).toBeDefined();
      expect(Array.isArray(jsonColors)).toBe(true);
      expect(jsonColors.length).toBeGreaterThan(0);
      expect(jsonColors[0]).toHaveProperty('name');
      expect(jsonColors[0]).toHaveProperty('hex');
      expect(jsonColors.length).toBe(csvColors.length);
    });

    it('should import bestof JSON file correctly', () => {
      expect(jsonBestOfColors).toBeDefined();
      expect(Array.isArray(jsonBestOfColors)).toBe(true);
      expect(jsonBestOfColors.length).toBeGreaterThan(0);
      expect(jsonBestOfColors[0]).toHaveProperty('name');
      expect(jsonBestOfColors[0]).toHaveProperty('hex');
      expect(jsonBestOfColors.length).toBeLessThan(csvColors.length);
    });

    it('should import short JSON file correctly', () => {
      expect(jsonShortColors).toBeDefined();
      expect(Array.isArray(jsonShortColors)).toBe(true);
      expect(jsonShortColors.length).toBeGreaterThan(0);
      expect(jsonShortColors[0]).toHaveProperty('name');
      expect(jsonShortColors[0]).toHaveProperty('hex');
      expect(jsonShortColors.length).toBeLessThan(csvColors.length);
    });

    it('should import minified JSON files correctly', () => {
      expect(jsonMinColors).toBeDefined();
      expect(typeof jsonMinColors).toBe('object');
      expect(Object.keys(jsonMinColors).length).toBeGreaterThan(0);
      expect(Object.values(jsonMinColors).length).toBe(csvColors.length);

      expect(jsonMinBestOfColors).toBeDefined();
      expect(typeof jsonMinBestOfColors).toBe('object');
      expect(Object.keys(jsonMinBestOfColors).length).toBeGreaterThan(0);

      expect(jsonMinShortColors).toBeDefined();
      expect(typeof jsonMinShortColors).toBe('object');
      expect(Object.keys(jsonMinShortColors).length).toBeGreaterThan(0);
    });
  });

  describe('ESM Files', () => {
    it('should import main ESM file correctly', () => {
      expect(esmColors).toBeDefined();
      expect(esmColors.colornames).toBeDefined();
      expect(Array.isArray(esmColors.colornames)).toBe(true);
      expect(esmColors.colornames.length).toBeGreaterThan(0);
      expect(esmColors.colornames[0]).toHaveProperty('name');
      expect(esmColors.colornames[0]).toHaveProperty('hex');
      expect(esmColors.colornames.length).toBe(csvColors.length);
    });

    it('should import bestof ESM file correctly', () => {
      expect(esmBestOfColors).toBeDefined();
      expect(esmBestOfColors.colornames).toBeDefined();
      expect(Array.isArray(esmBestOfColors.colornames)).toBe(true);
      expect(esmBestOfColors.colornames.length).toBeGreaterThan(0);
      expect(esmBestOfColors.colornames[0]).toHaveProperty('name');
      expect(esmBestOfColors.colornames[0]).toHaveProperty('hex');
    });

    it('should import short ESM file correctly', () => {
      expect(esmShortColors).toBeDefined();
      expect(esmShortColors.colornames).toBeDefined();
      expect(Array.isArray(esmShortColors.colornames)).toBe(true);
      expect(esmShortColors.colornames.length).toBeGreaterThan(0);
      expect(esmShortColors.colornames[0]).toHaveProperty('name');
      expect(esmShortColors.colornames[0]).toHaveProperty('hex');
    });
  });

  describe('Content Verification', () => {
    it('should contain expected color names', () => {
      // Check for some common color names
      const commonColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink'];

      // Convert to lowercase for easier comparison
      const allNames = jsonColors.map((color) => color.name.toLowerCase());

      commonColors.forEach((color) => {
        // Check if at least one entry contains this common color name
        expect(allNames.some((name) => name.includes(color))).toBe(true);
      });
    });
  });
});
