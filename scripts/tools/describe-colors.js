/**
 * Generates short, AI-written descriptions for colors using a local Ollama model.
 *
 * Reads src/colornames.csv, writes a JSON array to src/descriptions.json
 * keyed by the (name, hex) pair. Records carry `ai: true` to mark them as
 * machine-generated; hand-written entries set `ai: false` and are never
 * overwritten. The run is resumable: colors already present in the output file
 * are skipped, so you can stop (Ctrl-C) and continue at any time.
 *
 * Each color is grounded before the model writes a word:
 *   - how the color actually looks, in the words of the color-description
 *     package (the same words the website shows), so a pink is never "red"
 *   - what the name refers to, from the website's nightly copy of Wikipedia
 *     and Wiktionary (--data), so a reference is recognised, not guessed
 *   - the hex itself, since some spell words (#c0ffee, #fedcba)
 * The model first names the kind of name (pun, reference, place …), then
 * writes one sentence. Each answer is checked (length, worn-out words, color
 * words that don't fit the hex) and sent back for another try when it fails.
 *
 * Usage:
 *   node scripts/tools/describe-colors.js                       # good names only
 *   node scripts/tools/describe-colors.js --all                 # every color
 *   node scripts/tools/describe-colors.js --names="24 Carrot,Zombie" --out=sample.json
 *   node scripts/tools/describe-colors.js --redo                # rewrite every ai entry
 *
 * Flags:
 *   --all              Describe every color, not just rows marked "good name".
 *   --names=a,b        Only these names (comma-separated).
 *   --limit=N          Stop after generating N new descriptions this run.
 *   --model=NAME       Ollama model tag (default: env OLLAMA_MODEL or gemma4:31b).
 *   --temperature=N    Sampling temperature (default 0.7).
 *   --think            Let reasoning models think before answering (slower,
 *                      better at puns and references).
 *   --data=PATH        The website's data folder (website-data branch), for the
 *                      Wikipedia/Wiktionary facts (default website/.data).
 *   --host=URL         Ollama host (default env OLLAMA_HOST or http://127.0.0.1:11434),
 *                      or the server's address with --api=openai.
 *   --api=openai       Talk to an OpenAI-compatible server (vLLM, see modal-llm.py)
 *                      instead of Ollama; --model is then its served name.
 *   --concurrency=N    Colors in flight at once (default 1; 32 suits vLLM).
 *   --out=PATH         Output JSON path (default src/descriptions.json).
 *   --redo             Rewrite descriptions already in the output file (ai ones only).
 *   --force            Same as --redo.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ColorDescription from 'color-description';
import { parseCSVString } from '../lib.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseFolder = path.normalize(`${__dirname}/../../`);

const bestOfKey = 'good name';

const args = process.argv.slice(2);
const getFlag = (name) => args.includes(`--${name}`);
const getOpt = (name, fallback) => {
  const prefix = `--${name}=`;
  const hit = args.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
};

const config = {
  all: getFlag('all'),
  redo: getFlag('redo') || getFlag('force'),
  think: getFlag('think'),
  names: getOpt('names', '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean),
  limit: Number(getOpt('limit', Infinity)),
  api: getOpt('api', 'ollama'),
  concurrency: Number(getOpt('concurrency', 1)),
  model: getOpt('model', process.env.OLLAMA_MODEL || 'gemma4:31b'),
  temperature: Number(getOpt('temperature', 0.7)),
  host: getOpt('host', process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').replace(/\/$/, ''),
  data: path.normalize(getOpt('data', `${baseFolder}website/.data`)),
  out: path.normalize(getOpt('out', `${baseFolder}src/descriptions.json`)),
};

const MAX_LENGTH = 110; // the prompt asks for 90; past this it tries again
const TRIES = 3;

// --- how the color looks --------------------------------------------------------

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const oklch = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
};

// "bright orange; bright, vivid, brilliant and glowing"
export const describeColor = (hex) => {
  const lore = new ColorDescription(hex);
  const [noun, alt] = lore.nouns;
  const adjective = /^(black|white)$/.test(noun) ? '' : lore.descriptiveWords[0];
  const kind = [adjective, noun].filter(Boolean).join(' ');
  return `${kind}${alt ? `, close to ${alt}` : ''}; ${lore.getDescriptiveList(false, 4)}`;
};

// hue words and where they sit in OKLCH, to catch a color called what it isn't
const HUES = {
  red: 25,
  scarlet: 30,
  crimson: 15,
  orange: 55,
  amber: 70,
  yellow: 100,
  lime: 125,
  green: 145,
  emerald: 160,
  teal: 190,
  turquoise: 190,
  cyan: 205,
  blue: 255,
  navy: 265,
  indigo: 280,
  violet: 300,
  purple: 310,
  lilac: 310,
  magenta: 335,
  pink: 355,
};
const REDS = ['red', 'scarlet', 'crimson']; // light reds are pinks
const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

// --- what the name refers to ----------------------------------------------------

let facts = null;
const loadFacts = () => {
  facts = new Map();
  const dir = path.join(config.data, 'names');
  if (!fs.existsSync(dir)) {
    console.warn(`No data at ${config.data}: descriptions get no Wikipedia facts (see --data).`);
    return;
  }
  for (const sub of fs.readdirSync(dir)) {
    for (const file of fs.readdirSync(path.join(dir, sub))) {
      try {
        const { name, looked } = JSON.parse(fs.readFileSync(path.join(dir, sub, file), 'utf8'));
        if (name && looked) facts.set(name, looked);
      } catch {
        // a broken file only costs that name its facts
      }
    }
  }
};

const firstSentence = (text = '') => {
  const s = text.replace(/\s+/g, ' ').trim();
  const end = s.search(/(?<!\b[A-Z][a-z]?)\.\s/);
  return (end > 0 ? s.slice(0, end + 1) : s).slice(0, 220);
};

const factsFor = (name) => {
  const looked = facts?.get(name);
  if (!looked) return [];
  const lines = [];
  for (const entry of (looked.entries || []).slice(0, 3)) {
    const text = entry.blocks?.find((b) => b.text)?.text;
    if (text) lines.push(`Wikipedia, ${entry.title}: ${firstSentence(text)}`);
  }
  for (const word of (looked.definitions || []).slice(0, 2)) {
    const sense = word.parts?.[0]?.definitions?.[0];
    if (sense) lines.push(`Wiktionary, ${word.term}: ${firstSentence(sense.split('\n')[0])}`);
  }
  return lines;
};

// --- the prompt -----------------------------------------------------------------

export const systemPrompt = `You write one-line descriptions for Color Names, a list of colors named by people.

For each color you get its name, its hex, how it looks in words, and sometimes facts about what the name refers to. Reply with JSON: {"kind": …, "reference": …, "description": …}.

1. Decide the kind first:
   pun        the name is wordplay (24 Carrot = 24 carat)
   hex        the hex itself spells a word or a sequence (#c0ffee, #fedcba)
   reference  a song, film, book, game, artwork, person, character or brand
   place      a real place
   word       a word from another language or an unusual word (Cerise, Taupe)
   thing      a food, plant, material or object (Wasabi, Moss)
   mood       a feeling or moment (Butterfly Kisses)
   plain      an ordinary color term (Teal, Brick Red)
   Only call it a reference if you are sure what it refers to; the facts help.
   When a name could mean several things, pick the sense the color fits.

2. "reference": what the joke or allusion is, in a few plain words ("24-carat gold", "Prince, Purple Rain"), or "" if there is none.

3. "description": ONE sentence, 90 characters at most.
   - Make the joke or reference land in plain words. Name the thing, don't explain it: "Prince", not "the late American musician Prince".
   - Stay true to how the color looks. Never call it a color it isn't.
   - Be specific and a little playful. Concrete things beat adjectives.
   - Don't repeat the whole name. Mention the hex only when kind is "hex".
   - Don't start with "A" or "The" plus an adjective and a comma.
   - Never use: carries, weight, heavy, reminiscent, mirrors, evokes, captures, embodies, hue, shade of, tone, vibe, aesthetic, palette.`;

// words a hex can spell (0 as o, 1 as i or l, 5 as s), from the system's word
// list; without one, no hex is taken for a word
const WORDS = (() => {
  try {
    return new Set(
      fs
        .readFileSync('/usr/share/dict/words', 'utf8')
        .split('\n')
        .map((w) => w.toLowerCase())
        .filter((w) => w.length >= 4 && /^[abcdefilos]+$/.test(w))
    );
  } catch {
    return new Set();
  }
})();

export const spells = (hex) => {
  const h = hex.slice(1).toLowerCase();
  if (h === 'abcdef' || h === 'fedcba') return h;
  const readings = [h.replace(/0/g, 'o').replace(/5/g, 's')].flatMap((r) => [
    r.replace(/1/g, 'i'),
    r.replace(/1/g, 'l'),
  ]);
  let best = '';
  for (const r of readings)
    for (let a = 0; a < r.length; a++)
      for (let b = r.length; b - a >= 4 && b - a > best.length; b--)
        if (WORDS.has(r.slice(a, b))) best = r.slice(a, b);
  return best;
};

const hexHint = (hex) => {
  const word = spells(hex);
  return word
    ? [`Hex reads: ${hex.slice(1).toUpperCase()} (contains "${word.toUpperCase()}")`]
    : [];
};

const ask = ({ name, hex, facts: given }) =>
  [
    `Name: ${name}`,
    `Hex: ${hex}`,
    ...hexHint(hex),
    `Looks: ${describeColor(hex)}`,
    ...(given || factsFor(name)).map((f) => `Fact: ${f}`),
  ].join('\n');

export const buildPrompt = (name, hex) => ask({ name, hex });

// to show the range, not to be copied
export const EXAMPLES = [
  [
    {
      name: '24 Carrot',
      hex: '#e56e24',
      facts: [
        'Wiktionary, carrot: A vegetable with a nutritious, juicy, sweet root that is often orange in colour.',
      ],
    },
    {
      kind: 'pun',
      reference: '24-carat gold',
      description: 'Carrot orange polished to 24 carats: the vegetable patch goes gold.',
    },
  ],
  [
    { name: 'Alphabet Soup', hex: '#fedcba', facts: [] },
    {
      kind: 'hex',
      reference: 'the hex is FEDCBA, the alphabet backwards',
      description: 'Its hex spells the alphabet backwards, F to A, into a pale peach broth.',
    },
  ],
  [
    { name: 'Arabica Mint', hex: '#c0ffee', facts: [] },
    {
      kind: 'hex',
      reference: 'the hex reads C0FFEE',
      description: 'The hex orders C0FFEE; the color arrives as mint, pale as milk foam.',
    },
  ],
  [
    {
      name: 'Purple Rain',
      hex: '#7442c8',
      facts: [
        'Wikipedia, Purple Rain (song): "Purple Rain" is a song by Prince and the Revolution.',
      ],
    },
    {
      kind: 'reference',
      reference: 'Prince, Purple Rain',
      description: 'Prince in a cloud of stage smoke, every spotlight turned violet.',
    },
  ],
  [
    {
      name: 'Kermit Green',
      hex: '#5cb200',
      facts: [
        'Wikipedia, Kermit the Frog: Kermit the Frog is a Muppet character created and originated by Jim Henson.',
      ],
    },
    {
      kind: 'reference',
      reference: 'Kermit the Frog',
      description: 'Muppet-felt green, bright enough to sing from a log with a banjo.',
    },
  ],
  [
    {
      name: 'Starry Night',
      hex: '#286492',
      facts: [
        'Wikipedia, The Starry Night: The Starry Night is an oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh.',
      ],
    },
    {
      kind: 'reference',
      reference: 'Van Gogh, The Starry Night',
      description: "Van Gogh's swirling night blue, just before the stars start spinning.",
    },
  ],
  [
    {
      name: 'Manhattan',
      hex: '#e2af80',
      facts: [
        'Wikipedia, Manhattan: Manhattan is the most densely populated of the five boroughs of New York City.',
        'Wikipedia, Manhattan (cocktail): A Manhattan is a cocktail made with whiskey, sweet vermouth, and bitters.',
      ],
    },
    {
      kind: 'reference',
      reference: 'the Manhattan cocktail',
      description: 'Cocktail-hour amber: rye, vermouth and the glow through a bar window.',
    },
  ],
  [
    {
      name: 'Big Cypress',
      hex: '#b98675',
      facts: [
        'Wikipedia, Big Cypress National Preserve: Big Cypress National Preserve is a United States National Preserve in southern Florida.',
      ],
    },
    {
      kind: 'place',
      reference: 'Big Cypress National Preserve, Florida',
      description: 'Weathered cypress bark and dry prairie at the edge of the Everglades.',
    },
  ],
  [
    {
      name: 'Cerise',
      hex: '#ad134e',
      facts: ['Wiktionary, cerise: A deep red colour, like that of cherries.'],
    },
    {
      kind: 'word',
      reference: 'French for cherry',
      description: 'French for cherry, the dark, staining kind rather than the candy one.',
    },
  ],
  [
    {
      name: 'Taupe',
      hex: '#b9a281',
      facts: ['Wiktionary, taupe: A brownish-grey colour, like that of moleskin.'],
    },
    {
      kind: 'word',
      reference: 'French for mole',
      description: 'French for mole, though this one has dug its way up into dry sand.',
    },
  ],
  [
    { name: 'Wasabi', hex: '#afd77f', facts: [] },
    {
      kind: 'thing',
      reference: '',
      description: 'Soft green with a kick: the dab on the sushi plate you underestimate once.',
    },
  ],
  [
    { name: 'Butterfly Kisses', hex: '#f0dedc', facts: [] },
    {
      kind: 'mood',
      reference: '',
      description: 'Barely-there blush, like an eyelash brushed across a cheek.',
    },
  ],
  [
    {
      name: 'Teal',
      hex: '#008080',
      facts: ['Wiktionary, teal: A small dabbling duck of the genus Anas.'],
    },
    {
      kind: 'plain',
      reference: '',
      description: 'Blue-green split down the middle, named after the stripe on a small duck.',
    },
  ],
];

const examplesAsChat = EXAMPLES.flatMap(([color, answer]) => [
  { role: 'user', content: ask(color) },
  { role: 'assistant', content: JSON.stringify(answer) },
]);

const SCHEMA = {
  type: 'object',
  properties: {
    kind: {
      type: 'string',
      enum: ['pun', 'hex', 'reference', 'place', 'word', 'thing', 'mood', 'plain'],
    },
    reference: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['kind', 'reference', 'description'],
};

// --- checks ---------------------------------------------------------------------

const WORN =
  /\b(carr(y|ies|ying)|weight\w*|heav(y|ily)|reminisc\w*|mirror\w*|evok\w*|captur\w*|embod\w*|hue|shade of|tone|vibe|aesthetic|palette)\b/i;

export const problemsWith = ({ kind, reference = '', description = '' }, { name, hex }) => {
  if (!description) return ['The description is empty.'];
  const problems = [];
  if (description.length > MAX_LENGTH)
    problems.push(`It is ${description.length} characters; say it in 90 or fewer.`);
  if ((description.match(/[.!?](\s|$)/g) || []).length > 1)
    problems.push('Use one sentence, not several.');
  const worn = description.match(WORN);
  if (worn) problems.push(`Don't use the word "${worn[0]}".`);
  if (/^(a|the)\s+\w+,/i.test(description))
    problems.push('Don\'t open with "A" or "The" plus an adjective and a comma.');
  if (name.length > 6 && description.toLowerCase().includes(name.toLowerCase()))
    problems.push("Don't repeat the whole name.");
  if (kind === 'hex' && !spells(hex))
    problems.push('The hex spells nothing; pick another kind and leave the hex out.');
  else if (kind !== 'hex' && description.toLowerCase().includes(hex.slice(1).toLowerCase()))
    problems.push('Only mention the hex when it spells something.');
  const { L, C, H } = oklch(hex);
  if (C >= 0.04) {
    const allowed = `${name} ${reference}`.toLowerCase();
    const looks = describeColor(hex).split(';')[0];
    for (const [word, at] of Object.entries(HUES)) {
      if (!new RegExp(`\\b${word}\\b`, 'i').test(description) || allowed.includes(word)) continue;
      if (hueGap(H, at) > 70 || (REDS.includes(word) && L > 0.75))
        problems.push(`It isn't ${word}; it looks ${looks}.`);
    }
  }
  return problems;
};

// --- ollama ---------------------------------------------------------------------

export const cleanResponse = (text) =>
  text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();

const ollama = async ({ host, model, temperature, think, messages }) => {
  const res = await fetch(`${host}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      format: SCHEMA,
      think: Boolean(think),
      options: { temperature, num_predict: think ? 2000 : 200 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama responded ${res.status}: ${await res.text()}`);
  return (await res.json()).message?.content;
};

const openai = async ({ host, model, temperature, messages }) => {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${host}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 200,
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'description', schema: SCHEMA },
        },
      }),
    });
    if (res.ok) return (await res.json()).choices?.[0]?.message?.content;
    // a server still starting or busy answers 5xx for a while
    if (res.status < 500 || attempt >= 8)
      throw new Error(`Server responded ${res.status}: ${await res.text()}`);
    await new Promise((r) => setTimeout(r, 15000));
  }
};

const chat = async (options) => {
  const content = await (config.api === 'openai' ? openai : ollama)(options);
  const answer = JSON.parse(content || '{}');
  return { ...answer, description: cleanResponse(answer.description || '') };
};

// One color: ask, check, and ask again with what was wrong. Returns the best
// answer and whatever problems it still has.
export const describe = async ({ host, model, temperature = 0.7, think = false, name, hex }) => {
  if (!facts) loadFacts();
  const messages = [
    { role: 'system', content: systemPrompt },
    ...examplesAsChat,
    { role: 'user', content: ask({ name, hex }) },
  ];
  let best = null;
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    const answer = await chat({ host, model, temperature, think, messages });
    const problems = problemsWith(answer, { name, hex });
    if (!best || problems.length < best.problems.length) best = { answer, problems };
    if (!problems.length) break;
    messages.push(
      { role: 'assistant', content: JSON.stringify(answer) },
      {
        role: 'user',
        content: `Rewrite the description. ${problems.join(' ')} Keep what was good.`,
      }
    );
  }
  return best;
};

// the description alone, as the model-comparison tool uses it
export const generateDescription = async ({ host, model, temperature, think, name, hex }) =>
  (await describe({ host, model, temperature, think, name, hex })).answer.description;

// --- resumability ---------------------------------------------------------------

const keyOf = (name, hex) => `${name} ${hex}`;

const loadExistingDescriptions = (outPath) => {
  if (!fs.existsSync(outPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const writeDescriptions = (outPath, records) => {
  const tmpPath = `${outPath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(records, null, 2)}\n`);
  fs.renameSync(tmpPath, outPath);
};

// --- main -----------------------------------------------------------------------

const main = async () => {
  const src = fs.readFileSync(path.normalize(`${baseFolder}src/colornames.csv`), 'utf8').toString();
  const { entries } = parseCSVString(src);
  loadFacts();

  const wanted = new Set(config.names);
  const targets = entries.filter((e) =>
    wanted.size ? wanted.has(e.name) : config.all || e[bestOfKey]
  );
  if (wanted.size && targets.length < wanted.size) {
    const found = new Set(targets.map((e) => e.name));
    console.warn(`Not in the list: ${[...wanted].filter((n) => !found.has(n)).join(', ')}`);
  }

  // hand-written entries (ai: false) are kept whatever happens
  const existing = new Map(
    loadExistingDescriptions(config.out)
      .filter((rec) => rec && rec.name && rec.hex)
      .map((rec) => [keyOf(rec.name, rec.hex), rec])
  );
  const todo = targets.filter((e) => {
    const had = existing.get(keyOf(e.name, e.hex));
    return !had || (config.redo && had.ai !== false);
  });

  console.log(`Model:    ${config.model}${config.think ? ' (thinking)' : ''}`);
  console.log(`Host:     ${config.host}`);
  console.log(
    `Scope:    ${wanted.size ? `${targets.length} named` : config.all ? 'all colors' : 'good names only'}`
  );
  console.log(`Facts:    ${facts.size ? `${facts.size} names` : 'none'}`);
  console.log(`Output:   ${path.relative(baseFolder, config.out)}`);
  console.log(`Targets:  ${targets.length} | to do: ${todo.length}`);
  if (Number.isFinite(config.limit)) console.log(`Limit:    ${config.limit} this run`);
  console.log('');

  fs.mkdirSync(path.dirname(config.out), { recursive: true });

  let stopRequested = false;
  process.on('SIGINT', () => {
    console.log('\nStopping after the current color… (progress is saved)');
    stopRequested = true;
  });

  let made = 0;
  let flagged = 0;
  let unsaved = 0;
  const queue = todo.slice(0, Number.isFinite(config.limit) ? config.limit : todo.length);
  const total = queue.length;
  const one = async ({ name, hex }) => {
    try {
      const { answer, problems } = await describe({
        host: config.host,
        model: config.model,
        temperature: config.temperature,
        think: config.think,
        name,
        hex,
      });
      if (!answer.description) {
        console.warn(`! empty description for "${name}" (${hex}) — skipped`);
        return;
      }
      existing.set(keyOf(name, hex), {
        name,
        hex,
        ai: true,
        kind: answer.kind,
        ...(answer.reference ? { reference: answer.reference } : {}),
        description: answer.description,
        model: config.model,
        ...(problems.length ? { review: problems } : {}),
      });
      made += 1;
      if (problems.length) flagged += 1;
      if (++unsaved >= 50) {
        writeDescriptions(config.out, [...existing.values()]);
        unsaved = 0;
      }
      console.log(
        `${problems.length ? '?' : '✓'} ${made}/${total}  ${name} ${hex}  [${answer.kind}]`
      );
      console.log(`    ${answer.description}`);
      if (problems.length) console.log(`    review: ${problems.join(' ')}`);
    } catch (err) {
      console.error(`✗ failed for "${name}" (${hex}): ${err.message}`);
      if (/fetch failed|ECONNREFUSED/.test(err.message) && config.api === 'ollama') {
        console.error('\nIs Ollama running? Try: ollama serve');
        process.exit(1);
      }
    }
  };
  await Promise.all(
    Array.from({ length: Math.max(1, config.concurrency) }, async () => {
      while (queue.length && !stopRequested) await one(queue.shift());
    })
  );
  writeDescriptions(config.out, [...existing.values()]);

  console.log(
    `\nDone. Wrote ${made} description(s) to ${path.relative(baseFolder, config.out)}` +
      `${flagged ? `; ${flagged} marked for review` : ''}.`
  );
};

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main();
}
