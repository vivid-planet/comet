---
"@comet/admin-generator": minor
---

**Breaking:** Rename `filter.gqlName` to `filter.rootQueryArg` and `filter.fieldName` to `filter.formFieldName` for `asyncSelect` form fields

This is done to better reflect what the options are used for.
To upgrade, rename the fields in your Admin Generator configs:

```diff
{
    fields: [
        {
            type: "asyncSelect",
            name: "manufacturer",
            rootQuery: "manufacturers",
            filter: {
                type: "typeField",
-               fieldName: "manufacturerCountry",
+               formFieldName: "manufacturerCountry",
-               gqlName: "addressAsEmbeddable_country",
+               rootQueryArg: "addressAsEmbeddable_country",
            },
        },
    ];
}
```
