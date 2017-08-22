# __10469__ color-names 🎨
[![GitHub release](https://img.shields.io/github/release/meodai/color-names.svg)](https://github.com/meodai/color-names/)
[![npm version](https://img.shields.io/npm/v/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![npm](https://img.shields.io/npm/dt/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![Travis](https://img.shields.io/travis/meodai/color-names.svg)](https://travis-ci.org/meodai/color-names)

A handpicked list of __10469__ unique color names from various sources and thousands of user submissions. [Try it yourself](http://codepen.io/meodai/full/mEvZRx/) or read [the full list](https://docs.google.com/spreadsheets/d/14ny2oB7g5Tof9TmKiaaDFv25XSCRt-LlBRJhIDz_3Mo/pubhtml?gid=40578722).

> The names of color function like a thread attached to a frightfully slender needle, capable of stitching together our most delicate emotions and memories. When the needle hits the target, we feel either pleasure or emathy. **Kenya Hara – White**

## Process 📋
My goal is to create a as big as possible color name list. I merged different [lists](#sources-), modified the names when they where the same but had different hex values, and I shifted the colors a bit when the same color had different names but the same value.

## [Submit a name 🌈](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)

## Sources 🗒

- [User submissions](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform).
- [Wikipedia list of named colors](https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F)
- [CSS/HTML Color Names](https://developer.mozilla.org/en/docs/Web/CSS/color_value)
- [ntc.js](http://chir.ag/projects/ntc/)
- [pantone](https://github.com/Margaret2/pantone-colors)
- [htmlcsscolor.com](http://www.htmlcsscolor.com/color-names-rgb-values/A)
- [OSX Crayons](http://www.randomactsofsentience.com/2013/06/os-x-crayon-color-hex-table.html)
- [Crayola Crayon names](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors)
- Different Paint Brand color lists

### Installation JS 📦

```
npm install color-name-list --save
```
or
```
yarn add color-name-list
```

### color count: __10469__

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

# Contributors
- [yxklyx](https://github.com/yxklyx/) hunders of names!!
- [Syl](https://twitter.com/Gypsy_Syl)
