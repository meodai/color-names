const fs = require('fs');
const colors = fs.readFileSync('colors.csv').toString().split(`\n`);
const namedColors = JSON.parse(
  fs.readFileSync(__dirname + '/../../dist/colornames.json', 'utf8')
);
const nearestColor = require('../../node_modules/nearest-color/nearestColor.js');

// object containing the name:hex pairs for nearestColor()
const colorsObj = {};

namedColors.forEach((c) => {
  colorsObj[c.name] = c.hex;
});

const nc = nearestColor.from(colorsObj);

const newNames = [];
colors.forEach(color => {
  if (!color) return;
  let n = nc(color);
  newNames.push(n.name + ',' + color);
});

fs.writeFileSync('exp.csv', 'name,hex\n' + newNames.join(`\n`));
