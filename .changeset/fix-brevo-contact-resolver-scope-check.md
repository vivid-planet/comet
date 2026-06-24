---
"@comet/brevo-api": patch
---

Enforce the content scope on the Brevo contact, contact-import, and config resolvers

Several Brevo resolver operations were declared with `{ skipScopeCheck: true }`. With `skipScopeCheck`, the guard only verified that the caller held the permission in _some_ scope, not in the scope passed in the request. In a multi-scope setup, an editor permissioned for one scope could therefore operate on another scope's data by passing that scope in the GraphQL arguments:

- `BrevoContactResolver` and `BrevoContactImportResolver` (`brevoNewsletter`) — read, modify, delete, import, and trigger sends against the contacts of any other scope.
- `brevoSenders` and `brevoDoubleOptInTemplates` on `BrevoConfigResolver` (`brevoNewsletterConfig`) — read the configured senders and double-opt-in templates of any other scope.

These operations now enforce the scope like their `BrevoTargetGroupResolver` and `EmailCampaignsResolver` siblings: the scope argument is checked against the caller's permissions. `manuallyAssignedBrevoContacts`, which has no scope argument, resolves its scope from the referenced target group.
