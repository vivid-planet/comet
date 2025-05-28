import { gql, useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    FillSpace,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackSwitchApiContext,
    ToolbarActions,
    ToolbarItem,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Edit, ImpersonateUser } from "@comet/admin-icons";
import { Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridRenderCellParams, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { commonImpersonationMessages } from "../common/impersonation/commonImpersonationMessages";
import { useCurrentUser } from "./hooks/currentUser";
import { GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";
import { startImpersonation, stopImpersonation } from "./utils/handleImpersonation";

function UserPermissionsGridToolbar({ toolbarAction }: { toolbarAction?: React.ReactNode }) {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <FillSpace />
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
    const stackApi = useContext(StackSwitchApiContext);
    const currentUser = useCurrentUser();
    const isImpersonated = currentUser.impersonated;

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
            disableExport: true,
            renderCell: (params) => {
                const isCurrentUser = params.row.id === currentUser.id;
                return (
                    <>
                        <Tooltip
                            title={
                                isCurrentUser ? (
                                    <FormattedMessage
                                        id="comet.userPermissions.cannotImpersonateYourself"
                                        defaultMessage="You can't impersonate yourself"
                                    />
                                ) : (
                                    commonImpersonationMessages.impersonate
                                )
                            }
                        >
                            {/* span is needed for the tooltip to trigger even if the button is disabled*/}
                            <span>
                                <IconButton
                                    disabled={isCurrentUser && !isImpersonated}
                                    onClick={() => {
                                        !isCurrentUser && startImpersonation(params.row.id.toString());
                                        isCurrentUser && isImpersonated && stopImpersonation();
                                    }}
                                >
                                    <ImpersonateUser />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <IconButton
                            onClick={() => {
                                stackApi.activatePage("edit", params.id.toString());
                            }}
                            color="primary"
                        >
                            <Edit />
                        </IconButton>
                    </>
                );
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
                Toolbar: UserPermissionsGridToolbar,
            }}
            componentsProps={{
                toolbar: { toolbarAction },
            }}
        />
    );
};

const NameBox = styled("div")({
    fontWeight: "bold",
    fontSize: "small",
});
