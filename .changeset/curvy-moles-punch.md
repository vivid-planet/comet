---
"@comet/admin-theme": major
---

Rework `typographyOptions`

- Replace `typographyOptions` with `createTypographyOptions()` to enable using the theme's breakpoints for media queries
- Add new default styles for variants `subtitle1`, `subtitle2`, `caption` and `overline`
- Change naming of `fontWeights` according to [common weight name mapping](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping)