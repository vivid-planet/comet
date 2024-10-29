---
"@comet/cms-admin": patch
---

Display global `ContentScopeIndicator` if redirects are scoped globally

Previously, an empty `ContentScopeIndicator` was displayed if no `scopeParts` were passed to `createRedirectsPage`.
