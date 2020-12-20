const lib = require('./lib.js');
const ClosestVector = require('closestvector');

/**
 * entriches color object and fills RGB color arrays
 * Warning: Not a pure function at all :D
 * @param   {object} colorObj hex representation of color
 * @param   {array} rgbColorArrRef reference to RGB color array
 * @return  {object} enriched color object
 */
const enrichColorObj = (colorObj, rgbColorArrRef) => {
  const rgb = lib.hexToRgb(colorObj.hex);
  // populates array needed for ClosestVector()
  rgbColorArrRef.push([rgb.r, rgb.g, rgb.b]);
  // transform hex to RGB
  colorObj.rgb = rgb;
  // get hsl color value
  colorObj.hsl = lib.rgbToHsl(...Object.values(rgb));

  // calculate luminancy for each color
  colorObj.luminance = lib.luminance(rgb);

  return colorObj;
};

module.exports = class FindColors {
  constructor(colors, colorsBestOf) {

    this.colors = colors;
    this.colorsBestOf = colorsBestOf;

    // object containing the name:hex pairs for nearestColor()
    this.rgbColorsArr = [];
    this.rgbColorsArrBestOf = [];

    // prepare color array
    this.colors.forEach((c) => enrichColorObj(c, this.rgbColorsArr));
    this.colorsBestOf.forEach((c) => enrichColorObj(c, this.rgbColorsArrBestOf));

    Object.freeze(this.colors);
    Object.freeze(this.colorsBestOf);

    this.closest = new ClosestVector(this.rgbColorsArr);
    this.closestBestOf = new ClosestVector(this.rgbColorsArrBestOf);
  }

  /**
   * returns all colors that match a name
   * @param {string} searchStr search term
   * @param {boolen} bestOf    if set only returns good names
   */
  searchNames (searchStr, bestOf = false) {
    const colors = bestOf ? this.colorsBestOf : this.colors;
    return colors.filter(color => color.name.toLowerCase().includes(searchStr.toLowerCase()));
  }

  /**
   * names an array of colors
   * @param   {array} colorArr array containing hex values without the hash
   * @param   {boolean} unique if set to true every returned name will be unque
   * @param   {boolean} bestOf if set only returns good names
   * @return  {object}         object containing all nearest colors
   */
  getNamesForValues (colorArr, unique = false, bestOf = false) {
    let localClosest = bestOf ? this.closestBestOf : this.closest;

    if (unique) {
      localClosest = new ClosestVector(
        bestOf ? this.rgbColorsArrBestOf : this.rgbColorsArr,
        true
      );
    }

    const colorResp = colorArr.map((hex) => {
      // calculate RGB values for passed color
      const rgb = lib.hexToRgb(hex);

      // get the closest named colors
      const closestColor = localClosest.get([rgb.r, rgb.g, rgb.b]);
      const color = bestOf ? this.colorsBestOf[closestColor.index] :
        this.colors[closestColor.index];

      return {
        ...color,
        requestedHex: `#${hex}`,
        distance: Math.sqrt(
          Math.pow(color.rgb.r - rgb.r, 2) +
          Math.pow(color.rgb.g - rgb.g, 2) +
          Math.pow(color.rgb.b - rgb.b, 2)
        ),
      }
    });

    if (unique) {
      localClosest.clearCache();
    }

    return colorResp;
  };
}


