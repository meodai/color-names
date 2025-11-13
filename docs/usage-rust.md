# Rust Usage

Rust support is provided by
[philocalyst/color-names](https://github.com/philocalyst/color-names).
Add it with:

```sh
cargo add colorsnamed
```

## Choosing colors

```rust
use colorsnamed;

let black = colorsnamed::Basic::Black;
let teal = colorsnamed::Basic::Teal;
let another = colorsnamed::Xkcd::Tea;
```

## Getting colors

```rust
use colorsnamed;

// Get the relevant hex code
let red = colorsnamed::Basic::Red;
let hex = red.hex();

// Figure out if there is a matching color for a hex code!
let ex: colorsnamed::Basic = hex.try_into().unwrap();
```

## Converting colors

```rust
use colorsnamed;
use colors;
use rgb::Rgb;

// Convert to the representation of your colorspace of choice.
let correct_color = red.color::<colors::Srgb>();

let red = colorsnamed::Basic::Red;

// Get the RGB representation
let rgb: Rgb = red.rgb();
```

See the upstream project for more details and updates:
[philocalyst/color-names](https://github.com/philocalyst/color-names)
