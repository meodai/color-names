const seedrandom = require('seedrandom');

/**
 * getPaletteTitle
 * @param {string[]} namesArr
 * @param {int(0-1)} rnd1
 * @param {int(0-1)} rnd2
 * @param {int(0-1)} longPartFirst
 * @param {RegExp} separatorRegex
 * @returns {string}
 */

module.exports = function getPaletteTitle(
    namesArr, // array of names
    separatorRegex = /(\s|-)+/g
) {
  let localnames = [...namesArr];

  const rng = seedrandom(namesArr.join('-'));
  const rnd1 = rng();
  const rnd2 = rng();
  const longPartFirst = rng() < .5;

  // select a random name from the list for the first word in the palette title
  const indexFirst = Math.round(rnd1 * (localnames.length - 1));

  // remove the selected name from the list
  const firstName = localnames.splice(indexFirst, 1)[0];

  // select a random name from the list as a last word in the palette title
  const lastIndex = Math.round(rnd2 * (localnames.length - 1));
  const lastName = localnames[lastIndex];

  const partsFirst = firstName.split(separatorRegex);
  const partsLast = lastName.split(separatorRegex);

  if (longPartFirst) {
    partsFirst.length > 1 ?
      partsFirst.pop() :
      partsFirst[0] = `${partsFirst[0]} `;
    return partsFirst.join('') + partsLast.pop();
  } else {
    partsLast.length > 1 ?
      partsLast.shift() :
      partsLast[0] = ` ${partsLast[0]}`;
    return partsFirst.shift() + partsLast.join('');
  }
}
