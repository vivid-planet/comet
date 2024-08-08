---
"@comet/cms-admin": minor
---

Rework `EditImageDialog`

Changes

-   Increase image size
-   Add hover effects for focal points
-   Add "Open in DAM" button

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
