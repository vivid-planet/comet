import { gql, useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackSwitchApiContext,
    ToolbarItem,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { IconButton, ToggleButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

export const UserGrid = () => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("UserGrid") };
    const intl = useIntl();
    const stackApi = useContext(StackSwitchApiContext);
    const [includeUsersWithoutPermissions, setIncludeUsersWithoutPermissions] = useState(false);

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
            query UserGrid(
                $offset: Int
                $limit: Int
                $filter: UserFilter
                $sort: [UserSort!]
                $search: String
                $includeUsersWithoutPermissions: Boolean
            ) {
                users: userPermissionsUsers(
                    offset: $offset
                    limit: $limit
                    filter: $filter
                    sort: $sort
                    search: $search
                    includeUsersWithoutPermissions: $includeUsersWithoutPermissions
                ) {
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
            }
        `,
        {
            variables: {
                ...muiGridFilterToGql(columns, dataGridProps.filterModel),
                offset: dataGridProps.page * dataGridProps.pageSize,
                limit: dataGridProps.pageSize,
                sort: muiGridSortToGql(dataGridProps.sortModel),
                includeUsersWithoutPermissions,
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
                    <DataGridToolbar>
                        <ToolbarItem>
                            <GridToolbarQuickFilter />
                        </ToolbarItem>
                        <ToolbarItem>
                            <GridFilterButton />
                        </ToolbarItem>
                        <ToolbarItem>
                            <ToggleButton
                                value="includeUsersWithoutPermissions"
                                selected={includeUsersWithoutPermissions}
                                onChange={() => setIncludeUsersWithoutPermissions(!includeUsersWithoutPermissions)}
                            >
                                <FormattedMessage
                                    id="comet.userPermissions.includeUsersWithoutPermissions"
                                    defaultMessage="Include users without permissions"
                                />
                            </ToggleButton>
                        </ToolbarItem>
                    </DataGridToolbar>
                ),
            }}
        />
    );
};

const NameBox = styled("div")({
    fontWeight: "bold",
    fontSize: "small",
});
