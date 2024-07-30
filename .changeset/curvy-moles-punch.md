---
"@comet/admin-theme": major
---

Rework `typographyOptions`

-   Replace `typographyOptions` with `createTypographyOptions()` to enable using the theme's breakpoints for media queries
-   Add new default styles for variants `subtitle1`, `subtitle2`, `caption` and `overline`
-   Remove custom `fontWeights`
-   Switch the font from `Roboto` to `Roboto Flex`

The font switch requires you to make the following two changes in your admin application:

**Note: The `@comet/upgrade` script handles these changes automatically.**

```diff
// package.json
- "@fontsource/roboto": "^4.5.5",
+ "@fontsource-variable/roboto-flex": "^5.0.0",
```

```diff
// App.tsx
- import "@fontsource/roboto/100.css";
- import "@fontsource/roboto/300.css";
- import "@fontsource/roboto/400.css";
- import "@fontsource/roboto/500.css";
+ import "@fontsource-variable/roboto-flex/full.css";
```
