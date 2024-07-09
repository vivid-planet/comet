---
"@comet/cms-admin": major
---

Replace `additionalMimeTypes` and `overrideAcceptedMimeTypes` in `DamConfigProvider` with `acceptedMimeTypes`

You can now add mime types like this:

```tsx
<DamConfigProvider
    value={{
        acceptedMimeTypes: [...damDefaultAcceptedMimetypes, "something-else"],
    }}
>
    {/* ... */}
</DamConfigProvider>
```

And remove them like this:

```tsx
<DamConfigProvider
    value={{
        acceptedMimeTypes: damDefaultAcceptedMimetypes.filter((mimeType) => mimeType !== "application/zip"),
    }}
>
    {/* ... */}
</DamConfigProvider>
```

Don't forget to also remove/add the mime types in the API's `DamModule`
