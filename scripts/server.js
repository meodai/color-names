const http = require('http');
const url = require('url');
const fs = require('fs');
const zlib = require('zlib');
const nearestColor = require('../node_modules/nearest-color/nearestColor.js');
const colors = JSON.parse(
  fs.readFileSync(__dirname + '/../dist/colornames.json', 'utf8')
);
const port = process.env.PORT || 8080;
const currentVersion = 'v1';
const APIurl = ''; // subfolder for the API
const baseUrl = `${APIurl}${currentVersion}/`;

/**
 * disassembles a HEX color to its RGB components
 * @param   {string} hex hex color representatin
 * @return  {object}     {r,g,b}
 */
const hexToRgb = (hex) => {
  const int = parseInt(hex.replace('#', ''), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
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
 * @return  {boolen}
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
  return colorArr.map((hex) => {
    const closestColor = nc(`#${hex}`);
    const rgb = hexToRgb(hex);
    return {
      hex: closestColor.value,
      name: closestColor.name,
      rgb: closestColor.rgb,
      requestedHex: `#${hex}`,
      // checks if the requested & returned color are identical
      distance: Math.sqrt(
        Math.pow(closestColor.rgb.r - rgb.r, 2) +
        Math.pow(closestColor.rgb.g - rgb.g, 2) +
        Math.pow(closestColor.rgb.b - rgb.b, 2)
      ),
    };
  })
};

const httpRespond = (response, responseObj = {}, statusCode = 200) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Credentials': false,
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    'Content-Encoding': 'gzip',
    'Content-Type': 'application/json; charset=utf-8',
  });

  // ends the response with the API answer
  zlib.gzip(JSON.stringify(responseObj), (_, result) => {
    response.end(result);
  });
};

const requestHandler = (request, response) => {
  const requestUrl = url.parse(request.url);
  const isAPI = requestUrl.pathname.indexOf(baseUrl) !== -1;
  const search = requestUrl.search || '';
  let colorQuery = request.url.toLowerCase();
      colorQuery = colorQuery.replace(requestUrl.search, '');
      colorQuery = colorQuery.split(baseUrl)[1] || '';

  const urlColorList = colorQuery.split(',').filter((hex) => (hex));
  const responseObj = {};
  const invalidColors = urlColorList.filter((hex) => (
    !validateColor(hex) && hex
  ));

  if (!isAPI) {
    responseObj.error = {
      status: 404,
      message: 'invalid URL: make sure to provide the API version',
    };
  } else if (!urlColorList[0]) {
    responseObj.colors = colors;
  } else if (invalidColors.length) {
    responseObj.error = {
      status: 404,
      message: `'${invalidColors.join(', ')}' is not a valid HEX color`,
    };
  } else if (!invalidColors.length && isAPI) {
    responseObj.colors = nameColors(urlColorList);
  }

  httpRespond(
    response,
    responseObj,
    responseObj.error ? responseObj.error.status : 200
  );
};

const server = http.createServer(requestHandler);
server.listen(port, '0.0.0.0', (error) => {
  if (error) {
    return console.log(`something terrible happened: ${error}`);
  }
  console.log(`Server running and listening on port ${port}`);
  console.log(`http://localhost:${port}/${baseUrl}`);
});
