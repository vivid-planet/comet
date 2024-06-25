---
"@comet/admin": minor
---

Add `OnChangeField` helper to listen to field changes

**Example**

```tsx
<OnChangeField name="product">
    {(value, previousValue) => {
        // Will be called when field 'product' changes
    }}
</OnChangeField>
```
