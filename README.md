# color-names 🎨
A semi manual merge of different color name lists. [Try it yourself](http://codepen.io/meodai/full/mEvZRx/) or see [the full list](https://docs.google.com/spreadsheets/d/14ny2oB7g5Tof9TmKiaaDFv25XSCRt-LlBRJhIDz_3Mo/pubhtml?gid=40578722).

## Process
My goal is to create a as big as possible color name list. I merged different lists, modified the names when they where the same but had different hex values, and I shifted the colors a bit when the same color had different names.

## [Submit a name](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform)

## Sources
- [Wikipedia list of named colors](https://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F)
- [CSS/HTML Color Names](https://developer.mozilla.org/en/docs/Web/CSS/color_value)
- [ntc.js](http://chir.ag/projects/ntc/)
- [pantone from color namer](https://github.com/zeke/color-namer/blob/master/lib/colors/pantone.js)
- [htmlcsscolor.com](http://www.htmlcsscolor.com/color-names-rgb-values/A)
- [OSX Crayons](http://www.randomactsofsentience.com/2013/06/os-x-crayon-color-hex-table.html)
- [Crayola Crayon names](https://en.wikipedia.org/wiki/Crayola)
- [User submited color names](https://docs.google.com/forms/d/e/1FAIpQLSfbS5D6owA4dQupJJ-6qhRzuxkjX9r2AliPMg-VR2V3NpGkQg/viewform).

### Installation JS

#### yarn
```
yarn add color-name-list
```

#### NPM
```
npm install color-name-list --save
```


### Usage JS:
```javascript
import namedColors from 'color-name-list';

let someColor = namedColors.find(color => c.hex === '#ffffff')
console.log(someColor.name) // => white

```

### Create a new build
```
npm install && npm run build
```
