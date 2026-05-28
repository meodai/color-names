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
 *   --count=N          Number of colors to sample (default 20).
 *   --temperature=N    Sampling temperature (default 0.8).
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
  count: Number(getOpt('count', 20)),
  temperature: Number(getOpt('temperature', 0.8)),
  host: getOpt('host', process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').replace(/\/$/, ''),
  out: path.normalize(getOpt('out', `${baseFolder}model-comparison.md`)),
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

const main = async () => {
  const src = fs.readFileSync(path.normalize(`${baseFolder}src/colornames.csv`), 'utf8').toString();
  const { entries } = parseCSVString(src);
  const pool = entries.filter((e) => (config.all ? true : e[bestOfKey]));
  const colors = sampleColors(pool, config.count);

  console.log(`Comparing ${config.models.length} model(s) on ${colors.length} colors`);
  console.log(`Models: ${config.models.join(', ')}`);
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

  console.log('\n--- timing summary ---');
  for (const model of config.models) {
    const s = timing.get(model);
    const avg = s.ok ? s.totalMs / s.ok / 1000 : 0;
    console.log(`${model}: ${avg.toFixed(2)}s/color avg, ${s.ok} ok, ${s.fail} failed`);
  }
  console.log(`\nReport written to ${path.relative(baseFolder, config.out)}`);
};

main();
