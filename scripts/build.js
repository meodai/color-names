const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');
const parseCSVString = lib.parseCSVString;
const findDuplicates = lib.findDuplicates;
const objArrToString = lib.objArrToString;
const args = process.argv;
const isTestRun = !!args.find((arg) => (arg === '--testOnly'));
const exec = require('child_process').exec;

// only hex colors with 6 values
const hexColorValidation = /^#[0-9a-f]{6}$/;
const errors = [];

// spaces regex
const spacesValidation = /^\s+|\s{2,}|\s$/;

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

csvKeys.forEach((key) => {
  // find duplicates
  const dupes = findDuplicates(colorsSrc.values[key]);
  dupes.forEach((dupe) => {
    log(key, dupe, `found a double ${key}`);
  });
});

// loop hex values
colorsSrc.values['hex'].forEach((hex) => {
  // validate HEX values
  if ( !hexColorValidation.test(hex) ) {
    log('hex', hex, `${hex} is not a valid hex value. (Or to short, we avoid using the hex shorthands, no capital letters)`);
  }
});

// loop names
colorsSrc.values['name'].forEach((name) => {
  // check for spaces
  if (spacesValidation.test(name)) {
    log('name', name, `${name} found either a leading or trailing space (or both)`);
  }
});

showLog();

if (isTestRun) {
  console.log('⇪ See test results above ⇪');
  process.exit();
}

// creates JS related files
const JSONExportString = JSON.stringify(
  [...colorsSrc.entires].map( // removes good name attributes
    (val) => ({
      name: val.name,
      hex: val.hex,
    })
  )
);

fs.writeFileSync(
    path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.json`),
    JSONExportString
);

// creates a more compact JSON file, where the HEX color serves as an id
const miniJSONExportObj = colorsSrc.entires.reduce((obj, entry) => {
  obj[entry.hex.replace('#', '')] = entry.name;
  return obj;
}, {});

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.min.json`),
  JSON.stringify(miniJSONExportObj)
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

// gets ESM template
const esmTpl = fs.readFileSync(
    path.normalize(__dirname + '/esm.js.tpl'),
    'utf8'
).toString();

// create ESM
fs.writeFileSync(
    path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.esm.js`),
    esmTpl.replace('"{{COLORS}}"', JSONExportString)
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
  'css': {
    insertBefore: ':root{\r\n--color-',
    beforeValue: '',
    afterValue: '',
    insertAfter: '};',
    itemDelimitor: ':',
    rowDelimitor: ';\r\n--color-',
  },
  'html': {
    insertBefore: `<table><thead><tr><th>${csvKeys.join('</th><th>')}</th></tr><thead><tbody><tr><td>`,
    itemDelimitor: '</td><td>',
    rowDelimitor: '</td></tr><tr><td>',
    insertAfter: `</td></tr></tbody></table>`,
  },
  'xml': {
    insertBefore: `<?xml version='1.0'?>\r\n<colors>\r\n<color>\r\n<${csvKeys[0]}>`,
    itemDelimitor: `</${csvKeys[0]}>\r\n<${csvKeys[1]}>`,
    rowDelimitor: `</${csvKeys[1]}>\r\n</color>\r\n<color>\r\n<${csvKeys[0]}>`,
    insertAfter: `</${csvKeys[1]}>\r\n</color>\r\n</colors>`,
  },
};

for (const outputFormat in outputFormats) {
  if (outputFormats[outputFormat]) {
    let outputString = objArrToString(
        colorsSrc.entires,
        csvKeys,
        outputFormats[outputFormat]
    );
    if (outputFormat === 'html' || outputFormat === 'xml') {
      outputString = outputString.replace(/&/g, '&amp;');
    }
    if (outputFormat === 'css') {
      outputString = outputString.toLowerCase();
      outputString = outputString.replace(/'/g, '');
      outputString = outputString.replace(/ /g, '-');
      outputString = outputString.replace(/&/g, 'and');
      outputString = outputString.replace(/%/g, 'percent');
    }
    fs.writeFileSync(
        path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.${outputFormat}`),
        outputString
    );
  }
}

// updates the color count in readme file
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
        ), 'utf8'
);

/**
 * outputs the collected logs
 */
function showLog() {
  let errorLevel = 0;
  let totalErrors = 0;
  errors.forEach((error, i) => {
    totalErrors = i + 1;
    errorLevel = error.errorLevel || errorLevel;
    console.log(`${error.errorLevel ? '⛔' : '⚠'}  ${error.message}`);
    console.log(JSON.stringify(error.entries));
    console.log('*-------------------------*');
  });
  if (errorLevel) {
    throw `⚠ failed because of the ${totalErrors} error${totalErrors > 1 ? 's' : ''} above ⚠`;
  }
  return totalErrors;
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

// gets SVG template
const svgTpl = fs.readFileSync(
  path.normalize(__dirname + '/changes.svg.tpl'),
  'utf8'
).toString();

function diffSVG() {
  exec(`git diff HEAD ${baseFolder}${folderSrc}${fileNameSrc}.csv`,
  function (err, stdout, stderr) {
    const diffTxt = stdout;
    if (!/(?<=^[\+])[^\+].*/gm.test(diffTxt)) return;
    const changes = diffTxt.match(/(?<=^[\+])[^\+].*/gm).filter(i => i);
    const svgTxtStr = changes.reduce((str, change, i) => {
      const changeParts = change.split(',');
      return `${str}<text x="40" y="${20 + (i + 1) * 70}" fill="${changeParts[1]}">${changeParts[0]}</text>`;
    }, '');

    fs.writeFileSync(
      path.normalize(`${baseFolder}changes.svg`),
      svgTpl.replace(/{height}/g, changes.length * 70 + 80).replace(/{items}/g, svgTxtStr)
    );
  });
};

diffSVG();
