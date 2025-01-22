---
"@comet/cms-admin": patch
"@comet/cms-api": patch
---

Improve SVG validation

Following tags are banned in SVGs:

-   script
-   \[new\] foreignObject
-   \[new\] use
-   \[new\] image
-   \[new\] animate
-   \[new\] animateMotion
-   \[new\] animateTransform
-   \[new\] set

Following attributes are banned:

-   Event handlers (`onload`, `onclick`, ...)
-   \[new\] `href` and `xlink:href` (if the value starts with `http://`, `https://` or `javascript:`)
