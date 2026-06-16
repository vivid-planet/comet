---
"@comet/cms-api": minor
---

Filter `fullTextSearch` results by the entity's required permission

The `requiredPermission` of an entity (declared via the `@RequiredPermission` decorator) is now included in both the `EntityInfo` and `EntityInfoFullText` SQL views.

The `fullTextSearch` query now filters results based on the current user's permissions, only returning entities where the user has the required permission. Entries without a required permission are excluded from results, as the permission cannot be determined.

**Example usage:**

```ts
@EntityInfo<Product>({
    name: "title",
    secondaryInformation: "category.name",
    visible: { status: { $eq: ProductStatus.Published } },
    fullText: "fullText",
})
@RequiredPermission("products")
@ObjectType()
@Entity()
export class Product {
    // ...
}
```
