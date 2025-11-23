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
- Do not use LLM / AI to generate color names.

## Generated files and CI

- PRs run `npm ci`, `npm run build`, and `npm test` in CI.
- CI may update `README.md` and `changes.svg` automatically and push
  to your PR branch.
- Do not include generated files (`dist/`, `README.md`, `changes.svg`) in commits.
- For color name changes, only submit updates to `src/colornames.csv`.
- No need to run `npm run build` locally; CI generates outputs.
- Optional locally: `npm run lint:markdown` to match CI markdown checks.

## Committing changes

- We use automated semantic versioning using conventional changelog rules. You
  can run `npx cz` or `npm run commit` instead of `git commit -m`, or make sure
  to follow [conventional changelog naming rules]. Our conventional commits
  look like:

  ```text
  feat(colors): Add fantastic new colors names.
  fix(colors): Correct the hex value for Awesome Pink.
  docs(readme): Update the readme to include new colors.
  ```

- Write your commit messages in imperative form:
  **feat(colors): Add fantastic new colors names.** rather then
  feat(colors): Added new names.
  Make sure to run `npm run test` before committing.
  For color name changes this is the only command you need locally.

## No Command Line? No Problem! 🐣

If you are not familiar with Git or the command line, you can contribute directly
through GitHub:

1. **Fork the repository**: Click the "Fork" icon in the top right corner of
   this page. This creates a copy of the project under your own account.
2. **Edit the list**: Navigate to `src/colornames.csv` in your forked
   repository.
3. **Add your colors**: Scroll to the bottom and add your new colors. Don't
   worry about sorting; it will be done automatically for you.
4. **Create a Pull Request**:
   - Commit your changes in the GitHub interface.
   - Go back to the [original repository](https://github.com/meodai/color-names).
   - GitHub will often show a banner asking if you want to create a Pull Request
     from your recent changes. If not, go to the "Pull requests" tab and click
     "New pull request", then "compare across forks" to select your version.
   - Fill in the details and submit your Pull Request. The title should look
      something like "feat(colors): Add new color names".

If this feels too complicated, feel free to just
[open an issue](https://github.com/meodai/color-names/issues/new) with your
list or share a Google Spreadsheet with us. Note that doing it this way skips
our automated checks (which tell you if a color is already taken), so it might
take a bit longer to review.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
[conventional changelog naming rules]: https://github.com/conventional-changelog/conventional-changelog
