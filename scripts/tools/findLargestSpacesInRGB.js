const fs = require('fs');
const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;

const namedColors = JSON.parse(
  fs.readFileSync(__dirname + '/../../dist/colornames.json', 'utf8')
);

const hexToRgb = (hexSrt) => {
  const [, short, long] = String(hexSrt).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    return {
      r: value >> 16,
      g: value >> 8 & 0xFF,
      b: value & 0xFF,
    };
  } else if (short) {
    const rgbArray = Array.from(short,
      (s) => Number.parseInt(s, 16)
    ).map((n) => (n << 4) | n);
    return {
      r: rgbArray[0],
      g: rgbArray[1],
      b: rgbArray[2],
    };
  }
};

const rgbColors = namedColors.map((color) => {
  const {r,g,b} = hexToRgb(color.hex);
  return [r, g, b];
});


function calculateDistance(r, g, b, rgbColors) {
  let distance = 0;
  for (let i = 0; i < rgbColors.length; i++) {
    const rgb = rgbColors[i];
    distance += Math.abs(r - rgb[0]) + Math.abs(g - rgb[1]) + Math.abs(b - rgb[2]);
  }
  return distance;
}

// create new RGB color with the largest possible distance from all other rgbColors
function findLargestSpaceInRGB(rgbColors) {
  const rgb = [0, 0, 0];
  let largestDistance = 0;
  for (let i = 0; i < 256; i+=10) {
    for (let j = 0; j < 256; j+=10) {
      for (let k = 0; k < 256; k+=10) {
        const distance = calculateDistance(i, j, k, rgbColors);
        if (distance > largestDistance) {
          largestDistance = distance;
          rgb[0] = i;
          rgb[1] = j;
          rgb[2] = k;
        }
      }
    }
  }
  return rgb;
}

console.log(findLargestSpaceInRGB(rgbColors));
