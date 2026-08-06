---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Summarize a user's content scopes per dimension in the user permissions users list

The users list previously showed a single content scope count per user, which counts a wildcard dimension (`"*"`) as a single scope and therefore under-reports the accessible scopes. It now summarizes the content scopes **per dimension** (e.g. `domain: 3, language: *`), so a wildcard dimension is simply shown as `*` and never has to be counted.

The `contentScopesCount` field of `UserPermissionsUser` is replaced by `contentScopeSummary: [ContentScopeSummaryByDimension!]!`, where each entry's `count` is the number of distinct values for a dimension, or the wildcard `"*"` if the user has access to all values.
