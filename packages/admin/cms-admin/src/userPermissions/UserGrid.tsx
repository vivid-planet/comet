import { gql, useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridRenderCellParams, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

declare module "@mui/x-data-grid" {
    interface ToolbarPropsOverrides {
        toolbarAction: React.ReactNode;
    }
}

function UserPermissionsUserGridToolbar({ toolbarAction }: { toolbarAction?: React.ReactNode }) {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            {toolbarAction && <ToolbarActions>{toolbarAction}</ToolbarActions>}
        </DataGridToolbar>
    );
}
type Props = {
    toolbarAction?: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowAction?: (params: GridRenderCellParams<any, GQLUserForGridFragment, any>) => React.ReactNode;
    actionsColumnWidth?: number;
};

export const UserPermissionsUserGrid = ({ toolbarAction, rowAction, actionsColumnWidth = 52 }: Props) => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("UserPermissionsUserGrid") };
    const intl = useIntl();

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
            field: "permissionsInfo",
            flex: 1,
            pinnable: false,
            sortable: false,
            filterable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.permissionsInfo", defaultMessage: "Permissions" }),
            renderCell: ({ row }) => {
                if (row.permissionsCount === data?.availablePermissions.length) {
                    return (
                        <Chip
                            color="primary"
                            label={<FormattedMessage id="comet.userPermissions.allPermissions" defaultMessage="All permissions" />}
                        />
                    );
                } else if (row.permissionsCount === 0) {
                    return (
                        <Chip
                            color="secondary"
                            label={<FormattedMessage id="comet.userPermissions.noPermissions" defaultMessage="No permissions" />}
                        />
                    );
                } else {
                    return (
                        <Chip
                            color="default"
                            label={
                                <FormattedMessage
                                    id="comet.userPermissions.permissionsCount"
                                    defaultMessage="{permissionsCount} of {availablePermissionsCount} permissions"
                                    values={{
                                        permissionsCount: row.permissionsCount,
                                        availablePermissionsCount: data?.availablePermissions.length,
                                    }}
                                />
                            }
                        />
                    );
                }
            },
        },
        {
            field: "scopesInfo",
            flex: 1,
            pinnable: false,
            sortable: false,
            filterable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.contentScopesInfo", defaultMessage: "Scopes" }),
            renderCell: ({ row }) => {
                if (row.contentScopesCount === data?.availableContentScopes.length) {
                    return (
                        <Chip color="primary" label={<FormattedMessage id="comet.userPermissions.allContentScopes" defaultMessage="All scopes" />} />
                    );
                } else if (row.contentScopesCount === 0) {
                    return (
                        <Chip color="secondary" label={<FormattedMessage id="comet.userPermissions.noContentScopes" defaultMessage="No scopes" />} />
                    );
                } else {
                    return (
                        <Chip
                            color="default"
                            label={
                                <FormattedMessage
                                    id="comet.userPermissions.contentScopesCount"
                                    defaultMessage="{contentScopesCount} of {availableContentScopesCount} scopes"
                                    values={{
                                        contentScopesCount: row.contentScopesCount,
                                        availableContentScopesCount: data?.availableContentScopes.length,
                                    }}
                                />
                            }
                        />
                    );
                }
            },
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            align: "right",
            pinned: "right",
            width: actionsColumnWidth,
            disableExport: true,
            renderCell: (params) => {
                return <> {rowAction && rowAction(params)}</>;
            },
        },
    ];

    const { data, loading, error } = useQuery<GQLUserGridQuery, GQLUserGridQueryVariables>(
        gql`
            query UserGrid($offset: Int, $limit: Int, $filter: UserPermissionsUserFilter, $sort: [UserPermissionsUserSort!], $search: String) {
                users: userPermissionsUsers(offset: $offset, limit: $limit, filter: $filter, sort: $sort, search: $search) {
                    nodes {
                        ...UserForGrid
                    }
                    totalCount
                }
                availablePermissions: userPermissionsAvailablePermissions
                availableContentScopes: userPermissionsAvailableContentScopes
            }
            fragment UserForGrid on UserPermissionsUser {
                id
                name
                email
                permissionsCount
                contentScopesCount
            }
        `,
        {
            variables: {
                ...muiGridFilterToGql(columns, dataGridProps.filterModel),
                offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
                limit: dataGridProps.paginationModel.pageSize ?? 0,
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
            slots={{
                toolbar: UserPermissionsUserGridToolbar,
            }}
            slotProps={{
                toolbar: {
                    toolbarAction,
                },
            }}
        />
    );
};

const NameBox = styled("div")({
    fontWeight: "bold",
    fontSize: "small",
});
