import { describe, it, expect, beforeAll } from 'vitest';
import { csvTestData } from './csv-test-data.js';
import { buildFailureMessage } from './_utils/report.js';

describe('APA Title Case Validation', () => {
  beforeAll(() => {
    // Load CSV data once for all tests
    csvTestData.load();
  });

  /**
   * Determine if a word should be capitalized according to APA title case rules
   * @param {string} word - The word to check
   * @param {boolean} isFirstWordOrAfterPunctuation - True if this is the first word or after punctuation
   * @param {boolean} isAfterPunctuation - True if this word comes after punctuation
   * @param {boolean} isLastWord - True if this is the last word in the title
   * @returns {boolean} - True if the word should be capitalized
   */
  function shouldBeCapitalized(
    word,
    isFirstWordOrAfterPunctuation,
    isAfterPunctuation,
    isLastWord = false
  ) {
    // Always capitalize first words, words after punctuation, and last words
    if (isFirstWordOrAfterPunctuation || isAfterPunctuation || isLastWord) {
      return true;
    }

    // Capitalize words of 4 or more letters
    if (word.length >= 4) {
      return true;
    }

    // Short words (3 letters or fewer) that should be lowercase (unless first, after punctuation, or last)
    const minorWords = new Set([
      // Short conjunctions
      'and',
      'as',
      'but',
      'for',
      'if',
      'nor',
      'or',
      'so',
      'yet',
      // Articles
      'a',
      'an',
      'the',
      // Short prepositions
      'at',
      'by',
      'in',
      'of',
      'off',
      'on',
      'per',
      'to',
      'up',
      'via',
      // for short prepositions
      'de',
      'la',
      'le',
      'les',
      'un',
      'une',
      'du',
      'des',
      'et',
      'ou',
      'à',
      'au',
      'aux',
    ]);

    return !minorWords.has(word.toLowerCase());
  }

  /**
   * Convert a color name to proper APA title case
   * @param {string} name - The color name to convert
   * @returns {string} - The properly formatted title case name
   */
  function toTitleCase(name) {
    // Special cases that should maintain their exact capitalization
    const specialCases = new Map([
      // Roman numerals (case-insensitive key, exact case value)
      ['ii', 'II'],
      ['iii', 'III'],
      ['iv', 'IV'],
      ['vi', 'VI'],
      ['vii', 'VII'],
      ['viii', 'VIII'],
      ['ix', 'IX'],
      ['xi', 'XI'],
      ['xii', 'XII'],

      // Common abbreviations that should stay uppercase
      ['ny', 'NY'],
      ['nyc', 'NYC'],
      ['usa', 'USA'],
      ['uk', 'UK'],
      ['us', 'US'],
      ['bbc', 'BBC'],
      ['cnn', 'CNN'],
      ['fbi', 'FBI'],
      ['cia', 'CIA'],
      ['nasa', 'NASA'],
      ['nato', 'NATO'],
      ['nypd', 'NYPD'],
      ['usmc', 'USMC'],
      ['usc', 'USC'],
      ['ucla', 'UCLA'],
      ['ksu', 'KSU'],
      ['ku', 'KU'],
      ['ou', 'OU'],
      ['msu', 'MSU'],
      ['ua', 'UA'],

      // Technical terms
      ['cg', 'CG'],
      ['cga', 'CGA'],
      ['ega', 'EGA'],
      ['led', 'LED'],
      ['lcd', 'LCD'],
      ['crt', 'CRT'],
      ['vic', 'VIC'],
      ['mvs', 'MVS'],
      ['lua', 'LUA'],
      ['php', 'PHP'],
      ['sql', 'SQL'],
      ['ufo', 'UFO'],
      ['uv', 'UV'],
      ['pcb', 'PCB'],
      ['ntsc', 'NTSC'],
      ['nes', 'NES'],
      ['gmb', 'GMB'],
      ['ocd', 'OCD'],
      ['bbq', 'BBQ'],
      ['ok', 'OK'],
      ['ff', 'FF'],
      ['po', 'PO'],

      // Chemical formulas (maintain exact case)
      ['co₂', 'CO₂'],
      ['h₂o', 'H₂O'],
      ['mos₂', 'MoS₂'],

      // Proper nouns with specific capitalization
      ['mckenzie', 'McKenzie'],
      ['mcnuke', 'McNuke'],
      ['mcquarrie', 'McQuarrie'],
      ["o'brien", "O'Brien"],
      ["o'neal", "O'Neal"],
      ["lechuck's", "LeChuck's"],
      ['davanzo', 'DaVanzo'],
      ['bioshock', 'BioShock'],
      ['microprose', 'MicroProse'],
      ['dodgeroll', 'DodgeRoll'],
      ['aurometalsaurus', 'AuroMetalSaurus'],
      ['yinmn', 'YInMn'],
      ['redяum', 'RedЯum'],
      ['omgreen', 'OMGreen'],

      // foreign words and acronyms
      ['Vers De Terre', 'Vers de Terre'],
    ]);

    // Time pattern regex for expressions like 3AM, 12PM, etc.
    const timePattern = /^\d{1,2}[AP]M$/i;

    /**
     * Check if "LA" in this context likely refers to Los Angeles
     * @param {string} fullName - The complete color name
     * @param {number} wordIndex - Index of the current word
     * @param {string[]} words - Array of all words
     * @returns {boolean} - True if "LA" likely refers to Los Angeles
     */
    function isLosAngelesContext(fullName, wordIndex, words) {
      const lowerName = fullName.toLowerCase();

      // Patterns that suggest Los Angeles context
      const losAngelesIndicators = [
        'vibes',
        'style',
        'sunset',
        'beach',
        'hollywood',
        'california',
        'west coast',
        'city',
        'metro',
        'downtown',
        'freeway',
        'boulevard',
      ];

      // If the name contains any LA indicators, treat "la" as Los Angeles
      if (losAngelesIndicators.some((indicator) => lowerName.includes(indicator))) {
        return true;
      }

      // If "La" is followed by a clearly non-French word, it might be Los Angeles
      const nextWord = words[wordIndex + 2]; // +2 to skip whitespace
      if (nextWord) {
        const nonFrenchPatterns = ['vibes', 'style', 'sunset', 'beach'];
        if (nonFrenchPatterns.some((pattern) => nextWord.toLowerCase().includes(pattern))) {
          return true;
        }
      }

      return false;
    }

    // Split on spaces and handle punctuation
    const words = name.split(/(\s+)/);
    let result = '';
    let isFirstWord = true;

    for (let i = 0; i < words.length; i++) {
      const segment = words[i];

      // Skip whitespace segments
      if (/^\s+$/.test(segment)) {
        result += segment;
        continue;
      }

      // Check if previous segment ended with punctuation that requires capitalization
      const isAfterPunctuation = i > 0 && /[:—–-]$/.test(words[i - 2]);

      // Check for alphanumeric patterns that should stay uppercase (like model numbers)
      // Exclude ordinal numbers (1st, 2nd, 3rd, 18th, etc.)
      const isAlphanumericPattern =
        /^[0-9]+[A-Z]+$/i.test(segment) && !/^\d+(st|nd|rd|th)$/i.test(segment);

      // Handle hyphenated words - both parts should follow title case rules
      if (segment.includes('-')) {
        const parts = segment.split('-');
        const capitalizedParts = parts.map((part, partIndex) => {
          if (!part) return part; // Handle cases like "--"

          // Check if this is a special case
          const lowerPart = part.toLowerCase();
          if (specialCases.has(lowerPart)) {
            return specialCases.get(lowerPart);
          }

          // Check for time patterns
          if (timePattern.test(part)) {
            return part.toUpperCase();
          }

          // Check for alphanumeric patterns (exclude ordinal numbers)
          if (/^[0-9]+[A-Z]+$/i.test(part) && !/^\d+(st|nd|rd|th)$/i.test(part)) {
            return part.toUpperCase();
          }

          // Check for Los Angeles context in hyphenated words
          if (part.toLowerCase() === 'la' && isLosAngelesContext(name, i, words)) {
            return 'LA';
          }

          // Check if this is the last part of the last word in the title
          const isLastPart = partIndex === parts.length - 1;
          const isLastWordInTitle =
            i === words.length - 1 ||
            (i === words.length - 2 && /^\s+$/.test(words[words.length - 1]));
          const isLastWord = isLastPart && isLastWordInTitle;

          const shouldCap = shouldBeCapitalized(
            part,
            isFirstWord || partIndex > 0,
            isAfterPunctuation,
            isLastWord
          );
          return shouldCap
            ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            : part.toLowerCase();
        });
        result += capitalizedParts.join('-');
      } else {
        // Check if this is a special case
        const lowerSegment = segment.toLowerCase();
        if (specialCases.has(lowerSegment)) {
          result += specialCases.get(lowerSegment);
        } else if (timePattern.test(segment)) {
          // Handle time expressions like 3AM, 12PM
          result += segment.toUpperCase();
        } else if (isAlphanumericPattern) {
          // Handle alphanumeric patterns like "400XT"
          result += segment.toUpperCase();
        } else if (lowerSegment === 'la' && isLosAngelesContext(name, i, words)) {
          // Handle Los Angeles context - force uppercase
          result += 'LA';
        } else {
          // Regular word - check if this is the last non-whitespace word
          const isLastWordInTitle =
            i === words.length - 1 ||
            (i === words.length - 2 && /^\s+$/.test(words[words.length - 1]));
          const shouldCap = shouldBeCapitalized(
            segment,
            isFirstWord,
            isAfterPunctuation,
            isLastWordInTitle
          );
          result += shouldCap
            ? segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()
            : segment.toLowerCase();
        }
      }

      isFirstWord = false;
    }

    return result;
  }

  /**
   * Check if a color name follows APA title case rules
   * @param {string} name - The color name to validate
   * @returns {boolean} - True if the name follows proper title case
   */
  function isValidTitleCase(name) {
    const expectedTitleCase = toTitleCase(name);
    return name === expectedTitleCase;
  }

  it.skip('should follow APA title case capitalization rules', () => {
    const invalidNames = [];

    csvTestData.data.values['name'].forEach((name, index) => {
      if (!isValidTitleCase(name)) {
        const entry = csvTestData.data.entries[index];
        const expectedTitleCase = toTitleCase(name);
        invalidNames.push({
          name,
          expected: expectedTitleCase,
          hex: entry.hex,
          lineNumber: index + 2, // +2 for header and 0-based index
        });
      }
    });

    if (invalidNames.length) {
      const details = invalidNames.map(
        ({ name, expected, hex, lineNumber }) =>
          `  * line ${lineNumber}: "${name}" -> should be "${expected}" (${hex})`
      );

      throw new Error(
        buildFailureMessage({
          title: 'Found {n} color {items} not following APA title case:',
          offenders: invalidNames.map((i) => `"${i.name}"`),
          offenderLabel: 'name',
          details: [
            ...details,
            '',
            'Color names should follow APA Style title case capitalization rules:',
            '• Capitalize the first word',
            '• Capitalize major words (nouns, verbs, adjectives, adverbs, pronouns)',
            '• Capitalize words of 4+ letters',
            '• Capitalize both parts of hyphenated words',
            '• Lowercase minor words (3 letters or fewer): articles (a, an, the), short conjunctions (and, as, but, for, if, nor, or, so, yet), and short prepositions (at, by, in, of, off, on, per, to, up, via)',
            '• Always capitalize words after colons, em dashes, or end punctuation',
            '',
            'Reference: https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case',
          ],
          tips: [
            'Edit src/colornames.csv and update the capitalization',
            'Examples: "Red and Blue" → "Red and Blue" (correct)',
            'Examples: "A Shade Of Green" → "A Shade of Green" (of should be lowercase)',
            'Examples: "Self-Report Blue" → "Self-Report Blue" (both parts capitalized)',
            'After changes, run: npm run sort-colors',
          ],
        })
      );
    }

    expect(invalidNames.length).toBe(0);
  });
});
