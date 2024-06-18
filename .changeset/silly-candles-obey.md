---
"@comet/admin": minor
---

Add `OnChange` helper to listen to field changes

**Example**

```tsx
<OnChange name="product">
    {(value, previousValue) => {
        // Will be called when field 'product' changes
    }}
</OnChange>
```
