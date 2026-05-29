/**
 * Runs several Ollama models over the same batch of "good name" colors so you
 * can eyeball description quality (and speed) side by side before committing to
 * a full generation run.
 *
 * Writes a Markdown report (default model-comparison.md) and prints a timing
 * summary to the console.
 *
 * Usage:
 *   node scripts/tools/compare-color-models.js --models=gemma3:27b,qwen2.5vl:32b
 *   node scripts/tools/compare-color-models.js --models=gemma3:12b,gemma3:27b --count=20
 *
 * Flags:
 *   --models=a,b,c     Comma-separated Ollama model tags to compare (required).
 *   --names=a,b,c      Test these exact color names instead of an even sample.
 *   --count=N          Number of colors to sample (default 20; ignored with --names).
 *   --think            Let reasoning models reason before answering (slower).
 *   --temperature=N    Sampling temperature (default 0.8).
 *   --html=PATH        Also write an HTML swatch preview (colors + descriptions).
 *   --appearance=X     Appearance anchor: "builtin" (default) or "package"
 *                      (lazy-loads the color-description npm package; install first).
 *   --host=URL         Ollama host (default env OLLAMA_HOST or http://127.0.0.1:11434).
 *   --out=PATH         Markdown report path (default model-comparison.md).
 *   --all              Sample from all colors instead of good names only.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCSVString } from '../lib.js';
import { describeColor, generateDescription } from './describe-colors.js';

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
  models: (getOpt('models', '') || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean),
  names: (getOpt('names', '') || '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean),
  count: Number(getOpt('count', 20)),
  temperature: Number(getOpt('temperature', 0.8)),
  think: getFlag('think'),
  // 'builtin' uses describeColor(); 'package' lazy-loads the color-description npm
  // package for a richer appearance anchor (experimental — install it first).
  appearance: getOpt('appearance', 'builtin'),
  host: getOpt('host', process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').replace(/\/$/, ''),
  out: path.normalize(getOpt('out', `${baseFolder}model-comparison.md`)),
  html: getOpt('html', '') ? path.normalize(getOpt('html', '')) : '',
  all: getFlag('all'),
};

if (!config.models.length) {
  console.error('Provide at least one model: --models=gemma3:27b,qwen2.5vl:32b');
  process.exit(1);
}

// Deterministically sample `count` colors spread evenly across the pool so the
// batch covers a variety of names rather than just the alphabetical start.
const sampleColors = (pool, count) => {
  if (pool.length <= count) return pool;
  const step = pool.length / count;
  return Array.from({ length: count }, (_, i) => pool[Math.floor(i * step)]);
};

// Pick black or white body text for contrast against a hex (WCAG luminance).
const textColor = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const lin = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  return L > 0.4 ? '#111' : '#fff';
};

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );

const renderHtml = (entries, models) => {
  const cards = entries
    .map(({ name, hex, byModel }) => {
      const descs = models
        .map((m) => {
          const r = byModel[m];
          const label = models.length > 1 ? `<span class="model">${escapeHtml(m)}</span> ` : '';
          return `<p class="desc">${label}${escapeHtml(r ? r.text : '(no result)')}</p>`;
        })
        .join('');
      return (
        `<div class="card" style="background:${hex};color:${textColor(hex)}">` +
        `<p class="name">${escapeHtml(name)}</p>` +
        `<p class="hex">${escapeHtml(hex)} · ${escapeHtml(describeColor(hex))}</p>` +
        `${descs}</div>`
      );
    })
    .join('\n');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Color description preview</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #111; color: #eee; }
  header { padding: 28px 32px 8px; }
  header h1 { margin: 0 0 4px; font-size: 18px; font-weight: 600; }
  header p { margin: 0; opacity: .6; font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding: 24px 32px 48px; }
  .card { border-radius: 14px; padding: 20px; min-height: 200px; display: flex; flex-direction: column; justify-content: flex-end; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
  .name { font-size: 17px; font-weight: 650; margin: 0 0 2px; }
  .hex { font-size: 12px; font-variant-numeric: tabular-nums; opacity: .75; margin: 0 0 12px; text-transform: uppercase; }
  .desc { font-size: 14.5px; margin: 0 0 8px; }
  .desc:last-child { margin-bottom: 0; }
  .model { font-size: 11px; font-weight: 700; opacity: .7; text-transform: uppercase; letter-spacing: .04em; }
</style></head>
<body>
<header><h1>Color description preview</h1><p>${escapeHtml(models.join(', '))} · ${entries.length} colors</p></header>
<div class="grid">
${cards}
</div></body></html>
`;
};

const main = async () => {
  const src = fs.readFileSync(path.normalize(`${baseFolder}src/colornames.csv`), 'utf8').toString();
  const { entries } = parseCSVString(src);

  // Either test an explicit list of names, or an even sample of the pool.
  let colors;
  if (config.names.length) {
    const byName = new Map(entries.map((e) => [e.name, e]));
    colors = config.names.map((n) => byName.get(n)).filter(Boolean);
    const missing = config.names.filter((n) => !byName.has(n));
    if (missing.length) console.warn(`Not found in CSV: ${missing.join(' | ')}\n`);
  } else {
    const pool = entries.filter((e) => (config.all ? true : e[bestOfKey]));
    colors = sampleColors(pool, config.count);
  }

  // Optional richer appearance anchor via the color-description package.
  let appearanceFn = null;
  if (config.appearance === 'package') {
    const { default: ColorDescription } = await import('color-description');
    appearanceFn = (hex) => new ColorDescription(hex).getDescriptiveList(false, 4);
  }

  console.log(`Comparing ${config.models.length} model(s) on ${colors.length} colors`);
  console.log(`Models: ${config.models.join(', ')}`);
  console.log(`Anchor: ${config.appearance}`);
  console.log(`Host:   ${config.host}\n`);

  // results[hex] = { name, hex, byModel: { model: { text, ms } } }
  const results = new Map();
  const timing = new Map(config.models.map((m) => [m, { totalMs: 0, ok: 0, fail: 0 }]));

  for (const model of config.models) {
    console.log(`\n=== ${model} ===`);
    for (const { name, hex } of colors) {
      if (!results.has(hex)) results.set(hex, { name, hex, byModel: {} });
      const t0 = Date.now();
      try {
        const text = await generateDescription({
          host: config.host,
          model,
          temperature: config.temperature,
          think: config.think,
          appearance: appearanceFn ? appearanceFn(hex) : undefined,
          name,
          hex,
        });
        const ms = Date.now() - t0;
        results.get(hex).byModel[model] = { text, ms };
        const stat = timing.get(model);
        stat.totalMs += ms;
        stat.ok += 1;
        console.log(`  ${name} ${hex} (${(ms / 1000).toFixed(1)}s)\n    ${text}`);
      } catch (err) {
        results.get(hex).byModel[model] = { text: `⚠️ ${err.message}`, ms: 0 };
        timing.get(model).fail += 1;
        console.error(`  ✗ ${name} ${hex}: ${err.message}`);
        if (/fetch failed|ECONNREFUSED/.test(err.message)) {
          console.error('\nIs Ollama running? Try: ollama serve');
          process.exit(1);
        }
      }
    }
  }

  // --- write markdown report --------------------------------------------------
  const lines = [];
  lines.push('# Color description model comparison\n');
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Colors: ${colors.length} (${config.all ? 'all' : 'good names'})`);
  lines.push(`- Temperature: ${config.temperature}\n`);

  lines.push('## Timing\n');
  lines.push('| Model | OK | Failed | Avg s/color | Total s |');
  lines.push('| --- | ---: | ---: | ---: | ---: |');
  for (const model of config.models) {
    const s = timing.get(model);
    const avg = s.ok ? s.totalMs / s.ok / 1000 : 0;
    lines.push(
      `| ${model} | ${s.ok} | ${s.fail} | ${avg.toFixed(2)} | ${(s.totalMs / 1000).toFixed(1)} |`
    );
  }
  lines.push('');

  lines.push('## Descriptions\n');
  for (const { name, hex, byModel } of results.values()) {
    lines.push(`### ${name} \`${hex}\``);
    lines.push(`<span style="display:inline-block;width:1em;height:1em;background:${hex}"></span> ${describeColor(hex)}\n`);
    for (const model of config.models) {
      const r = byModel[model];
      lines.push(`- **${model}** — ${r ? r.text : '(no result)'}`);
    }
    lines.push('');
  }

  fs.writeFileSync(config.out, lines.join('\n'));

  // --- optional HTML swatch view ----------------------------------------------
  if (config.html) {
    fs.writeFileSync(config.html, renderHtml([...results.values()], config.models));
    console.log(`HTML preview written to ${path.relative(baseFolder, config.html)}`);
  }

  console.log('\n--- timing summary ---');
  for (const model of config.models) {
    const s = timing.get(model);
    const avg = s.ok ? s.totalMs / s.ok / 1000 : 0;
    console.log(`${model}: ${avg.toFixed(2)}s/color avg, ${s.ok} ok, ${s.fail} failed`);
  }
  console.log(`\nReport written to ${path.relative(baseFolder, config.out)}`);
};

main();
