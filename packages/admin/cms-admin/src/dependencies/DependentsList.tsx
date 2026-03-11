import { type QueryResult, type TypedDocumentNode, useApolloClient, useQuery } from "@apollo/client";
import {
    Alert,
    DataGridToolbar,
    FillSpace,
    GridCellContent,
    type GridColDef,
    messages,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { ArrowRight, OpenNewTab, Reload, ThreeDotSaving } from "@comet/admin-icons";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, type GridSlotsComponent, type GridToolbarProps } from "@mui/x-data-grid";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../contentScope/Provider";
import { type GQLDependency } from "../graphql.generated";
import { useDependenciesConfig } from "./dependenciesConfig";
import { type DependencyInterface } from "./types";

type DependencyItem = Pick<GQLDependency, "name" | "secondaryInformation" | "rootColumnName" | "jsonPath"> & {
    id: string;
    graphqlObjectType: string;
};

type Dependent = Pick<GQLDependency, "rootGraphqlObjectType" | "rootId" | "rootColumnName" | "jsonPath" | "name" | "secondaryInformation">;

interface DependentsListQuery {
    item: {
        id: string;
        dependents: { totalCount: number; nodes: Array<Dependent> };
    };
}

type QueryVariables = {
    offset: number;
    limit: number;
    forceRefresh?: boolean;
};

interface DependentsListGridToolbarProps extends GridToolbarProps {
    refetch: QueryResult<DependentsListQuery, QueryVariables>["refetch"];
}
function DependentsListGridToolbar({ refetch }: DependentsListGridToolbarProps) {
    const [isRefetching, setIsRefetching] = useState<boolean>(false);

    return (
        <DataGridToolbar>
            <FillSpace />
            <Tooltip title={<FormattedMessage id="comet.dependencies.dataGrid.reloadTooltip" defaultMessage="Reload" />}>
                <IconButton
                    onClick={async () => {
                        setIsRefetching(true);
                        try {
                            await refetch({ forceRefresh: true });
                        } finally {
                            setIsRefetching(false);
                        }
                    }}
                    disabled={isRefetching}
                >
                    {isRefetching ? <ThreeDotSaving /> : <Reload />}
                </IconButton>
            </Tooltip>
        </DataGridToolbar>
    );
}

const pageSize = 10;

export interface DependentsListProps {
    query: TypedDocumentNode<DependentsListQuery, QueryVariables>;
    variables: Record<string, unknown>;
}

export const DependentsList = ({ query, variables }: DependentsListProps) => {
    const intl = useIntl();
    const { entityDependencyMap } = useDependenciesConfig();
    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const history = useHistory();

    const dataGridProps = {
        ...useDataGridRemote({
            queryParamsPrefix: "dependents",
            pageSize,
        }),
        ...usePersistentColumnState("DependentsList"),
    };

    const columns: GridColDef<DependencyItem>[] = [
        {
            field: "nameInfo",
            headerName: intl.formatMessage({ id: "comet.dependencies.dataGrid.nameAndInfo", defaultMessage: "Name/Info" }),
            sortable: false,
            flex: 1,
            renderCell: ({ row }) => (
                <GridCellContent primaryText={row.name ?? <FormattedMessage {...messages.unknown} />} secondaryText={row.secondaryInformation} />
            ),
        },
        {
            field: "type",
            headerName: intl.formatMessage({ id: "comet.dependencies.dataGrid.type", defaultMessage: "Type" }),
            sortable: false,
            renderCell: ({ row }) => <Chip label={entityDependencyMap[row.graphqlObjectType]?.displayName ?? row.graphqlObjectType} />,
        },
        {
            field: "actions",
            type: "actions",
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
                    const path = await dependencyObject.resolvePath({
                        rootColumnName: row.rootColumnName,
                        jsonPath: row.jsonPath,
                        apolloClient,
                        id: row.id,
                    });
                    return contentScope.match.url + path;
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

    const { data, loading, error, refetch } = useQuery<DependentsListQuery, QueryVariables>(query, {
        variables: {
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            ...variables,
        },
    });

    if (error) throw error;

    const rowCount = useBufferedRowCount(data?.item.dependents?.totalCount);
    const rows =
        data?.item.dependents?.nodes.map((node) => {
            return {
                ...node,
                graphqlObjectType: node.rootGraphqlObjectType,
                id: node.rootId,
            };
        }) ?? [];

    return (
        <>
            <DataGrid
                {...dataGridProps}
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                getRowId={(row) => {
                    return `${row.id}_${row.rootColumnName}_${row.jsonPath}`;
                }}
                slots={{
                    toolbar: DependentsListGridToolbar as GridSlotsComponent["toolbar"],
                }}
                slotProps={{
                    toolbar: { refetch } as DependentsListGridToolbarProps,
                }}
                showToolbar
            />
            <Alert
                title={<FormattedMessage id="comet.dependencies.dependents.info.title" defaultMessage="What are dependents?" />}
                sx={{ marginTop: 4 }}
            >
                <FormattedMessage
                    id="comet.dependencies.dependents.info.content"
                    defaultMessage="Dependents are all content items that reference or use this item — such as pages, snippets, or other content. Use this list to see where this item is used."
                />
            </Alert>
        </>
    );
};
