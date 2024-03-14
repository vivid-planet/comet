import { TypedDocumentNode, useApolloClient, useQuery } from "@apollo/client";
import { messages, Tooltip, useDataGridRemote } from "@comet/admin";
import { ArrowRight, OpenNewTab, Reload } from "@comet/admin-icons";
import { IconButton, LinearProgress, tablePaginationClasses } from "@mui/material";
import { LabelDisplayedRowsArgs } from "@mui/material/TablePagination/TablePagination";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../contentScope/Provider";
import { GQLDependency } from "../graphql.generated";
import { useDependenciesConfig } from "./DependenciesConfig";
import * as sc from "./DependencyList.sc";
import { DependencyInterface } from "./types";

export type DependencyItem = Pick<GQLDependency, "name" | "secondaryInformation" | "rootColumnName" | "jsonPath"> & {
    id: string;
    graphqlObjectType: string;
};

type Dependency = Pick<GQLDependency, "targetGraphqlObjectType" | "targetId" | "rootColumnName" | "jsonPath" | "name" | "secondaryInformation">;
type Dependent = Pick<GQLDependency, "rootGraphqlObjectType" | "rootId" | "rootColumnName" | "jsonPath" | "name" | "secondaryInformation">;

interface Query {
    item: {
        id: string;
        dependencies?: { totalCount: number; nodes: Array<Dependency> };
        dependents?: { totalCount: number; nodes: Array<Dependent> };
    };
}

type QueryVariables = {
    offset: number;
    limit: number;
    forceRefresh?: boolean;
};

interface DependencyListProps {
    query: TypedDocumentNode<Query, QueryVariables>;
    variables: Record<string, unknown>;
}

const pageSize = 10;

export const DependencyList = ({ query, variables }: DependencyListProps) => {
    const intl = useIntl();
    const entityDependencyMap = useDependenciesConfig();
    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const history = useHistory();

    const dataGridProps = useDataGridRemote({ queryParamsPrefix: "dependencies", pageSize: pageSize });

    const { data, loading, error, refetch } = useQuery<Query, QueryVariables>(query, {
        variables: {
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            ...variables,
        },
    });

    const columns: GridColDef<DependencyItem>[] = [
        {
            field: "nameInfo",
            headerName: intl.formatMessage({ id: "comet.dependencies.dataGrid.nameAndInfo", defaultMessage: "Name/Info" }),
            sortable: false,
            flex: 1,
            renderCell: ({ row }) => {
                return (
                    <sc.NameInfoWrapper>
                        <sc.NameInfoTypography color="text.primary">{row.name ?? <FormattedMessage {...messages.unknown} />}</sc.NameInfoTypography>
                        <sc.NameInfoTypography color="text.secondary">{row.secondaryInformation}</sc.NameInfoTypography>
                    </sc.NameInfoWrapper>
                );
            },
        },
        {
            field: "type",
            headerName: intl.formatMessage({ id: "comet.dependencies.dataGrid.type", defaultMessage: "Type" }),
            sortable: false,
            renderCell: ({ row }) => <sc.StyledChip label={entityDependencyMap[row.graphqlObjectType]?.displayName ?? row.graphqlObjectType} />,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            renderCell: ({ row }) => {
                const dependencyObject = entityDependencyMap[row.graphqlObjectType] as DependencyInterface | undefined;

                if (dependencyObject === undefined) {
                    if (process.env.NODE_ENV === "development") {
                        console.warn(
                            `Cannot load URL because no implementation of DependencyInterface for ${row.graphqlObjectType} was provided via the DependenciesConfig`,
                        );
                    }
                    return <FormattedMessage id="comet.dependencies.dataGrid.cannotLoadUrl" defaultMessage="Cannot determine URL" />;
                }

                const loadUrl = async () => {
                    const route = await dependencyObject.resolveRoute({
                        rootColumnName: row.rootColumnName,
                        jsonPath: row.jsonPath,
                        apolloClient,
                        id: row.id,
                    });
                    return contentScope.match.url + route;
                };

                return (
                    <div style={{ display: "flex" }}>
                        <IconButton
                            onClick={async () => {
                                const url = await loadUrl();
                                window.open(url, "_blank");
                            }}
                        >
                            <OpenNewTab />
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                const url = await loadUrl();

                                history.push(url);
                            }}
                        >
                            <ArrowRight />
                        </IconButton>
                    </div>
                );
            },
        },
    ];

    let items: DependencyItem[] = [];
    let totalCount = 0;

    if (data?.item.dependencies) {
        items = data.item.dependencies.nodes.map((node) => ({
            ...node,
            graphqlObjectType: node.targetGraphqlObjectType,
            id: node.targetId,
        }));
        totalCount = data.item.dependencies.totalCount;
    } else if (data?.item.dependents) {
        items = data.item.dependents.nodes.map((node) => ({
            ...node,
            graphqlObjectType: node.rootGraphqlObjectType,
            id: node.rootId,
        }));
        totalCount = data.item.dependents.totalCount;
    } else if (!loading) {
        throw new Error("Neither dependencies nor dependents is defined");
    }

    return (
        <>
            <sc.Toolbar>
                <Tooltip trigger="hover" title={<FormattedMessage id="comet.dependencies.dataGrid.reloadTooltip" defaultMessage="Reload" />}>
                    <IconButton
                        onClick={() => {
                            refetch({
                                forceRefresh: true,
                            });
                        }}
                    >
                        <Reload />
                    </IconButton>
                </Tooltip>
            </sc.Toolbar>
            <DataGrid
                {...dataGridProps}
                components={{
                    LoadingOverlay: loading && data ? LinearProgress : undefined,
                }}
                componentsProps={{
                    pagination: {
                        labelDisplayedRows: DisplayedRows,
                        sx: {
                            flexGrow: 1,
                            [`& .${tablePaginationClasses.spacer}`]: {
                                width: 0,
                                flex: 0,
                            },
                            [`& .${tablePaginationClasses.displayedRows}`]: {
                                flexGrow: 1,
                            },
                            [`& .${tablePaginationClasses.toolbar} .${tablePaginationClasses.actions}`]: {
                                marginLeft: "5px",
                            },
                        },
                    },
                }}
                rowHeight={60}
                disableSelectionOnClick
                disableColumnMenu
                loading={loading}
                error={error}
                autoHeight={true}
                columns={columns}
                rows={items}
                rowCount={totalCount}
                getRowId={(row) => {
                    return `${row.id}_${row.rootColumnName}_${row.jsonPath}`;
                }}
            />
        </>
    );
};

const DisplayedRows = ({ from, to, count, page }: LabelDisplayedRowsArgs) => {
    const numPages = Math.ceil(count / pageSize) > 0 ? Math.ceil(count / pageSize) : 1;

    return (
        <sc.DisplayedRowsWrapper>
            <div>
                <FormattedMessage
                    id="comet.dependencies.dataGrid.currentItems"
                    defaultMessage="{from} - {to} of {count} Items"
                    values={{ from, to, count }}
                />
            </div>
            <sc.PageLabel>
                <FormattedMessage
                    id="comet.dependencies.dataGrid.currentPage"
                    defaultMessage="Page {page} of {numPages}"
                    values={{ page: page + 1, numPages }}
                />
            </sc.PageLabel>
        </sc.DisplayedRowsWrapper>
    );
};
