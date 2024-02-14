---
"@comet/cms-admin": minor
---

Support additional content in DAM Data Grid rows

**Example**

```tsx
<DamConfigProvider
    value={{
        renderAdditionalRowContent: (row) => <Chip size="small" icon={<UnsplashIcon />} label="Unsplash" />,
    }}
>
    ...
</DamConfigProvider>
```
