import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackSwitchApiContext,
    ToolbarItem,
    Tooltip,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Edit, ImpersonateUser } from "@comet/admin-icons";
import { IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useCurrentUser, useUserPermissionCheck } from "./hooks/currentUser";
import { GQLUserPermissionsStartImpersonationMutation, GQLUserPermissionsStartImpersonationMutationVariables } from "./user/UserPage.generated";
import { GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

export const UserGrid = () => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("UserGrid") };
    const intl = useIntl();
    const stackApi = useContext(StackSwitchApiContext);
    const isAllowed = useUserPermissionCheck();
    const client = useApolloClient();
    const currentUser = useCurrentUser();

    const startImpersonation = async (userId: string) => {
        const result = await client.mutate<GQLUserPermissionsStartImpersonationMutation, GQLUserPermissionsStartImpersonationMutationVariables>({
            mutation: gql`
                mutation UserPermissionsStartImpersonation($userId: String!) {
                    userPermissionsStartImpersonation(userId: $userId)
                }
            `,
            variables: {
                userId,
            },
        });
        if (result.data?.userPermissionsStartImpersonation) {
            location.href = "/";
        }
    };

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
            renderCell: (params) => {
                const isCurrentUser = params.row.id === currentUser.id;
                return (
                    <>
                        {isAllowed("impersonation") && (
                            <Tooltip
                                title={
                                    isCurrentUser ? (
                                        <FormattedMessage
                                            id="comet.userPermissions.cannotImpersonate"
                                            defaultMessage="You can't impersonate yourself"
                                        />
                                    ) : (
                                        <FormattedMessage id="comet.userPermissions.impersonate" defaultMessage="Impersonate" />
                                    )
                                }
                            >
                                {/* span is needed for the tooltip to trigger even if the button is disabled*/}
                                <span>
                                    <IconButton
                                        disabled={isCurrentUser}
                                        onClick={() => {
                                            !isCurrentUser && startImpersonation(params.row.id.toString());
                                        }}
                                    >
                                        <ImpersonateUser />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                        <IconButton
                            onClick={() => {
                                stackApi.activatePage("edit", params.id.toString());
                            }}
                        >
                            <Edit color="primary" />
                        </IconButton>
                    </>
                );
            },
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
                    <DataGridToolbar>
                        <ToolbarItem>
                            <GridToolbarQuickFilter />
                        </ToolbarItem>
                        <ToolbarItem>
                            <GridFilterButton />
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
