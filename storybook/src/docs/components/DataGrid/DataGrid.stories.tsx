import { gql, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    CrudMoreActionsMenu,
    DataGridToolbar,
    FileIcon,
    GridColDef,
    GridFilterButton,
    Loading,
    muiGridFilterToGql,
    RowActionsItem,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridExcelExport,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Delete, Download, Favorite, MoreVertical, Move } from "@comet/admin-icons";
import { Button, Divider, Menu, MenuItem, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
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

const exampleRows = [
    { id: 1, lastName: "Snow", firstName: "Jon" },
    { id: 2, lastName: "Lannister", firstName: "Cersei" },
    { id: 3, lastName: "Lannister", firstName: "Jaime" },
    { id: 4, lastName: "Stark", firstName: "Arya" },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys" },
    { id: 6, lastName: "Melisandre", firstName: null },
    { id: 7, lastName: "Clifford", firstName: "Ferrara" },
    { id: 8, lastName: "Frances", firstName: "Rossini" },
    { id: 9, lastName: "Roxie", firstName: "Harvey" },
];
const exampleColumns: GridColDef[] = [
    {
        field: "firstName",
        headerName: "First name",
    },
    {
        field: "lastName",
        headerName: "Last name",
    },
];

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
                    limit: dataGridProps.paginationModel.pageSize,
                    offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
                    sort: dataGridProps.sortModel[0]?.field,
                    order: dataGridProps.sortModel[0]?.sort,
                },
            },
        );

        if (error) {
            throw error;
        }

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} />
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
                    limit: dataGridProps.paginationModel.pageSize,
                    offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
                    sort: dataGridProps.sortModel[0]?.field,
                    order: dataGridProps.sortModel[0]?.sort,
                },
            },
        );

        if (error) {
            throw error;
        }

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} />
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
            initialFilter: { items: [{ field: "mission_name", operator: "contains", value: "able" }] },
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
                    limit: dataGridProps.paginationModel.pageSize,
                    offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
                    filter: muiGridFilterToGql(columns, dataGridProps.filterModel).filter,
                },
            },
        );

        const rows = data?.launchesPastResult.data ?? [];
        const rowCount = useBufferedRowCount(data?.launchesPastResult.result.totalCount);

        if (error) {
            throw error;
        }
        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} />
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
                    <ToolbarFillSpace />
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
                    slots={{
                        toolbar: DemoToolbar,
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
            limit: dataGridProps.paginationModel.pageSize,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
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

        const [showMoreMenu, setShowMoreMenu] = React.useState<boolean>(false);
        const moreMenuRef = React.useRef<HTMLButtonElement>(null);

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
                    <ToolbarFillSpace />
                    <ToolbarActions>
                        <>
                            <Button variant="text" ref={moreMenuRef} onClick={() => setShowMoreMenu(true)} endIcon={<MoreVertical />} color="info">
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

        if (error) {
            throw error;
        }
        return (
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    {...dataGridProps}
                    rows={rows}
                    columns={columns}
                    rowCount={rowCount}
                    loading={loading}
                    slots={{
                        toolbar: DemoToolbar,
                    }}
                />
            </Box>
        );
    },
    name: "useDataGridExcelExport",
};

export const _CrudMoreActionsMenu = {
    render: () => {
        return (
            <Box sx={{ height: 300, width: "100%" }}>
                <h2>Without selection:</h2>
                <DataGridToolbar>
                    <ToolbarFillSpace />
                    <ToolbarItem>
                        <CrudMoreActionsMenu
                            selectionSize={0}
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

                <h2>With selection:</h2>
                <DataGridToolbar>
                    <ToolbarFillSpace />
                    <ToolbarItem>
                        <CrudMoreActionsMenu
                            selectionSize={2}
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
            </Box>
        );
    },
    name: "CrudMoreActionsMenu",
};
