---
"@comet/cms-admin": minor
---

Redesign `EditImageDialog` to increase Imagesize, Hover Effects for Focalpoints and Open in DAM Button

Note: To display the Button `DependenciesConfig` needs to be configured for `DamFile`:

```diff
// App.tsx

<DependenciesConfigProvider
    entityDependencyMap={{
+       DamFile: createDamFileDependency(),
        // ...
    }}
>
```
