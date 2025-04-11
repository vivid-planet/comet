---
"@comet/cms-api": minor
---

Suppert `getUserForLogin` in `UserService`.

This allows implementing a different code path for getting the user to login
and the user shown in the administration panel. Examples are caching the currently logged
in user or throwing `UnauthorizedException` when not allowed to login.
