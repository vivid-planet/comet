import { gql, useQuery } from "@apollo/client";
import {
    Button,
    CancelButton,
    CrudMoreActionsMenu,
    DataGridToolbar,
    FieldSet,
    FillSpace,
    type GridColDef,
    Loading,
    messages,
    SaveBoundary,
    SaveBoundarySaveButton,
} from "@comet/admin";
import { Select } from "@comet/admin-icons";
import {
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogTitle,
    Typography,
} from "@mui/material";
import { DataGrid, type GridToolbarProps } from "@mui/x-data-grid";
import isEqual from "lodash.isequal";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import { type GQLContentScopesQuery, type GQLContentScopesQueryVariables } from "./ContentScopeGrid.generated";
import { SelectScopesDialogContent } from "./selectScopesDialogContent/SelectScopesDialogContent";
import { type GQLAvailableContentScopesQuery } from "./selectScopesDialogContent/SelectScopesDialogContent.generated";

type ContentScope = {
    [key: string]: string;
};

interface ToolbarProps extends GridToolbarProps {
    toolbarAction?: ReactNode;
}

export const ContentScopeGrid = ({ userId }: { userId: string }) => {
    const intl = useIntl();
    const [open, setOpen] = useState(false);

    const { data, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                userContentScopes: userPermissionsContentScopes(userId: $userId)
                userContentScopesSkipManual: userPermissionsContentScopes(userId: $userId, skipManual: true)
                availableContentScopes: userPermissionsAvailableContentScopes {
                    scope
                    label
                }
            }
        `,
        {
            variables: { userId },
        },
    );

    if (error) throw new Error(error.message);

    if (!data) {
        return <Loading />;
    }

    const columns: GridColDef<ContentScope>[] = generateGridColumnsFromContentScopeProperties(data.availableContentScopes);

    function ContentScopeGridToolbar({ toolbarAction }: ToolbarProps) {
        return (
            <DataGridToolbar>
                <FillSpace />
                <CrudMoreActionsMenu />
                {toolbarAction}
            </DataGridToolbar>
        );
    }

    return (
        <FieldSet title={intl.formatMessage({ id: "comet.userPermissions.assignedScopes", defaultMessage: "Assigned Scopes" })}>
            <DataGrid
                autoHeight={true}
                rows={data.userContentScopes}
                columns={columns}
                rowCount={data?.userContentScopes.length ?? 0}
                loading={false}
                getRowHeight={() => "auto"}
                getRowId={(row) => JSON.stringify(row)}
                slots={{
                    toolbar: ContentScopeGridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        toolbarAction: (
                            <Button startIcon={<Select />} onClick={() => setOpen(true)} variant="primary">
                                <FormattedMessage id="comet.userPermissions.selectScopes" defaultMessage="Assign scopes" />
                            </Button>
                        ),
                    } as ToolbarProps,
                }}
            />
            <SaveBoundary
                onAfterSave={() => {
                    setOpen(false);
                }}
            >
                <Dialog open={open} maxWidth="lg">
                    <DialogTitle>
                        <FormattedMessage id="comet.userScopes.dialog.title" defaultMessage="Select scopes" />
                    </DialogTitle>
                    <SelectScopesDialogContent
                        userId={userId}
                        userContentScopes={data.userContentScopes}
                        userContentScopesSkipManual={data.userContentScopesSkipManual}
                    />
                    <DialogActions>
                        <CancelButton onClick={() => setOpen(false)}>
                            <FormattedMessage {...messages.close} />
                        </CancelButton>
                        <SaveBoundarySaveButton />
                    </DialogActions>
                </Dialog>
            </SaveBoundary>
        </FieldSet>
    );
};

export function generateGridColumnsFromContentScopeProperties(
    availableContentScopes: GQLAvailableContentScopesQuery["availableContentScopes"],
): GridColDef[] {
    const uniquePropertyNames = Array.from(new Set(availableContentScopes.flatMap((item) => Object.keys(item.scope))));
    return uniquePropertyNames.map((propertyName) => {
        return {
            field: propertyName,
            flex: 1,
            pinnable: false,
            sortable: false,
            filterable: true,
            headerName: camelCaseToHumanReadable(propertyName),
            renderCell: ({ row }: { row: ContentScope }) => {
                const contentScopeWithLabel = availableContentScopes.find((availableContentScope) => isEqual(availableContentScope.scope, row));
                if (contentScopeWithLabel) {
                    return <Typography variant="subtitle2">{contentScopeWithLabel.label[propertyName]}</Typography>;
                } else {
                    return "-";
                }
            },
        };
    });
}
