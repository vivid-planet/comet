---
"@comet/admin": minor
---

useDataGridRemote: Add `initialFilter` option

**Example usage:**

```tsx
const dataGridProps = useDataGridRemote({
    initialFilter: { items: [{ columnField: "description", operatorValue: "contains", value: "text" }] },
});
```
