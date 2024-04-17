---
"@comet/cms-site": minor
---

Store site preview scope in cookie and add `previewParams()` helper to access it

- Requires the new `SITE_PREVIEW_SECRET` environment variable that must contain a random secret (not required for local development)
- Requires a Route Handler located at `app/api/site-preview/route.ts`:

  ```ts
  import { sitePreviewRoute } from "@comet/cms-site";
  import { createGraphQLFetch } from "@src/util/graphQLClient";
  import { type NextRequest } from "next/server";

  export const dynamic = "force-dynamic";
  
  export async function GET(request: NextRequest) {
    return sitePreviewRoute(request, createGraphQLFetch());
  }