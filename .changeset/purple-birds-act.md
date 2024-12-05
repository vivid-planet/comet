---
"@comet/admin-theme": minor
"@comet/admin": minor
---

Enhance `FieldContainer` with `secondaryHelperText` prop and `helperTextIcon` prop

-   `helperTextIcon` displays an icon alongside the text for `helperText`, `error` or `warning`.
-   `secondaryHelperText` provides an additional helper text positioned beneath the input field, aligned to the bottom-right corner.

**Example:**

```tsx
<FieldContainer label="Helper Text Icon" helperTextIcon={<Info />} helperText="Helper Text with icon" secondaryHelperText="0/100">
    <InputBase onChange={handleChange} value={value} placeholder="Placeholder" />
</FieldContainer>
```
