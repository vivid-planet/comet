---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Support the import of files from external DAMs

To connect an external DAM, implement a component with the necessary logic (asset picker, upload functionality, ...). Pass this component to the `DamPage` via the `additionalToolbarItems` prop.

```tsx
<DamPage
    // ...
    additionalToolbarItems={<ImportFromExternalDam />}
/>
```

You can find an [example](demo/admin/src/dam/ImportFromUnsplash.tsx) in the demo project.

