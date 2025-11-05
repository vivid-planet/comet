import { gql } from "@comet/site-react";
import type { predefinedPagesRoutes } from "@src/routes/predefinedPagesRoutes";
import { createCache, memoryStore } from "cache-manager";

import { createGraphQLFetch } from "./graphQLClient";
import { type GQLPredefinedPagesQuery, type GQLPredefinedPagesQueryVariables } from "./predefinedPages.generated";
import { getSiteConfigForDomain } from "./siteConfig";

export const memoryCache = createCache(
    memoryStore({
        ttl: 15 * 60 * 1000, // 15 minutes,
    }),
    {
        refreshThreshold: 5 * 60 * 1000, // refresh if less than 5 minutes TTL are remaining,
        onBackgroundRefreshError: (error) => {
            console.error("Error refreshing cache in background", error);
        },
    },
);
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

export type PredefinedPage = {
    type: keyof typeof predefinedPagesRoutes;
    path: string;
};
export async function fetchPredefinedPages(domain: string, language: string): Promise<PredefinedPage[]> {
    if (!getSiteConfigForDomain(domain).scope.languages.includes(language)) {
        return [];
    }
    const graphQLFetch = createGraphQLFetch();
    const key = `predefinedPages-${domain}-${language}`;

    return memoryCache.wrap(key, async () => {
        const pages: Array<PredefinedPage> = [];
        const { paginatedPageTreeNodes } = await graphQLFetch<GQLPredefinedPagesQuery, GQLPredefinedPagesQueryVariables>(predefinedPagesQuery, {
            scope: { domain: domain, language },
        });

        for (const node of paginatedPageTreeNodes.nodes) {
            if (node.document?.__typename === "PredefinedPage" && node.document.type) {
                pages.push({
                    type: node.document.type,
                    path: node.path,
                });
            }
        }

        return pages;
    });
}
