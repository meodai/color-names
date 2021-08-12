const SpellChecker = require('spellchecker');
const checker = new SpellChecker.Spellchecker();

const fs = require('fs');
const path = require('path');
const lib = require('./lib.js');
const parseCSVString = lib.parseCSVString;

// setting
const baseFolder = __dirname + '/../';
const folderSrc = 'src/';
const fileNameSrc = 'colornames';

const src = fs.readFileSync(
  path.normalize(`${baseFolder}${folderSrc}${fileNameSrc}.csv`),
  'utf8'
).toString();

const colorsSrc = parseCSVString(src);

const words = [
  '5-Masted Preußen', // Kind of ship
  'Aare', // river in switzerland
  'Aarhusian', // City of Århus
  'Abaddon', // Greek equivalent "Apollyon"
  'Acai', // Açaí Fruit
  'Ashwood', // Wood of an Ashtree
  'Arrowwood', // Cornus Florida
  'Apricotta', // Apricot
  'Chiffonade', // slicing technique
  'Battletoad', // Videogame character
  'Babyccino', // Milk Only Cappuccino
  'Baba Ganoush', // Libanese Dish
];

words.forEach((word) => checker.add(word));

const misspelledWords = colorsSrc.entires.filter((entry) =>
  checker.isMisspelled(entry.name)
);


console.log(
  SpellChecker.getCorrectionsForMisspelling(misspelledWords[0].name),
  misspelledWords
);
