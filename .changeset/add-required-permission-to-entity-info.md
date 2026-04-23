---
"@comet/cms-api": minor
---

Add `requiredPermission` to `@EntityInfo` decorator

The `@EntityInfo` decorator now accepts an optional `requiredPermission` property. When set, the full-text search query filters results to only include entities where the current user has the required permission.

```typescript
@EntityInfo<Product>({
    name: "title",
    fullText: "fullText",
    requiredPermission: "products",
})
```
