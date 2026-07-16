import { gql, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
    FillSpace,
    type GridColDef,
    GridFilterButton,
    GridToolbarQuickFilter,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackSwitchApiContext,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { Chip, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { GridRenderCellParams, GridSlotsComponent, GridToolbarProps } from "@mui/x-data-grid";
import { type ReactNode, useContext, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DataGrid } from "../dataGrid/DataGrid";
import { useUserPermissionCheck } from "./hooks/currentUser";
import { ImpersonateMenuItem } from "./ImpersonateMenuItem";
import type { GQLUserAvailablePermissionsQuery, GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

interface UserPermissionsUserGridToolbarProps extends GridToolbarProps {
    toolbarAction?: ReactNode;
}
function UserPermissionsUserGridToolbar({ toolbarAction }: UserPermissionsUserGridToolbarProps) {
    return (
        <DataGridToolbar>
            <GridToolbarQuickFilter />
            <GridFilterButton />
            <FillSpace />
            {toolbarAction && <>{toolbarAction}</>}
        </DataGridToolbar>
    );
}
type Props = {
    toolbarAction?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowAction?: (params: GridRenderCellParams<any, GQLUserForGridFragment, any>) => ReactNode;
    actionsColumnWidth?: number;
};

export const UserPermissionsUserGrid = ({ toolbarAction, rowAction, actionsColumnWidth = 52 }: Props) => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("UserPermissionsUserGrid") };
    const intl = useIntl();
    const stackApi = useContext(StackSwitchApiContext);
    const isAllowed = useUserPermissionCheck();

    const { data: availablePermissions } = useQuery<GQLUserAvailablePermissionsQuery>(
        gql`
            query UserAvailablePermissions {
                permissions: userPermissionsAvailablePermissions
            }
        `,
        { skip: !isAllowed("userPermissions") },
    );

    const columns: GridColDef<GQLUserForGridFragment>[] = useMemo(() => {
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
        ];
        if (isAllowed("userPermissions")) {
            columns.push(
                {
                    field: "permission",
                    flex: 1,
                    pinnable: false,
                    sortable: false,
                    type: "singleSelect",
                    valueOptions: availablePermissions?.permissions,
                    headerName: intl.formatMessage({ id: "comet.userPermissions.permissionsInfo", defaultMessage: "Permissions" }),
                    renderCell: ({ row }) => {
                        if (row.permissionsCount === availablePermissions?.permissions.length) {
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
                                                availablePermissionsCount: availablePermissions?.permissions.length,
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
                        // No total and no "All scopes": with wildcard dimensions the number of accessible scopes can't be
                        // counted meaningfully against a total, so just show the number of accessible scopes.
                        if (row.contentScopesCount === 0) {
                            return (
                                <Chip
                                    color="secondary"
                                    label={<FormattedMessage id="comet.userPermissions.noContentScopes" defaultMessage="No scopes" />}
                                />
                            );
                        }
                        return (
                            <Chip
                                color="default"
                                label={
                                    <FormattedMessage
                                        id="comet.userPermissions.contentScopesCount"
                                        defaultMessage="{contentScopesCount, plural, one {# scope} other {# scopes}}"
                                        values={{ contentScopesCount: row.contentScopesCount }}
                                    />
                                }
                            />
                        );
                    },
                },
            );
        }
        columns.push({
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            align: "right",
            pinned: "right",
            disableExport: true,
            renderCell: (params) => (
                <>
                    {rowAction ? (
                        rowAction(params)
                    ) : (
                        <IconButton
                            onClick={() => {
                                stackApi.activatePage("edit", params.id.toString());
                            }}
                            color="primary"
                        >
                            <Edit />
                        </IconButton>
                    )}
                    {isAllowed("impersonation") && (
                        <CrudContextMenu>
                            <ImpersonateMenuItem userId={params.row.id} />
                        </CrudContextMenu>
                    )}
                </>
            ),
        });
        return columns;
    }, [intl, isAllowed, availablePermissions, stackApi, rowAction]);

    const { data, loading, error } = useQuery<GQLUserGridQuery, GQLUserGridQueryVariables>(
        gql`
            query UserGrid($offset: Int!, $limit: Int!, $filter: UserPermissionsUserFilter, $sort: [UserPermissionsUserSort!], $search: String) {
                users: userPermissionsUsers(offset: $offset, limit: $limit, filter: $filter, sort: $sort, search: $search) {
                    nodes {
                        ...UserForGrid
                    }
                    totalCount
                }
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

    const rowCount = useBufferedRowCount(data?.users.totalCount);
    if (error) {
        throw new Error(error.message);
    }

    return (
        <DataGrid<GQLUserForGridFragment>
            {...dataGridProps}
            rows={data?.users.nodes ?? []}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            slots={{
                toolbar: UserPermissionsUserGridToolbar as GridSlotsComponent["toolbar"],
            }}
            slotProps={{
                toolbar: {
                    toolbarAction: toolbarAction,
                } as UserPermissionsUserGridToolbarProps,
            }}
            showToolbar
        />
    );
};

const NameBox = styled("div")({
    fontWeight: "bold",
    fontSize: "small",
});
