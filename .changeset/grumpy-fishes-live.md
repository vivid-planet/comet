---
"@comet/cms-site": major
---

Remove unused GraphQL client/fetch from site preview handlers

The client/fetch was passed as the last argument for `sitePreviewRoute` and `legacyPagesRouterSitePreviewApiHandler`.
Remove the argument from the respective function calls.
