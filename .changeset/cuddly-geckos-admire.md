---
"@comet/cms-site": patch
"@comet/site-nextjs": patch
"@comet/cms-admin": patch
---

Prevent phishing in SitePreview

Affected applications: if the property `resolvePath` of the `SitePreview` component returns the plain path. The default implementation in the starter is not affected.
