---
"@comet/admin": minor
---

Support applying props directly to `CrudMoreActionsMenu` to apply them to its `Button` component

For example, the component can be set to be responsive by applying the `responsive` prop from `Button`:

```tsx
<CrudMoreActionsMenu
    responsive
    overallActions={
        // ...
    }
    selectiveActions={
        // ...
    }
/>
```
