import {
    convertPreviewDataToHeaders,
    createFetchWithDefaultNextRevalidate,
    createFetchWithDefaults,
    createGraphQLFetch as createGraphQLFetchLibrary,
} from "@comet/site-nextjs";
import { type AllBlockNames } from "@src/blocks.generated";
import { blockLoaders } from "@src/util/recursivelyLoadBlockData";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { blockType, blockData, showOnlyVisible, ...dependencies } = body;

    const graphQLFetch = createGraphQLFetchLibrary(
        // set a default revalidate time of 7.5 minutes to get an effective cache duration of 15 minutes if a CDN cache is enabled
        // see cache-handler.ts for maximum cache duration (24 hours)
        createFetchWithDefaults(createFetchWithDefaultNextRevalidate(fetch, 7.5 * 60), {
            headers: {
                authorization: `Basic ${Buffer.from(`system-user:${process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD}`).toString("base64")}`,
                ...convertPreviewDataToHeaders({ includeInvisible: !showOnlyVisible }),
            },
        }),
        `${process.env.API_URL_INTERNAL}/graphql`,
    );

    const loader = blockLoaders[blockType as AllBlockNames];
    if (!loader) throw new Error("no loader for blockType");
    const returnData = await loader({ blockData, graphQLFetch, fetch, ...dependencies });

    return NextResponse.json(returnData);
}
