# C# Usage

C# support is provided by
[vycdev/ColorNamesSharp](https://github.com/vycdev/ColorNamesSharp).
The library is available as a
[NuGet package](https://www.nuget.org/packages/ColorNamesSharp).

## Creating the instance

```csharp
ColorNames colorNames = new ColorNamesBuilder()
  .Add("Best Blue", "#3299fe") // Add your own custom colors
  .LoadDefault() // Load the default color list
  .AddFromCsv("path/to/your/colorlist.csv") // Add a custom color list from a csv file
  .Build(); // Get a new ColorNames instance that includes all the colors you've added
```

## Getting a fitting color name

```csharp
NamedColor customNamedColor = new("Custom Named Color", 50, 153, 254);

// You can directly get the name of the color as a string
string colorNameFromHex = colorNames.FindClosestColorName("#facfea"); // Classic Rose
string colorNameFromRgb = colorNames.FindClosestColorName(224, 224, 255); // Stoic White
string colorNameFromNamedColor = colorNames.FindClosestColorName(customNamedColor); // Best Blue

// Or similarly you can get the NamedColor object
NamedColor namedColorFromHex = colorNames.FindClosestColorName("#facfea"); // Classic Rose
NamedColor namedColorFromRgb = colorNames.FindClosestColorName(224, 224, 255); // Stoic White
NamedColor namedColorFromNamedColor = colorNames.FindClosestColorName(customNamedColor); // Best Blue

// Or a random color
NamedColor randomColor = colorNames.GetRandomNamedColor();
```

See the upstream project for more details and updates:
[vycdev/ColorNamesSharp](https://github.com/vycdev/ColorNamesSharp)
