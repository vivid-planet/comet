---
"@comet/cms-api": minor
"@comet/cms-admin": minor
---

Show reason why impersonation is not possible

The admin UI uses `impersonationAllowed` for the initial check and only queries `impersonationNotAllowedByPermissions` on demand when the user clicks the question mark icon next to a disabled impersonation action, opening a dialog with the details.
