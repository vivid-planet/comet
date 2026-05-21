---
"@comet/cms-api": minor
---

Use `@RequiredPermission` decorator on entities to define required permissions for `EntityInfo` and `EntityInfoFullText` views

The `@RequiredPermission` decorator can now be applied to entity classes. The permission is included in both the `EntityInfo` and `EntityInfoFullText` SQL views.

The `fullTextSearch` query filters results based on the current user's permissions, only returning entities where the user has the required permission.

**Example usage:**

```ts
@EntityInfo<Product>({
    name: "title",
    fullText: "fullText",
})
@RequiredPermission("products")
export class Product extends BaseEntity {}
```
