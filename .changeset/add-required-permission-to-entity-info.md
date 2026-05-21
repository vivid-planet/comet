---
"@comet/cms-api": minor
---

Use `@RequiredPermission` decorator on entities instead of `requiredPermission` in `@EntityInfo`

The `requiredPermission` option has been removed from the `@EntityInfo` decorator. Instead, use the existing `@RequiredPermission` decorator directly on entity classes.

**Before:**

```ts
@EntityInfo<Product>({
    name: "title",
    fullText: "fullText",
    requiredPermission: "products",
})
export class Product extends BaseEntity {}
```

**After:**

```ts
@EntityInfo<Product>({
    name: "title",
    fullText: "fullText",
})
@RequiredPermission("products")
export class Product extends BaseEntity {}
```
