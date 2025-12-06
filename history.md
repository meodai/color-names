# The Evolution of Color Names: A Project History

Since its inception in April 2017, the `color-names` project has evolved from
a simple list into a rigorously maintained, standardized dataset of color
names. This document highlights the major eras and largest shifts in the
dataset’s content and structure, rather than listing every individual change.

## The Spark (August 10, 2016)

Started the google spreadsheet, sparking my passion for color name collecting.
The sheet itself was created on **August 10, 2016**, but the moment the
project truly went public was the now-classic tweet from **August 26, 2017**:
“I made a list of 18,000+ color names”
([tweet](https://twitter.com/meodai/status/901503922419298304)), which sent
thousands of visitors and stars to the freshly created repository.

## Inception & Foundation (April – September 2017)

The project began on **April 23, 2017**, with the
[initial commit](https://github.com/meodai/color-names/commit/6f4fdcc) by
David Aerne (`meodai`). It originally started as a simple **Google
Spreadsheet** before being converted into a code repository. The early months
were focused on establishing the core infrastructure and rapid data
acquisition:

- **Rapid Growth (May 2017):** Shortly after launch, the dataset tripled in
  size with multiple updates adding over 5,000 new names
  ([c649f88](https://github.com/meodai/color-names/commit/c649f88),
  [7d7d9bd](https://github.com/meodai/color-names/commit/7d7d9bd)).
  Across a single intense day of commits in late May 2017, roughly **10,000**
  new colors were added in total, making this the single biggest one-day
  growth event in the project’s history.
- **The September Expansion (2017):** A massive influx of data occurred in
  September, with the addition of a large paint manufacturer list
  ([080bbd4](https://github.com/meodai/color-names/commit/080bbd4)),
  traditional Japanese colors
  ([1a995e2](https://github.com/meodai/color-names/commit/1a995e2)), and
  saturated colors
  ([1fbbab9](https://github.com/meodai/color-names/commit/1fbbab9)), adding
  thousands of new entries.
- **Visualizing the Data:** A significant early milestone occurred on
  **September 10, 2017**, when
  [3D visualizations](https://github.com/meodai/color-names/commit/c181096)
  were added to the documentation. These visuals mapped the name distribution
  in RGB color space, providing the first graphical insight into the dataset's
  coverage and density.
- **Tooling:** By late September 2017, the project had matured with a **UMD
  build** for browsers
  ([v3.5.0](https://github.com/meodai/color-names/commit/41d9825)) and a
  [simple API script](https://github.com/meodai/color-names/commit/03ea1a6),
  allowing the list to be served easily.
- **Early Curators:** From the beginning, the project relied on human
  creativity. Early contributors like **Verena**, **Syl**, **Stephanie Stutz**,
  and **Simbiasamba** helped shape the initial personality of the list
  ([3cb6b46](https://github.com/meodai/color-names/commit/3cb6b46)).

## Content Expansion (2018 – 2019)

With the technical foundation laid, the focus shifted to growing the dataset.

- **Steady Growth:** The repository saw a continuous stream of color additions.
- **Themed Waves (2018):** Several playful bursts introduced fantasy, makeup,
  fandom, food, and miniature-paint-inspired colors, reflecting the
  community’s creative relationship to culture, media, and everyday life.
- **Werner's Nomenclature (October 2018):** A historically significant addition
  was the incorporation of colors from
  [Werner's Nomenclature of Colours](https://github.com/meodai/color-names/commit/176b30f),
  an 1814 color reference guide used by Charles Darwin, adding ~70 historically
  documented color names.
- **Specialized Sets:** A notable milestone was **v4.1.0 (April 2019)**, which
  introduced
  [specific fashion and paint color sets](https://github.com/meodai/color-names/commit/ff25923),
  broadening the library's utility beyond standard web colors.

## Modernization & The Paint Palette Era (2020 – 2023)

As the JavaScript ecosystem evolved, so did the project.

- **Community & Collaboration (2021):** The project continued to grow through
  community engagement, with significant batches of user-submitted colors
  ([882a069](https://github.com/meodai/color-names/commit/882a069)) and the
  integration of top-rated names from **colornames.org**
  ([07fcb52](https://github.com/meodai/color-names/commit/07fcb52)).
- **A Growing Community:** The community grew significantly in 2020, welcoming
  prolific namers like **basgys**, **Shelina S.**, **Trevor Elia**, and
  **cheesits456** in March
  ([8475e41](https://github.com/meodai/color-names/commit/8475e41)), followed
  by **Sandhya Subram**, **BerylBucket**, **Jimmy Fitzback**, and **TLZ** in
  July ([79669df](https://github.com/meodai/color-names/commit/79669df)). By
  the end of the year, **DarthTorus**, **Carrion**, **BlueChaos**, and
  **nachtfunke** had joined the ranks
  ([7448a31](https://github.com/meodai/color-names/commit/7448a31)). In 2021,
  a new wave of contributors including **Sean Gibbons**, **Brantley Sibo**, and
  **Jeff Bronks** expanded the list further
  ([c9e501a](https://github.com/meodai/color-names/commit/c9e501a)).
  **Bas Geysels** (`basgys`) remains the single most prolific contributor,
  responsible for many thousands of delightful and quirky names across more
  than half a decade.
- **Team Fortress 2 Colors (August 2021):** A fun pop-culture addition brought
  [Team Fortress 2 paint colors](https://github.com/meodai/color-names/commit/e82b070)
  into the dataset, showcasing the project's embrace of gaming culture.
- **ES Module Support:** In **February 2020**,
  [support for ES modules](https://github.com/meodai/color-names/commit/1731a30)
  was added, reflecting the industry's shift away from CommonJS.
- **Early Adoption & Integrations (2020–2023):** The list began powering design
  tools and experiments, from early integrations (e.g. Pigments, Relume) to
  large-scale usage benchmarks (such as 10.5k names needed within 72 hours),
  demonstrating its suitability for real-world, high-volume projects.
- **Inclusive Language Efforts (2022–2024):** The project took a strong stance
  on inclusive naming. In **June 2022**, efforts began to
  [remove "caucasian as default" color names](https://github.com/meodai/color-names/commit/e676436).
  In **February 2023**, the
  [Confederate color was removed](https://github.com/meodai/color-names/commit/2ff1afa),
  followed by the removal of
  [colonial-themed colors](https://github.com/meodai/color-names/commit/5944e2e)
  in **March 2023**. This effort continued into **August 2024** with further
  [decolonizing efforts](https://github.com/meodai/color-names/commit/49d6e9f).
- **External List Import Wave (June 2022):** A major expansion came from
  importing large batches of colors from multiple curated lists
  ([6905331](https://github.com/meodai/color-names/commit/6905331),
  [1046d28](https://github.com/meodai/color-names/commit/1046d28),
  [f0be753](https://github.com/meodai/color-names/commit/f0be753),
  [5cc7ee5](https://github.com/meodai/color-names/commit/5cc7ee5),
  [4cab0a8](https://github.com/meodai/color-names/commit/4cab0a8)), adding
  several hundred new entries in a concentrated burst.
- **Diamond Vogel Paint Colors (December 2022):** A significant addition of
  professional paint colors came with the
  [Diamond Vogel palette](https://github.com/meodai/color-names/commit/b955b63),
  adding 49 new names from the paint industry.
- **Large Color-Value Corrections (November 2022):** A
  [sweeping accuracy pass](https://github.com/meodai/color-names/commit/13a161f)
  adjusted around a thousand color values, improving the fidelity of the
  underlying RGB data without changing the names themselves.
- **Hawaiian Food & Plant Names (May 2023):** The dataset embraced cultural
  diversity with
  [Hawaiian food and plant color names](https://github.com/meodai/color-names/commit/d6175a8),
  contributed via PR #163.
- **Apostrophe Standardization (June 2023):** A major typographical cleanup
  occurred when
  [correct apostrophes were enforced](https://github.com/meodai/color-names/commit/6f14195),
  fixing over 400 color names that used incorrect apostrophe characters.
- **Data Insights:** Scripts were added to track the history of color changes
  ([history.js](https://github.com/meodai/color-names/commit/75bfdd2)),
  authored by **Nicolas Mattia**, allowing users to see when specific colors
  were added or modified.
- **The API Spin-off:** On **December 23, 2022**, the project reached a
  maturity point where the
  [API code was decoupled](https://github.com/meodai/color-names/commit/4512eea)
  from the data. The API was moved to its own dedicated repository, allowing
  `color-names` to focus purely on being the definitive data source while the
  API project handled serving that data.
- **API as a Living System (2023–2024):** The API evolved into a "dreaming"
   system, powering visualizations of live color-name requests and creative
   img2img/AI experiments, turning the dataset into an endlessly reimagined
   stream of color poetry.
- **Contributor Workflow & Rules (2018–2023):** The
  [`CONTRIBUTING.md`](https://github.com/meodai/color-names/blob/main/CONTRIBUTING.md)
  file grew from a short note into a detailed guide, introducing strict
  capitalization (APA title case), clarifying test and CI behavior, and
  explicitly banning LLM/AI‑generated names so the list stays intentionally
  human‑curated.
- **Automated Docs & Visuals:** During this era,
  [`README.md`](https://github.com/meodai/color-names/blob/main/README.md) and
  the generated [`changes.svg`](https://github.com/meodai/color-names/blob/main/changes.svg)
  banner were wired into CI, automatically updating counts and a small visual
  preview of the latest color names instead of relying on manual edits.

## The ESM Refactor (November 2024)

A major technical pivot occurred with **v11.0.0 (November 16, 2024)**.

- **Pure ESM:** The project underwent a
  [breaking change](https://github.com/meodai/color-names/commit/82731ea) to
  fully embrace ECMAScript Modules (ESM).
- **Named Exports:** It switched from a default export to a named export
  (`colornames`), modernizing the consumption pattern for developers.
  From roughly **2019–2024**, the package also shipped a built-in
  `closestColor()` KD-tree lookup function. That convenience, combined with the
  rich dataset, explains why so many tools chose to bundle the full
  1.2&nbsp;MB list directly.
- **“A List Apart” README:** The README’s "A List Apart" section was refined
  to clearly articulate what differentiates `color-names`: curated subsets
  (full, best‑of, short), strict quality rules and validations, inclusive
  naming guidelines, and an emphasis on human, non‑AI contributions.
- **Chakra Colors (April 2024):** Earlier in the year, a spiritual addition
  brought [Chakra-inspired colors](https://github.com/meodai/color-names/commit/59f8f2a)
  to the dataset.
- **Pun Colors (October 2024):** The dataset got a playful boost with
  [pun-based color names](https://github.com/meodai/color-names/commit/4d93703),
  adding nearly 20 humorous entries.
- **Festive & Travel-Inspired Names (Late 2024):** New sets such as
  Christmas-themed and Philippines-inspired colors connected the list to
  personal travel and seasonal storytelling.
- **Language Ports & Ecosystem (2024):** Community ports (such as a C#
  implementation with KD‑Tree lookup) and over 900 dependent repositories
  signaled that `color-names` had become a core building block across
  languages and tools.

## The "Quality & Standardization" Era (Late 2025)

The most recent period of activity in late 2025 has been characterized by
strict validation and linguistic standardization, resulting in three major
version bumps:

- **Duplicate Detection (v12.0.0, September 2025):** Introduction of
  [sophisticated scripts to detect near-duplicates](https://github.com/meodai/color-names/commit/985c300)
  and normalize names, removing ~170 redundant entries.
- **Misspelling Cleanup (September 2025):** A thorough review removed
  [common misspellings](https://github.com/meodai/color-names/commit/069e71a),
  cleaning up ~170 incorrectly spelled color names.
- **Plural Handling (v13.0.0, September 2025):** Enhanced validation to
  [handle pluralization](https://github.com/meodai/color-names/commit/c163947),
  ensuring singular/plural variations didn't clutter the list, removing ~70
  plural duplicates.
- **APA Style Capitalization (November 2025):** Enforcement of
  [proper APA style capitalization](https://github.com/meodai/color-names/commit/05f17fe)
  across the dataset, standardizing ~120 color names.
- **Linguistic Standardization (v14.0.0, December 2025):** A strict enforcement
  of [British English spelling](https://github.com/meodai/color-names/commit/2998294)
  and **APA style capitalization**. This was a significant breaking change that
  renamed or removed numerous "Americanized" entries (~210 changes) to ensure
  consistency across the entire dataset.
- **New Formats & Subsets (2025):** A new TOON format (a compact tabular JSON
   variant optimized for LLMs) and additional curated subsets made the data
   easier to consume in modern tooling.
- **Ongoing Community Releases (2024–2025):** Frequent minor versions (such
  as **v11.23.0**, **v11.24.0**, **v13.18.0**, **v13.23.0**, **v13.32.0**)
  delivered waves of user-submitted and themed names, while CI, markdownlint,
  and improved diffs kept contributions smooth.
- **Cultural & Linguistic Review:** Public calls for feedback (for example on
  Hindi color names) and community vigilance around problematic terminology
  reinforced the project’s commitment to global, respectful naming.
- **A Passionate Contributor Community:** Contributors range from prolific
  namers to people who created a GitHub account just to add a single color
  name, underlining that the list is as much a human story as it is a dataset.

## Current State (December 2025)

The dataset now contains over **30,000 curated color names**, making it one of
the largest human-curated color name collections in the world. The project
continues to accept community contributions while maintaining strict quality
standards for naming conventions, spelling, and cultural sensitivity.

Over time the project has also grown in visibility and usage:

- **Repository stars:** 1,000 (October 2017), 1,500 (2020), 2,000 (2023), and
  roughly **2,800** stars by December 2025, alongside hundreds of forks and
  dependents.
- **API traffic:** As of late 2025, the companion Color Names API serves
  roughly **3 million requests per month**, continuously turning random RGB
  values and hex codes into small pieces of color poetry.
