---
"@comet/cms-admin": major
"@comet/cms-site": major
---

Support single host for block preview

The content scope is passed through the iframe-bridge in the admin and accessible in the site in the IFrameBridgeProvider.
Breaking: `previewUrl`-property of `SiteConfig` has changed to `blockPreviewBaseUrl`
