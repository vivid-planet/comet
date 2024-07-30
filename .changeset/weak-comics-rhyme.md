---
"@comet/cms-site": major
---

Remove server-only code from client bundle

Make sure to upgrade to Next 14.2.0 or later.
Enable `optimizePackageImports` for `@comet/cms-site` in `next.config.js`:

```diff
const nextConfig = {
    /* ... */
+   experimental: {
+       optimizePackageImports: ["@comet/cms-site"],
+   },
};

module.exports = withBundleAnalyzer(nextConfig);
```
