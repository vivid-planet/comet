---
"@comet/cms-admin": patch
---

Fix the dependents list crashing due to an invalid `visible` filter

The `DependentsList` initialized the `visible` filter with the string `"true"` instead of the boolean `true`, causing the GraphQL request to fail with a `400 Bad Request` (`Boolean cannot represent a non boolean value`). This made the dependents tab (e.g., on assets) crash with a network error.
