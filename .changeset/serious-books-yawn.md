---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `overrideAcceptedMimeTypes` configuration to DAM

If set, only the mimetypes specified in `overrideAcceptedMimeTypes` will be accepted.

You must configure `overrideAcceptedMimeTypes` in the API and the admin interface:

API:

```diff
// app.module.ts

DamModule.register({
    damConfig: {
        // ...
+       overrideAcceptedMimeTypes: ["image/png"],
        // ...
    },
    // ...
}),
```

Admin:

```diff
// App.tsx

<DamConfigProvider
    value={{
        // ...
+       overrideAcceptedMimeTypes: ["image/png"],
    }}
>
```
