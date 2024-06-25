---
"@comet/cms-admin": minor
---

Add a menu item to `PixelImageBlock`, `SvgImageBlock` and `DamVideoBlock` that opens the chosen file in the DAM

Note: This feature only works if the `DependenciesConfig` is configured for `DamFile`:

```diff
// App.tsx

<DependenciesConfigProvider
    entityDependencyMap={{
+       DamFile: createDamFileDependency(),
        // ...
    }}
>
```
