#!/usr/bin/env node

/**
 * Script to sort the colornames.csv file alphabetically by name
 * This helps maintain order when new colors are added to the list
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the CSV file
const csvPath = path.join(__dirname, '..', 'src', 'colornames.csv');

// Read the CSV file
const readAndSortCSV = () => {
  try {
    // Read the file
    const data = fs.readFileSync(csvPath, 'utf8');

    // Split the data into lines
    const lines = data.trim().split('\n');

    // The header should be kept as the first line
    const header = lines[0];

    // Remove the header from the array of lines
    const colorLines = lines.slice(1);

    // Sort the color lines alphabetically by name (case-insensitive)
    const sortedColorLines = colorLines.sort((a, b) => {
      // Extract the name from each line (first column before the comma)
      const nameA = a.split(',')[0].toLowerCase();
      const nameB = b.split(',')[0].toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Combine the header and sorted lines
    const sortedData = [header, ...sortedColorLines].join('\n');

    // Write the sorted data back to the file
    fs.writeFileSync(csvPath, sortedData, 'utf8');

    console.log(`✅ Successfully sorted ${sortedColorLines.length} colors alphabetically by name`);
    console.log(`📝 File saved: ${csvPath}`);

  } catch (error) {
    console.error('❌ Error sorting the CSV file:', error);
    process.exit(1);
  }
};

// Execute the function
readAndSortCSV();
