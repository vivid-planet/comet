---
"@comet/cms-admin": major
"@comet/cms-api": major
---

Add scoping to the DAM

The DAM scoping can be enabled optionally. You can still use the DAM without scoping.

To enable DAM scoping, you must

In the API:

-   Create a DAM folder entity using `createFolderEntity({ Scope: DamScope });`
-   Create a DAM file entity using `createFileEntity({ Scope: DamScope, Folder: DamFolder });`
-   Pass the `Scope` DTO and the `File` and `Folder` entities when intializing the `DamModule`

In the Admin:

-   Set `scopeParts` in the `DamConfigProvider` (e.g. `<DamConfigProvider value={{ scopeParts: ["domain"] }}>`)
-   Render the content scope indicator in the `DamPage`
    ```tsx
    <DamPage renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />} />
    ```

You can access the current DAM scope in the Admin using the `useDamScope()` hook.

See Demo for an example on how to enable DAM scoping.
