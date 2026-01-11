# Contributing

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Please note we have a code of conduct; please follow it in all your interactions
with the project.

## Important Note

We're not actively looking to grow the list much further. Instead, we'd love
help **replacing uninspired or plain bad names**
(e.g., `Amethyst Light Violet`). Yes, this is subjective—but hey,
it's a list of color names! 🎨

## Adding Colors

1. **Review Rules:** Read and adhere to the
["Rules for new color names"](#rules-for-new-color-names) below.
2. **File Edits:** For color changes, update `src/colornames.csv`. Each line
should end with a trailing comma (e.g., `My Color,#ff5733,`).
   - If a test requires an explicit exception, also update the referenced
     allowlist JSON file in `tests/`.
3. **Local Check:** Run npm test to confirm names and hex values are unique
and that no generated files are modified.
4. **Source**: Add the source/origin of your new colors in the Pull Request
description. Maintainers will update documentation if needed.
5. **Do Not Commit Generated Files:** Do not commit changes to generated files
like `README.md`, `changes.svg`, or anything in `dist/`.

## Rules for New Color Names

### 🚫 Name Exclusions (Mandatory)

These rules are strictly enforced for all new and changed names:

- **No Duplicates:** Neither the name nor the hex value can be a duplicate of
an existing entry.
- **Offensive Content:** No offensive, racist, obscene, or derogatory names
(including terms based on ethnicity, race, nationality, gender, or sex). Avoid
ethnic and racial assumptions.
- **Protected Brands:** No protected brand names (e.g., `Coca Cola Red`,
`Facebook Blue`).
- **No Enumerations:** No numbered or simple sequence names (e.g., `Grey 1`,
`Blue 2`).
- **No AI Generation:** Do not use LLM / AI to generate color names.
- **No Near-Primary Colors:** Do not add colors that are nearly identical
(OKLab distance) to protected target colors (see `tests/protected-targets.json`).
This helps avoid ambiguous “closest color” results in downstream consumers.
- **No Best-Of Flag:** Do not set the `bestOf` flag (third column) yourself;
this is exclusively done by maintainers.

### ✨ Naming Conventions (Style & Clarity)

- **Convey Color:** Names must clearly evoke a color (e.g., `Sunset Orange`
evokes orange, `Partygoer` does not).
- **Common/Flora/Fauna:** Prefer common names, especially when referencing
flora and fauna (plants and animals); for example, use `Venus Slipper Orchid`
instead of `Paphiopedilum`.
- **British English:** Use British English spelling (e.g., `Grey` not `Gray`),
unless the name is something typically U.S. (e.g., `Tuscan Red` is fine).
- **Capitalization (APA Title Case):** Capitalize the name following
[APA title case style](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)
(e.g., `Kind of Orange`).

## Generated Files and CI

- PRs run `npm ci`, `npm run build`, and `npm test` in CI.
- CI may update `README.md` and `changes.svg` automatically and push to your PR branch.
- **Do not include generated files** (`dist/`, `README.md`, `changes.svg`) in
your commits.
- For color name changes, only submit updates to `src/colornames.csv`.
- No need to run `npm run build` locally; CI generates outputs.
- Optional locally: `npm run lint:markdown` to match CI markdown checks.

## Committing Changes

We use automated semantic versioning based on conventional changelog rules.

- You can run `npx cz` or `npm run commit` instead of `git commit -m`.
- Alternatively, make sure your commit message follows the
[conventional changelog naming rules][conventional changelog naming rules].
Our conventional commits look like:

```text
  feat(colors): Add fantastic new colors names.
  fix(colors): Correct the hex value for Awesome Pink.
  docs(readme): Update the readme to include new colors.
```

- **Imperative Form:** Write your commit messages in imperative form:
**feat(colors): Add fantastic new colors names.** rather than *feat(colors):
Added new names.*
- Make sure to run `npm run test` before committing. For color name changes,
this is the only command you need locally.

## No Command Line? No Problem\! 🐣

If you are not familiar with Git or the command line, you can contribute directly
through GitHub:

1. **Fork the repository**: Click the "Fork" icon in the top right corner of
this page. This creates a copy of the project under your own account.
2. **Edit the list**: Navigate to `src/colornames.csv` in your forked repository.
3. **Add your colors**: Scroll to the bottom and add your new colors. Don't
worry about sorting; it will be done automatically for you. **Make sure to add
a trailing comma after the hex value**, for example:

    ```csv
    My Awesome Color,#ff5733,
    ```

4. **Create a Pull Request**:
    - Commit your changes in the GitHub interface.
    - Go back to the [original repository](https://github.com/meodai/color-names).
    - GitHub will often show a banner asking if you want to create a Pull
    Request from your recent changes. If not, go to the "Pull requests" tab
    and click "New pull request", then "compare across forks" to select your
    version.
    - Fill in the details and submit your Pull Request. The title should look
    something like "feat(colors): Add new color names".

If this feels too complicated, feel free to just
[open an issue](https://github.com/meodai/color-names/issues/new)
with your list or share a Google Spreadsheet with us. Note that doing it this
way skips our automated checks (which tell you if a color is already taken),
so it might take a bit longer to review.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 1.4, available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
[conventional changelog naming rules]: https://github.com/conventional-changelog/conventional-changelog
