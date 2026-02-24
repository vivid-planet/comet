import { type QueryResult, type TypedDocumentNode, useApolloClient, useQuery } from "@apollo/client";
import {
    Alert,
    DataGridToolbar,
    FillSpace,
    type GridColDef,
    messages,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { ArrowRight, OpenNewTab, Reload, ThreeDotSaving } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGrid, type GridSlotsComponent, type GridToolbarProps } from "@mui/x-data-grid";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../contentScope/Provider";
import { type GQLDependency } from "../graphql.generated";
import { useDependenciesConfig } from "./dependenciesConfig";
import * as sc from "./DependenciesList.sc";
import { type DependencyInterface } from "./types";

type DependencyItem = Pick<GQLDependency, "name" | "secondaryInformation" | "rootColumnName" | "jsonPath"> & {
    id: string;
    graphqlObjectType: string;
};

type Dependency = Pick<GQLDependency, "targetGraphqlObjectType" | "targetId" | "rootColumnName" | "jsonPath" | "name" | "secondaryInformation">;

interface DependenciesListQuery {
    item: {
        id: string;
        dependencies: { totalCount: number; nodes: Array<Dependency> };
    };
}

type QueryVariables = {
    offset: number;
    limit: number;
    forceRefresh?: boolean;
};

interface DependenciesListGridToolbarProps extends GridToolbarProps {
    refetch: QueryResult<DependenciesListQuery, QueryVariables>["refetch"];
}
function DependenciesListGridToolbar({ refetch }: DependenciesListGridToolbarProps) {
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

export interface DependenciesListProps {
    query: TypedDocumentNode<DependenciesListQuery, QueryVariables>;
    variables: Record<string, unknown>;
}

export const DependenciesList = ({ query, variables }: DependenciesListProps) => {
    const intl = useIntl();
    const { entityDependencyMap } = useDependenciesConfig();
    const contentScope = useContentScope();
    const apolloClient = useApolloClient();
    const history = useHistory();

    const dataGridProps = {
        ...useDataGridRemote({
            queryParamsPrefix: "dependencies",
            pageSize,
        }),
        ...usePersistentColumnState("DependenciesList"),
    };

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

    const { data, loading, error, refetch } = useQuery<DependenciesListQuery, QueryVariables>(query, {
        variables: {
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            ...variables,
        },
    });

    if (error) throw error;

    const rowCount = useBufferedRowCount(data?.item.dependencies?.totalCount);
    const rows =
        data?.item.dependencies?.nodes.map((node) => {
            return {
                ...node,
                graphqlObjectType: node.targetGraphqlObjectType,
                id: node.targetId,
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
                    toolbar: DependenciesListGridToolbar as GridSlotsComponent["toolbar"],
                }}
                slotProps={{
                    toolbar: { refetch } as DependenciesListGridToolbarProps,
                }}
            />
            <Alert
                title={<FormattedMessage id="comet.dependencies.dependencies.info.title" defaultMessage="What are dependencies?" />}
                sx={{ marginTop: 4 }}
            >
                <FormattedMessage
                    id="comet.dependencies.dependencies.info.content"
                    defaultMessage="Dependencies are all items that this content references or uses — such as linked pages, embedded files, or other content. Use this list to review what this item depends on."
                />
            </Alert>
        </>
    );
};
