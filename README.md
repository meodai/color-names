# __14874__ color-names 🎨

[![GitHub release](https://img.shields.io/github/release/meodai/color-names.svg)](https://github.com/meodai/color-names/)
[![npm version](https://img.shields.io/npm/v/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![npm](https://img.shields.io/npm/dt/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![Travis](https://img.shields.io/travis/meodai/color-names.svg)](https://travis-ci.org/meodai/color-names)
[![license](https://img.shields.io/npm/l/color-name-list.svg?colorB=ff77b4)](https://github.com/meodai/color-names/blob/master/LICENSE)
[![color count](https://img.shields.io/badge/__14874__-colors-orange.svg)](https://github.com/meodai/color-names/blob/master/src/colornames.csv)

A handpicked list of __14874__ unique color names from various sources and thousands of user submissions. [Try it yourself](http://codepen.io/meodai/full/mEvZRx/) or read [the full list](https://docs.google.com/spreadsheets/d/14ny2oB7g5Tof9TmKiaaDFv25XSCRt-LlBRJhIDz_3Mo/pubhtml?gid=40578722).

> The names of color function like a thread attached to a frightfully slender needle, capable of stitching together our most delicate emotions and memories. When the needle hits the target, we feel either pleasure or emathy. **Kenya Hara – White**


## About 📋

The aim of this project is to create as large a list as possible of color names. We've merged various [lists](#sources-), modified the names when there were duplicates with different hex values, and shifted the colors a bit when there were identical colors with different names.

## [Submit a name 🌈](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)


### color count: __14874__ 🎉

## Color distribution 🛰 [RGB](https://codepen.io/meodai/full/zdgXJj/)

When coming up with new color names, it is vital to know what spots in a certain color-space are crowded and where there is still room for new colors.
Our API for example returns the closest RGB color to a given hex value. To avoid that to many colors snap to the same name we aim to distribute the colors
evenly in the color space: [RGB Visualization](https://codepen.io/meodai/full/zdgXJj/)


## Sources 🗒

- [User submissions](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform).
- [Wikipedia list of named colors](https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F)
- [CSS/HTML Color Names](https://developer.mozilla.org/en/docs/Web/CSS/color_value)
- [ntc.js](http://chir.ag/projects/ntc/)
- [pantone](https://github.com/Margaret2/pantone-colors)
- [htmlcsscolor.com](http://www.htmlcsscolor.com/color-names-rgb-values/A)
- [OSX Crayons](http://www.randomactsofsentience.com/2013/06/os-x-crayon-color-hex-table.html)
- [Crayola Crayon names](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors)
- [Thailand Weekday Colors](https://en.wikipedia.org/wiki/Colors_of_the_day_in_Thailand)
- [Chinese Heavenly Creatures Colors](https://en.wikipedia.org/wiki/Color_in_Chinese_culture)
- [Traditional Colors of Japan](https://en.wikipedia.org/wiki/Traditional_colors_of_Japan)
- Multiple Paint Brand color lists


### Installation JS 📦

```
npm install color-name-list --save
```
or
```
yarn add color-name-list
```

### CDN 🌍: [JSON](https://unpkg.com/color-name-list/dist/colornames.json), [CSV](https://unpkg.com/color-name-list/dist/colornames.csv), [YML](https://unpkg.com/color-name-list/dist/colornames.yaml)


### Experimental API 🃏

```
https://color-names.herokuapp.com/v1/{{hexvalue without the #}}
```

ex: `curl `[https://color-names.herokuapp.com/v1/060606](https://color-names.herokuapp.com/v1/060606)

```
{
  "query":"060606",
  "name":"Black Metal",
  "hex":"#060606",
  "rgb":{"r":6,"g":6,"b":6},
  "isExact":true
}
```


### Usage JS ⌨

```javascript
import namedColors from 'color-name-list';

let someColor = namedColors.find(color => color.hex === '#ffffff')
console.log(someColor.name) // => white

```


### Create a new build 🔨

```
npm install && npm run build
```


# Contributors 🦑

- [yxklyx](https://github.com/yxklyx/) hundreds of names!!
- [Syl](https://twitter.com/Gypsy_Syl)
- [Stephanie Stutz](https://www.behance.net/stephaniestutzart)
- [Simbiasamba](https://www.instagram.com/simbisamba/)

#### Disclaimer ⚠️

In the process we try to remove all names that are offensive or racist, as well as protect brandnames.
As some of the color names come from other lists, it might happen that some bad ones slip in. [Please report them](https://github.com/meodai/color-names/issues), they will be removed as quickly as possible.

[![Buy Me a Coffee at ko-fi.com](https://img.shields.io/badge/-Buy%20me%20a%20Coffee-orange.svg?colorB=593C1F&colorA=4e798d&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAVUlEQVR4AWNQtnJTQcZ%2Blb2fsWF0dQzYNRHWzIBdE2EDGGCaSNYI47x69fY%2FMRimnmiNyGqwavyflo6MaawRTTP1%2FIiM4dFBQBPl8UggyRHWSHYiBwCwA90T1NTlAQAAAABJRU5ErkJggg%3D%3D%0D%0A&logoWidth=14)](https://ko-fi.com/A530429S)
