---
"@comet/cms-admin": major
"@comet/cms-api": major
"@comet/admin": minor
---

Add filtering and sorting to `DependenciesList` and `DependentsList`

Users can now filter dependencies/dependents by name, type, secondary information, and visibility, and sort by all columns. A default filter shows only visible items. The `GqlFilter` type is now exported from `@comet/admin`.

**Breaking changes:**

**`@comet/cms-api`:** `DependencyFilter.targetGraphqlObjectType` and `DependentFilter.rootGraphqlObjectType` changed from `string` to `StringFilter`. Update any code passing a plain string to use `{ equal: "..." }` instead.

**`@comet/cms-admin`:** The GQL queries passed to `DependenciesList` and `DependentsList` must now accept `$filter` and `$sort` variables and forward them to the `dependencies`/`dependents` field. Update your queries as follows:

```graphql
# DependentsList
query MyDependents($id: ID!, $offset: Int!, $limit: Int!, $forceRefresh: Boolean = false, $filter: DependentFilter, $sort: [DependencySort!]) {
    item: myEntity(id: $id) {
        id
        dependents(offset: $offset, limit: $limit, forceRefresh: $forceRefresh, filter: $filter, sort: $sort) {
            nodes {
                rootGraphqlObjectType
                rootId
                rootColumnName
                jsonPath
                name
                secondaryInformation
                visible
            }
            totalCount
        }
    }
}

# DependenciesList
query MyDependencies($id: ID!, $offset: Int!, $limit: Int!, $forceRefresh: Boolean = false, $filter: DependencyFilter, $sort: [DependencySort!]) {
    item: myEntity(id: $id) {
        id
        dependencies(offset: $offset, limit: $limit, forceRefresh: $forceRefresh, filter: $filter, sort: $sort) {
            nodes {
                targetGraphqlObjectType
                targetId
                rootColumnName
                jsonPath
                name
                secondaryInformation
                visible
            }
            totalCount
        }
    }
}
```
