import { gql, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    FileIcon,
    GridFilterButton,
    Loading,
    muiGridFilterToGql,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridExcelExport,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { MoreVert } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
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

storiesOf("stories/components/DataGrid", module)
    .addDecorator(storyRouterDecorator())
    .addDecorator(apolloStoryDecorator("/graphql"))
    .add("useDataGridRemote", () => {
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
    })
    .add("useDataGridRemoteInitialSort", () => {
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
    })
    .add("useDataGridRemoteInitialFilter", () => {
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
    })
    .add("usePersistentColumnState", () => {
        const dataGridProps = usePersistentColumnState("PersColStateStory");

        return (
            <Box sx={{ height: 200, width: "100%" }}>
                <DataGrid {...dataGridProps} rows={exampleRows} columns={exampleColumns} />
            </Box>
        );
    })
    .add("GridFilterButton", () => {
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
                    components={{
                        Toolbar: DemoToolbar,
                    }}
                />
            </Box>
        );
    })
    .add("CrudContextMenu", () => {
        const columns: GridColDef[] = [
            {
                field: "firstName",
                headerName: "First name",
            },
            {
                field: "lastName",
                headerName: "Last name",
            },
            {
                field: "action",
                headerName: "",
                sortable: false,
                filterable: false,
                renderCell: (params) => {
                    return (
                        <>
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
                            />
                        </>
                    );
                },
            },
        ];

        return (
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid rows={exampleRows} columns={columns} />
            </Box>
        );
    })
    .add("useDataGridExcelExport", () => {
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
                            <Button variant="text" ref={moreMenuRef} onClick={() => setShowMoreMenu(true)} endIcon={<MoreVert />} color="info">
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
    });
