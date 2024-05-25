---
"@comet/cms-admin": minor
"@comet/cms-api": minor
---

Add `overrideAcceptedMimetypes` configuration to DAM

If set, only the mimetypes specified in `overrideAcceptedMimetypes` will be accepted.

You must configure `overrideAcceptedMimetypes` in the API and the admin interface:

API:

```diff
// app.module.ts

DamModule.register({
    damConfig: {
        // ...
+       overrideAcceptedMimetypes: ["image/png"],
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
+       overrideAcceptedMimetypes: ["image/png"],
    }}
>
```
