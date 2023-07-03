import { gql, useQuery } from "@apollo/client";
import { TableDeleteButton, ToolbarActions, ToolbarFillSpace, ToolbarTitleItem } from "@comet/admin";
import { Add, Delete, Edit, Info, Reject, ToggleOn } from "@comet/admin-icons";
import { Button, Card, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PermissionContentScopesDialog } from "./PermissionContentScopesDialog";
import { PermissionDialog } from "./PermissionDialog";
import { GQLPermissionsQuery, GQLPermissionsQueryVariables, namedOperations } from "./Permissions.generated";

export const Permissions: React.FC<{
    userId: string;
}> = ({ userId }) => {
    const intl = useIntl();
    const [permissionId, setPermissionId] = React.useState<string | "add" | null>(null);
    const [contentScopeId, setContentScopeId] = React.useState<string | null>(null);

    const { data, loading, error } = useQuery<GQLPermissionsQuery, GQLPermissionsQueryVariables>(
        gql`
            query Permissions($userId: String!) {
                permissions: userManagementPermissionList(userId: $userId) {
                    id
                    permission
                    name
                    description
                    source
                    validFrom
                    validTo
                    reason
                    requestedBy
                    approvedBy
                    overrideContentScopes
                }
            }
        `,
        {
            variables: {
                userId,
            },
        },
    );

    const columns: GridColDef<GQLPermissionsQuery["permissions"][0]>[] = [
        {
            field: "name",
            flex: 1,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userManagement.permission", defaultMessage: "Permission" }),
            renderCell: ({ row }) => (
                <>
                    <Typography variant="h6">{row.name}</Typography>
                    {row.description && (
                        <Tooltip title={row.description}>
                            <IconButton>
                                <Info />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            ),
        },
        {
            field: "source",
            width: 100,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userManagement.source", defaultMessage: "Source" }),
        },
        {
            field: "validityPeriod",
            width: 200,
            pinnable: false,
            headerName: intl.formatMessage({ id: "comet.userManagement.validityPeriod", defaultMessage: "Validity period" }),
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
            headerName: intl.formatMessage({ id: "comet.userManagement.status", defaultMessage: "Status" }),
            renderCell: ({ row }) => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {row.overrideContentScopes && (
                        <Chip
                            icon={<ToggleOn />}
                            color="info"
                            label={<FormattedMessage id="comet.userManagement.overidingScopes" defaultMessage="Overriding Scopes" />}
                        />
                    )}
                    {row.validTo && new Date(row.validTo) < new Date() && (
                        <Chip
                            icon={<Reject />}
                            color="error"
                            label={<FormattedMessage id="comet.userManagement.expired" defaultMessage="Expired" />}
                        />
                    )}
                    {row.validTo && new Date(row.validTo) >= new Date() && new Date(row.validTo) < new Date(Date.now() + 3600 * 1000 * 24 * 30) && (
                        <Chip
                            icon={<Info />}
                            color="warning"
                            label={<FormattedMessage id="comet.userManagement.expiringSoon" defaultMessage="Expiring soon" />}
                        />
                    )}
                </div>
            ),
        },
        {
            field: "overrideScopes",
            headerName: "",
            width: 175,
            sortable: false,
            pinnable: false,
            filterable: false,
            renderCell: ({ row }) =>
                row.source !== "BY_RULE" && (
                    <Button onClick={() => setContentScopeId(row.id)}>
                        <FormattedMessage id="comet.userManagement.overrideScopes" defaultMessage="Override Scopes" />
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
                                userManagementDeletePermission(id: $id)
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
            <DataGrid
                checkboxSelection={true}
                autoHeight={true}
                rows={data?.permissions ?? []}
                columns={columns}
                rowCount={data?.permissions.length ?? 0}
                disableSelectionOnClick
                loading={loading}
                getRowHeight={() => "auto"}
                sx={{ "&.MuiDataGrid-root .MuiDataGrid-cell": { py: "8px" } }}
                components={{
                    Toolbar: () => (
                        <GridToolbar>
                            <ToolbarTitleItem>
                                <FormattedMessage id="comet.userManagement.permissions" defaultMessage="Permissions" />
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
                                    <FormattedMessage id="comet.userManagement.addPermission" defaultMessage="Add new permission" />
                                </Button>
                            </ToolbarActions>
                        </GridToolbar>
                    ),
                }}
            />
            {contentScopeId && (
                <PermissionContentScopesDialog userId={userId} permissionId={contentScopeId} handleDialogClose={() => setContentScopeId(null)} />
            )}
            {permissionId && <PermissionDialog userId={userId} permissionId={permissionId} handleDialogClose={() => setPermissionId(null)} />}
        </Card>
    );
};

const GridToolbar = styled(GridToolbarContainer)`
    padding: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
`;
