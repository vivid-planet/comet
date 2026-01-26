import { type BlockLoaderOptions, gql } from "@comet/site-nextjs";
import { type PageTreeIndexBlockData } from "@src/blocks.generated";

import { type GQLPageTreeIndexDataQuery, type GQLPageTreeIndexDataQueryVariables } from "./PageTreeIndexBlock.loader.generated";

export type PageTreeNode = GQLPageTreeIndexDataQuery["paginatedPageTreeNodes"]["nodes"][number];
export type LoadedData = Awaited<ReturnType<typeof loader>>;

export const loader = async ({ graphQLFetch, scope }: BlockLoaderOptions<PageTreeIndexBlockData>) => {
    let totalCount = 0;
    let currentCount = 0;
    const pageSize = 100;
    const allNodes: PageTreeNode[] = [];

    do {
        const { paginatedPageTreeNodes } = await graphQLFetch<GQLPageTreeIndexDataQuery, GQLPageTreeIndexDataQueryVariables>(
            gql`
                query PageTreeIndexData($scope: PageTreeNodeScopeInput!, $offset: Int, $limit: Int, $visibility: PageTreeNodeVisibility) {
                    paginatedPageTreeNodes(scope: $scope, offset: $offset, limit: $limit, visibility: $visibility) {
                        nodes {
                            id
                            name
                            path
                            parentId
                            scope {
                                domain
                                language
                            }
                            visibility
                        }
                        totalCount
                    }
                }
            `,
            {
                scope,
                offset: currentCount,
                limit: pageSize,
                visibility: "Published",
            },
        );

        totalCount = paginatedPageTreeNodes.totalCount;
        currentCount += paginatedPageTreeNodes.nodes.length;
        allNodes.push(...paginatedPageTreeNodes.nodes);
    } while (totalCount > currentCount);

    return allNodes;
};
