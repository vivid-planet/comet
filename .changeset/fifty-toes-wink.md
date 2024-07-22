---
"@comet/admin": patch
---

Fix error dialog to show GraphQL errors again

Previously, GraphQL errors without an http status code didn't trigger an error dialog anymore.
