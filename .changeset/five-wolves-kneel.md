---
"@comet/blocks-admin": minor
---

Simplify setting field props when using `createCompositeBlockTextField` or `createCompositeBlockSelectField`

The props can now be set directly without nesting them inside the `fieldProps` object.

```diff
 block: createCompositeBlockTextField({
-    fieldProps: {
         label: "Title",
         fullWidth: true,
-    },
 }),
```
