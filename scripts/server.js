const http = require('http');
const url = require('url');
const fs = require('fs');
const zlib = require('zlib');
const colors = JSON.parse(
    fs.readFileSync(__dirname + '/../dist/colornames.json', 'utf8')
);
const colorsBestOf = JSON.parse(
    fs.readFileSync(__dirname + '/../dist/colornames.bestof.json', 'utf8')
);
const NameColors = require('./nameColors.js');
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
};

const nameColors = new NameColors(colors, colorsBestOf);

/**
 * validates a hex color
 * @param   {string} color hex representation of color
 * @return  {boolen}
 */
const validateColor = (color) => (
  /^[0-9A-F]{3}([0-9A-F]{3})?$/i.test(color)
);


/*
const parseSearchString = (searchStr) => {
  const objURL = {};

  searchStr.replace(
      new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
      ($0, $1, $2, $3) => {
        objURL[$1] = $3;
      }
  );

  return objURL;
};
*/
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

  // understanding where requests come from
  console.info(
      'request from',
      request.headers.origin
  );

  // makes sure the API is beeing requested
  if (!isAPI) {
    return httpRespond(response, {error: {
      status: 404,
      message: 'invalid URL: make sure to provide the API version',
    }}, 404);
  }

  // const search = requestUrl.search || '';
  const searchParams = new URLSearchParams(requestUrl.search);

  const uniqueMode = searchParams.has('noduplicates')
                     && searchParams.get('noduplicates') === 'true';

  const goodNamesMode = searchParams.has('goodnamesonly')
                        && searchParams.get('goodnamesonly') === 'true';

  const colorQuery = request.url.replace(requestUrl.search, '')
  // splits the base url from everything
  // after the API URL
      .split(baseUrl)[1] || '';

  const colorListString = searchParams.has('values')
                          ? searchParams.get('values') : '';

  // gets all the colors after
  const urlColorList = (colorQuery || colorListString).toLowerCase()
      .split(urlColorSeparator)
      .filter((hex) => hex);

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
    colors: urlColorList[0] ?
    nameColors.getNames(urlColorList, uniqueMode, goodNamesMode):
    (goodNamesMode ? colorsBestOf : colors),
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
