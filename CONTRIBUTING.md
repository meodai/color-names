# Contributing

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Please note we have a code of conduct, please follow it in all your
interactions with the project.

## Adding colors

1. Only update the `src/colornames.csv` file and run `npm test`.
2. Make sure the names you commit are not racist or offensive or a protected
   brand name (No Facebook Blue, Coca Cola Red etc.., no nationality or tan etc..).
3. Read the "Rules for new color names" directly below
4. Make sure that neither name nor hex value of your added colors are already
  in use. `npm test` will test that for you.
5. Do not edit generated files. Do not commit changes to `README.md`,
  `changes.svg` or anything in `dist/`.
6. Add the source of your colors in the Pull Request description.
  Maintainers will update documentation if needed.

**We use automated semantic versioning** make sure to use git cz (or npm run commit).

## Generated files and CI

- PRs run `npm ci`, `npm run build`, and `npm test` in CI.
- CI may update `README.md` and `changes.svg` automatically and push
  to your PR branch.
- Do not include generated files (`dist/`, `README.md`, `changes.svg`) in commits.
- For color name changes, only submit updates to `src/colornames.csv`.
- No need to run `npm run build` locally; CI generates outputs.
- Optional locally: `npm run lint:markdown` to match CI markdown checks.

## Rules for new color names

- No duplicate names or hex values.
- No racist names
- No offensive names
- No obscene names 💩
- No protected brand-names (`Facebook Blue`, `Coca Cola Red`)
- No enumerations (`Grey 1`, `Grey 2`, `Grey 3`, `Grey 4`)
- British English spelling (ex. `Grey` not `Gray`), unless its something U.S. typical.
- Capitalize colors: `Kind of Orange` following [APA style](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)
- Prefer common names, especially when adding colors of flora and fauna
  (plants and animals ;) ) ex. `Venus Slipper Orchid` instead of `Paphiopedilum`.
- Avoid ethnic & racial assumptions

## Git

- We use automated semantic versioning using conventional changelog rules. You
  can run `npx cz` or `npm run commit` instead of `git commit -m`, or make sure
  to follow [conventional changelog naming rules].
- Write your commit messages in imperative form:
  **feat(colors): Add fantastic new colors names.** rather then
  feat(colors): Added new names.
- Make sure to run `npm run test` before committing.
  For color name changes this is the only command you need locally.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
[conventional changelog naming rules]: https://github.com/conventional-changelog/conventional-changelog
