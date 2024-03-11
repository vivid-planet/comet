---
"@comet/cms-admin": major
"@comet/cms-site": major
---

Use a single host for block preview

The content scope is passed through the iframe-bridge in the admin and accessible in the site in the IFrameBridgeProvider

Requires the following changes in the admin:

-   The `SitesConfigProvider` needs the absolute base Url to the block preview
-   Use `previewPath` instead of `previewUrl` in block previews in Admin
