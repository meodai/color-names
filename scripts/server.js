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
const FindColors = require('./findColors.js');
const port = process.env.PORT || 8080;
const currentVersion = 'v1';
const urlNameSubpath = 'names';
const APIurl = ''; // subfolder for the API
const baseUrl = `${APIurl}${currentVersion}/`;
const baseUrlNames = `${baseUrl}${urlNameSubpath}/`;
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

const findColors = new FindColors(colors, colorsBestOf);

/**
 * validates a hex color
 * @param   {string} color hex representation of color
 * @return  {boolen}
 */
const validateColor = (color) => (
  /^[0-9A-F]{3}([0-9A-F]{3})?$/i.test(color)
);

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

const respondNameSearch = (
    searchParams = new URLSearchParams(''),
    goodNamesMode = false,
    requestUrl,
    request,
    response
) => {
  const nameQuery = request.url.replace(requestUrl.search, '')
  // splits the base url from everything
  // after the API URL
      .split(baseUrlNames)[1] || '';

  // gets the name
  const nameString = searchParams.has('name')
                     ? searchParams.get('name') : '';

  const searchString = decodeURI(nameString || nameQuery);

  if (searchString.length < 3) {
    return httpRespond(response, {error: {
      status: 404,
      message: `the color name your are looking for must be at least 3 characters long.`,
    }}, 404);
  }

  return httpRespond(response, {
    colors: findColors.searchNames(searchString, goodNamesMode),
  }, 200);
};

const respondValueSearch = (
    searchParams = new URLSearchParams(''),
    goodNamesMode = false,
    requestUrl,
    request,
    response
) => {
  const uniqueMode = searchParams.has('noduplicates')
                    && searchParams.get('noduplicates') === 'true';

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
    findColors.getNamesForValues(urlColorList, uniqueMode, goodNamesMode):
    (goodNamesMode ? colorsBestOf : colors),
  }, 200);
};

/**
 * Paths:
 *
 * /                      => Error
 * /v1/                   => all colors
 * /v1/212121             => array with one color
 * /v1/212121,222,f02f123 => array with 3 color
 * /v1/names/             => all colors
 * /v1/names/red          => all colors containing the word red
 */

const requestHandler = (request, response) => {
  const requestUrl = url.parse(request.url);
  const isAPI = requestUrl.pathname.includes(baseUrl);
  const isNamesAPI = requestUrl.pathname.includes(urlNameSubpath + '/');

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

  const goodNamesMode = searchParams.has('goodnamesonly')
                        && searchParams.get('goodnamesonly') === 'true';

  if (!isNamesAPI) {
    return respondValueSearch(
        searchParams,
        goodNamesMode,
        requestUrl,
        request,
        response
    );
  } else {
    return respondNameSearch(
        searchParams,
        goodNamesMode,
        requestUrl,
        request,
        response
    );
  }
};

const server = http.createServer(requestHandler);
server.listen(port, '0.0.0.0', (error) => {
  if (error) {
    return console.log(`something terrible happened: ${error}`);
  }
  console.log(`Server running and listening on port ${port}`);
  console.log(`http://localhost:${port}/${baseUrl}`);
});
