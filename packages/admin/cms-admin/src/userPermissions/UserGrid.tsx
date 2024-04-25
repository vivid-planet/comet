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
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import React from "react";
import { useIntl } from "react-intl";

import { GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

export const UserGrid: React.FC = () => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("UserGrid") };
    const intl = useIntl();
    const stackApi = React.useContext(StackSwitchApiContext);

    const columns: GridColDef<GQLUserForGridFragment>[] = [
        {
            field: "name",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.name", defaultMessage: "Name" }),
            renderCell: ({ row }) => (
                <NameBox>
                    <Typography>{row.name}</Typography>
                </NameBox>
            ),
        },
        {
            field: "email",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.email", defaultMessage: "E-Mail" }),
        },
        {
            field: "locale",
            flex: 0.5,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.locale", defaultMessage: "Locale" }),
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
                users: userPermissionsUsers(offset: $offset, limit: $limit, filter: $filter, sort: $sort, search: $search) {
                    nodes {
                        ...UserForGrid
                    }
                    totalCount
                }
            }
            fragment UserForGrid on User {
                id
                name
                email
                locale
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
        <DataGrid<GQLUserForGridFragment>
            {...dataGridProps}
            rows={data?.users.nodes ?? []}
            columns={columns}
            rowCount={data?.users.totalCount ?? 0}
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
