# JavaScript / TypeScript Usage

This guide shows how to use the color list from JavaScript and
TypeScript projects. It covers ESM and CommonJS usage and finding the
closest named color.

## Install

```sh
npm install color-name-list
```

## Data Shape

```ts
type ColorName = { name: string; hex: string };
```

## ESM (Node/Browser Bundlers)

```js
import { colornames } from 'color-name-list';

const white = colornames.find((c) => c.hex === '#ffffff');
console.log(white.name); // => white

const eigengrau = colornames.find((c) => c.name === 'Eigengrau');
console.log(eigengrau?.hex); // => #16161d
```

## CommonJS (require)

```js
// When required, the package returns the array of color objects directly
const colornames = require('color-name-list');

const white = colornames.find((c) => c.hex === '#ffffff');
console.log(white.name); // => white
```

## Find the Closest Named Color

With 16,777,216 possible RGB colors, you may want to use a helper like
`nearest-color` or `ClosestVector`.

```js
import nearestColor from 'nearest-color';
import { colornames } from 'color-name-list';

// nearestColor expects an object { name => hex }
const colors = colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
const nearest = nearestColor.from(colors);

// Get closest named color
nearest('#f1c1d1'); // => Fairy Tale
```

Note: For better visual accuracy, consider DeltaE or using CIECAM02
instead of raw RGB distance:

- [DeltaE](https://github.com/zschuessler/DeltaE)
- [CIECAM02](https://github.com/baskerville/ciecam02)

## Subsets and Performance Tips

- Best-of subset (smaller list):
  - ESM: `import { colornames as bestof } from 'color-name-list/bestof'`
  - UMD: `https://unpkg.com/color-name-list/dist/colornames.bestof.umd.js`
- Short subset (< 13 characters, best-of filtered): `dist/colornames.short.*`
- For browsers, prefer the public API for payload-sensitive scenarios:
  [Color Name API](https://github.com/meodai/color-name-api)

## CDN (Reproducible)

- Latest: `https://unpkg.com/color-name-list/dist/colornames.min.json`
- Pinned: `https://unpkg.com/color-name-list@<version>/dist/colornames.min.json`

## Types

The package ships ESM. For TypeScript projects, you can declare the data
shape as shown above or infer it directly from usage.
