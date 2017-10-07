const http = require('http');
const url = require('url');
const fs = require('fs');
const zlib = require('zlib');
const lib = require('./lib.js');
const ClosestVector = require('../node_modules/closestvector/index.umd.js');
const colors = JSON.parse(
  fs.readFileSync(__dirname + '/../dist/colornames.json', 'utf8')
);
const port = process.env.PORT || 8080;
const currentVersion = 'v1';
const APIurl = ''; // subfolder for the API
const baseUrl = `${APIurl}${currentVersion}/`;
const urlColorSeparator = ',';
const responseHeaderObj = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Credentials': false,
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  'Content-Encoding': 'gzip',
  'Content-Type': 'application/json; charset=utf-8',
}

// object containing the name:hex pairs for nearestColor()
const rgbColorsArr = [];

colors.forEach((c) => {
  const rgb = lib.hexToRgb(c.hex);
  // populates array needed for ClosestVector()
  rgbColorsArr.push([rgb.r, rgb.g, rgb.b]);
  // transform hex to RGB
  c.rgb = rgb;
  // calculate luminancy for each color
  c.luminance = lib.luminance(rgb);
});


const closest = new ClosestVector(rgbColorsArr);
/**
 * validates a hex color
 * @param   {string} color hex representation of color
 * @return  {boolen}
 */
const validateColor = (color) => (
  /^[0-9A-F]{3}([0-9A-F]{3})?$/i.test(color)
);

/**
 * names an array of colors
 * @param   {array} colorArr array containing hex values without the hash
 * @return  {object}         object containing all nearest colors
 */
const nameColors = (colorArr) => {
  return colorArr.map((hex) => {
    // calculate RGB values for passed color
    const rgb = lib.hexToRgb(hex);

    // get the closest named colors
    const closestColor = closest.get([rgb.r, rgb.g, rgb.b]);
    const color = colors[closestColor.closestIndex];
    return {
      hex: color.hex,
      name: color.name,
      rgb: color.rgb,
      requestedHex: `#${hex}`,
      luminance: color.luminance,
      distance: closestColor.distance,
    };
  })
};

/**
 * responds to the client
 * @param {object} response      server response object
 * @param {object} responseObj   the actual response object
 * @param {*} statusCode         HTTP status code
 */
const httpRespond = (response, responseObj = {}, statusCode = 200) => {
  response.writeHead(statusCode, responseHeaderObj);
  // ends the response with the gziped API answer
  zlib.gzip(JSON.stringify(responseObj), (_, result) => {
    response.end(result);
  });
};

/**
 * Paths:
 *
 * /                      => Error
 * /v1/                   => all colors
 * /v1/212121             => array with one color
 * /v1/212121,222,f02f123 => array with 3 color
 */

const requestHandler = (request, response) => {
  const requestUrl = url.parse(request.url);
  const isAPI = requestUrl.pathname.indexOf(baseUrl) !== -1;

  // makes sure the API is beeing requested
  if (!isAPI) {
    return httpRespond(response, {error: {
      status: 404,
      message: 'invalid URL: make sure to provide the API version',
    }}, 404);
  }

  const search = requestUrl.search || '';
  let colorQuery = request.url.replace(requestUrl.search, '')
                   // splits the base url from the everything
                   // after the API URL
                   .split(baseUrl)[1] || '';

  // gets all the colors after
  const urlColorList = colorQuery.toLowerCase()
                       .split(urlColorSeparator)
                       .filter((hex) => (hex));

  // creates a list of invalid colors
  const invalidColors = urlColorList.filter((hex) => (
    !validateColor(hex) && hex
  ));

  if (invalidColors.length) {
    return httpRespond(response, {error: {
      status: 404,
      message: `'${invalidColors.join(', ')}' is not a valid HEX color`,
    }}, 404);
  }

  return httpRespond(response, {
    colors: urlColorList[0] ? nameColors(urlColorList) : colors,
  }, 200);
};

const server = http.createServer(requestHandler);
server.listen(port, '0.0.0.0', (error) => {
  if (error) {
    return console.log(`something terrible happened: ${error}`);
  }
  console.log(`Server running and listening on port ${port}`);
  console.log(`http://localhost:${port}/${baseUrl}`);
});
