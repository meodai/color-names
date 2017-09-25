const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');
const parseCSVString = lib.parseCSVString;
const findDuplicates = lib.findDuplicates;
const objArrToString = lib.objArrToString;
const args = process.argv;
const isTestRun = !!args.find((arg) => (arg === '--testOnly'));

// we only want hex colors with 6 values
const hexColorValidation = /^#[0-9a-f]{6}$/;
const errors = [];

// setting
const baseFolder = __dirname + '/../';
const folderSrc = 'src/';
const folderDist = 'dist/';
const fileNameSrc = 'colornames';
const readmeFileName = 'README.md';

const sortBy = 'name';
const csvKeys = ['name', 'hex'];

// reads the CSV file contents
const src = fs.readFileSync(
              path.normalize(`${baseFolder}${folderSrc}${fileNameSrc}.csv`)
            ).toString();
const colorsSrc = parseCSVString(src);

// sort by sorting criteria
colorsSrc.entires.sort((a, b) => {
  return a[sortBy].localeCompare(b[sortBy]);
});

// find duplicates
csvKeys.forEach((key) => {
  const dupes = findDuplicates(colorsSrc.values[key]);
  dupes.forEach((dupe) => {
    log(key, dupe, `found a double ${key}`);
  });
});

// validate HEX values
colorsSrc.values['hex'].forEach((hex) => {
  if ( !hexColorValidation.test(hex) ) {
    log('hex', hex, `${hex} is not a valid hex value. (Or to short, we avoid using the hex shorthands, no capital letters)`);
  }
});

showLog();

if (isTestRun) {
  console.log('See test results above');
  process.exit();
}

// create JS related files
const JSONExportString = JSON.stringify(colorsSrc.entires);
const jsExportString = `module.exports = ${JSONExportString};`;

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.json`),
  JSONExportString
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.js`),
  jsExportString
);

// create foreign formats
// configuration for the file outputs
const outputFormats = {
  'csv': {
    insertBefore: csvKeys.join(',') + '\r\n',
  },
  'yaml': {
    insertBefore: '-\r\n  ',
    beforeValue: '"',
    afterValue: '"',
    includeKeyPerItem: true,
    rowDelimitor: '\r\n-\r\n  ',
    itemDelimitor: '\r\n  ',
  },
  'scss': {
    insertBefore: '$color-name-list: (',
    beforeValue: '"',
    afterValue: '"',
    insertAfter: ');',
    itemDelimitor: ':',
    rowDelimitor: ',',
  },
  'html': {
    insertBefore: `<table><thead><tr><th>${csvKeys.join('</th><th>')}</th></tr><thead><tbody><tr><td>`,
    itemDelimitor: '</td><td>',
    rowDelimitor: '</td></tr><tr><td>',
    insertAfter: `</td></tr></tbody></table>`,
  },
};

for (let outputFormat in outputFormats) {
  let outputString = objArrToString(
    colorsSrc.entires,
    csvKeys,
    outputFormats[outputFormat]
  );
  fs.writeFileSync(
    path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.${outputFormat}`),
    outputString
  );
}

// adapts the count in the readme file
const readme = fs.readFileSync(
  path.normalize(`${baseFolder}${readmeFileName}`)
).toString();
fs.writeFileSync(
  path.normalize(`${baseFolder}${readmeFileName}`),
  readme.replace(/__\d+__/g, `__${colorsSrc.entires.length}__`)
);

/**
 * outputs the collected logs
 */
function showLog() {
  let errorLevel = 0;
  errors.forEach((error) => {
    errorLevel = error.errorLevel || errorLevel;
    console.log(`${error.errorLevel ? '⛔' : '⚠'}  ${error.message}`);
    console.log(JSON.stringify(error.entries));
    console.log('*-------------------------*');
  });
  if (errorLevel) {
    throw `⚠ failed because of ${errors.length} errors ⚠`;
  }
}

/**
 * logs errors and warning
 * @param   {string} key        key to look for in input
 * @param   {string} value      value to look for
 * @param   {string} message    error message
 * @param   {Number} errorLevel if any error is set to 1, the program will exit
 */
function log(key, value, message, errorLevel = 1) {
  const error = {};

  // looks for the original item that caused the error
  error.entries = colorsSrc.entires.filter((entry) => {
      return entry[key] === value;
  });

  error.message = message;
  error.errorLevel = errorLevel;

  errors.push(error);
}
