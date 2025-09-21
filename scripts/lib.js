/**
 * takes a CSV string an parse it
 * @param   {String} csvString    CSV file contents
 * @param   {String} csvDelimitor
 * @param   {String} csvNewLine
 * @return {Object} Object with all entries, headers as Array,
 *                   and entires per header as Array
 */
export const parseCSVString = (csvString, csvDelimitor = ',', csvNewLine = /\r?\n/) => {
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

  const entries = rows.map((row) => {
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

  return { headers, entries, values };
};

/**
 * finds duplicates in a simple array
 * @param   {array} arr array of items containing comparable items
 * @return  {array}     array of second (or more) instance of duplicate items
 */
export const findDuplicates = (arr) => {
  const lookUpObj = {};
  const dupes = [];

  arr.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(lookUpObj, item)) {
      dupes.push(item);
    }
    lookUpObj[item] = 0;
  });

  return dupes;
};

export const objArrToString = (arr, keys, options) => {
  const settings = Object.assign(
    {},
    {
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
    },
    options
  );

  return (
    settings.insertBefore +
    arr
      .map((item) => {
        return keys
          .map((key) => {
            return (
              (settings.includeKeyPerItem
                ? settings.beforeKey + key + settings.afterKey + settings.keyValueSeparator
                : '') +
              settings.beforeValue +
              item[key] +
              settings.afterValue
            );
          })
          .join(settings.itemDelimitor);
      })
      .join(settings.rowDelimitor) +
    settings.insertAfter
  );
};

/**
 * Normalize a color name to detect near-duplicates.
 * - Lowercase
 * - Strip diacritics
 * - Remove all non-alphanumeric characters
 * Examples:
 *  "Snow Pink" -> "Snowpink"
 * @param {string} name
 * @return {string}
 */
export const normalizeNameForDuplicates = (name) => {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
};

/**
 * Given a list of items with a name and optional lineNumber, find groups of
 * near-duplicate names that collapse to the same normalized key.
 *
 * @param {Array<{name:string, lineNumber?:number}>} items
 * @returns {Array<{norm:string, entries:Array<{name:string, lineNumber?:number}>}>}
 */
export const findNearDuplicateNameConflicts = (items, options = {}) => {
  const {
    allowlist = [],
    foldPlurals = false,
    pluralAllowlist = [],
    foldStopwords = false,
    stopwords = [],
  } = options;

  // Precompute stopword set (normalized to lowercase ASCII) when folding is enabled
  const stopSet = foldStopwords
    ? new Set(
        (Array.isArray(stopwords) ? stopwords : [])
          .filter((w) => typeof w === 'string' && w.trim().length)
          .map((w) =>
            String(w)
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
          )
      )
    : null;

  // Helper: normalize name using current options (stopword folding if enabled)
  const normalizeForOptions = (name) => {
    const base = String(name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const tokens = base.match(/[a-z0-9]+/g) || [];
    const filtered =
      foldStopwords && stopSet && stopSet.size ? tokens.filter((t) => !stopSet.has(t)) : tokens;
    return filtered.length ? filtered.join('') : normalizeNameForDuplicates(name);
  };

  // Normalize allowlist entries using the same normalization function.
  const allowSet = new Set(
    (Array.isArray(allowlist) ? allowlist : [])
      .filter((v) => typeof v === 'string' && v.trim().length)
      .map((v) => normalizeForOptions(String(v)))
  );

  const byNorm = new Map();
  for (const item of items) {
    if (!item || typeof item.name !== 'string') continue;
    const norm = normalizeForOptions(item.name);
    if (!byNorm.has(norm)) byNorm.set(norm, []);
    byNorm.get(norm).push({ name: item.name, lineNumber: item.lineNumber });
  }

  // Optional plural folding: merge keys ending in 's' with their singular if present.
  if (foldPlurals) {
    const pluralAllowSet = new Set(
      (Array.isArray(pluralAllowlist) ? pluralAllowlist : [])
        .filter((v) => typeof v === 'string' && v.trim().length)
        // Use the same normalization as used for keys (respects stopword folding)
        .map((v) => normalizeForOptions(String(v)))
    );
    // We iterate over a snapshot of keys because we'll mutate the map.
    for (const key of Array.from(byNorm.keys())) {
      if (key.length < 4) continue; // avoid over-aggressive folding for tiny words
      if (!key.endsWith('s')) continue;
      if (key.endsWith('ss')) continue; // glass vs glas, moss vs mos, keep
      if (pluralAllowSet.has(key)) continue; // explicit allow: don't fold
      const singular = key.slice(0, -1);
      if (byNorm.has(singular)) {
        // merge arrays
        const merged = [...byNorm.get(singular), ...byNorm.get(key)];
        byNorm.set(singular, merged);
        byNorm.delete(key);
      }
    }
  }

  const conflicts = [];
  for (const [norm, arr] of byNorm.entries()) {
    if (allowSet.has(norm)) continue; // explicitly allowed
    const uniqueNames = Array.from(new Set(arr.map((x) => x.name)));
    if (uniqueNames.length > 1) {
      conflicts.push({ norm, entries: arr });
    }
  }

  return conflicts;
};
