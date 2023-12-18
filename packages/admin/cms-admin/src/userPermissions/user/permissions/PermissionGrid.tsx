import { gql, useQuery } from "@apollo/client";
import { TableDeleteButton, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Add, Delete, Edit, Info, Reject } from "@comet/admin-icons";
import { Button, Card, Chip, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import { differenceInDays, parseISO } from "date-fns";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import { OverrideContentScopesDialog } from "./OverrideContentScopesDialog";
import { PermissionDialog } from "./PermissionDialog";
import { GQLPermissionForGridFragment, GQLPermissionsQuery, GQLPermissionsQueryVariables, namedOperations } from "./PermissionGrid.generated";

export const PermissionGrid: React.FC<{
    userId: string;
}> = ({ userId }) => {
    const intl = useIntl();
    const [permissionId, setPermissionId] = React.useState<string | "add" | null>(null);
    const [overrideContentScopesId, setOverrideContentScopesId] = React.useState<string | null>(null);

    const { data, loading, error } = useQuery<GQLPermissionsQuery, GQLPermissionsQueryVariables>(
        gql`
            query Permissions($userId: String!) {
                permissions: userPermissionsPermissionList(userId: $userId) {
                    ...PermissionForGrid
                }
            }
            fragment PermissionForGrid on UserPermission {
                id
                permission
                source
                validFrom
                validTo
                reason
                requestedBy
                approvedBy
            }
        `,
        {
            variables: {
                userId,
            },
        },
    );

    const columns: GridColDef<GQLPermissionForGridFragment>[] = [
        {
            field: "name",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.permission", defaultMessage: "Permission" }),
            renderCell: ({ row }) => (
                <>
                    <Typography variant="h6">
                        <FormattedMessage id={`permission.${row.permission}`} defaultMessage={camelCaseToHumanReadable(row.permission)} />
                    </Typography>
                </>
            ),
        },
        {
            field: "source",
            width: 100,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.source", defaultMessage: "Source" }),
        },
        {
            field: "validityPeriod",
            width: 200,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.validityPeriod", defaultMessage: "Validity period" }),
            renderCell: ({ row }) =>
                `${row.validFrom ? new Date(row.validFrom).toLocaleDateString() : "∞"} - ${
                    row.validTo ? new Date(row.validTo).toLocaleDateString() : "∞"
                }`,
        },
        {
            field: "status",
            flex: 1,
            filterable: false,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.status", defaultMessage: "Status" }),
            renderCell: ({ row }) => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {row.validTo && differenceInDays(parseISO(row.validTo), new Date()) < 0 && (
                        <Chip
                            icon={<Reject />}
                            color="error"
                            label={<FormattedMessage id="comet.userPermissions.expired" defaultMessage="Expired" />}
                        />
                    )}
                    {row.validTo &&
                        differenceInDays(parseISO(row.validTo), new Date()) >= 0 &&
                        differenceInDays(parseISO(row.validTo), new Date()) < 30 && (
                            <Chip
                                icon={<Info />}
                                color="warning"
                                label={<FormattedMessage id="comet.userPermissions.expiringSoon" defaultMessage="Expiring soon" />}
                            />
                        )}
                </div>
            ),
        },
        {
            field: "overrideContentScopes",
            headerName: "",
            width: 175,
            sortable: false,
            pinnable: false,
            filterable: false,
            renderCell: ({ row }) =>
                row.source !== "BY_RULE" && (
                    <Button onClick={() => setOverrideContentScopesId(row.id)}>
                        <FormattedMessage id="comet.userPermissions.overrideContentScopes" defaultMessage="Override Content-Scopes" />
                    </Button>
                ),
        },
        {
            field: "edit",
            width: 60,
            headerName: "",
            sortable: false,
            pinnable: false,
            filterable: false,
            renderCell: ({ row }) => (
                <IconButton
                    onClick={() => {
                        setPermissionId(row.id);
                    }}
                >
                    <Edit color="primary" />
                </IconButton>
            ),
        },
        {
            field: "delete",
            width: 60,
            headerName: "",
            sortable: false,
            pinnable: false,
            filterable: false,
            renderCell: ({ row }) =>
                row.source !== "BY_RULE" && (
                    <TableDeleteButton
                        icon={<Delete />}
                        mutation={gql`
                            mutation DeletePermission($id: ID!) {
                                userPermissionsDeletePermission(id: $id)
                            }
                        `}
                        selectedId={`${row.id}`}
                        text=""
                        refetchQueries={[namedOperations.Query.Permissions]}
                    />
                ),
        },
    ];

    if (error) throw new Error(error.message);

    return (
        <Card>
            <DataGrid<GQLPermissionForGridFragment>
                autoHeight={true}
                rows={data?.permissions ?? []}
                columns={columns}
                rowCount={data?.permissions.length ?? 0}
                loading={loading}
                getRowHeight={() => "auto"}
                sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" } }}
                components={{
                    Toolbar: () => (
                        <GridToolbar>
                            <ToolbarTitleItem>
                                <FormattedMessage id="comet.userPermissions.permissions" defaultMessage="Permissions" />
                            </ToolbarTitleItem>
                            <ToolbarFillSpace />
                            <ToolbarActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => {
                                        setPermissionId("add");
                                    }}
                                >
                                    <FormattedMessage id="comet.userPermissions.addPermission" defaultMessage="Add new permission" />
                                </Button>
                            </ToolbarActions>
                        </GridToolbar>
                    ),
                }}
            />
            {overrideContentScopesId && (
                <OverrideContentScopesDialog
                    userId={userId}
                    permissionId={overrideContentScopesId}
                    handleDialogClose={() => setOverrideContentScopesId(null)}
                />
            )}
            {permissionId && <PermissionDialog userId={userId} permissionId={permissionId} handleDialogClose={() => setPermissionId(null)} />}
        </Card>
    );
};

const GridToolbar = styled(GridToolbarContainer)`
    padding: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;
