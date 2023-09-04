---
"@comet/cms-admin": minor
"@comet/admin": minor
---

Add little helper for mui grid pagination (muiGridPagingToGql)

Sample usage:

```
const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
    variables: {
        ...muiGridFilterToGql(columns, dataGridProps.filterModel),
        ...muiGridPagingToGql({ page: dataGridProps.page, pageSize: dataGridProps.pageSize }),
        sort: muiGridSortToGql(sortModel),
    },
});
```
