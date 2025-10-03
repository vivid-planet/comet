---
"@comet/admin": patch
---

Allow overriding the `divider` value of the `title` slot of `FormSection` using `slotProps`

```tsx
<FormSection
    title="Title of the FormSection"
    slotProps={{
        title: { divider: false },
    }}
>
    {/* ... */}
</FormSection>
```
