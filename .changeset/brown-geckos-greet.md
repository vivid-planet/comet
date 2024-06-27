---
"@comet/cms-site": patch
---

Remove `<a>` tag from `DamFileDownloadLinkBlock`

The block incorrectly added the tag which prevents styling it in the application. The tag has been removed to achieve the same behavior as in the other link blocks, e.g. `ExternalLinkBlock`.
