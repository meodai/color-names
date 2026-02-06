import Color from "colorjs.io";
import fs from "fs/promises";
import path from "node:path";

// Environment setup
const dirname = `${path.dirname(new URL(import.meta.url).pathname)}`.replace(`/scripts`,` `).trim();
const colornamesJsonFile = path.join(dirname, "dist", "colornames.json");
const colorsData = JSON.parse(await fs.readFile(colornamesJsonFile, "utf-8"));
// 
// Color palette
// const violet = new Color("Violet").oklch.map(value => Math.floor(value * 100));
// const indigo = new Color("Indigo").oklch.map(value => Math.floor(value * 100));
// const blue = new Color("Blue").oklch.map(value => Math.floor(value * 100));
// const green = new Color("Green").oklch.map(value => Math.floor(value * 100));
// const yellow = new Color("Yellow").oklch.map(value => Math.floor(value * 100));
// const orange = new Color("Orange").oklch.map(value => Math.floor(value * 100));
// const red = new Color("Red").oklch.map(value => Math.floor(value * 100));
// const black = new Color("Black").oklch.map(value => Math.floor(value * 100));
// const white = new Color("White").oklch.map(value => Math.floor(value * 100));
//  
// console.log(`Violet: ${violet}\n Indigo: ${indigo}\n Blue:${blue}\n Green:${green}\n Yellow: ${yellow}\n Orange: ${orange} \n Red: ${red}\n Black: ${black} \n White: ${white}`);

// classify colors
const buckets = {
  black: [],
  white: [],
  red: [],
  orange: [],
  yellow: [],
  green: [],
  blue: [],
  indigo: [],
  violet: [],
};
// 
// Detect Hue 
const detectHue = (hex, colorName) => {
  const color = new Color(hex).oklch;
  const luminosity = Math.floor(color[0] * 100);
  // const chroma = Math.floor(color[1] * 100);
  const hue = Math.floor(color[2] * 100);
  if (hue == 0) {
    // Black
    if (luminosity <= 50) {
      buckets.black.push({ name: colorName, hex });
      return;
    }
    // 
    // White
    if (luminosity >= 95) {
      buckets.white.push({ name: colorName, hex });
      return;
    }
    // 
  } else {
    // Red
    if (hue <= 2923) {
      buckets.red.push({ name: colorName, hex });
      return;
    }
    //
    // Orange
    if (hue > 2923 && hue <= 7066) {
      buckets.orange.push({ name: colorName, hex });
      return;
    }
    // 
    // Yellow
    if (hue > 7066 && hue <= 10976) {
      buckets.yellow.push({ name: colorName, hex });
      return;
    }
    // 
    // Green
    if (hue > 10976 && hue <= 14249) {
      buckets.green.push({ name: colorName, hex });
      return;
    }
    // 
    // Blue
    if (hue > 14249 && hue <= 26405) {
      buckets.blue.push({ name: colorName, hex });
      return;
    }
    // 
    // Indigo
    if (hue > 26405 && hue <= 30168) {
      buckets.indigo.push({ name: colorName, hex });
      return;
    }
    // 
    // Violet
    if (hue > 30168) {
      buckets.violet.push({ name: colorName, hex });
      return;
    }
    // 
  };
};
//
console.log("Arranging Shades");
// Now loop through database
colorsData.forEach(color => {
  detectHue(color.hex, color.name);
});
// 
// Writing to file flow
console.warn("Writing to file system, Don't terminate");
console.log("Writing to shades");
const outputDirectory = path.join(dirname, "dist", "shades");
await fs.mkdir(outputDirectory, { recursive: true });

for (const [shade, list] of Object.entries(buckets)) {
  const filePath = path.join(outputDirectory, `${shade}.json`);
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
  console.log(`Wrote ${list.length} colors → ${shade}.json`);
};
// 