---
"@comet/cms-site": minor
---

Add preloginRoute()-Helper for use with the Comet-Prelogin-Proxy

-   Requires the new `SITE_JWT_SECRET` environment variable that must contain a random secret (not required for local development)
-   Requires a Route Handler located at `app/api/prelogin/route.ts`:

    ```ts
    import { preloginRoute } from "@comet/cms-site";
    import { createGraphQLFetch } from "@src/util/graphQLClient";
    import { type NextRequest } from "next/server";

    export const dynamic = "force-dynamic";

    export async function GET(request: NextRequest) {
        return preloginRoute(request, createGraphQLFetch());
    }
    ```
