---
"@comet/admin": minor
---

Allow passing `data-testid` to FieldContainer/Field-based fields

This enables easier element selection in end-to-end tests (e.g., with Playwright).

**Example usage:**

```ts
<SelectField
    data-testid="test-select"
    ...
/>
```
