import { describe, it, expect, beforeAll } from 'vitest';
import { csvTestData } from './csv-test-data.js';
import britishSpellingAllowlist from './british-spelling-allowlist.json';
import { buildFailureMessage } from './_utils/report.js';

describe('British English Spelling', () => {
  beforeAll(() => {
    csvTestData.load();
  });

  /**
   * American to British spelling patterns
   * Each entry: [American pattern (regex), British replacement, description]
   */
  const americanToBritishPatterns = [
    // -or vs -our (color/colour, honor/honour, etc.)
    // But NOT: glamor (acceptable), or words like "or", "for", "nor"
    [/\b(\w*)(arb|arm|behavi|col|enam|endeav|fav|ferv|flav|glam|harb|hon|hum|lab|neighb|od|parl|rum|sav|splend|val|vap|vig)or(ed|ing|y|ful|less|able|er|ist|hood|ite|al|ly|s)?\b/gi, '$1$2our$3', '-or should be -our (e.g., colour, honour)'],

    // -ize vs -ise (organize/organise, realize/realise, etc.)
    // Note: Some -ize words are acceptable in British English, so we only flag common ones
    [/\b(\w*)(agon|appet|apolog|author|capital|caramel|categor|character|colon|critic|crystall|emphas|energ|equal|fantas|fertil|final|fossil|legal|maxim|memor|mesmer|minim|mobil|modern|normal|optim|organ|paraly|popular|priorit|real|recogn|stabil|standard|summar|symbol|synchron|tantal|terror|util|vandal|vapor|visual|vulcan)iz(e|ed|es|ing|er|ation|able)\b/gi, '$1$2is$3', '-ize should be -ise (e.g., organise, realise)'],

    // -er vs -re (center/centre, theater/theatre, etc.)
    [/\b(calib|cent|epicent|fib|goit|lit|lust|meag|met|nit|och|reconnoit|sab|scept|sepulch|somb|spect|theat|tit)er\b/gi, '$1re', '-er should be -re (e.g., centre, theatre)'],
    // Special case: maneuver -> manoeuvre
    [/\b(maneuver)\b/gi, 'manoeuvre', '-er should be -re (e.g., centre, theatre)'],
    // Special case: miter -> mitre
    [/\b(mit)er\b/gi, '$1re', '-er should be -re (e.g., centre, theatre)'],

    // -ense vs -ence (defense/defence, offense/offence, etc.)
    [/\b(def|off|pret|lic)ense\b/gi, '$1ence', '-ense should be -ence (e.g., defence, offence)'],

    // -og vs -ogue (catalog/catalogue, dialog/dialogue, etc.)
    [/\b(anal|catal|dial|monol|prol)og\b/gi, '$1ogue', '-og should be -ogue (e.g., catalogue, dialogue)'],

    // -eled/-eling vs -elled/-elling (traveled/travelled, etc.)
    [/\b(\w*)(bevel|cancel|carol|channel|fuel|label|level|model|panel|signal|travel)(ed|ing)\b/gi, '$1$2l$3', 'should use double l (e.g., travelled, cancelled)'],

    // gray vs grey
    [/\bgray(\w*)\b/gi, 'grey$1', 'should be "grey" (British spelling)'],

    // Specific common words
    [/\b(A|a)irplane(\w*)\b/g, '$1eroplane$2', 'should be "aeroplane" (British spelling)'],
    [/\b(A|a)rcheolog(\w*)\b/g, '$1rchaeolog$2', 'should be "archaeology" (British spelling)'],
    [/\b(A|a)rtifact(\w*)\b/g, '$1rtefact$2', 'should be "artefact" (British spelling)'],
    [/\b(C|c)heckered\b/g, '$1hequered', 'should be "chequered" (British spelling)'],
    [/\b(C|c)hili\b/g, '$1hilli', 'should be "chilli" (British spelling)'],
    [/\b(C|c)himera\b/g, '$1himaera', 'should be "chimaera" (British spelling)'],
    [/\b(C|c)ozy\b/g, '$1osy', 'should be "cosy" (British spelling)'],
    [/\b(D|d)isk\b/g, '$1isc', 'should be "disc" (British spelling)'],
    [/\b(D|d)onut(\w*)\b/g, '$1oughnut$2', 'should be "doughnut" (British spelling)'],
    [/\b(D|d)raft(\w*)\b/g, '$1raught$2', 'should be "draught" (British spelling)'],
    [/\b(E|e)on\b/g, '$1eon', 'should be "aeon" (British spelling)'],
    [/\b(G|g)riffin\b/g, '$1ryphon', 'should be "gryphon" (British spelling)'],
    [/\b(H|h)emoglobin\b/g, '$1aemoglobin', 'should be "haemoglobin" (British spelling)'],
    [/\b(H|h)omeopath(\w*)\b/g, '$1omoeopath$2', 'should be "homoeopathy" (British spelling)'],
    [/\b(J|j)ewelry\b/g, '$1ewellery', 'should be "jewellery" (British spelling)'],
    [/\b(M|m)arvelous\b/g, '$1arvellous', 'should be "marvellous" (British spelling)'],
    [/\b(M|m)old(y|er)?\b/g, '$1ould$2', 'should be "mould/mouldy/moulder" (British spelling)'],
    [/\b(M|m)ustache\b/g, '$1oustache', 'should be "moustache" (British spelling)'],
    [/\b(P|p)ajamas\b/g, '$1yjamas', 'should be "pyjamas" (British spelling)'],
    [/\b(P|p)low(\w*)\b/g, '$1lough$2', 'should be "plough" (British spelling)'],
    [/\b(M|m)olt(?!en)(\w*)\b/g, '$1oult$2', 'should be "moult" (British spelling)'],
    [/\b(S|s)keptic(\w*)\b/g, '$1ceptic$2', 'should be "sceptic" (British spelling)'],
    [/\b(S|s)molder(\w*)\b/g, '$1moulder$2', 'should be "smoulder" (British spelling)'],
    [/\b(S|s)ulfur(\w*)\b/g, '$1ulphur$2', 'should be "sulphur" (British spelling)'],
    [/\b(T|t)ranquility\b/g, '$1ranquillity', 'should be "tranquillity" (British spelling)'],
    [/\b(W|w)ool(en|y)\b/g, '$1ooll$2', 'should be "woollen/woolly" (British spelling)'],
    [/\b(Y|y)ogurt\b/g, '$1oghurt', 'should be "yoghurt" (British spelling)'],
    [/\b(A|a)luminum\b/g, '$1luminium', 'should be "aluminium" (British spelling)'],
    [/\b(A|a)ging\b/g, '$1geing', 'should be "ageing" (British spelling)'],
  ];

  it('should use British English spelling (unless in allowlist)', () => {
    const allowlistSet = new Set(
      britishSpellingAllowlist.map((name) => name.toLowerCase())
    );

    const americanSpellings = [];

    csvTestData.data.entries.forEach((entry, index) => {
      const name = entry.name;

      // Skip if in allowlist
      if (allowlistSet.has(name.toLowerCase())) {
        return;
      }

      // Check each pattern
      for (const [pattern, replacement, description] of americanToBritishPatterns) {
        const match = name.match(pattern);
        if (match) {
          americanSpellings.push({
            name,
            match: match[0],
            issue: description,
            lineNumber: index + 2,
            suggestion: name.replace(pattern, replacement),
          });
          break; // Only report first issue per name
        }
      }
    });

    if (americanSpellings.length > 0) {
      const details = americanSpellings.map(
        ({ name, match, issue, lineNumber, suggestion }) =>
          `  * line ${lineNumber}: "${name}" contains "${match}" - ${issue} (Suggested: "${suggestion}")`
      );

      throw new Error(
        buildFailureMessage({
          title: 'Found {n} color {items} with American English spelling:',
          offenders: americanSpellings.map((item) => item.name),
          offenderLabel: 'name',
          details: [
            ...details,
            '',
            'As per CONTRIBUTING.md, use British English spelling unless the name',
            'refers to something typically American (place names, proper nouns, etc.)',
            '',
            'Common differences:',
            '  • gray → grey',
            '  • center → centre',
            '  • honor → honour',
            '  • organize → organise',
          ],
          tips: [
            'Fix the spelling in src/colornames.csv',
            'Or add the name to tests/british-spelling-allowlist.json if the American spelling is intentional',
            'After changes, run: npm run sort-colors',
          ],
        })
      );
    }

    expect(americanSpellings.length).toBe(0);
  });
});
