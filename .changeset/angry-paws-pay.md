---
"@comet/cms-site": patch
---

Fix Next peer dependency

The peer dependency was incorrectly set to `14`.
We require `14.2.0` or later due to relying on [optimizePackageImports](https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports).
