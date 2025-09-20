// Small utility to build consistent, helpful failure messages in tests.
// Keeps output informative while avoiding repeated boilerplate in each test file.

/**
 * Simple pluralization helper
 * @param {number} n
 * @param {string} singular
 * @param {string} [plural]
 * @returns {string}
 */
export function pluralize(n, singular, plural = `${singular}s`) {
  return n === 1 ? singular : plural;
}

/**
 * Join values as a readable, comma-separated list.
 * Ensures uniqueness and stable order.
 * @param {Array<string|number>} items
 * @returns {string}
 */
export function list(items) {
  if (!items || !items.length) return '';
  const uniq = [...new Set(items.map(String))];
  return uniq.join(', ');
}

/**
 * Build a consistent failure message for test assertions.
 *
 * @param {Object} opts
 * @param {string} opts.title - Heading/title of the error (without counts)
 * @param {Array<string>} [opts.offenders] - Values to summarize in a one-line list.
 * @param {string} [opts.offenderLabel] - Label for offenders list (e.g. "name", "hex code").
 * @param {Array<string>} [opts.details] - Additional bullet/section lines to include.
 * @param {Array<string>} [opts.tips] - How-to-fix tips appended at the end.
 * @param {number} [opts.count] - Optional explicit count (defaults to offenders.length).
 * @param {string} [opts.icon] - Optional icon/emphasis prefix, default ⛔.
 * @returns {string}
 */
export function buildFailureMessage({
  title,
  offenders = [],
  offenderLabel = 'item',
  details = [],
  tips = [],
  count,
  icon = '⛔',
} = {}) {
  const msgLines = [];
  const n = typeof count === 'number' ? count : offenders.length;

  msgLines.push(
    `${icon} ${title.replace('{n}', String(n)).replace('{items}', pluralize(n, offenderLabel))}`
  );
  msgLines.push('');

  if (offenders.length) {
    msgLines.push(`Offending ${pluralize(offenders.length, offenderLabel)}: ${list(offenders)}`);
    msgLines.push('*-------------------------*');
    msgLines.push('');
  }

  if (details.length) {
    for (const line of details) msgLines.push(line);
    msgLines.push('');
  }

  if (tips.length) {
    msgLines.push('Tip:');
    for (const t of tips) msgLines.push(`  - ${t}`);
    msgLines.push('');
  }

  msgLines.push('*-------------------------*');
  return msgLines.join('\n');
}
