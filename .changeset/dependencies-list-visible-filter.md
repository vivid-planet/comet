---
"@comet/cms-admin": patch
---

Fix the dependencies list crashing due to an invalid `visible` filter

The `DependenciesList` initialized the `visible` filter with the string `"true"` instead of the boolean `true`, causing the GraphQL request to fail with a `400 Bad Request` (`Boolean cannot represent a non boolean value`). This made the dependencies/dependents tab (e.g., on global content) crash with a network error. This is the counterpart to the earlier fix for `DependentsList`.
