import { gql, useQuery } from "@apollo/client";
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
import { Edit, ImpersonateUser, Reset } from "@comet/admin-icons";
import { IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useCurrentUser, useUserPermissionCheck } from "./hooks/currentUser";
import { useImpersonation } from "./hooks/useImpersonation";
import { GQLUserForGridFragment, GQLUserGridQuery, GQLUserGridQueryVariables } from "./UserGrid.generated";

export const UserGrid = () => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("UserGrid") };
    const intl = useIntl();
    const stackApi = useContext(StackSwitchApiContext);
    const isAllowed = useUserPermissionCheck();
    const currentUser = useCurrentUser();
    const { startImpersonation, stopImpersonation } = useImpersonation();

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
                const isImpersonated = currentUser.impersonated;
                return (
                    <>
                        {isAllowed("impersonation") && (
                            <Tooltip
                                title={
                                    isCurrentUser ? (
                                        isImpersonated ? (
                                            <FormattedMessage id="comet.impersonate.regainIdentity" defaultMessage="Regain original identity" />
                                        ) : (
                                            <FormattedMessage id="comet.impersonate.self" defaultMessage="You can't impersonate yourself" />
                                        )
                                    ) : (
                                        <FormattedMessage id="comet.impersonate" defaultMessage="Impersonate" />
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
                                        {isCurrentUser && isImpersonated ? <Reset /> : <ImpersonateUser />}
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
