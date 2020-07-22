// opens "someColorList.json" and shifts all the colors a bit
// and rexports them as csv

const fs = require('fs');
const tinycolor = require("tinycolor2");
const colors = JSON.parse(fs.readFileSync('someColorList.json').toString());

let newColors = [];

colors.forEach((col) => {
  const rand = Math.round( 4 * Math.random() * (Math.random() < .5 ? -1 : 1) );
  const lightMod = Math.round( Math.random() * 5);
  let hex;

  let tinyCol = tinycolor(col.hex).spin(rand);

  if (tinyCol.isDark() ) {
    tinyCol.lighten(lightMod);
  }else{
    tinyCol.darken(lightMod);
  }

  hex = tinyCol.toHexString();

  newColors.push({
    name: col.name,
    hex: hex
  });

  console.log(`${col.hex} => ${hex} : ${col.name}`);
  console.log(`----------------------------------`);
});

// create CSV
let csv = 'name,hex\n';

newColors.forEach(col => {
  csv += `${col.name},${col.hex}\n`;
});

fs.writeFileSync('somefile.csv', csv);
