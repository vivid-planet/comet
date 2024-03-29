import { gql, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    GridFilterButton,
    Toolbar,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { apolloStoryDecorator } from "../../../apollo-story.decorator";
import { storyRouterDecorator } from "../../../story-router.decorator";

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
    });
