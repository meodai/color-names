'use strict';

const fs = require('fs'),
      path = require('path'),
      lib = require('./lib.js'),
      parseCSVString = lib.parseCSVString,
      findDuplicates = lib.findDuplicates,
      objArrToString = lib.objArrToString,
      args = process.argv,
      isTestRun = !!args.find(arg => (arg === '--testOnly')),

      // we only want hex colors with 6 values
      hexColorValidation = /^#[0-9a-f]{6}$/,
      errors = [],

      // setting
      baseFolder = __dirname + '/../',
      folderSrc = 'src/',
      folderDist = 'dist/',
      fileNameSrc = 'colornames',

      sortBy = 'name',
      csvKeys = ['name', 'hex'];

// reads the CSV file contents
const src = fs.readFileSync(path.normalize(`${baseFolder}${folderSrc}${fileNameSrc}.csv`)).toString();
const colorsSrc = parseCSVString(src);

// sort by sorting criteria
colorsSrc.entires.sort((a, b) => {
  return a[sortBy].localeCompare(b[sortBy]);
});

// find duplicates
csvKeys.forEach(key => {
  const dupes = findDuplicates(colorsSrc.values[key]);
  dupes.forEach(dupe => {
    log(key, dupe, `found a double ${key}`);
  });
});

// validate HEX values
colorsSrc.values['hex'].forEach(hex => {
  if ( !hexColorValidation.test(hex) ) {
    log('hex', hex, `${hex} is not a valid hex value. (Or to short, we avoid
    using the hex shorthands, no capital letters)`);
  }
});

showLog();

if (isTestRun) {
  console.log('See test results above');
  process.exit();
}

// create files
const csvExportString = objArrToString(colorsSrc.entires, csvKeys, {
  insertBefore: csvKeys.join(',') + '\r\n'
});

const yamlExportString = objArrToString(colorsSrc.entires, csvKeys, {
  insertBefore: '-\r\n  ',
  beforeValue: '"',
  afterValue: '"',
  includeKeyPerItem: true,
  rowDelimitor: '\r\n-\r\n  ',
  itemDelimitor: '\r\n  '
});

const scssExportString = objArrToString(colorsSrc.entires, csvKeys, {
  insertBefore: '$color-name-list: (',
  beforeKey: '"',
  afterKey: '"',
  insertAfter: ');',
  itemDelimitor: ':',
  rowDelimitor: ',',
});

const JSONExportString = JSON.stringify(colorsSrc.entires);

const jsExportString = `module.exports = ${JSONExportString};`;

fs.writeFileSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.scss`), scssExportString);
fs.writeFileSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.csv`), csvExportString);
fs.writeFileSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.yaml`), yamlExportString);
fs.writeFileSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.json`), JSONExportString);
fs.writeFileSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.js`), jsExportString);

function showLog () {
  let errorLevel = 0;
  errors.forEach(error => {
    errorLevel = error.errorLevel || errorLevel;
    console.log(`${error.errorLevel ? '⛔' : '⚠'}  ${error.message}`);
    console.log(JSON.stringify(error.entries));
    console.log('*-------------------------*');
  });
  if (errorLevel) {
    throw `⚠ failed because of ${errors.length} errors ⚠`;
  }
}

function log (key, value, message, errorLevel = 1) {
  const error = {};

  // looks for the original item that caused the error
  error.entries = colorsSrc.entires.filter((entry) => {
      return entry[key] === value
  });

  error.message = message;
  error.errorLevel = errorLevel;

  errors.push(error);
}
