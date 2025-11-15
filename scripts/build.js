import fs from 'fs';
import path from 'path';
import { parseCSVString, objArrToString } from './lib.js';
import { exec } from 'child_process';

// setting
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const baseFolder = __dirname + '/../';
const folderSrc = 'src/';
const folderDist = 'dist/';
const fileNameSrc = 'colornames';
const fileNameBestOfPostfix = '.bestof';
const readmeFileName = 'README.md';

const fileNameShortPostfix = '.short';
const maxShortNameLength = 12;

const csvKeys = ['name', 'hex'];
const bestOfKey = 'good name';

// reads the CSV file contents
const src = fs
  .readFileSync(path.normalize(`${baseFolder}${folderSrc}${fileNameSrc}.csv`), 'utf8')
  .toString();

const colorsSrc = parseCSVString(src);

// creates JS related files
const JSONExportString = JSON.stringify(
  [...colorsSrc.entries].map(
    // removes good name attributes
    (val) => ({
      name: val.name,
      hex: val.hex,
    })
  )
);

const JSONExportStringBestOf = JSON.stringify(
  [...colorsSrc.entries]
    .filter((val) => val[bestOfKey])
    .map(
      // removes good name attributes
      (val) => ({
        name: val.name,
        hex: val.hex,
      })
    )
);

const JSONExportStringShort = JSON.stringify(
  [...colorsSrc.entries]
    .filter(
      // make sure its only one word long
      (val) =>
        val[bestOfKey] &&
        // val.name.split(" ").length === 1 &&
        val.name.length < maxShortNameLength + 1
    )
    .map(
      // removes good name attributes
      (val) => ({
        name: val.name,
        hex: val.hex,
      })
    )
);

// make sure dist folder exists
const distFolder = path.normalize(`${baseFolder}${folderDist}`);
if (!fs.existsSync(distFolder)) {
  fs.mkdirSync(distFolder);
}

fs.writeFileSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.json`), JSONExportString);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameBestOfPostfix}.json`),
  JSONExportStringBestOf
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameShortPostfix}.json`),
  JSONExportStringShort
);

// creates a more compact JSON file, where the HEX color serves as an id
const miniJSONExportObj = colorsSrc.entries.reduce((obj, entry) => {
  obj[entry.hex.replace('#', '')] = entry.name;
  return obj;
}, {});

const miniJSONExportObjBestOf = colorsSrc.entries.reduce((obj, entry) => {
  if (entry[bestOfKey]) {
    obj[entry.hex.replace('#', '')] = entry.name;
  }
  return obj;
}, {});

const miniJSONExportObjShort = colorsSrc.entries.reduce((obj, entry) => {
  if (
    entry[bestOfKey] &&
    // entry.name.split(" ").length === 1 &&
    entry.name.length < maxShortNameLength + 1
  ) {
    obj[entry.hex.replace('#', '')] = entry.name;
  }
  return obj;
}, {});

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.min.json`),
  JSON.stringify(miniJSONExportObj)
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameBestOfPostfix}.min.json`),
  JSON.stringify(miniJSONExportObjBestOf)
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameShortPostfix}.min.json`),
  JSON.stringify(miniJSONExportObjShort)
);

// gets UMD template
const umdTpl = fs.readFileSync(path.normalize(__dirname + '/umd.js.tpl'), 'utf8').toString();

// create UMD
fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.umd.js`),
  umdTpl.replace('"{{COLORS}}"', JSONExportString)
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameBestOfPostfix}.umd.js`),
  umdTpl.replace('"{{COLORS}}"', JSONExportStringBestOf)
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameShortPostfix}.umd.js`),
  umdTpl.replace('"{{COLORS}}"', JSONExportStringShort)
);

// gets ESM template
const esmTpl = fs.readFileSync(path.normalize(__dirname + '/esm.js.tpl'), 'utf8').toString();

// create ESM
fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.esm.js`),
  esmTpl.replace('"{{COLORS}}"', JSONExportString)
);
fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.esm.mjs`),
  esmTpl.replace('"{{COLORS}}"', JSONExportString)
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameBestOfPostfix}.esm.js`),
  esmTpl.replace('"{{COLORS}}"', JSONExportStringBestOf)
);
fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameBestOfPostfix}.esm.mjs`),
  esmTpl.replace('"{{COLORS}}"', JSONExportStringBestOf)
);

fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameShortPostfix}.esm.js`),
  esmTpl.replace('"{{COLORS}}"', JSONExportStringShort)
);
fs.writeFileSync(
  path.normalize(`${baseFolder}${folderDist}${fileNameSrc}${fileNameShortPostfix}.esm.mjs`),
  esmTpl.replace('"{{COLORS}}"', JSONExportStringShort)
);

// create foreign formats
// configuration for the file outputs
const outputFormats = {
  csv: {
    insertBefore: csvKeys.join(',') + '\n',
  },
  toon: {
    // TOON tabular array header for flat objects: colors[N]{name,hex}:
    insertBefore: `colors[${colorsSrc.entries.length}]{${csvKeys.join(',')}}:\n  `,
    itemDelimitor: ',',
    rowDelimitor: '\n  ',
  },
  yaml: {
    insertBefore: '-\n  ',
    beforeValue: '"',
    afterValue: '"',
    includeKeyPerItem: true,
    rowDelimitor: '\n-\n  ',
    itemDelimitor: '\n  ',
  },
  scss: {
    insertBefore: '$color-name-list: (',
    beforeValue: '"',
    afterValue: '"',
    insertAfter: ');',
    itemDelimitor: ':',
    rowDelimitor: ',',
  },
  html: {
    insertBefore: `<table><thead><tr><th>${csvKeys.join('</th><th>')}</th></tr><thead><tbody><tr><td>`,
    itemDelimitor: '</td><td>',
    rowDelimitor: '</td></tr><tr><td>',
    insertAfter: `</td></tr></tbody></table>`,
  },
  xml: {
    insertBefore: `<?xml version='1.0'?>\n<colors>\n<color>\n<${csvKeys[0]}>`,
    itemDelimitor: `</${csvKeys[0]}>\n<${csvKeys[1]}>`,
    rowDelimitor: `</${csvKeys[1]}>\n</color>\n<color>\n<${csvKeys[0]}>`,
    insertAfter: `</${csvKeys[1]}>\n</color>\n</colors>`,
  },
};

for (const outputFormat in outputFormats) {
  if (outputFormats[outputFormat]) {
    let outputString = objArrToString(colorsSrc.entries, csvKeys, outputFormats[outputFormat]);
    if (outputFormat === 'html' || outputFormat === 'xml') {
      outputString = outputString.replace(/&/g, '&amp;');
    }
    fs.writeFileSync(
      path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.${outputFormat}`),
      outputString
    );
  }
}

// bestOf files
for (const outputFormat in outputFormats) {
  if (outputFormats[outputFormat]) {
    let outputString = objArrToString(
      colorsSrc.entries.filter((val) => val[bestOfKey]),
      csvKeys,
      outputFormats[outputFormat]
    );
    if (outputFormat === 'html' || outputFormat === 'xml') {
      outputString = outputString.replace(/&/g, '&amp;');
    }
    fs.writeFileSync(
      path.normalize(
        `${baseFolder}${folderDist}${fileNameSrc}${fileNameBestOfPostfix}.${outputFormat}`
      ),
      outputString
    );
  }
}

// short files
for (const outputFormat in outputFormats) {
  if (outputFormats[outputFormat]) {
    let outputString = objArrToString(
      colorsSrc.entries.filter(
        (val) =>
          val[bestOfKey] &&
          // val.name.split(" ").length === 1 &&
          val.name.length < maxShortNameLength + 1
      ),
      csvKeys,
      outputFormats[outputFormat]
    );
    if (outputFormat === 'html' || outputFormat === 'xml') {
      outputString = outputString.replace(/&/g, '&amp;');
    }
    fs.writeFileSync(
      path.normalize(
        `${baseFolder}${folderDist}${fileNameSrc}${fileNameShortPostfix}.${outputFormat}`
      ),
      outputString
    );
  }
}

// updates the color count in readme file
const readme = fs.readFileSync(path.normalize(`${baseFolder}${readmeFileName}`), 'utf8').toString();
fs.writeFileSync(
  path.normalize(`${baseFolder}${readmeFileName}`),
  readme
    .replace(
      // update color count in text
      /__\d+__/g,
      `__${colorsSrc.entries.length}__`
    )
    .replace(
      // update color count in badge
      /\d+-colors-orange/,
      `${colorsSrc.entries.length}-colors-orange`
    )
    .replace(
      // update color count in percentage
      /__\d+(\.\d+)?%__/,
      `__${((colorsSrc.entries.length / (256 * 256 * 256)) * 100).toFixed(2)}%__`
    )
    .replace(
      // update file size (update all occurrences)
      /\d+(\.\d+)? MB\)__+/g,
      `${(
        fs.statSync(path.normalize(`${baseFolder}${folderDist}${fileNameSrc}.json`)).size /
        1024 /
        1024
      ).toFixed(2)} MB)__`
    ),
  'utf8'
);

// gets SVG template
const svgTpl = fs.readFileSync(path.normalize(__dirname + '/changes.svg.tpl'), 'utf8').toString();

// generates an SVG image with the new colors based on the diff between the last two commits that changed the file
function diffSVG() {
  // Get the last two commits that modified the CSV file
  exec(
    `git log -n 2 --pretty=format:"%H" -- ${baseFolder}${folderSrc}${fileNameSrc}.csv`,
    function (err, stdout, stderr) {
      if (err) {
        console.error('Error getting commit history:', err);
        return;
      }

      const commits = stdout.trim().split('\n');
      if (commits.length < 2) {
        console.log('Not enough commit history to generate diff');
        return;
      }

      const newerCommit = commits[0];
      const olderCommit = commits[1];

      // Compare the two commits
      exec(
        `git diff -w -U0 ${olderCommit} ${newerCommit} -- ${baseFolder}${folderSrc}${fileNameSrc}.csv`,
        function (err, stdout, stderr) {
          if (err) {
            console.error('Error generating diff:', err);
            return;
          }

          const diffTxt = stdout;
          if (!/(?<=^[+])[^+].*/gm.test(diffTxt)) {
            console.log('No changes detected in the color file');
            return;
          }

          const changes = diffTxt.match(/(?<=^[+])[^+].*/gm).filter((i) => i);

          // Filter out the header line if it was included in the diff
          const filteredChanges = changes.filter((line) => !line.startsWith('name,hex'));

          if (filteredChanges.length === 0) {
            console.log('No color changes detected');
            return;
          }

          const svgTxtStr = filteredChanges.reduce((str, change, i) => {
            const changeParts = change.split(',');
            // Make sure we have both the name and hex color
            if (changeParts.length < 2) return str;

            return `${str}<text x="40" y="${20 + (i + 1) * 70}" fill="${
              changeParts[1]
            }">${changeParts[0].replace(/&/g, '&amp;')}</text>`;
          }, '');

          fs.writeFileSync(
            path.normalize(`${baseFolder}changes.svg`),
            svgTpl
              .replace(/{height}/g, filteredChanges.length * 70 + 80)
              .replace(/{items}/g, svgTxtStr)
          );

          console.log(`Generated SVG showing ${filteredChanges.length} new color(s)`);
        }
      );
    }
  );
}

diffSVG();
