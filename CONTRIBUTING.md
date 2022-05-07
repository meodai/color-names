# Contributing

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Please note we have a code of conduct, please follow it in all your
interactions with the project.

## Adding colors

1. Only update the `src/colornames.csv` file and run
   `npm run build` or request access to our shared google spreadsheet
2. Make sure the names you commit are not racist or offensive or a protected
   brand name (No Facebook Blue, Coca Cola Red etc.., no nationality or tan etc..).
3. Read the "Rules for new color names" directly below
4. Make sure that neither name nor hex value of your added colors are already
   in use. `npm run test` will test that for you.
5. Update the `README.md` with the source of your colors, unless you invented
   that color, in this case add yourself to the contributors in the `README.md`

**We use automated semantic versioning** make sure to use git cz (or npm run commit).

## Rules for new color names

- No duplicate names or hex values.
- No racist names
- No offensive names
- No obscene names 💩
- No protected brand-names (`Facebook Blue`, `Coca Cola Red`)
- No enumerations (`Grey 1`, `Grey 2`, `Grey 3`, `Grey 4`)
- British English spelling (ex. `Grey` not `Gray`), unless its something U.S. typical.
- Capitalize colors: `Kind of Orange`
- Prefer common names, especially when adding colors of flora and fauna
  (plants and animals ;) ) ex. `Venus Slipper Orchid` instead of `Paphiopedilum`.

## Git

- We use automated semantic versioning using conventional changelog rules. You
  can run `npx cz` or `npm run commit` instead of `git commit -m`, or make sure
  to follow [conventional changelog naming rules].
- Write your commit messages in imperative form:
  **feat(colors): Adds fantastic new colors names.** rather then
  feat(colors): Added new names.
- Make sure to run `npm run build` before commiting. (No need to `npm ci` the
  dependencies are only needed if you need to run the API)

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
[conventional changelog naming rules]: https://github.com/conventional-changelog/conventional-changelog
