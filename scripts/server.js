const http = require('http');
const fs = require('fs');
const nearestColor = require('../node_modules/nearest-color/nearestColor.js');
const colors = JSON.parse(
  fs.readFileSync(__dirname + '/../dist/colornames.json', 'utf8')
);
const port = process.env.PORT || 8080;
const baseUrl = 'v1/';

/**
 * disassembles a HEX color to its RGB components
 * @param   {string} hex hex color representatin
 * @return  {object}     {r,g,b}
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
  } : null;
};

// object containing the name:hex pairs for nearestColor()
const colorsObj = {};

colors.forEach((c) => {
  // populates object needed for nearestColor()
  colorsObj[c.name] = c.hex;
  // transform hex to RGB
  c.rgb = hexToRgb(c.hex);
});

const nc = nearestColor.from(colorsObj);
/**
 * validates a hex color
 * @param   {string} color hex representation of color
 * @return {boolen}
 */
const validateColor = (color) => (
  /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(color)
);

/**
 * names an array of colors
 * @param   {array} colorArr array containing hex values without the hash
 * @return  {object}         object containing all nearest colors
 */
const nameColors = (colorArr) => {
  let colors = {};
  colorArr.forEach((hex) => {
    const closestColor = nc('#' + hex);
    colors['#' + hex] = {
      name: closestColor.name,
      hex: closestColor.value,
      rgb: closestColor.rgb,
      isExactMatch: closestColor.value.substr(1) === hex,
    };
  });
  return colors;
};

const httpRespond = (response, responseObj = {}, statusCode = 200) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    'Content-Type': 'application/json',
  });

  // ends the response with the API answer
  response.end(JSON.stringify(responseObj));
};

const requestHandler = (request, response) => {
  const isAPI = request.url.indexOf(baseUrl) !== -1;
  let statusCode = 400;
  let colorQuery = request.url.toLowerCase();
      colorQuery = colorQuery.split(baseUrl)[1] || '';

  const urlColorList = colorQuery.split(',');
  const responseObj = {status: 'Someting went wrong', colors: {}};
  const invalidColors = urlColorList.filter((hex) => {
    !validateColor(hex) && hex;
  });

  if (!isAPI) {
    responseObj.status = 'invalid URL: make sure to provide the API version';
    statusCode = 400;
  } else if (!urlColorList[0]) {
    responseObj.status = 'no color(s) provided, returning all the colors';
    responseObj.colors = colors;
    statusCode = 200;
  } else if (invalidColors.length) {
    responseObj.status = `'${invalidColors.join(', ')}' is not a valid HEX color`;
    statusCode = 400;
  } else {
    responseObj.status = `names for '${urlColorList.join(',')}' returned`;
    responseObj.colors = nameColors(urlColorList);
    statusCode = 200;
  }

  httpRespond(response, responseObj, statusCode);
};

const server = http.createServer(requestHandler);
server.listen(port, '0.0.0.0', (error) => {
  if (error) {
    return console.log(`something terrible happened: ${error}`);
  }
  console.log(`Server running and listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});

