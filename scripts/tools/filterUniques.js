const fs = require('fs');
const colors = fs.readFileSync('refs.csv').toString().split(`\n`);
const namedColors = JSON.parse(
    fs.readFileSync(__dirname + '/../../dist/colornames.json', 'utf8')
);

const uniqueColors = [];

for(const name in colors) {
  const foundMath = namedColors.find(item => {
    return item.name.toLowerCase() === colors[name][0].toLowerCase() || item.name.toLowerCase() === colors[name][0].toLowerCase().split(' ').reverse().join(' ');
  });
  if (!foundMath) {
    uniqueColors.push(colors[name])
  }
}

fs.writeFileSync('uniques.csv', 'name,hex\n' + uniqueColors.join(`\n`));
