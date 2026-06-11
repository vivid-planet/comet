---
"@comet/cms-api": minor
---

Filter `fullTextSearch` results by the entity's required permission

The `requiredPermission` of an entity (declared via the `@RequiredPermission` decorator) is now included in both the `EntityInfo` and `EntityInfoFullText` SQL views.

The `fullTextSearch` query now requires a `requiredPermissions` argument and only returns entities whose required permission is included in it. This makes the query idempotent: it returns the same results for all users, regardless of their individual permissions. The current user is still validated against the passed `requiredPermissions` — requesting a permission the user doesn't have results in a `ForbiddenException`. Entries without a required permission are excluded from results, as the permission cannot be determined.

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
