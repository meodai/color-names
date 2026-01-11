**PR title format:** `feat(colors): Describe your colors`

## Summary

Describe what this PR changes. For color additions, mention how many colors you
added or adjusted.

## Checklist

- [ ] I have read and followed `CONTRIBUTING.md`.
- [ ] I only edited `src/colornames.csv` for color name changes (and, if needed,
the relevant allowlist JSON in `tests/`) — no changes to `dist/`, `README.md`,
or `changes.svg`.
- [ ] Each line ends with a trailing comma (e.g., `My Color,#ff5733,`).
- [ ] New color names:
  - [ ] Convey a specific color (not just a vibe or reference).
  - [ ] Follow the "Rules for new color names" (no racist/offensive/obscene/
  brand names, etc.).
  - [ ] Are not nearly identical to protected primary colors.
  - [ ] Use British English spelling where applicable (e.g. `Grey` not `Gray`).
  - [ ] Are capitalized in [APA-style title case](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case).
- [ ] I ran `npm test` locally (or understand CI will run it for me).

## Color source / inspiration

Explain where these colors come from (e.g. standard, dataset, artwork, game, etc.)
and link sources if possible.

## Notes for maintainers

Anything special reviewers should know (e.g. why a borderline or subjective name
still feels appropriate, or why it improves over an existing uninspired name).
