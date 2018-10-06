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
  path.normalize(`${baseFolder}${folderSrc}${fileNameSrc}.csv`),
  'utf8'
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

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.json`),
  JSONExportString
);

// gets UMD template
const umdTpl = fs.readFileSync(
  path.normalize(__dirname + '/umd.js.tpl'),
  'utf8'
).toString();

// create UMD
fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.umd.js`),
  umdTpl.replace('"{{COLORS}}"', JSONExportString)
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
  'xml': {
    insertBefore: `<?xml version='1.0'?>\r\n<color>\r\n<${csvKeys[0]}>`,
    itemDelimitor: `</${csvKeys[0]}>\r\n<${csvKeys[1]}>`,
    rowDelimitor: `</${csvKeys[1]}>\r\n</color>\r\n<color>\r\n<${csvKeys[0]}>`,
    insertAfter: `</${csvKeys[1]}>\r\n</color>`,
  }
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
  path.normalize(`${baseFolder}${readmeFileName}`),
  'utf8'
).toString();
fs.writeFileSync(
  path.normalize(`${baseFolder}${readmeFileName}`),
  readme.replace(/__\d+__/g, `__${colorsSrc.entires.length}__`)
  .replace(
    /\d+-colors-orange/,
    `${colorsSrc.entires.length}-colors-orange`
  ).replace(
    /__\d+(\.\d+)?%__/,
    `__${((colorsSrc.entires.length / (256 * 256 * 256)) * 100).toFixed(2)}%__`
  ),'utf8'
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
    throw `⚠ failed because of errors above ⚠`;
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
