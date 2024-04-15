---
"@comet/admin": minor
---

Add optional `initalFilter` Prop for useDataGridRemote hook

**Example usage:**

```diff
const dataGridProps = useDataGridRemote({
    initialFilter: { items: [{ columnField: "description", operatorValue: "contains", value: "text" }] },
});
```
