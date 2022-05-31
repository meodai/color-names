const fs = require('fs');

//const colors = fs.readFileSync('refs.csv').toString().split(`\n`);
//const colorsSRCfile = fs.readFileSync(__dirname + '/../../historic-master.json', 'utf8');
const colorsSRCfile = fs.readFileSync(__dirname + '/json.json', 'utf8');

const colors = JSON.parse(colorsSRCfile);

const namedColors = JSON.parse(
  fs.readFileSync(__dirname + '/../../dist/colornames.json', 'utf8')
);

const uniqueColors = [];

colors.forEach((color) => {
  let name = color['name'].replace(/Gray/g, 'Grey');
  const foundMath = namedColors.find(item => {
    return item.name.toLowerCase() === name.toLowerCase() ||
      item.name.toLowerCase() === name.toLowerCase().split(' ').reverse().join(' ') ||
      item.name.toLowerCase() === name.toLowerCase().split(' ').join('-') ||
      item.name.toLowerCase() === name.toLowerCase().split('-').join(' ');
  });
  if (!foundMath) {
    uniqueColors.push([
      name,
      color['hex'].toLowerCase()
    ]);
  }
});

fs.writeFileSync('uniques.csv', 'name,hex\n' + uniqueColors.join(`\n`));
