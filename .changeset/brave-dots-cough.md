---
"@comet/cms-api": patch
---

Add `@RequiredPermission()` decorator to `dependencies` and `dependents` field resolver

Uses camel-cased entity name by default (e.g. `ProductVariant` -> `"productVariant"`).
To override the default behavior, pass the required permission as option in the respective factory:

```diff
- DependentsResolverFactory.create(ProductVariant)
+ DependentsResolverFactory.create({ entity: ProductVariant, requiredPermission: "product" })
```
