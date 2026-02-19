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
import * as sc from "./DependencyList.sc";
import { type DependencyInterface } from "./types";

type DependencyItem = Pick<GQLDependency, "name" | "secondaryInformation" | "rootColumnName" | "jsonPath"> & {
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

interface DependencyListGridToolbarProps extends GridToolbarProps {
    refetch: QueryResult<Query, QueryVariables>["refetch"];
}
function DependencyListGridToolbar({ refetch }: DependencyListGridToolbarProps) {
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
interface DependencyListProps {
    query: TypedDocumentNode<Query, QueryVariables>;
    variables: Record<string, unknown>;
}

export const DependencyList = ({ query, variables }: DependencyListProps) => {
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
        ...usePersistentColumnState("DependencyList"),
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

    const { data, loading, error, refetch } = useQuery<Query, QueryVariables>(query, {
        variables: {
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            ...variables,
        },
    });

    if (error) throw error;

    if (!loading && ((data?.item.dependencies && data?.item.dependents) || (!data?.item.dependents && !data?.item.dependencies))) {
        throw new Error("Either dependencies or dependents must be defined, but not both.");
    }

    const type: "dependencies" | "dependents" = data?.item.dependencies ? "dependencies" : "dependents";

    const rowCount = useBufferedRowCount(data?.item[type]?.totalCount);
    const rows =
        data?.item[type]?.nodes.map((node) => {
            return {
                ...node,
                graphqlObjectType: type === "dependencies" ? (node as Dependency).targetGraphqlObjectType : (node as Dependent).rootGraphqlObjectType,
                id: type === "dependencies" ? (node as Dependency).targetId : (node as Dependent).rootId,
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
                    toolbar: DependencyListGridToolbar as GridSlotsComponent["toolbar"],
                }}
                slotProps={{
                    toolbar: { refetch } as DependencyListGridToolbarProps,
                }}
            />
            <Alert title={<FormattedMessage id="comet.dam.file.dependents.info.title" defaultMessage="What are dependents?" />} sx={{ marginTop: 4 }}>
                <FormattedMessage
                    id="comet.dam.file.dependents.info.content"
                    defaultMessage="Dependents are all pages, snippets and content in which a particular asset is used, linked or included. With this list, it's easy to manage or reorganize the integration of your assets."
                />
            </Alert>
        </>
    );
};
