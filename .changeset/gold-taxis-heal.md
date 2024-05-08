---
"@comet/cms-admin": minor
"@comet/admin": minor
---

Add `filterByFragment` to replace graphql-anywhere's `filter`

[graphql-anywhere](https://www.npmjs.com/package/graphql-anywhere) is no longer maintained.
However, its `filter` utility is useful for filtering data by a GraphQL document, e.g., a fragment.
Therefore, the function was copied to `@comet/admin`.
To migrate, replace all `filter` calls with `filterByFragment`:

```diff
- import { filter } from "graphql-anywhere";
+ import { filterByFragment } from "@comet/admin";

const initialValues: Partial<FormValues> = data?.product
    ? {
-       ...filter<GQLProductPriceFormFragment>(productPriceFormFragment, data.product),
+       ...filterByFragment<GQLProductPriceFormFragment>(productPriceFormFragment, data.product),
        price: String(data.product.price),
    }
    : {};
```

You can then uninstall the `graphql-anywhere` package:

```bash
# In admin/
npm uninstall graphql-anywhere
```
