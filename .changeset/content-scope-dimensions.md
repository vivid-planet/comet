---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Allow declaring content scope dimensions at runtime

Content scope dimensions were previously only known implicitly from the keys of the `availableContentScopes` values. An optional dimension that is not part of `availableContentScopes` (e.g. a dimension with too many values to enumerate) therefore had no runtime representation and was not shown in the user permissions admin panel.

Add an optional `availableContentScopeDimensions` option to the `UserPermissionsModule` to declare the content scope dimensions (with optional labels) at runtime. The user permissions panel uses it to render a consistent set of columns for every user. When omitted, the dimensions are derived from `availableContentScopes` as before.

**Example**

```ts
UserPermissionsModule.forRootAsync({
    useFactory: () => ({
        availableContentScopes: [ ... ],
        availableContentScopeDimensions: [{ name: "domain" }, { name: "language" }, { name: "product" }],
        // ...
    }),
    // ...
});
```
