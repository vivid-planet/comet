---
"@comet/cms-api": patch
---

Load `jsdom` lazily for SVG validation

`jsdom` (~90 MB resident) was imported and instantiated at module load time, so importing anything from `@comet/cms-api` pulled it into memory even when no SVG was ever validated. It's now loaded on the first SVG validation instead, reducing the package's base memory footprint.
