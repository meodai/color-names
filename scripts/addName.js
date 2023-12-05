#!/usr/bin/env node

// cli utility to add a name to the database

const fs = require('fs');
const path = require('path');
const hexColorValidation = /^#[0-9a-f]{6}$/;

const args = process.argv.slice(2);

const name = args[0];
let colorValue = args[1];

if (!name || !colorValue) {
  console.log('Usage: node scripts/addName.js <name> <colorValue as hex>');
  process.exit(1);
}

// check if the colorvalue has a # if not add it
if (colorValue.charAt(0) !== '#') {
  colorValue = `#${colorValue}`;
}

const csv = fs.readFileSync(
    path.join(__dirname, '../src/colornames.csv')
).toString();

if (colorValue.match(hexColorValidation) === null) {
  console.log(
      `colorValue must be a valid hex color: ${colorValue} is not
  `);
  process.exit(1);
}

const newLine = `${name},${colorValue},`;
const newCsv = csv + `\n${newLine}`;

fs.writeFileSync(
    path.join(__dirname, '../src/colornames.csv'),
    newCsv
);
