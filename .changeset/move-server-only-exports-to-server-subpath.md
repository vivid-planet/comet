---
"@comet/site-nextjs": major
"@comet/site-react": major
---

Move server-only exports to `/server` subpath

Server-only exports have been moved to a separate `/server` entry point to prevent server-only code from being pulled into client bundles. While tree-shaking previously removed unused server code, this is an optional optimization — Vite's dev server, for example, does not tree-shake, causing errors when importing these packages in non-server environments (e.g., Storybook).

**`@comet/site-nextjs`**: `sitePreviewRoute`, `legacyPagesRouterSitePreviewApiHandler`, `previewParams`, `legacyPagesRouterPreviewParams`, and `persistedQueryRoute` must now be imported from `@comet/site-nextjs/server`:

```diff
- import { sitePreviewRoute } from "@comet/site-nextjs";
+ import { sitePreviewRoute } from "@comet/site-nextjs/server";
```

```diff
- import { previewParams } from "@comet/site-nextjs";
+ import { previewParams } from "@comet/site-nextjs/server";
```

```diff
- import { persistedQueryRoute } from "@comet/site-nextjs";
+ import { persistedQueryRoute } from "@comet/site-nextjs/server";
```

**`@comet/site-react`**: `persistedQueryRoute` must now be imported from `@comet/site-react/server`:

```diff
- import { persistedQueryRoute } from "@comet/site-react";
+ import { persistedQueryRoute } from "@comet/site-react/server";
```
