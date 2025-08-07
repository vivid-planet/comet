---
"@comet/cms-admin": minor
---

Remove download of files during page copy

Previously, when copying a page from another instance (e.g., staging to dev), COMET would try to download the files from the other instance.

Files from another instance were recognized by looking at their file URL.
If the domain was different from the current domain, COMET would try to download the file.

This doesn't work anymore because now we only have relative file URLs.
It also sometimes caused issues with the file download, e.g., when the file was not available anymore.
Therefore, we removed this feature.
