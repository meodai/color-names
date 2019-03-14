# __17621__ color-names

<img align="right" height="222" width="222" src="https://meodai.github.io/color-names/logo/cockatoo-fill.svg">

[![GitHub release](https://img.shields.io/github/release/meodai/color-names.svg)](https://github.com/meodai/color-names/)
[![npm version](https://img.shields.io/npm/v/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![npm](https://img.shields.io/npm/dt/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![Travis](https://img.shields.io/travis/meodai/color-names.svg)](https://travis-ci.org/meodai/color-names)
[![color count](https://img.shields.io/badge/17621-colors-orange.svg)](https://github.com/meodai/color-names/blob/master/src/colornames.csv)
[![Buy Me a Coffee at ko-fi.com](https://img.shields.io/badge/-Buy%20us%20a%20Coffee-orange.svg?colorB=593C1F&colorA=4e798d&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAVUlEQVR4AWNQtnJTQcZ%2Blb2fsWF0dQzYNRHWzIBdE2EDGGCaSNYI47x69fY%2FMRimnmiNyGqwavyflo6MaawRTTP1%2FIiM4dFBQBPl8UggyRHWSHYiBwCwA90T1NTlAQAAAABJRU5ErkJggg%3D%3D%0D%0A&logoWidth=14)](https://ko-fi.com/A530429S)

A handpicked list of __17621__ unique color names from [various sources](#sources-) and thousands of user submissions. [Try it yourself](http://codepen.io/meodai/full/mEvZRx/) or read [the full list](https://codepen.io/meodai/full/VMpNdQ/).

> The names of color function like a thread attached to a frightfully slender needle, capable of stitching together our most delicate emotions and memories. When the needle hits the target, we feel either pleasure or empathy. **Kenya Hara – White**

## About 📋
The aim of this project is to create as large a list of color names as possible. We've merged various [lists](#sources-), modified the names when there were duplicates with different hex values, and shifted the colors a bit when there were identical colors with different names.

### Submit a color [via form 🌈](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform) / or [twitter 🐦](https://codepen.io/meodai/full/ZXQzLb/)
Make sure to read the [naming rules](CONTRIBUTING.md) before you contribute!

### color count: __17621__ 🎉
(~__0.11%__ of all RGB Colors)

### [Color distribution](https://codepen.io/meodai/full/zdgXJj/) 🛰
![3d representation of color distribution in RGB Space (Preview image of link above)](https://raw.githubusercontent.com/meodai/color-names/gh-pages/color-dist.png)
When coming up with new color names, it is vital to know what spots in a certain color-space are crowded and where there is still room for new colors. For example: Our API returns the closest `RGB` color to a given `HEX` value. To avoid too many colors snapping to the same name, we aim to distribute the colors evenly in the color space: [Visualization](https://codepen.io/meodai/full/zdgXJj/)

PS: You can choose between different color spaces on the bottom right.

## Usage 📖
### Installation Node.js 📦
```shell
npm install color-name-list --save
```
or `yarn add color-name-list`

### CDN 🌍 [JSON](https://unpkg.com/color-name-list/dist/colornames.json) / [CSV](https://unpkg.com/color-name-list/dist/colornames.csv) / [YML](https://unpkg.com/color-name-list/dist/colornames.yaml) / [JS](https://unpkg.com/color-name-list/dist/colornames.umd.js) / [XML](https://unpkg.com/color-name-list/dist/colornames.xml) / [HTML](https://unpkg.com/color-name-list/dist/colornames.html) / [SCSS](https://unpkg.com/color-name-list/dist/colornames.scss)

### API 🃏
```url
https://api.color.pizza/v1/{{hexvalue without the #}},{{more comma separated values}}
```
#### Single Color
`curl` [https://api.color.pizza/v1/212121](https://api.color.pizza/v1/212121)

```javascript
{
  "colors": [{
    "name": "Lead",
    "hex": "#212121",
    "rgb": {"r": 33, "g": 33, "b": 33},
    "distance": 0, // its an exact match
    "luminance": 22.062320231562225,
    "requestedHex": "#212121",
  }]
}
```
#### Multiple Colors
`curl` [https://api.color.pizza/v1/212121,060606,ff0012,550055,123456](https://api.color.pizza/v1/212121,060606,ff0012,550055,123456)

#### All Named Colors
`curl` [https://api.color.pizza/v1/](https://api.color.pizza/v1/)

In this case colors is not an `object` but an `array` of `objects` sorted by color-name

#### Unique Color-Names
by adding `?noduplicates=true` every returned name will be unique. The closest color, that was not returned previously will be returned:
`curl` [https://api.color.pizza/v1/212121,212121?noduplicates=true](https://api.color.pizza/v1/212121,212121?noduplicates=true) 

```javascript
{
  "colors": [{ 
    "name": "Lead",
    "hex": "#212121",
    "rgb": { "r": 33, "g": 33, "b": 33 },
    "luminance": 22.062320231562225 
  },{ 
    "name": 'Abaddon Black',
    "hex": '#231f20',
    "rgb": { "r": 35, "g": 31, "b": 32 },
    "luminance": 21.30621829419759 
  }]
}
```

### Usage JS ⌨
#### Exact Color
```javascript
import namedColors from 'color-name-list';

let someColor = namedColors.find(color => color.hex === '#ffffff');
console.log(someColor.name); // => white

let someNamedColor = namedColors.find(color => color.name === 'Eigengrau')
console.log(someColor.hex); // => #16161d
```

#### Closest Named Color
Since there are 16777216 possible RGB colors, you might use a library such as [nearest-color](https://github.com/dtao/nearest-color) to help you find the the closest named color.
Since there are 16777216 possible RGB colors, you might use a library such as [ClosestVector](https://github.com/meodai/ClosestVector) to help you find the the closest named color.

```js
import nearestColor from 'nearest-color';
import namedColors from 'color-name-list';

// nearestColor need objects {name => hex} as input
const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});

const nearest = nearestColor.from(colors);

// get closest named color
nearest('#f1c1d1'); // => Fairy Tale
```

Alternative package: [ktree](https://github.com/caub/ktree)

**Note**: If you are looking for something visually more accurate, you could: use [DeltaE](https://github.com/zschuessler/DeltaE), or use the above snippet, combined with a transform from rgb to [ciecam02](https://github.com/baskerville/ciecam02) scaled to 0-255.

### Building 🔨
```shell
npm install && npm run build
```

See [package.json](package.json#L6) for more.

## Sources 🗒
### Sources: Names 📇
- Thousands of user submissions [Twitter](https://codepen.io/meodai/full/ZXQzLb/)/[Google Docs](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)/[Github](#contributors-)
- [Wikipedia list of named colors](https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F) (2018-02-23)
- [CSS/HTML color names](https://developer.mozilla.org/en/docs/Web/CSS/color_value)
- [ntc.js](http://chir.ag/projects/ntc/)
- [xkcd color survey list](https://blog.xkcd.com/2010/05/03/color-survey-results/)
- [htmlcsscolor.com](http://www.htmlcsscolor.com/color-names-rgb-values/A)
- [OSX Crayons](http://www.randomactsofsentience.com/2013/06/os-x-crayon-color-hex-table.html)
- [Crayola crayon](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors)
- [Thailand weekday colors](https://en.wikipedia.org/wiki/Colors_of_the_day_in_Thailand)
- [Chinese heavenly creatures colors](https://en.wikipedia.org/wiki/Color_in_Chinese_culture)
- [Military Paint](http://paintref.com/cgi-bin/colorcodedisplay.cgi?manuf=Military)
- [Olympian god colors](http://www.hellenicgods.org/colors-associated-with-the-olympian-gods)
- Model Color Paints: [Vallejo](http://www.danbecker.info/minis/miniother/PaintCharts/VallejoModelColor.html)
- [Fictional Colors](https://en.wikipedia.org/wiki/List_of_fictional_colors#Identified_fictional_colors) (2018-05-09)
- Non English Transliterations: [Japanese](https://en.wikipedia.org/wiki/Traditional_colors_of_Japan), [Mandarin](http://www.fluentu.com/blog/chinese/2016/07/25/chinese-colors/), [Hindi](https://en.wikibooks.org/wiki/Hindi/Colors), [Persian](https://en.wikibooks.org/wiki/Persian/Phrasebook/Colors), [Russian](//github.com/AleksejDix)
- Multiple paint, print, nail polish, model paint color lists

### Sources: Color 🎨
- [12-Bit & 8-Bit color palettes](https://en.wikipedia.org/wiki/List_of_color_palettes)
- [Pico-8 color palette](https://www.lexaloffle.com/bbs/?tid=2101)
- [Some Android Arts palettes](http://androidarts.com/palette/)

## Contributors 🦑
- [meodai](//github.com/meodai) Initiator, Maintainer, Name Creator & Tooling
- [Verena](//github.com/yxklyx/) Hundreds of names!!
- [Syl](https://twitter.com/Gypsy_Syl) Name creator
- [Stephanie Stutz](https://www.behance.net/stephaniestutzart) Name creator
- [Simbiasamba](https://www.instagram.com/simbisamba/) Name creator
- [Jason Wilson](//github.com/SgiobairOg) Manual Merging of some lists
- [Inês João](https://www.inesjoao.me/) Mostly Portuguese names
- [Nirazul](//github.com/Nirazul) Name Creator & Tooling
- [Nick Niles](http://nickniles.com/) Name Creator
- [Qwhex](https://github.com/qwhex) Name Creator
- [Ichatdelune](https://www.reddit.com/user/Ichatdelune) Name Creator
- [Metafizzy](https://metafizzy.co/) Logo Sponsor 💖

## Disclaimer 👮🏾‍
In the process we try to remove all names that are offensive or racist, as well as protected brand names.
As some of the color names come from other lists, some bad ones might slip in. [Please report them](https://github.com/meodai/color-names/issues/new?title=Bad%20color%20name), they will be removed as quickly as possible.
