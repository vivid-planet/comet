import { gql } from "@dextinity/site-react";
import { predefinedPagePaths } from "@src/documents/predefinedPages/predefinedPagePaths";
import { createGraphQLFetchMiddleware } from "@src/util/graphQLClientMiddleware";
import { getHostByHeaders, getSiteConfigForDomain, getSiteConfigForHost } from "@src/util/siteConfig";
import { createMiddleware } from "hono/factory";

import { memoryCache } from "./cache";
import type { MiddlewareEnv } from "./env";
import type { GQLPredefinedPagesQuery, GQLPredefinedPagesQueryVariables } from "./predefinedPages.generated";

async function getPredefinedPageRedirect(domain: string, pathname: string): Promise<string | undefined> {
    const pages = await fetchPredefinedPages(domain);

    const matchingPredefinedPage = pages.find((page) => pathname.startsWith(page.codePath));

    if (matchingPredefinedPage) {
        return pathname.replace(matchingPredefinedPage.codePath, matchingPredefinedPage.pageTreeNodePath);
    }

    return undefined;
}

async function getPredefinedPageRewrite(domain: string, pathname: string): Promise<string | undefined> {
    const pages = await fetchPredefinedPages(domain);

    const matchingPredefinedPage = pages.find((page) => pathname.startsWith(page.pageTreeNodePath));

    if (matchingPredefinedPage) {
        return pathname.replace(matchingPredefinedPage.pageTreeNodePath, matchingPredefinedPage.codePath);
    }

    return undefined;
}

const predefinedPagesQuery = gql`
    query PredefinedPages($scope: PageTreeNodeScopeInput!) {
        paginatedPageTreeNodes(scope: $scope, documentType: "PredefinedPage") {
            nodes {
                id
                path
                document {
                    __typename
                    ... on PredefinedPage {
                        type
                    }
                }
            }
        }
    }
`;

const graphQLFetch = createGraphQLFetchMiddleware();

async function fetchPredefinedPages(domain: string) {
    const key = `predefinedPages-${domain}`;

    return memoryCache.wrap(key, async () => {
        const pages: Array<{ codePath: string; pageTreeNodePath: string }> = [];

        for (const language of getSiteConfigForDomain(domain).scope.languages) {
            const { paginatedPageTreeNodes } = await graphQLFetch<GQLPredefinedPagesQuery, GQLPredefinedPagesQueryVariables>(predefinedPagesQuery, {
                scope: { domain: domain, language },
            });

            for (const node of paginatedPageTreeNodes.nodes) {
                if (node.document?.__typename === "PredefinedPage" && node.document.type) {
                    pages.push({
                        codePath: `/${language}${predefinedPagePaths[node.document.type]}`,
                        pageTreeNodePath: `/${language}${node.path}`,
                    });
                }
            }
        }

        return pages;
    });
}

export const predefinedPagesMiddleware = createMiddleware<MiddlewareEnv>(async (c, next) => {
    const host = getHostByHeaders(c.req.raw.headers);
    const siteConfig = await getSiteConfigForHost(host);
    if (!siteConfig) {
        throw new Error(`Cannot get siteConfig for host ${host}`);
    }

    const predefinedPageRedirect = await getPredefinedPageRedirect(siteConfig.scope.domain, c.req.path);

    if (predefinedPageRedirect) {
        return c.redirect(predefinedPageRedirect, 307);
    }

    const predefinedPageRewrite = await getPredefinedPageRewrite(siteConfig.scope.domain, c.req.path);

    if (predefinedPageRewrite) {
        c.set("rewrittenPathname", predefinedPageRewrite);
    }

    await next();
});
