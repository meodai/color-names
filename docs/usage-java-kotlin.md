# Java / Kotlin Usage

Java/Kotlin support is provided by
[UwUAroze/Color-Names](https://github.com/UwUAroze/Color-Names).

## Gradle (Kotlin DSL)

```kts
repositories {
  maven("https://jitpack.io")
}

dependencies {
  implementation("me.aroze:color-names:1.0.4")
}
```

## Maven

```xml
<repository>
  <id>jitpack.io</id>
  <url>https://jitpack.io</url>
</repository>

<dependency>
  <groupId>me.aroze</groupId>
  <artifactId>color-names</artifactId>
  <version>1.0.4</version>
</dependency>
```

## Closest Named Color (Java)

```java
public ColorNames colorNames = new ColorNameBuilder()
  .loadDefaults()
  .build();

String fromHex = colorNames.getName("#facfea"); // "Classic Rose"
String fromRGB = colorNames.getName(224, 224, 255); // "Stoic White"
String fromColor = colorNames.getName(new Color(255, 219, 240)); // "Silky Pink"
```

## Closest Named Color (Kotlin)

```kt
val colorNames = ColorNameBuilder()
  .loadDefaults()
  .build()

val fromHex = colorNames.getName("#facfea") // "Classic Rose"
val fromRGB = colorNames.getName(224, 224, 255) // "Stoic White"
val fromColor = colorNames.getName(Color(255, 219, 240)) // "Silky Pink"
```

See the upstream project for more details and updates:
[UwUAroze/Color-Names](https://github.com/UwUAroze/Color-Names)
