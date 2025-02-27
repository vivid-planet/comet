---
"@comet/cms-api": patch
---

Allow `use` tag in SVG again

`use` can be used to define paths once in a SVG and then integrating them multiple times via anchor links: `<use xlink:href="#path-id" />`. This should not be prohibited.

It's still not possible to use `use` to reference external files, since we still prohibit `href` and `xlink:href` attributes starting with `http://`, `https://` and `javascript:`.
