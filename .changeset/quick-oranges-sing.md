---
"@comet/cms-admin": minor
---

Add convert callback to muiGridFilterToGql function

This allows to map custom filters to more complex gql filter structures, especially if it's required to combine multiple gql-filter objects with `and` or `or`. With this callback it's also possible to combine multiple mui-data-grid filter into one filter-object by skipping.
