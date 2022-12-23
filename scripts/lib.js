module.exports = {
  /**
   * takes a CSV string an parse it
   * @param   {String} csvString    CSV file contents
   * @param   {String} csvDelimitor
   * @param   {String} csvNewLine
   * @return {Object} Object with all entries, headers as Array,
   *                   and entires per header as Array
   */
  parseCSVString: (csvString, csvDelimitor = ',', csvNewLine = '\r\n') => {
    const rows = csvString.split(csvNewLine);

    // remove last empty row (if there is any)
    if (!rows.slice(-1)[0]) {
      rows.pop();
    }

    // extracts all the CSV headers
    const headers = rows.shift().split(csvDelimitor);

    // collection of values per row
    const values = {};

    headers.forEach((header) => {
      values[header] = [];
    });

    const entires = rows.map((row) => {
      // decomposes each row into its single entries
      const rowArr = row.split(csvDelimitor);

      // creates an object for for each entry
      const entry = {};

      // populates the entries
      headers.forEach((header, i) => {
        const value = rowArr[i];
        entry[header] = value;

        // collects values
        values[header].push(value);
      });

      return entry;
    });

    return {headers, entires, values};
  },

  /**
   * finds duplicates in a simple array
   * @param   {array} arr array of items containing comparable items
   * @return  {array}     array of second (or more) instance of duplicate items
   */
  findDuplicates: (arr) => {
    const lookUpObj={};
    const dupes = [];

    arr.forEach((item) => {
      if (lookUpObj.hasOwnProperty(item)) {
        dupes.push(item);
      }
      lookUpObj[item]=0;
    });

    return dupes;
  },

  objArrToString: (arr, keys, options) => {
    const settings = Object.assign({}, {
      includeKeyPerItem: false,
      beforeKey: '',
      afterKey: '',
      beforeValue: '',
      afterValue: '',
      keyValueSeparator: ':',
      insertBefore: '',
      insertAfter: '',
      rowDelimitor: '\r\n',
      itemDelimitor: ',',
    }, options);

    return settings.insertBefore + arr.map((item) => {
      return keys.map((key) => {
        return (settings.includeKeyPerItem ? settings.beforeKey + key + settings.afterKey + settings.keyValueSeparator : '') + settings.beforeValue + item[key] + settings.afterValue;
      }).join(settings.itemDelimitor);
    }).join(settings.rowDelimitor) + settings.insertAfter;
  },
};
