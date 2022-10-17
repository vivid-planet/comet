import { gql } from "@apollo/client";
import { Table, TableQuery, useTableQuery } from "@comet/admin";
import { ArrowRight } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { GQLLatestContentUpdatesQuery, GQLLatestContentUpdatesQueryVariables } from "@src/graphql.generated";
import { categoryToUrlParam } from "@src/utils/pageTreeNodeCategoryMapping";
import * as React from "react";
import { FormattedDate, FormattedTime, useIntl } from "react-intl";
import { Link } from "react-router-dom";

const LATEST_CONTENT_UPDATES_QUERY = gql`
    query LatestContentUpdates {
        pages(offset: 0, limit: 5, sortColumnName: "updatedAt", sortDirection: DESC) {
            nodes {
                id
                updatedAt
                pageTreeNode {
                    id
                    name
                    path
                    scope {
                        domain
                        language
                    }
                    category
                }
            }
            totalCount
        }
    }
`;

export const LatestContentUpdates: React.FC = () => {
    const intl = useIntl();

    const { tableData, api, loading, error } = useTableQuery<GQLLatestContentUpdatesQuery, GQLLatestContentUpdatesQueryVariables>()(
        LATEST_CONTENT_UPDATES_QUERY,
        {
            resolveTableData: (data) => {
                // in rare cases, pages can exist without being linked in the pagetree (e.g. pasting with conflicts), we hide them
                const pageTreeNodesLinkedInPageTree = data.pages.nodes.filter((pageTreeNode) => pageTreeNode.pageTreeNode);

                return {
                    data: pageTreeNodesLinkedInPageTree,
                    totalCount: pageTreeNodesLinkedInPageTree.length,
                };
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
                                name: "pageTreeNode.name",
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
                                    if (!row.pageTreeNode) {
                                        return null;
                                    }

                                    return (
                                        <IconButton
                                            component={Link}
                                            to={`/${row.pageTreeNode.scope.domain}/${
                                                row.pageTreeNode.scope.language
                                            }/pages/pagetree/${categoryToUrlParam(row.pageTreeNode.category)}/${row.pageTreeNode.id}/edit`}
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
