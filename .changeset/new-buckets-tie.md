---
"@comet/cms-api": minor
---

Add new permissions `sitePreview` and `blockPreview` to `SitePreviewResolver`

These permissions can be assigned to users who can't access the page tree, but some other parts of the CMS where site or block previews are needed.

Users with the `pageTree` permission can still automatically access both previews.
