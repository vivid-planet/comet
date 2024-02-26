---
"@comet/cms-admin": minor
---

Show DAM import source in grid

To show the "Source" column in the DAM's data grid, provide `importSourceTypeLabels` in `DamConfigProvider`:

```tsx
<DamConfigProvider
    value={{
        ...
        importSourceTypeLabels: {
            unsplash: <FormattedMessage id="dam.importSourceLabel.unsplash" defaultMessage="Unsplash" />,
        },
    }}
>
    ...
</DamConfigProvider>
```
