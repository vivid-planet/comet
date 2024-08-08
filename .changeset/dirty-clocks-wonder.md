---
"@comet/cms-api": minor
---

Support filtering for document types in the `paginatedPageTreeNodes` query

**Example**

```graphql
query PredefinedPages($scope: PageTreeNodeScopeInput!) {
    paginatedPageTreeNodes(scope: $scope, documentType: "PredefinedPage") {
        nodes {
            id
        }
    }
}
```
