---
"@comet/admin-theme": major
---

Rework colors

- Rename `bluePalette` to `primaryPalette`
- Rename `neutrals` to `greyPalette`
- Remove `greenPalette`
- Remove `secondary` from `paletteOptions`
- Change colors in all palettes
- Change `text` colors 
- Add `highlight` colors `purple`, `green`, `orange`, `yellow` and `red` to palette

Hint: To use the `highlight` colors without getting a type error, you must adjust the `tsconfig.json` in your project:

```diff
{
    // ...
    "compilerOptions": {
        // ...
+       "types": ["@comet/admin-theme"]
    },
    // ...
}
```
