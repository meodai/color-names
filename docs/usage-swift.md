# Swift Usage

Swift support is provided by
[yonilevy/swift-color-names](https://github.com/yonilevy/swift-color-names).
It bundles this dataset and adds closest-named-color search in the perceptual
[OKLab](https://bottosson.github.io/posts/oklab/) space.

## Installation

Add the package with Swift Package Manager:

```swift
.package(url: "https://github.com/yonilevy/swift-color-names.git", from: "1.0.0")
```

```swift
.target(name: "MyApp", dependencies: [
  .product(name: "ColorNames", package: "swift-color-names"),
])
```

## Creating the instance

Pick which slice of the dataset to load — `.full`, `.bestOf`, or `.short`
(the `.bestOf` names limited to 12 characters or fewer):

```swift
import ColorNames

let colorNames = ColorNames(.short)
```

## Getting a fitting color name

```swift
// Closest name to an sRGB value…
let fromRgb = colorNames.find(rgb: RGB(red255: 224, green255: 224, blue255: 255))
fromRgb?.name  // "Velvet Scarf"

// …or straight from a hex string:
let fromHex = colorNames.find(hex: "#facfea")
fromHex?.name  // "Puff of Pink"

// The result carries name, sRGB, precomputed OKLab, and hex — note the hex is
// the matched color's, not your input:
fromHex?.hex   // "#FFCBEE"

// Exact lookups (no distance search):
colorNames.color(named: "Red")?.hex    // "#FF0000"
colorNames.color(hex: "#000000")?.name  // "Black"
```

Search runs by brute force over the chosen list in OKLab space, so numeric
closeness matches perceived closeness. `find(…)` returns `nil` only when the
database is empty (or the hex string is invalid).

See the upstream project for more details and updates:
[yonilevy/swift-color-names](https://github.com/yonilevy/swift-color-names)
