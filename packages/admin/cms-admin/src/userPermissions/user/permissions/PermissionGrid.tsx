import { gql, useQuery } from "@apollo/client";
import { Button, FillSpace, type GridColDef, TableDeleteButton, ToolbarActions, ToolbarTitleItem } from "@comet/admin";
import { Add, Delete, Edit, Info, Reject } from "@comet/admin-icons";
import { Card, Chip, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { differenceInDays, parseISO } from "date-fns";
import { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import { LabelsContext } from "../../utils/LabelsContext";
import { OverrideContentScopesDialog } from "./OverrideContentScopesDialog";
import { PermissionDialog } from "./PermissionDialog";
import {
    type GQLPermissionForGridFragment,
    type GQLPermissionsQuery,
    type GQLPermissionsQueryVariables,
    namedOperations,
} from "./PermissionGrid.generated";

export const PermissionGrid = ({ userId }: { userId: string }) => {
    const intl = useIntl();
    const [permissionId, setPermissionId] = useState<string | "add" | null>(null);
    const [overrideContentScopesId, setOverrideContentScopesId] = useState<string | null>(null);
    const { permissionLabels } = useContext(LabelsContext);

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
                overrideContentScopes
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
                <Typography variant="subtitle2">
                    {permissionLabels && permissionLabels[row.permission]
                        ? permissionLabels[row.permission]
                        : camelCaseToHumanReadable(row.permission)}
                </Typography>
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
                (row.source === "MANUAL" || row.overrideContentScopes) && (
                    <Button onClick={() => setOverrideContentScopesId(row.id)}>
                        <FormattedMessage id="comet.userPermissions.overrideContentScopes" defaultMessage="Permission-specific Content-Scopes" />
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
                    color="primary"
                >
                    <Edit />
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
                rows={data?.permissions ?? []}
                columns={columns}
                loading={loading}
                slots={{
                    toolbar: () => (
                        <GridToolbar>
                            <ToolbarTitleItem>
                                <FormattedMessage id="comet.userPermissions.permissions" defaultMessage="Permissions" />
                            </ToolbarTitleItem>
                            <FillSpace />
                            <ToolbarActions>
                                <Button
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
