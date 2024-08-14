import { gql } from "@comet/cms-site";
import { languages } from "@src/config";
import { predefinedPagePaths } from "@src/predefinedPages/predefinedPagePaths";
import { createGraphQLFetch } from "@src/util/graphQLClient";

import { memoryCache } from "./cache";
import { GQLPredefinedPagesQuery, GQLPredefinedPagesQueryVariables } from "./predefinedPages.generated";

async function getPredefinedPageRedirect(scope: { domain: string }, pathname: string): Promise<string | undefined> {
    const pages = await fetchPredefinedPages(scope);

    const matchingPredefinedPage = pages.find((page) => pathname.startsWith(page.codePath));

    if (matchingPredefinedPage) {
        return pathname.replace(matchingPredefinedPage.codePath, matchingPredefinedPage.pageTreeNodePath);
    }

    return undefined;
}

async function getPredefinedPageRewrite(scope: { domain: string }, pathname: string): Promise<string | undefined> {
    const pages = await fetchPredefinedPages(scope);

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

const graphQLFetch = createGraphQLFetch();

async function fetchPredefinedPages(scope: { domain: string }) {
    const key = `predefinedPages-${JSON.stringify(scope)}`;

    return memoryCache.wrap(key, async () => {
        const pages: Array<{ codePath: string; pageTreeNodePath: string }> = [];

        for (const language of languages) {
            const { paginatedPageTreeNodes } = await graphQLFetch<GQLPredefinedPagesQuery, GQLPredefinedPagesQueryVariables>(predefinedPagesQuery, {
                scope: { domain: scope.domain, language },
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

export { getPredefinedPageRedirect, getPredefinedPageRewrite };
