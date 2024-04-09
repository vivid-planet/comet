---
"@comet/cms-site": minor
---

Store site preview-scope in cookie and add `previewParams()` helper to access it

- new required env variable `SITE_PREVIEW_SECRET` must contain a random secret (not required in local dev)
- new api site-preview api route is required:
```
import { sitePreviewRoute } from "@comet/cms-site";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
    return sitePreviewRoute(request, createGraphQLFetch());
}
```