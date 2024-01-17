---
"@comet/cms-admin": patch
---

Show `additionalToolbarItems` in `ChooseFileDialog`

The `additionalToolbarItems` were only shown inside the `DamPage`, but not in the `ChooseFileDialog`.
To fix this, use the `additionalToolbarItems` option in `DamConfigProvider`.
The `additionalToolbarItems` prop of `DamPage` has been deprecated in favor of this option.

**Previously:**

```tsx
<DamPage
    // ...
    additionalToolbarItems={<ImportFromExternalDam />}
/>
```

**Now:**

```tsx
<DamConfigProvider
    value={{
        // ...
        additionalToolbarItems: <ImportFromExternalDam />,
    }}
>
    {/*...*/}
</DamConfigProvider>
```
