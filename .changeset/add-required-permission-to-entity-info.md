---
"@comet/cms-api": minor
---

Add `requiredPermission` to `@EntityInfo` decorator

The `@EntityInfo` decorator now accepts an optional `requiredPermission` field. This permission is included in both the `EntityInfo` and `EntityInfoFullText` SQL views.

The `fullTextSearch` query now filters results based on the current user's permissions, only returning entities where the user has the required permission. Entries with a `null` `requiredPermission` are excluded from results, as the permission cannot be determined.

**Example usage:**

```ts
@EntityInfo<Product>({
    name: "title",
    secondaryInformation: "category.name",
    visible: { status: { $eq: ProductStatus.Published } },
    fullText: "fullText",
    requiredPermission: "products",
})
```
