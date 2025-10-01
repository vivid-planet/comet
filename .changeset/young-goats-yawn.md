---
"@comet/admin": minor
---

Simplify adding an info-icon with a tooltip in `FormSection` using the new `infoTooltip` prop

Either set the props value to a string or `FormattedMessage` directly:

```tsx
<FormSection title="Title of the FormSection" infoTooltip="Title of the info tooltip">
    {/* ... */}
</FormSection>
```

Or use an object for a more detailed definition:

```tsx
<FormSection
    title="FormSection"
    infoTooltip={{
        title: "Title of the info tooltip",
        description: "Description of the info tooltip",
        variant: "light",
    }}
>
    {/* ... */}
</FormSection>
```
