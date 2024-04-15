---
"@comet/admin": minor
---

Add optional `initalFilter` prop for useDataGridRemote hook

**Example usage:**

```tsx
const dataGridProps = useDataGridRemote({
    initialFilter: { items: [{ columnField: "description", operatorValue: "contains", value: "text" }] },
});
```
