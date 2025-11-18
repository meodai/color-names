<img
  align="left"
  height="119"
  width="119"
  src="https://meodai.github.io/color-names/logo/cockatoo-fill.svg"
  alt="Color Names Logo"
/>

# Color Names

[![GitHub release](https://img.shields.io/github/release/meodai/color-names.svg)](https://github.com/meodai/color-names/)
[![npm version](https://img.shields.io/npm/v/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![npm](https://img.shields.io/npm/dt/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![github sponsor count](https://img.shields.io/github/sponsors/meodai)](https://github.com/sponsors/meodai)

A meticulously curated collection of __29991__ unique color names, sourced from
[various references](#sources-) and thousands of thoughtful user contributions.

> The names of color function like a thread attached to a frightfully slender
> needle, capable of stitching together our most delicate emotions and memories.
> When the needle hits the target, we feel either pleasure or empathy.
> __Kenya Hara – White__

<p>
  <a href="#explore-">Explore / Find Names</a>
  | <a href="#color-distribution-">Name distribution in different models</a>
  | <a href="#usage-">Usage</a>
  | <a href="#cdn-">CDN</a>
  | <a href="#api-">Public Rest API</a>
  | <a href="#sources-">Name Sources</a>
  | <a href="#latest-color-names-">Latest Color Names</a>
  | <a href="#costs--sponsors">Sponsors</a>
</p>

## About 📋

This project aims to assemble the largest possible list of color names,
while maintaining high standards for name quality. We have merged numerous
[lists](#sources-), resolved duplicate names with different hex values,
and adjusted colors where identical values had different names.

## Explore 🌍

- [Color Picker & Name Search]: Click the wheel to discover a color name,
  or use the full text search.
- [Color Picker]: Click the colored area to change the color or enter a hex
  value below the name.
- [Color Picker II]: Move your mouse and scroll to select a color.
- [Name Search]: Perform a full text search on the color list.
- [Color Distribution]: Explore a 3D visualization of all color names in various
  color models.
- [Twitter Bot]: Posts random colors and allows you to submit new ones.

## Color Name Submission 💌

__[via form 🌈](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)
/ or [twitter 🐦](https://twitter.com/color_parrot)__

Please review the [naming rules](CONTRIBUTING.md) before contributing!

### Contributing via Git 🫱🏽‍🫲🏻

To contribute via Git, edit the `src/colornames.csv` file
and ensure tests pass locally (`npm test`).

See the full guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

CI notes:

- Pull Requests run `npm ci`, `npm run build`, and `npm test`.
- CI auto-updates `README.md` and `changes.svg` if needed and pushes to your PR branch.
- Do not commit generated files (`dist/`, `changes.svg`).
- For color name changes, only submit updates to `src/colornames.csv`.
- No need to run `npm run build` locally; CI generates outputs.
- Optional locally: `npm run lint:markdown` to match CI markdown checks.

## Color Count: __29991__ 🎉

~__0.18%__ of the RGB color space

## [Color distribution](https://codepen.io/meodai/full/zdgXJj/) 🛰

![3d representation of color distribution in RGB Space (Preview image of link above)](https://raw.githubusercontent.com/meodai/color-names/gh-pages/color-spaces.gif)

When creating new color names, it's essential to understand which areas of a
color space are crowded and where new names can be added. For example, our API
returns the closest `RGB` color to a given `HEX` value. To prevent too many
colors from mapping to the same name, we strive for an even distribution in
color space: [Visualization](https://codepen.io/meodai/full/zdgXJj/)

## Usage 📖

### Docs

While the tooling and list are primarily in JavaScript/TypeScript, there are several
other implementations maintained by the community:

- JS/TS: [docs/usage-js.md](docs/usage-js.md)
- Java/Kotlin: [docs/usage-java-kotlin.md](docs/usage-java-kotlin.md)
- C#: [docs/usage-csharp.md](docs/usage-csharp.md)
- Rust: [docs/usage-rust.md](docs/usage-rust.md)

### Consuming the list

The list is available in [multiple formats](https://app.unpkg.com/color-name-list/files/dist),
or you can use the [public REST API](#api-), making it easy to integrate into
your project.

### CDN 🌍

#### All Names 📚

[JSON](https://unpkg.com/color-name-list/dist/colornames.json)
/ [JSON.min](https://unpkg.com/color-name-list/dist/colornames.min.json)
/ [CSV](https://unpkg.com/color-name-list/dist/colornames.csv)
/ [YML](https://unpkg.com/color-name-list/dist/colornames.yaml)
/ [JS](https://unpkg.com/color-name-list/dist/colornames.umd.js)
/ [XML](https://unpkg.com/color-name-list/dist/colornames.xml)
/ [HTML](https://unpkg.com/color-name-list/dist/colornames.html)
/ [SCSS](https://unpkg.com/color-name-list/dist/colornames.scss)

#### Best of Names subset 🏆

[JSON](https://unpkg.com/color-name-list/dist/colornames.bestof.json)
/ [JSON.min](https://unpkg.com/color-name-list/dist/colornames.bestof.min.json)
/ [CSV](https://unpkg.com/color-name-list/dist/colornames.bestof.csv)
/ [YML](https://unpkg.com/color-name-list/dist/colornames.bestof.yaml)
/ [JS](https://unpkg.com/color-name-list/dist/colornames.bestof.umd.js)
/ [XML](https://unpkg.com/color-name-list/dist/colornames.bestof.xml)
/ [HTML](https://unpkg.com/color-name-list/dist/colornames.bestof.html)
/ [SCSS](https://unpkg.com/color-name-list/dist/colornames.bestof.scss)
/ [CSS](https://unpkg.com/color-name-list/dist/colornames.bestof.css)

### Usage JS 📦

__Size Warning (1.14 MB)__: For browser usage,
consider the [public rest API](#api-).

Minimal example:

```javascript
import { colornames } from 'color-name-list';

const white = colornames.find((c) => c.hex === '#ffffff');
console.log(white?.name); // => white
```

More examples: see `docs/usage-js.md`.

### API 🃏

To simplify access, we provide a free and public REST API for all color names
and other public name lists. Full API code and documentation are available
[in this repository](https://github.com/meodai/color-name-api).

#### API Example Call Usage

```url
https://api.color.pizza/v1/?values=00f,f00,f00&list=bestOf
```

#### API Disclaimer

The API is free and has no usage limits. However, if your commercial app or site
generates excessive traffic, you may be asked to become a sponsor.

You are welcome to self-host the API—it's easy to deploy on Heroku and relies
only on a few dependencies: [Color-Name-API](https://github.com/meodai/color-name-api)

### Building 🔨

```shell
npm install && npm run build
```

See [package.json](package.json#L6) for details.

### Java/Kotlin, C#, Rust

- [docs/usage-java-kotlin.md](docs/usage-java-kotlin.md)
- [docs/usage-csharp.md](docs/usage-csharp.md)
- [docs/usage-rust.md](docs/usage-rust.md)

## Sources 🗒

### Sources: Names 📇

- Thousands of user submissions [Twitter](https://codepen.io/meodai/full/ZXQzLb/)
  / [Google Docs](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)
  / [Github](#contributors-)
- [Wikipedia list of named colors] (2018-02-23)
- [Wada Sanzo's list of named colors]
- [CSS/HTML color names]
- [Werner’s Nomenclature of Colours]
- [ntc.js] (chir.ag's Name that Color library)
- [xkcd color survey list]
- [htmlcsscolor.com]
- [OSX Crayons]
- [Crayola crayon]
- [Japanese Twelve Level Cap and Rank System colors]
- [Thailand weekday colors]
- [Chinese heavenly creatures colors]
- [Military Paint]
- [Olympian god colors]
- Model Color Paints: [Vallejo](http://www.danbecker.info/minis/miniother/PaintCharts/VallejoModelColor.html)
- [Fictional Colors] (2018-05-09)
- Non English Transliterations:
  [Japanese](https://en.wikipedia.org/wiki/Traditional_colors_of_Japan)
  , [Mandarin](http://www.fluentu.com/blog/chinese/2016/07/25/chinese-colors/)
  , [Hindi](https://en.wikibooks.org/wiki/Hindi/Colors)
  , [Persian](https://en.wikibooks.org/wiki/Persian/Phrasebook/Colors)
  , [Russian](//github.com/AleksejDix)
  , [Māori](https://www.maorilanguage.net/maori-words-phrases/colours-nga-tae/)
- Multiple paint, print, nail polish, model paint color lists
- Curated Machine Learning names from [Matt DesLauriers](https://twitter.com/mattdesl/status/1234829613907501057)
  and [Nathan Kjer](https://nathankjer.com/text-generation/)
- [Team Fortress 2 paint colors](https://wiki.teamfortress.com/wiki/Paint_Can#Colors)

## Contributors 🦑

- [meodai] Initiator, maintainer, name creator &, tooling
- [Nirazul] Name creator & tooling
- [Bathos] Tooling
- [Metafizzy] Logo 💖

## Costs & Sponsors

### Sponsors

<!-- markdownlint-disable -->
<!-- sponsors --><!-- sponsors -->
<!-- markdownlint-enable -->

### Past Sponsors

- [Colorful Dots] 500USD
- [krissymashinsky.com] 300USD
- [color.museum] 100CHF
- [@tunnckoCore] 50USD
- [Myriam Aerne] 40CHF
- [Amin] 15USD
- [neverything] 25USD/month
- [Dmitry Iv.] 10USD/month

### Project Costs USD

#### One-Time

| Item              | Expenditure |
| ----------------- | ----------- |
| Logo by Metafizzy | 800         |

#### Periodic

| Item                    | Expenditure |
| ----------------------- | ----------- |
| Color Name API Server   | 264.60/year |
| color.pizza domain name | 36.16/year  |
| Cloudflare PRO Plan     | 240/year    |

### Color Namers

[Verena the naming overlord]
, [Jess the name wizard]
, [Syl]
, [Stephanie Stutz]
, [Simbiasamba]
, [Jason Wilson]
, [Inês João]
, [Nick Niles]
, [Qwhex]
, [Ichatdelune]
, [basgys]
, Shelina S.
, Trevor Elia
, [cheesits456]
, [Sandhya Subram]
, [BerylBucket]
, [Jimmy Fitzback]
, [TLZ]
, [DarthTorus]
, [Carrion]
, [BlueChaos]
, [nachtfunke]
, Sean Gibbons
, Brantley Sibo
, Jeff Bronks
, Joseph Oloughlin
, Nathan Swift
, Abra Giddings
, Iraj Nelson
, [Alex Cristache]

## Disclaimer 👮🏾‍

We are committed to fostering an inclusive and respectful environment.
We actively remove any offensive, racist, or protected brand names from our
list. While we strive to screen out such names, some may inadvertently remain.
If you encounter any, please [let us know](https://github.com/meodai/color-names/issues/new?title=Bad%20color%20name)
so we can address them promptly.

## Latest Color Names 🔖

![New colors](changes.svg 'New colors')

<!-----------------------------------------------------------------------------
                               REFERENCE LINKS
------------------------------------------------------------------------------>

<!-- explore -->

[Color Picker & Name Search]: https://codepen.io/meodai/full/pXNpXe
[Color Picker]: http://codepen.io/meodai/full/mEvZRx/
[Color Picker II]: https://codepen.io/meodai/full/xWNNwN
[Name Search]: https://codepen.io/meodai/full/VMpNdQ/
[Color Distribution]: https://codepen.io/meodai/full/zdgXJj/
[Twitter Bot]: https://twitter.com/color_parrot

<!-- people -->

[Ichatdelune]: https://www.reddit.com/user/Ichatdelune
[Inês João]: https://www.inesjoao.me/
[Jason Wilson]: https://github.com/SgiobairOg
[Jess the name wizard]: https://twitter.com/_nutbird_
[meodai]: https://github.com/meodai
[Bathos]: https://github.com/bathos
[Metafizzy]: https://metafizzy.co/
[Nick Niles]: http://nickniles.com/
[Nirazul]: https://github.com/Nirazul
[Qwhex]: https://github.com/qwhex
[Simbiasamba]: https://www.instagram.com/simbisamba/
[Stephanie Stutz]: https://www.behance.net/stephaniestutzart
[Syl]: https://twitter.com/MMOsyl
[Verena the naming overlord]: https://github.com/yxklyx/
[basgys]: https://github.com/basgys
[cheesits456]: https://cheesits456.dev
[Sandhya Subram]: https://sandhyasubram.github.io/
[BerylBucket]: https://github.com/BerylBucket
[Jimmy Fitzback]: https://www.linkedin.com/in/jimmy-fitzback-6b602265/
[TLZ]: https://github.com/TheLastZombie
[DarthTorus]: https://github.com/DarthTorus
[Carrion]: https://twitter.com/Cutlaska
[BlueChaos]: https://www.instagram.com/bluechaos1811/
[Dmitry Iv.]: https://github.com/dy
[neverything]: https://neverything.me/
[Myriam Aerne]: https://fynoeggeli.ch/
[nachtfunke]: https://helloyes.dev
[amin]: http://www.slashui.com
[@tunnckoCore]: https://github.com/tunnckoCore
[Colorful Dots]: https://colorfuldots.com/
[color.museum]: https://www.color.museum/
[krissymashinsky.com]: https://www.krissymashinsky.com/
[Alex Cristache]: https://x.com/AlexCristache

<!-- Sources: Names -->

[Japanese Twelve Level Cap and Rank System colors]: https://en.wikipedia.org/wiki/Twelve_Level_Cap_and_Rank_System
[Chinese heavenly creatures colors]: https://en.wikipedia.org/wiki/Color_in_Chinese_culture
[Crayola crayon]: https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors
[CSS/HTML color names]: https://developer.mozilla.org/en/docs/Web/CSS/color_value
[Fictional Colors]: https://en.wikipedia.org/wiki/List_of_fictional_colors#Identified_fictional_colors
[htmlcsscolor.com]: http://www.htmlcsscolor.com/color-names-rgb-values/A
[Military Paint]: http://paintref.com/cgi-bin/colorcodedisplay.cgi?manuf=Military
[Werner’s Nomenclature of Colours]: https://www.c82.net/werner/
[ntc.js]: http://chir.ag/projects/ntc/
[Olympian god colors]: http://www.hellenicgods.org/colors-associated-with-the-olympian-gods
[OSX Crayons]: http://www.randomactsofsentience.com/2013/06/os-x-crayon-color-hex-table.html
[Thailand weekday colors]: https://en.wikipedia.org/wiki/Colors_of_the_day_in_Thailand
[Wikipedia list of named colors]: https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F
[Wada Sanzo's list of named colors]: https://sanzo-wada.dmbk.io/
[xkcd color survey list]: https://blog.xkcd.com/2010/05/03/color-survey-results/

<!-- EOF -->
