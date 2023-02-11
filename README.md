<img align="left" height="119" width="119" src="https://meodai.github.io/color-names/logo/cockatoo-fill.svg">

# Color Names

[![Actions Status](https://github.com/meodai/color-names/workflows/Build%20CI/badge.svg)](https://github.com/meodai/color-names/actions)
[![GitHub release](https://img.shields.io/github/release/meodai/color-names.svg)](https://github.com/meodai/color-names/)
[![npm version](https://img.shields.io/npm/v/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![npm](https://img.shields.io/npm/dt/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![name count](https://img.shields.io/badge/__30032__-names-orange.svg)](https://github.com/meodai/color-names/blob/master/src/colornames.csv)
[![github sponsor count](https://img.shields.io/github/sponsors/meodai)](https://github.com/sponsors/meodai)

A handpicked list of __30032__ unique color names from
[various sources](#sources-) and thousands of curated user submissions.

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
  | <a href="#usage-js-">Usage JS</a>
  | <a href="#sources-">Name Sources</a>
  | <a href="#latest-color-names-">Latest Color Names</a>
  | <a href="#costs--sponsors">Sponsors</a>
</p>

## About 📋

The aim of this project is to create a list of color names as large as possible,
while keeping a good name quality. We've merged various [lists](#sources-),
modified the names when there were duplicates with different hex values, and
shifted the colors a bit when there were identical colors with different names.

## Explore 🌍

- [Color Picker & Name Search] Click the wheel to get name for a color, or just
  use the full text search.
- [Color Picker]: Click the colored surface to change the color or type in a
  hex value below the name.
- [Color Picker II]: Move your mouse and scroll to choose a color.
- [Name Search]: full text search on the color list.
- [Color Distribution] 3D view of all color names in different color spaces.
- [Twitter Bot]: Posts random colors and lets you submit new ones.

## Color Name Submission 💌

__[via form 🌈](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)
/ or [twitter 🐦](https://twitter.com/color_parrot)__

Make sure to read the [naming rules](CONTRIBUTING.md) before you contribute!

## Color Count: __30032__ 🎉

~__0.18%__ of the RGB color space

## [Color distribution](https://codepen.io/meodai/full/zdgXJj/) 🛰

![3d representation of color distribution in RGB Space (Preview image of link above)](https://raw.githubusercontent.com/meodai/color-names/gh-pages/color-spaces.gif)

When coming up with new color names, it is vital to know what spots in a
certain color-space are crowded and where there is still room for new colors.
For example: Our API returns the closest `RGB` color to a given `HEX` value.
To avoid too many colors snapping to the same name, we aim to distribute the
colors evenly in the color space: [Visualization](https://codepen.io/meodai/full/zdgXJj/)

## Usage 📖

### Node.js Installation 📦

__Size Warning (1.14 MB)__: If you are doing this in the browser,
consider using the [public rest API](#api-)

```shell
npm install color-name-list --save
```

or `yarn add color-name-list`

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

### API 🃏

To make it easier to access the names, we offer a free and public Rest API that
allows you to access all the color names and names from other publicly available
name lists. You can find the full API code and documentation
[in this repository](https://github.com/meodai/color-name-api).

#### API Exaple Call Usage

```url
https://api.color.pizza/v1/?values=00f,f00,f00&list=bestOf
```

#### API Disclaimer

The API is free to use and has no limitations. But if your app/site is commercial
and causes excessive traffic, I might contact you to become a sponsor.

Feel free to deploy it yourself, it is very easy to host/deploy on heroku and
has no dependencies [Color-Name-API](https://github.com/meodai/color-name-api)

### Usage JS ⌨

__Size Warning (1.14 MB)__: If you are doing this in the browser,
consider using the [public rest API](#api-)

#### Exact Color

```javascript
import namedColors from 'color-name-list';

let someColor = namedColors.find(color => color.hex === '#ffffff');
console.log(someColor.name); // => white

let someNamedColor = namedColors.find(color => color.name === 'Eigengrau')
console.log(someColor.hex); // => #16161d
```

#### Closest Named Color

Since there are 16777216 possible RGB colors, you might use a library such as
[nearest-color] or [ClosestVector] to help you find the the closest named color.

```js
import nearestColor from 'nearest-color';
import colorNameList from 'color-name-list';

// nearestColor need objects {name => hex} as input
const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});

const nearest = nearestColor.from(colors);

// get closest named color
nearest('#f1c1d1'); // => Fairy Tale
```

__Note__: If you are looking for something visually more accurate, you could
use [DeltaE] or use the above snippet, but using [ciecam02] instead of RGB.

[DeltaE]: https://github.com/zschuessler/DeltaE
[ciecam02]: https://github.com/baskerville/ciecam02

### Building 🔨

```shell
npm install && npm run build
```

See [package.json](package.json#L6) for more.

## Sources 🗒

### Sources: Names 📇

- Thousands of user submissions [Twitter](https://codepen.io/meodai/full/ZXQzLb/)
  / [Google Docs](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)
  / [Github](#contributors-)
- [Wikipedia list of named colors] (2018-02-23)
- [Wada Sanzo's list of named colors]
- [CSS/HTML color names]
- [Werner’s Nomenclature of Colours]
- [ntc.js]
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

#### Gold

- [Colorful Dots] 500USD/year

#### Silver

- [neverything] 25USD/month
- [Dmitry Iv.] 10USD/month
- [colorkit.co] 10USD/month

#### Bronze

- [krissymashinsky.com] 300USD
- [color.museum] 100CHF
- [Myriam Aerne] 20CHF
- [Amin] 15USD

### Project Costs USD

#### One-Time

| Item                    | Expenditure   |
| ----------------------- | ------------- |
| Logo by Metafizzy       | 800           |

#### Periodic

| Item                    | Expenditure   |
| ----------------------- | ------------- |
| Color Name API Server   | 264.60/year   |
| color.pizza domain name | 36.16/year    |
| Cloudflare PRO Plan     | 240/year      |

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

## Disclaimer 👮🏾‍

In an effort to create a more inclusive and respectful environment, we strive to
remove all offensive and racist names, as well as protected brand names,
from our list. While we do our best to screen out such names, some may still
slip through. If you come across any such names, please
[let us know](https://github.com/meodai/color-names/issues/new?title=Bad%20color%20name)
so that we can remove them promptly.

## Latest Color Names 🔖

![New colors](changes.svg "New colors")

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

<!-- 3r party libraries & tools -->

[ClosestVector]: https://github.com/meodai/ClosestVector
[nearest-color]: https://github.com/dtao/nearest-color

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
[colorkit.co]: https://colorkit.co/
[Myriam Aerne]: https://fynoeggeli.ch/
[nachtfunke]: https://helloyes.dev
[amin]: http://www.slashui.com
[Colorful Dots]: https://colorfuldots.com/
[color.museum]: https://www.color.museum/
[krissymashinsky.com]: https://www.krissymashinsky.com/

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
