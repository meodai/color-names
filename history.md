# The Evolution of Color Names: A Project History

Since its inception in April 2017, the `color-names` project has evolved from
a simple list into a rigorously maintained, standardized dataset of color
names. Here are the key eras in its development:

## The Spark (August 10, 2016)

Started the google spreadsheet, sparking my passion for color name collecting.

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
- **ES Module Support:** In **February 2020**,
  [support for ES modules](https://github.com/meodai/color-names/commit/1731a30)
  was added, reflecting the industry's shift away from CommonJS.
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

## The ESM Refactor (November 2024)

A major technical pivot occurred with **v11.0.0 (November 16, 2024)**.

- **Pure ESM:** The project underwent a
  [breaking change](https://github.com/meodai/color-names/commit/82731ea) to
  fully embrace ECMAScript Modules (ESM).
- **Named Exports:** It switched from a default export to a named export
  (`colornames`), modernizing the consumption pattern for developers.

## The "Quality & Standardization" Era (Late 2025)

The most recent period of activity in late 2025 has been characterized by
strict validation and linguistic standardization, resulting in three major
version bumps:

- **Duplicate Detection (v12.0.0, September 2025):** Introduction of
  [sophisticated scripts to detect near-duplicates](https://github.com/meodai/color-names/commit/985c300)
  and normalize names.
- **Plural Handling (v13.0.0, September 2025):** Enhanced validation to
  [handle pluralization](https://github.com/meodai/color-names/commit/c163947),
  ensuring singular/plural variations didn't clutter the list.
- **Linguistic Standardization (v14.0.0, December 2025):** A strict enforcement
  of [British English spelling](https://github.com/meodai/color-names/commit/2998294)
  and **APA style capitalization**. This was a significant breaking change that
  renamed or removed numerous "Americanized" entries to ensure consistency
  across the entire dataset.
