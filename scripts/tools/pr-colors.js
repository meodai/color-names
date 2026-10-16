// The colors a merged pull request added, as a comment with a link to each
// one's page on names.color.pizza. Run by .github/workflows/pr-colors.yml:
//
//   node scripts/tools/pr-colors.js <base sha> <merge sha>   (prints the comment, or nothing)

import { execFileSync } from 'child_process';
import { readList, slugsOf, pageOf, SITE } from '../site.js';

const [base, merged] = process.argv.slice(2);
const at = (sha) =>
  execFileSync('git', ['show', `${sha}:src/colornames.csv`], { encoding: 'utf8' });

const before = new Set(readList(at(base)).map((it) => it.name));
const list = readList(at(merged));
const added = list.filter((it) => !before.has(it.name));

if (added.length) {
  const slugs = slugsOf(list);
  const SHOWN = 40;
  const lines = added
    .slice(0, SHOWN)
    .map((it) => `- [${it.name}](${pageOf(slugs.get(it.name))}) \`${it.hex}\``);
  if (added.length > SHOWN) lines.push(`- …and ${added.length - SHOWN} more`);
  const one = added.length === 1;
  console.log(
    [
      `:art: ${one ? 'Your color is' : `Your ${added.length} colors are`} in the list. ${
        one ? 'It gets its own page' : 'They get their own pages'
      } on [names.color.pizza](${SITE}) with the site's next nightly update:`,
      '',
      ...lines,
      '',
      `Thank you! Every name can also be [adopted](${SITE}/adopt/).`,
    ].join('\n')
  );
}
