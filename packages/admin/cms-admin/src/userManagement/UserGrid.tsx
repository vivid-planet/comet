import { gql, useQuery } from "@apollo/client";
import {
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackSwitchApiContext,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarItem,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridSelectionModel, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React from "react";
import { useIntl } from "react-intl";

import { GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

export const UserGrid: React.FC = () => {
    const dataGridProps = { ...useDataGridRemote({ pageSize: 25 }), ...usePersistentColumnState("UserGrid") };
    const intl = useIntl();
    const stackApi = React.useContext(StackSwitchApiContext);

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const columns: GridColDef<GQLUserGridQuery["users"]["nodes"][0]>[] = [
        {
            field: "name",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userManagement.name", defaultMessage: "Name" }),
            renderCell: ({ row }) => (
                <Typography>
                    <NameBox>{row.name}</NameBox>
                </Typography>
            ),
        },
        {
            field: "email",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userManagement.email", defaultMessage: "E-Mail" }),
        },
        {
            field: "language",
            flex: 0.5,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userManagement.language", defaultMessage: "Language" }),
            renderCell: ({ row }) => row.language.toUpperCase(),
        },
        {
            field: "status",
            flex: 1,
            headerName: intl.formatMessage({ id: "comet.userManagement.status", defaultMessage: "Status" }),
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            pinnable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        stackApi.activatePage("edit", params.id.toString());
                    }}
                >
                    <Edit color="primary" />
                </IconButton>
            ),
        },
    ];

    const { data, loading, error } = useQuery<GQLUserGridQuery, GQLUserGridQueryVariables>(
        gql`
            query UserGrid($offset: Int, $limit: Int, $filter: UserFilter, $sort: [UserSort!], $search: String) {
                users: userManagementUsers(offset: $offset, limit: $limit, filter: $filter, sort: $sort, search: $search) {
                    nodes {
                        id
                        name
                        email
                        language
                        status
                    }
                    totalCount
                }
            }
        `,
        {
            variables: {
                ...muiGridFilterToGql(columns, dataGridProps.filterModel),
                offset: dataGridProps.page * dataGridProps.pageSize,
                limit: dataGridProps.pageSize,
                sort: muiGridSortToGql(dataGridProps.sortModel),
            },
        },
    );

    if (error) throw new Error(error.message);

    return (
        <DataGrid
            checkboxSelection
            onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
            {...dataGridProps}
            rows={data?.users.nodes ?? []}
            columns={columns}
            rowCount={data?.users.totalCount ?? 0}
            disableSelectionOnClick
            loading={loading}
            components={{
                Toolbar: () => (
                    <Toolbar>
                        <ToolbarAutomaticTitleItem />
                        <ToolbarActions>
                            <ToolbarItem>
                                <GridToolbarQuickFilter />
                                <GridFilterButton />
                            </ToolbarItem>
                        </ToolbarActions>
                    </Toolbar>
                ),
            }}
        />
    );
};

const NameBox = styled("div")({
    fontWeight: "bold",
    fontSize: "small",
});
