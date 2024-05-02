---
"@comet/admin": minor
---

Add an option to remap the fields used for sorting in `muiGridSortToGql`

This can be useful for custom columns that do not represent a real field in the data, e.g., columns that render the data of multiple fields.

In the following example, when sorting by the `overview` column, the data will be sorted by the value of `title`.

```ts
const sort = muiGridSortToGql(sortModel, {
    overview: "title",
});
```

Alternatively, you can also sort a single column by multiple values.

```ts
const sort = muiGridSortToGql(sortModel, {
    fullName: ["firstName", "lastName"],
});
```
