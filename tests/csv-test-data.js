import fs from 'fs';
import path from 'path';
import { parseCSVString } from '../scripts/lib.js';

/**
 * Shared CSV test data loader
 * Provides consistent CSV data across all test files
 */
class CSVTestData {
  constructor() {
    this._data = null;
    this._raw = null;
    this._lines = null;
    this._items = null;
  }

  /**
   * Load and parse the CSV file once
   */
  load() {
    if (this._data) return; // Already loaded

    const csvPath = path.resolve('./src/colornames.csv');
    this._raw = fs.readFileSync(csvPath, 'utf8').replace(/\r\n/g, '\n').trimEnd();

    // Parse with parseCSVString for structured access
    this._data = parseCSVString(this._raw);

    // Parse for line-by-line access (used by duplicates/sorting tests)
    this._lines = this._raw.split('\n');
    const header = this._lines.shift();

    if (!header.startsWith('name,hex,good name')) {
      throw new Error('Invalid CSV header format');
    }

    // Create items array with line numbers for duplicate checking
    this._items = this._lines
      .map((l, idx) => {
        const lineNumber = idx + 2; // +1 for header, +1 because idx is 0-based
        if (!l.trim()) return null;
        const firstComma = l.indexOf(',');
        const name = firstComma === -1 ? l : l.slice(0, firstComma);
        return { name, lineNumber };
      })
      .filter(Boolean);
  }

  /**
   * Get the parsed CSV data (using parseCSVString format)
   */
  get data() {
    this.load();
    return this._data;
  }

  /**
   * Get the raw CSV content
   */
  get raw() {
    this.load();
    return this._raw;
  }

  /**
   * Get CSV lines (without header)
   */
  get lines() {
    this.load();
    return this._lines;
  }

  /**
   * Get items array with line numbers for duplicate checking
   */
  get items() {
    this.load();
    return this._items;
  }

  /**
   * Get colors in simple format (name, hex)
   */
  get colors() {
    this.load();
    return this._data.entries.map((entry) => ({
      name: entry.name,
      hex: entry.hex,
    }));
  }

  /**
   * Get line count including header
   */
  get lineCount() {
    this.load();
    return this._lines.length + 1; // +1 for header
  }
}

// Export a singleton instance
export const csvTestData = new CSVTestData();

// Export a convenience function to ensure data is loaded
export function loadCSVTestData() {
  csvTestData.load();
  return csvTestData;
}
