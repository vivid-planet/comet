import { gql, useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    CrudMoreActionsMenu,
    DataGridToolbar,
    FileIcon,
    FillSpace,
    GridColDef,
    GridFilterButton,
    Loading,
    muiGridFilterToGql,
    RowActionsItem,
    Toolbar,
    ToolbarActions,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridExcelExport,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Delete, Download, Favorite, MoreVertical, Move } from "@comet/admin-icons";
import { Divider, Menu, MenuItem, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useRef, useState } from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { exampleColumns, exampleRows } from "../../../helpers/ExampleDataGrid";
import { storyRouterDecorator } from "../../../story-router.decorator";

type Launch = {
    id: string;
    mission_name: string;
    launch_date_local: Date;
};

interface LaunchesPastResultData {
    data: Launch[];
    result: { totalCount: number };
}

interface QueryVariables {
    offset: number;
    limit: number;
    sort?: string;
    order?: string | null;
}

interface GQLQuery {
    __typename?: "Query";
    launchesPastResult: LaunchesPastResultData;
}

export default {
    title: "Docs/Components/DataGrid",
    decorators: [storyRouterDecorator(), apolloStoryDecorator("/graphql")],
};

export const UseDataGridRemote = {
    render: () => {
        const columns: GridColDef[] = [
            {
                field: "mission_name",
                headerName: "Mission Name",
            },
            {
                field: "launch_date_local",
                headerName: "Launch Date",
                type: "dateTime",
            },
        ];

        const dataGridProps = useDataGridRemote();

        const { data, loading, error } = useQuery(
            gql`
                query LaunchesPast($limit: Int, $offset: Int, $sort: String, $order: String) {
                    launchesPastResult(limit: $limit, offset: $offset, sort: $sort, order: $order) {
                        data {
                            id
                            mission_name
                            launch_date_local
                        }
                        result {
                            totalCount
                        }
                    }
                }
            `,
            {
                variables: {
                    limit: dataGridProps.pageSize,
                    offset: dataGridProps.page * dataGridProps.pageSize,
                    sort: dataGridProps.sortModel[0]?.field,
                    order: dataGridProps.sortModel[0]?.sort,
                },
            },
        );

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} error={error} />
            </Box>
        );
    },
    name: "useDataGridRemote",
};

export const UseDataGridRemoteInitialSort = {
    render: () => {
        const columns: GridColDef[] = [
            {
                field: "mission_name",
                headerName: "Mission Name",
            },
            {
                field: "launch_date_local",
                headerName: "Launch Date",
                type: "dateTime",
            },
        ];

        const dataGridProps = useDataGridRemote({ initialSort: [{ field: "mission_name", sort: "desc" }] });

        const { data, loading, error } = useQuery(
            gql`
                query LaunchesPast($limit: Int, $offset: Int, $sort: String, $order: String) {
                    launchesPastResult(limit: $limit, offset: $offset, sort: $sort, order: $order) {
                        data {
                            id
                            mission_name
                            launch_date_local
                        }
                        result {
                            totalCount
                        }
                    }
                }
            `,
            {
                variables: {
                    limit: dataGridProps.pageSize,
                    offset: dataGridProps.page * dataGridProps.pageSize,
                    sort: dataGridProps.sortModel[0]?.field,
                    order: dataGridProps.sortModel[0]?.sort,
                },
            },
        );

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} error={error} />
            </Box>
        );
    },
    name: "useDataGridRemoteInitialSort",
};

export const UseDataGridRemoteInitialFilter = {
    render: () => {
        const columns: GridColDef[] = [
            {
                field: "mission_name",
                headerName: "Mission Name",
                flex: 1,
            },
            {
                field: "launch_date_local",
                headerName: "Launch Date",
                type: "dateTime",
                flex: 1,
            },
        ];

        const dataGridProps = useDataGridRemote({
            initialFilter: { items: [{ columnField: "mission_name", operatorValue: "contains", value: "able" }] },
        });

        const { data, loading, error } = useQuery(
            gql`
                query LaunchesPast($limit: Int, $offset: Int, $filter: LaunchesPastFilter) {
                    launchesPastResult(limit: $limit, offset: $offset, filter: $filter) {
                        data {
                            id
                            mission_name
                            launch_date_local
                        }
                        result {
                            totalCount
                        }
                    }
                }
            `,
            {
                variables: {
                    limit: dataGridProps.pageSize,
                    offset: dataGridProps.page * dataGridProps.pageSize,
                    filter: muiGridFilterToGql(columns, dataGridProps.filterModel).filter,
                },
            },
        );

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} error={error} />
            </Box>
        );
    },
    name: "useDataGridRemoteInitialFilter",
};

export const UsePersistentColumnState = {
    render: () => {
        const dataGridProps = usePersistentColumnState("PersColStateStory");

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={exampleRows} columns={exampleColumns} />
            </Box>
        );
    },
    name: "usePersistentColumnState",
};

export const ResponsiveColumns = {
    render: () => {
        const dataGridProps = usePersistentColumnState("ResponsiveColumnsStory");
        const theme = useTheme();

        const columns: GridColDef[] = [
            {
                field: "id",
                headerName: "ID",
                width: 50,
            },
            {
                field: "fullName",
                headerName: "Full name",
                flex: 1,
                renderCell: ({ row }) => `${row.firstName} ${row.lastName}`,
                visible: theme.breakpoints.down("md"),
            },
            {
                field: "firstName",
                headerName: "First name",
                flex: 1,
                visible: theme.breakpoints.up("md"),
            },
            {
                field: "lastName",
                headerName: "Last name",
                flex: 1,
                visible: theme.breakpoints.up("md"),
            },
        ];

        return <DataGridPro sx={{ height: 200 }} rows={exampleRows} columns={columns} {...dataGridProps} />;
    },
    name: "Responsive columns",
};

export const _GridFilterButton = {
    render: () => {
        function DemoToolbar() {
            return (
                <Toolbar>
                    <FillSpace />
                    <ToolbarItem>
                        <GridFilterButton />
                    </ToolbarItem>
                </Toolbar>
            );
        }

        return (
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={exampleRows}
                    columns={exampleColumns}
                    components={{
                        Toolbar: DemoToolbar,
                    }}
                />
            </Box>
        );
    },
    name: "GridFilterButton",
};

export const _CrudContextMenu = {
    render: () => {
        const columns: GridColDef[] = [
            {
                field: "firstName",
                headerName: "First name",
                flex: 1,
            },
            {
                field: "lastName",
                headerName: "Last name",
                flex: 1,
            },
            {
                field: "actions",
                headerName: "",
                sortable: false,
                filterable: false,
                pinned: "right",
                width: 52,
                renderCell: (params) => {
                    return (
                        <CrudContextMenu
                            url={`http://example.com/people/${params.row.id}`}
                            onPaste={async ({ input, client }) => {
                                /*
                                        await client.mutate<GQLCreatePeopleMutation, GQLCreatePeopleMutationVariables>({
                                            mutation: createPeopleMutation,
                                            variables: { input },
                                        });
                                        */
                                alert(`insert ${JSON.stringify(input)}`);
                            }}
                            onDelete={async ({ client }) => {
                                /*
                                        await client.mutate<GQLDeletePeopleMutation, GQLDeletePeopleMutationVariables>({
                                            mutation: deletePeopleMutation,
                                            variables: { id: params.row.id },
                                        });
                                        */
                                alert(`delete id ${params.row.id}`);
                            }}
                            refetchQueries={[]}
                            copyData={() => {
                                //could also use GQL Fragment:
                                //return filter<GQLPeopleListFragment>(peopleFragment, params.row);
                                return {
                                    firstName: params.row.firstName,
                                    lastName: params.row.lastName,
                                };
                            }}
                        >
                            <RowActionsItem icon={<Favorite />} onClick={() => alert(`Doing a custom action on ${params.row.firstName}`)}>
                                Custom action
                            </RowActionsItem>
                            <Divider />
                        </CrudContextMenu>
                    );
                },
            },
        ];

        return (
            <Box height={400}>
                <DataGrid rows={exampleRows} columns={columns} />
            </Box>
        );
    },
    name: "CrudContextMenu",
};

export const UseDataGridExcelExport = {
    render: () => {
        const dataGridProps = useDataGridRemote();

        const variables = {
            limit: dataGridProps.pageSize,
            offset: dataGridProps.page * dataGridProps.pageSize,
            sort: dataGridProps.sortModel[0]?.field,
            order: dataGridProps.sortModel[0]?.sort,
        };

        const columns: GridColDef[] = [
            {
                field: "mission_name",
                headerName: "Mission Name",
            },
            {
                field: "launch_date_local",
                headerName: "Launch Date",
                type: "dateTime",
            },
        ];

        const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
        const moreMenuRef = useRef<HTMLButtonElement>(null);

        const query = gql`
            query LaunchesPast($limit: Int, $offset: Int, $sort: String, $order: String) {
                launchesPastResult(limit: $limit, offset: $offset, sort: $sort, order: $order) {
                    data {
                        id
                        mission_name
                        launch_date_local
                    }
                    result {
                        totalCount
                    }
                }
            }
        `;

        const { data, loading, error } = useQuery<GQLQuery, QueryVariables | undefined>(query, {
            variables,
        });

        const exportApi = useDataGridExcelExport<Launch, GQLQuery, QueryVariables>({
            columns,
            variables,
            query,
            resolveQueryNodes: (data) => data.launchesPastResult.data,
            totalCount: data?.launchesPastResult.result.totalCount ?? 0,
            exportOptions: {
                fileName: "ExampleName",
            },
        });

        function DemoToolbar() {
            return (
                <Toolbar>
                    <FillSpace />
                    <ToolbarActions>
                        <>
                            <Button variant="textDark" ref={moreMenuRef} onClick={() => setShowMoreMenu(true)} endIcon={<MoreVertical />}>
                                More Actions
                            </Button>
                            <Menu
                                anchorEl={moreMenuRef.current}
                                open={showMoreMenu}
                                onClose={() => setShowMoreMenu(false)}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        exportApi.exportGrid();
                                        setShowMoreMenu(false);
                                    }}
                                    disabled={exportApi.loading}
                                    sx={{ display: "flex", gap: "10px" }}
                                >
                                    {exportApi.loading ? <Loading fontSize="small" /> : <FileIcon fileType="application/msexcel" />}
                                    Export
                                </MenuItem>
                            </Menu>
                        </>
                    </ToolbarActions>
                </Toolbar>
            );
        }

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    {...dataGridProps}
                    rows={rows}
                    columns={columns}
                    rowCount={rowCount}
                    loading={loading}
                    error={error}
                    components={{
                        Toolbar: DemoToolbar,
                    }}
                />
            </Box>
        );
    },
    name: "useDataGridExcelExport",
};

export const _CrudMoreActionsMenu = {
    render: () => {
        const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
        const dataGridProps = useDataGridRemote();

        function DemoToolBar() {
            return (
                <DataGridToolbar>
                    <FillSpace />
                    <ToolbarItem>
                        <CrudMoreActionsMenu
                            selectionSize={selectionModel.length}
                            overallActions={[
                                {
                                    label: "Export to excel",
                                    onClick: () => {},
                                },
                            ]}
                            selectiveActions={[
                                {
                                    label: "Move",
                                    onClick: () => {},
                                    icon: <Move />,
                                },
                                {
                                    label: "Delete",
                                    onClick: () => {},
                                    icon: <Delete />,
                                    divider: true,
                                },
                                {
                                    label: "Download",
                                    onClick: () => {},
                                    icon: <Download />,
                                },
                            ]}
                        />
                    </ToolbarItem>
                </DataGridToolbar>
            );
        }

        return (
            <Box height={600}>
                <DataGrid
                    {...dataGridProps}
                    rows={exampleRows}
                    columns={exampleColumns}
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                    components={{
                        Toolbar: DemoToolBar,
                    }}
                />
            </Box>
        );
    },
    name: "CrudMoreActionsMenu",
};
