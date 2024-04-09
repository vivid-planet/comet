import { gql } from "@comet/cms-site";
import { ExternalLinkBlockData, InternalLinkBlockData, RedirectsLinkBlockData } from "@src/blocks.generated";
import { Rewrite, RouteHas } from "next/dist/lib/load-custom-routes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { domain } from "./config";
import { GQLRedirectScope } from "./graphql.generated";
import { GQLRedirectsQuery, GQLRedirectsQueryVariables } from "./middleware.generated";
import { createGraphQLFetch } from "./util/graphQLClient";

const redirectsQuery = gql`
    query Redirects($scope: RedirectScopeInput!, $filter: RedirectFilter, $sort: [RedirectSort!], $offset: Int!, $limit: Int!) {
        paginatedRedirects(scope: $scope, filter: $filter, sort: $sort, offset: $offset, limit: $limit) {
            nodes {
                sourceType
                source
                target
            }
            totalCount
        }
    }
`;

const graphQLFetch = createGraphQLFetch();
export async function middleware(request: NextRequest) {
    const { pathname } = new URL(request.url);

    const scope = { domain };

    const redirects = await createRedirects(scope);

    const redirect = redirects.get(pathname);
    if (redirect) {
        const destination: string = redirect.destination;
        return NextResponse.redirect(new URL(destination, request.url), redirect.permanent ? 308 : 307);
    }

    const rewrites = await createRewrites(scope);
    const rewrite = rewrites.get(pathname);
    if (rewrite) {
        return NextResponse.rewrite(new URL(rewrite.destination, request.url));
    }

    return NextResponse.next();
}

const createInternalRedirects = async (): Promise<Map<string, Redirect>> => {
    const redirectsMap = new Map<string, Redirect>();
    const adminUrl = process.env.ADMIN_URL;

    if (!adminUrl) {
        throw Error("ADMIN_URL is not defined");
    }

    redirectsMap.set("/admin", { destination: adminUrl, permanent: false });
    return redirectsMap;
};

async function* fetchApiRedirects(scope: GQLRedirectScope) {
    let offset = 0;
    const limit = 100;

    while (true) {
        const { paginatedRedirects } = await graphQLFetch<GQLRedirectsQuery, GQLRedirectsQueryVariables>(redirectsQuery, {
            filter: { active: { equal: true } },
            sort: { field: "createdAt", direction: "DESC" },
            offset,
            limit,
            scope,
        });

        yield* paginatedRedirects.nodes;

        if (offset + limit >= paginatedRedirects.totalCount) {
            break;
        }

        offset += limit;
    }
}

const createApiRedirects = async (scope: GQLRedirectScope): Promise<Map<string, Redirect>> => {
    const redirects = new Map<string, Redirect>();
    function replaceRegexCharacters(value: string): string {
        // escape ":" and "?", otherwise it is used for next.js regex path matching  (https://nextjs.org/docs/pages/api-reference/next-config-js/redirects#regex-path-matching)
        return value.replace(/[:?]/g, "\\$&");
    }

    for await (const redirect of fetchApiRedirects(scope)) {
        let source: string | undefined;
        let destination: string | undefined;
        let has: Redirect["has"];

        if (redirect.sourceType === "path") {
            // query parameters have to be defined with has, see: https://nextjs.org/docs/pages/api-reference/next-config-js/redirects#header-cookie-and-query-matching
            if (redirect.source?.includes("?")) {
                const searchParamsString = redirect.source.split("?").slice(1).join("?");
                const searchParams = new URLSearchParams(searchParamsString);
                has = [];

                searchParams.forEach((value, key) => {
                    if (has) {
                        has.push({ type: "query", key, value: replaceRegexCharacters(value) });
                    }
                });
                source = replaceRegexCharacters(redirect.source.replace(searchParamsString, ""));
            } else {
                source = replaceRegexCharacters(redirect.source);
            }
        }

        const target = redirect.target as RedirectsLinkBlockData;

        if (target.block !== undefined) {
            switch (target.block.type) {
                case "internal":
                    destination = (target.block.props as InternalLinkBlockData).targetPage?.path;
                    break;

                case "external":
                    destination = (target.block.props as ExternalLinkBlockData).targetUrl;
                    break;
            }
        }

        if (source === destination) {
            console.warn(`Skipping redirect loop ${source} -> ${destination}`);
            continue;
        }

        if (source && destination) {
            redirects.set(source, { destination, permanent: true });
        }
    }
    return redirects;
};

type Redirect = { destination: string; permanent: boolean; has?: RouteHas[] | undefined };

const REDIRECTS_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

type RedirectsMap = Map<string, Redirect>;
const redirectsCache = new Map<string, RedirectsMap>();
const redirectsCacheLastUpdate = new Map<string, number>();

const createRedirects = async (scope: GQLRedirectScope) => {
    const key = JSON.stringify(scope);
    const lastUpdate = redirectsCacheLastUpdate.get(key);
    if (lastUpdate && Date.now() - lastUpdate < REDIRECTS_CACHE_TTL) {
        return redirectsCache.get(key) as RedirectsMap;
    }

    const redirectsMap = new Map<string, Redirect>([
        ...Array.from(await createApiRedirects({ domain: scope.domain })),
        ...Array.from(await createInternalRedirects()),
    ]);

    redirectsCache.set(key, redirectsMap);
    redirectsCacheLastUpdate.set(key, Date.now());

    return redirectsMap;
};

type RewritesMap = Map<string, Rewrite>;

async function createRewrites(scope: GQLRedirectScope): Promise<RewritesMap> {
    const rewritesMap = new Map<string, Rewrite>();
    return rewritesMap;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, favicon.svg, favicon.png
         * - manifest.json
         */
        "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|favicon.png|manifest.json).*)",
    ],
    // TODO find a better solution for this (https://nextjs.org/docs/messages/edge-dynamic-code-evaluation)
    unstable_allowDynamic: ["/node_modules/graphql/**"],
};
