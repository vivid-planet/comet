import { gql } from "@apollo/client";
import { useTableQuery } from "@comet/admin";
import { LatestContentUpdatesDashboardWidget } from "@comet/cms-admin";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import React from "react";

import { GQLLatestContentUpdatesQuery, GQLLatestContentUpdatesQueryVariables } from "./LatestContentUpdates.generated";

const LATEST_CONTENT_UPDATES_QUERY = gql`
    query LatestContentUpdates($scope: PageTreeNodeScopeInput!) {
        paginatedPageTreeNodes(offset: 0, limit: 5, scope: $scope, sort: [{ field: updatedAt, direction: DESC }]) {
            nodes {
                id
                updatedAt
                name
                path
                scope {
                    domain
                    language
                }
                category
            }
            totalCount
        }
    }
`;

export const LatestContentUpdates = () => {
    const { scope } = useContentScope();

    const tableQuery = useTableQuery<GQLLatestContentUpdatesQuery, GQLLatestContentUpdatesQueryVariables>()(LATEST_CONTENT_UPDATES_QUERY, {
        resolveTableData: (data) => {
            return {
                data: data.paginatedPageTreeNodes.nodes,
                totalCount: data.paginatedPageTreeNodes.totalCount,
            };
        },
        variables: {
            scope,
        },
    });

    return (
        <LatestContentUpdatesDashboardWidget
            tableQuery={tableQuery}
            getUrlFromPageTreeNode={(node: GQLLatestContentUpdatesQuery["paginatedPageTreeNodes"]["nodes"][0]) => {
                return `/${node.scope.domain}/${node.scope.language}/pages/pagetree/${categoryToUrlParam(node.category)}/${node.id}/edit`;
            }}
        />
    );
};
