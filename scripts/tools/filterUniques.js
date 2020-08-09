const fs = require('fs');

//const colors = fs.readFileSync('refs.csv').toString().split(`\n`);
const colorsSRCfile = fs.readFileSync(__dirname + '/../../historic-master.json', 'utf8');

const colors = eval(colorsSRCfile);

console.log(colors)
const namedColors = JSON.parse(
    fs.readFileSync(__dirname + '/../../dist/colornames.json', 'utf8')
);

const uniqueColors = [];

for(const color in colors) {
  let name = colors[color]['Name'];
  const foundMath = namedColors.find(item => {
    return item.name.toLowerCase() === name.toLowerCase()
    || item.name.toLowerCase() === name.toLowerCase().split(' ').reverse().join(' ');
  });
  if (!foundMath) {
    uniqueColors.push([
      name,
      '#' + colors[color]['HexaDecimal'].toLowerCase()
    ])
  }
}

fs.writeFileSync('uniques.csv', 'name,hex\n' + uniqueColors.join(`\n`));
