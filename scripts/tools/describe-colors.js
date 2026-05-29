/**
 * Generates short, AI-written descriptions for colors using a local Ollama model.
 *
 * Reads src/colornames.csv, writes a JSON array to src/descriptions.json
 * keyed by the (name, hex) pair. Records carry `ai: true` to mark them as
 * machine-generated; hand-written entries should set `ai: false`. The run is
 * resumable: colors already present in the output file are skipped, so you can
 * stop (Ctrl-C) and continue at any time.
 *
 * Usage:
 *   node scripts/tools/describe-colors.js                 # good names only (default)
 *   node scripts/tools/describe-colors.js --all           # every color
 *   node scripts/tools/describe-colors.js --limit=25      # cap new descriptions this run
 *   node scripts/tools/describe-colors.js --model=gemma3:27b
 *   node scripts/tools/describe-colors.js --force         # regenerate even if present
 *
 * Flags:
 *   --all              Describe every color, not just rows marked "good name".
 *   --limit=N          Stop after generating N new descriptions this run.
 *   --model=NAME       Ollama model tag (default: env OLLAMA_MODEL or gemma4:31b).
 *   --temperature=N    Sampling temperature (default 0.8).
 *   --think            Let reasoning models reason about the name before answering
 *                      (slower; can improve pickup of cultural references).
 *   --host=URL         Ollama host (default env OLLAMA_HOST or http://127.0.0.1:11434).
 *   --out=PATH         Output JSON path (default src/descriptions.json).
 *   --force            Regenerate descriptions for colors already in the output file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCSVString } from '../lib.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseFolder = path.normalize(`${__dirname}/../../`);

const bestOfKey = 'good name';

// --- argument parsing ---------------------------------------------------------

const args = process.argv.slice(2);
const getFlag = (name) => args.includes(`--${name}`);
const getOpt = (name, fallback) => {
  const prefix = `--${name}=`;
  const hit = args.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
};

const config = {
  all: getFlag('all'),
  force: getFlag('force'),
  think: getFlag('think'),
  limit: Number(getOpt('limit', Infinity)),
  model: getOpt('model', process.env.OLLAMA_MODEL || 'gemma4:31b'),
  temperature: Number(getOpt('temperature', 0.8)),
  host: (getOpt('host', process.env.OLLAMA_HOST || 'http://127.0.0.1:11434')).replace(/\/$/, ''),
  out: path.normalize(getOpt('out', `${baseFolder}src/descriptions.json`)),
};

// --- color analysis -----------------------------------------------------------
// We ground each description in the actual appearance of the hex, so the model
// does not describe a color purely from its (sometimes whimsical) name.

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgbToHsl = ({ r, g, b }) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      default:
        h = ((r - g) / d + 4) * 60;
    }
  }
  return { h, s, l };
};

const hueFamily = (h) => {
  const families = [
    [15, 'red'],
    [45, 'orange'],
    [70, 'yellow'],
    [95, 'lime green'],
    [150, 'green'],
    [185, 'teal'],
    [210, 'cyan'],
    [255, 'blue'],
    [285, 'indigo'],
    [320, 'violet'],
    [350, 'magenta'],
    [360, 'red'],
  ];
  for (const [max, name] of families) {
    if (h < max) return name;
  }
  return 'red';
};

export const describeColor = (hex) => {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));

  if (s < 0.08) {
    if (l < 0.12) return 'a near-black, neutral tone';
    if (l > 0.92) return 'an off-white, neutral tone';
    if (l < 0.4) return 'a dark gray';
    if (l > 0.65) return 'a light gray';
    return 'a mid gray';
  }

  const light =
    l < 0.18 ? 'very dark' : l < 0.38 ? 'dark' : l < 0.62 ? 'medium' : l < 0.82 ? 'light' : 'pale';
  const sat = s < 0.3 ? 'muted' : s < 0.6 ? 'soft' : s < 0.8 ? 'rich' : 'vivid';

  return `a ${light}, ${sat} ${hueFamily(h)}`;
};

// --- ollama -------------------------------------------------------------------

export const systemPrompt = [
  'You write descriptions for a curated color-name archive.',
  '',
  'For each color you receive its name and a note on how the color actually reads',
  '(its lightness, saturation, and hue family). Stay true to that appearance.',
  '',
  'First decide which register the name calls for:',
  '',
  'PLAIN COLOR TERMS — when the name is just an everyday English color word, or a',
  'basic hue with a simple modifier (Red, Blue, Green, Teal, Crimson, Navy, Sky',
  'Blue, Forest Green, Light Pink), write 1 to 2 calm, factual sentences: where the',
  'hue sits, whether it reads warm or cool, and a few named relatives it shades',
  'toward (e.g. maroon, burgundy, and rose for red). No scenes, no metaphors, no',
  'sensory imagery. Never mention hex, RGB, primaries, or other technical jargon.',
  '',
  'EVOCATIVE, REFERENTIAL, OR FOREIGN NAMES — for everything else (invented,',
  'narrative, punning, culturally referential, or non-English names), write 1 to 2',
  'vivid sentences that capture the feeling, materiality, atmosphere, and',
  'associations the name evokes:',
  '- Many names allude to a book, film, game, song, person, place, myth, dish, or',
  '  brand. When you genuinely recognize the allusion, make it legible: name its',
  '  creator, characters, vessel, world, or medium, or evoke its most iconic',
  '  concrete detail (the Nautilus and Captain Nemo for a deep-sea voyage; the',
  '  buried kingdom of a soulslike game). Only when you are sure — never invent a',
  '  reference for a generic name.',
  '- Some names are words from other languages (Cerise — French for cherry; Noir —',
  '  French for black; Celeste — Italian for sky). Surface what the word means and',
  '  let the thing it names shape the imagery.',
  '- Prefer concrete, specific imagery over generic adjectives. Avoid cliché',
  '  design-language ("vintage", "retro vibes", "inspired by") and lean away from',
  '  the crutch words "neon" and "midnight" unless they are truly apt.',
  '',
  'Both registers:',
  '- Favor one tight sentence; add a second only if it earns it. Never pad with',
  '  stock filler such as "it carries the weight of…" or "it evokes…".',
  '- Avoid quoting the color name verbatim; never write "this color is".',
  '- Vary your sentence openings; do not default to "A <adjective> <hue>…".',
  '- Never mention the hex code or RGB values.',
  '- No quotation marks, no preamble — reply with only the description.',
  '',
  'Good (evocative): Feels like faded paperback ink left in the sun beside a motel pool.',
  'Good (plain "Teal"): A blue-green that sits between cyan and deep sea-green, cool and slightly muted, shading toward pine and petrol.',
  'Bad: A warm retro orange inspired by vintage Americana.',
].join('\n');

export const buildPrompt = (name, hex, appearance = describeColor(hex)) =>
  `Name: ${name}\n` + `Reads as: ${appearance}.\n\n` + 'Write the description.';

export const cleanResponse = (text) =>
  text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^["'`]+|["'`]+$/g, '')
    .trim();

/**
 * Generate a single description via the Ollama HTTP API.
 * Reusable across the generator and the model-comparison harness.
 */
export const generateDescription = async ({
  host,
  model,
  temperature = 0.8,
  think = false,
  appearance,
  name,
  hex,
}) => {
  const res = await fetch(`${host}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      prompt: buildPrompt(name, hex, appearance),
      stream: false,
      // Reasoning models (e.g. gemma4) spend the token budget "thinking". With
      // think:false they answer directly (we only want the final line). With
      // think:true they can reason about a name's references first, so give a
      // much larger budget or the final response comes back empty.
      think,
      options: { temperature, num_predict: think ? 600 : 120 },
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama responded ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  return cleanResponse(data.response || '');
};

const generate = (name, hex) =>
  generateDescription({
    host: config.host,
    model: config.model,
    temperature: config.temperature,
    think: config.think,
    name,
    hex,
  });

// --- resumability -------------------------------------------------------------

const keyOf = (name, hex) => `${name} ${hex}`;

const loadExistingDescriptions = (outPath) => {
  if (!fs.existsSync(outPath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    // ignore malformed files; the test suite will catch them
    return [];
  }
};

const writeDescriptions = (outPath, records) => {
  // Write via temp file + rename to avoid partial writes on interruption.
  const tmpPath = `${outPath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(records, null, 2)}\n`);
  fs.renameSync(tmpPath, outPath);
};

// --- main ---------------------------------------------------------------------

const main = async () => {
  const src = fs
    .readFileSync(path.normalize(`${baseFolder}src/colornames.csv`), 'utf8')
    .toString();
  const { entries } = parseCSVString(src);

  const targets = entries.filter((e) => (config.all ? true : e[bestOfKey]));

  const existingRecords = config.force ? [] : loadExistingDescriptions(config.out);
  const existingMap = new Map(
    existingRecords
      .filter((rec) => rec && rec.name && rec.hex)
      .map((rec) => [keyOf(rec.name, rec.hex), rec])
  );
  const todo = targets.filter((e) => !existingMap.has(keyOf(e.name, e.hex)));

  console.log(`Model:    ${config.model}`);
  console.log(`Host:     ${config.host}`);
  console.log(`Scope:    ${config.all ? 'all colors' : 'good names only'}`);
  console.log(`Output:   ${path.relative(baseFolder, config.out)}`);
  console.log(
    `Targets:  ${targets.length} | already done: ${targets.length - todo.length} | to do: ${todo.length}`
  );
  if (Number.isFinite(config.limit)) console.log(`Limit:    ${config.limit} this run`);
  console.log('');

  // Ensure parent dir exists and initialize output for resumable writes.
  fs.mkdirSync(path.dirname(config.out), { recursive: true });
  if (config.force || !fs.existsSync(config.out)) {
    writeDescriptions(config.out, []);
  }

  let stopRequested = false;
  process.on('SIGINT', () => {
    console.log('\nStopping after the current color… (progress is saved)');
    stopRequested = true;
  });

  // Guard against ever writing the same (name, hex) twice in one run.
  const written = new Set(existingMap.keys());
  const outputRecords = [...existingMap.values()];

  let made = 0;
  for (const entry of todo) {
    if (stopRequested || made >= config.limit) break;

    const { name, hex } = entry;
    const key = keyOf(name, hex);
    if (written.has(key)) continue;
    try {
      const description = await generate(name, hex);
      if (!description) {
        console.warn(`! empty description for "${name}" (${hex}) — skipped`);
        continue;
      }
      outputRecords.push({ name, hex, ai: true, description });
      writeDescriptions(config.out, outputRecords);
      written.add(key);
      made += 1;
      console.log(`✓ ${made}/${Math.min(todo.length, config.limit)}  ${name} ${hex}`);
      console.log(`    ${description}`);
    } catch (err) {
      console.error(`✗ failed for "${name}" (${hex}): ${err.message}`);
      // A connection error usually means Ollama isn't running — bail early.
      if (/fetch failed|ECONNREFUSED/.test(err.message)) {
        console.error('\nIs Ollama running? Try: ollama serve');
        process.exit(1);
      }
    }
  }

  console.log(`\nDone. Wrote ${made} new description(s) to ${path.relative(baseFolder, config.out)}.`);
};

// Only run when invoked directly, not when imported (e.g. by the compare harness).
if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main();
}
