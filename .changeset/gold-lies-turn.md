---
"@comet/site-react": minor
"@comet/site-nextjs": minor
---

Move `DamFileDownloadLinkBlock`, `EmailLinkBlock`, `ExternalLinkBlock` and `PhoneLinkBlock` to `@comet/site-react`

The blocks have no dependency on Next.js and can therefore be in the generic React package.
