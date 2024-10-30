---
"@comet/cms-site": minor
---

PixelImageBlock: Allow different aspect ratio formats

The `aspectRatio` prop now supports values in the following formats:

-   x as separator: `aspectRatio="3x1"`
-   : as separator: `aspectRatio="16:9"`
-   / as separator: `aspectRatio="4/3"`
-   Numbers: `aspectRatio={1.5}`
-   Strings: `aspectRatio="3"`
