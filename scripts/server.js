const http = require('http');
const fs = require('fs');
const nearestColor = require('../node_modules/nearest-color/nearestColor.js');
const colors = JSON.parse(
  fs.readFileSync(__dirname + '/../dist/colornames.json', 'utf8')
);
const port = process.env.PORT || 8080;
const baseUrl = 'v1/';

let colorsObj = {};

colors.forEach((c) => {
  colorsObj[c.name] = c.hex;
});

const nc = nearestColor.from(colorsObj);
/**
 * validates a hex color
 * @param   {string} color hex representation of color
 * @return {boolen}
 */
function validateColor(color) {
  return /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(color);
}
/**
 * names an array of colors
 * @param   {array} colorArr array containing hex values without the hash
 * @return  {object}         object containing all nearest colors
 */
function nameColors(colorArr) {
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
}

http.createServer((req, res) => {
  const isAPI = req.url.indexOf(baseUrl) !== -1;
  let status = 200;
  let colorQuery = req.url.toLowerCase();
      colorQuery = colorQuery.split(baseUrl)[1] || '';

  const urlColorList = colorQuery.split(',');
  const response = {status: '', colors: {}};

  if (!urlColorList.length) {
    response.status = 'no colors provided';
    status = 400;
  }

  if (!isAPI && status == 200) {
    response.status = 'invalid URL: make sure to provide the API version';
    status = 400;
  }

  const invalidColors = urlColorList.filter((hex) => {
    return !validateColor(hex);
  });

  if (status == 200 && invalidColors.length) {
    response.status = `'${invalidColors.join(',')}' are not valid HEX color values`;
    status = 400;
  } else if (status == 200) {
    response.status = `names for '${urlColorList.join(',')}' returned`;
    response.colors = nameColors(urlColorList);
  }

  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    'Content-Type': 'application/json',
  });

  res.write(JSON.stringify(response));
  res.end();
}).listen(port, '0.0.0.0');

console.log(`Server running and listening on port ${port}`);
