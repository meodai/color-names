# __10500__ color-names 🎨
[![GitHub release](https://img.shields.io/github/release/meodai/color-names.svg)](https://github.com/meodai/color-names/)
[![npm version](https://img.shields.io/npm/v/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![npm](https://img.shields.io/npm/dt/color-name-list.svg)](https://www.npmjs.com/package/color-name-list)
[![Travis](https://img.shields.io/travis/meodai/color-names.svg)](https://travis-ci.org/meodai/color-names)
[![license](https://img.shields.io/npm/l/color-name-list.svg?colorB=ff77b4)](https://github.com/meodai/color-names/blob/master/LICENSE)
[![color count](https://img.shields.io/badge/__10500__-colors-orange.svg)](https://github.com/meodai/color-names/blob/master/src/colornames.csv)

Ein handverlesene Liste von __10500__ eindeutiger Farbname von verschiedene Quellen und tausende von Einreichungen. [Versuch es selber](http://codepen.io/meodai/full/mEvZRx/) or read [the full list](https://docs.google.com/spreadsheets/d/14ny2oB7g5Tof9TmKiaaDFv25XSCRt-LlBRJhIDz_3Mo/pubhtml?gid=40578722)

> Die Namen der Farbe funktionieren wie ein Faden an einer schrecklich schlanken Nadel befestigt, fähig unsere empfindlichsten Gefühle und Erinnerungen zusammenzutragen. Wann die Nadel auf das Ziel trifft, fühlen wir uns Lust oder Empathie. **Kenya Hara – White**

## Über 📋

Ziel dieses Projektes ist es, eine möglichst große Liste von Farbnamen zu erstellen. Wir haben verschiedene [Liste](#sources-) fusioniert, die Namen geändert, wenn es Duplikate mit verschiedenen HEX-Werten gab, und verschob die Farben ein bißchen wann es gibt identische farben mit andere namen.

## [Einen Namen einreichen 🌈](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)

### Farbzähler: __10500__ 🎉

## Quellen 🗒

- [Benutzereinreichungen](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform).
- [Wikipedia Liste der benannte Farben](https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F)
- [CSS/HTML Farbnamen](https://developer.mozilla.org/en/docs/Web/CSS/color_value)
- [ntc.js](http://chir.ag/projects/ntc/)
- [pantone](https://github.com/Margaret2/pantone-colors)
- [htmlcsscolor.com](http://www.htmlcsscolor.com/color-names-rgb-values/A)
- [OSX Crayons](http://www.randomactsofsentience.com/2013/06/os-x-crayon-color-hex-table.html)
- [Crayola Crayon names](https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors)
- [Thailand Weekday Colors](https://en.wikipedia.org/wiki/Colors_of_the_day_in_Thailand)
- [Chinese Heavenly Creatures Colors](https://en.wikipedia.org/wiki/Color_in_Chinese_culture)
- Mehrfachfarben-Markenfarblisten

### Installation JS 📦

```
npm install color-name-list --save
```
oder
```
yarn add color-name-list
```


### Experimentelle API 🃏

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

### Verwendung JS ⌨

```javascript
import namedColors from 'color-name-list';

let someColor = namedColors.find(color => color.hex === '#ffffff')
console.log(someColor.name) // => white

```

### Einen nuen Build erstellen 🔨

```
npm install && npm run build
```

# Mitweirkende 🦑

- [yxklyx](https://github.com/yxklyx/) Hunderte von Namen!!
- [Syl](https://twitter.com/Gypsy_Syl)
- [Stephanie Stutz](https://www.behance.net/stephaniestutzart)

#### Haftungsausschluss ⚠️

Dabei versuchen wir alle Namen zu entfernen, die beleidigend oder rassistisch sind. Da einige der Farbnamen aus anderen Listen kommen, könnte es passieren, dass irgendwelche schlechten Eins rutschen. [Bitte melden Sie sie bitte](https://github.com/meodai/color-names/issues), sie werden so schnell wie möglich entfernt. 