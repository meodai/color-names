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
  constructor(colorsListsObj) {
    this.colorLists = colorsListsObj;

    // object containing the name:hex pairs for nearestColor()
    this.colorListsRGBArrays = {};
    this.closestInstances = {};

    // prepare color array
    Object.keys(this.colorLists).forEach((listName) => {
      this.colorListsRGBArrays[listName] = [];

      this.colorLists[listName].forEach(c => {
        enrichColorObj(c, this.colorListsRGBArrays[listName]);
      });

      Object.freeze(this.colorLists[listName]);
      this.closestInstances[listName] = new ClosestVector(
        this.colorListsRGBArrays[listName]
      );
    });
  }

  _validateListKey (listKey) {
    if (!this.colorLists[listKey]) {
      throw new Error(`List key "${listKey}" is not valid.`);
    } else {
      return true;
    }
  }

  /**
   * returns all colors that match a name
   * @param {string} searchStr search term
   * @param {boolen} bestOf    if set only returns good names
   */
  searchNames (searchStr, listKey = 'default') {
    this._validateListKey(listKey);
    return this.colorLists[listKey].filter(
      color => color.name.toLowerCase().includes(searchStr.toLowerCase())
    );
  }

  /**
   * names an array of colors
   * @param   {array} colorArr array containing hex values without the hash
   * @param   {boolean} unique if set to true every returned name will be unque
   * @param   {boolean} bestOf if set only returns good names
   * @return  {object}         object containing all nearest colors
   */
  getNamesForValues(colorArr, unique = false, listKey = 'default') {
    let localClosest = this.closestInstances[listKey];

    if (unique) {
      localClosest = new ClosestVector(
        this.colorListsRGBArrays[listKey],
        true
      );
    }

    let lastResult = null;

    const colorResp = colorArr.map((hex) => {
      // calculate RGB values for passed color
      const rgb = lib.hexToRgb(hex);

      // get the closest named colors
      let closestColor = localClosest.get([rgb.r, rgb.g, rgb.b]);
      if (closestColor && unique) {
        lastResult = closestColor;
      } else if (unique) {
        closestColor = lastResult;
      }
      const color = this.colorLists[listKey][closestColor.index];

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


