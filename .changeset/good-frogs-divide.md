---
"@comet/mail-react": minor
---

Make this package ESM and add peer dependencies to `react` and `@faire/mjml-react`

Previously, this package was published as a CommonJS package and had no peer dependencies.
Now, it is published as an ESM package and has peer dependencies to `react@18` and `@faire/mjml-react@3`.

Though this is theoretically a breaking change, we are bumping only the minor version, as this package is completely new and has no known users yet.
