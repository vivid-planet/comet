---
"@comet/cms-api": major
---

Replace `additionalMimeTypes` and `overrideAcceptedMimeTypes` in `DamModule#damConfig` with `acceptedMimeTypes`

You can now add mime types like this:

```ts
DamModule.register({
    damConfig: {
        acceptedMimeTypes: [...damDefaultAcceptedMimetypes, "something-else"],
    },
});
```

And remove them like this:

```ts
DamModule.register({
    damConfig: {
        acceptedMimeTypes: damDefaultAcceptedMimetypes.filter((mimeType) => mimeType !== "application/zip"),
    },
});
```

Don't forget to also remove/add the mime types in the admin's `DamConfigProvider`
