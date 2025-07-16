---
"@comet/site-nextjs": major
"@comet/cms-admin": major
---

Require API route for block preview

Eliminates `Cannot get siteConfig for host ${preview-domain}` error in `withDomainRewriteMiddleware` when using BFF requests in block preview.
