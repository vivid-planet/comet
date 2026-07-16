---
"@comet/cms-admin": patch
---

Fix the warnings page crashing due to an invalid `state` filter

The `WarningsGrid` initialized its default filter with the field `state` instead of `status`, which doesn't exist on the `WarningFilter` input type. This caused the GraphQL request to fail with a `400 Bad Request`, crashing the warnings page (`/system/warnings`).
