---
"@comet/brevo-api": patch
---

Enforce the content scope on the Brevo contact and contact-import resolvers

`BrevoContactResolver` and `BrevoContactImportResolver` were declared with `@RequiredPermission(["brevoNewsletter"], { skipScopeCheck: true })`. With `skipScopeCheck`, the guard only verified that the caller held the `brevoNewsletter` permission in _some_ scope, not in the scope passed in the request. In a multi-scope setup, a newsletter editor permissioned for one scope could therefore read, modify, delete, import, and trigger sends against the contacts of any other scope by passing that scope in the GraphQL arguments.

The resolvers now enforce the scope like their `BrevoTargetGroupResolver` and `EmailCampaignsResolver` siblings: the scope argument is checked against the caller's permissions. `manuallyAssignedBrevoContacts`, which has no scope argument, resolves its scope from the referenced target group.
