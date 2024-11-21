---
"@comet/admin": minor
---

Add new custom `Dialog`

The component extends the MUI `Dialog` component to enable common use cases:

-   The `title` prop can be used to set the dialog title
-   A close button is shown when the `onClose` is used

**Example**

```tsx
<Dialog
    title="Dialog Title"
    onClose={() => {
        // Handle dialog closing here
    }}
/>
```
