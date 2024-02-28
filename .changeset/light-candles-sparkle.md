---
"@comet/cms-admin": minor
---

Show DAM import source in grid

To show the "Source" column in the DAM's data grid, provide `importSources` in `DamConfigProvider`:

```tsx
<DamConfigProvider
    value={{
        ...
        importSources: {
            unsplash: {
                label: <FormattedMessage id="dam.importSource.unsplash.label" defaultMessage="Unsplash" />,
            },
        },
    }}
>
    ...
</DamConfigProvider>
```
