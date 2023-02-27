import { gql } from "@apollo/client";
import { Table, TableQuery, useTableQuery } from "@comet/admin";
import { ArrowRight } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { useContentScope } from "@src/common/ContentScopeProvider";
import { GQLLatestContentUpdatesQuery, GQLLatestContentUpdatesQueryVariables } from "@src/graphql.generated";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import * as React from "react";
import { FormattedDate, FormattedTime, useIntl } from "react-intl";
import { Link } from "react-router-dom";

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

export const LatestContentUpdates: React.FC = () => {
    const intl = useIntl();
    const { scope } = useContentScope();

    const { tableData, api, loading, error } = useTableQuery<GQLLatestContentUpdatesQuery, GQLLatestContentUpdatesQueryVariables>()(
        LATEST_CONTENT_UPDATES_QUERY,
        {
            resolveTableData: (data) => {
                return {
                    data: data.paginatedPageTreeNodes.nodes,
                    totalCount: data.paginatedPageTreeNodes.totalCount,
                };
            },
            variables: {
                scope,
            },
        },
    );

    return (
        <TableQuery api={api} loading={loading} error={error}>
            {tableData && (
                <>
                    <Table
                        {...tableData}
                        columns={[
                            {
                                name: "name",
                                header: intl.formatMessage({ id: "comet.dashboard.latestContentUpdates.name", defaultMessage: "Page Name" }),
                            },
                            {
                                name: "updatedAt",
                                header: intl.formatMessage({ id: "comet.dashboard.latestContentUpdates.updatedAt", defaultMessage: "Updated At" }),
                                render: (row) => (
                                    <div>
                                        <FormattedDate value={row.updatedAt} day="2-digit" month="2-digit" year="numeric" />
                                        {", "}
                                        <FormattedTime value={row.updatedAt} />
                                    </div>
                                ),
                            },
                            {
                                name: "jumpTo",
                                cellProps: { align: "right" },
                                render: (row) => {
                                    if (!row) {
                                        return null;
                                    }

                                    return (
                                        <IconButton
                                            component={Link}
                                            to={`/${row.scope.domain}/${row.scope.language}/pages/pagetree/${categoryToUrlParam(row.category)}/${
                                                row.id
                                            }/edit`}
                                        >
                                            <ArrowRight />
                                        </IconButton>
                                    );
                                },
                            },
                        ]}
                    />
                </>
            )}
        </TableQuery>
    );
};
