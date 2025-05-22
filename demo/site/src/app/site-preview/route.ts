<<<<<<< HEAD
import { sitePreviewRoute } from "@comet/cms-site";
=======
import { sitePreviewRoute } from "@comet/site-nextjs";
import { createGraphQLFetch } from "@src/util/graphQLClient";
>>>>>>> main
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    return sitePreviewRoute(request);
}
