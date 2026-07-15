import { gql, useMutation, useQuery } from "@apollo/client";
import {
    Button,
    CancelButton,
    DataGridToolbar,
    DeleteDialog,
    FieldSet,
    FillSpace,
    type GridColDef,
    Loading,
    messages,
    SaveBoundary,
    SaveBoundarySaveButton,
} from "@comet/admin";
import { Add, Delete } from "@comet/admin-icons";
import {
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import type { GridToolbarProps } from "@mui/x-data-grid";
import isEqual from "lodash.isequal";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DataGrid } from "../../../dataGrid/DataGrid";
import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import type {
    GQLContentScopesQuery,
    GQLContentScopesQueryVariables,
    GQLDeleteContentScopeMutation,
    GQLDeleteContentScopeMutationVariables,
} from "./ContentScopeGrid.generated";
import { SelectScopesDialogContent } from "./selectScopesDialogContent/SelectScopesDialogContent";
import type { GQLAvailableContentScopesQuery } from "./selectScopesDialogContent/SelectScopesDialogContent.generated";

type ContentScope = {
    [key: string]: string;
};

/**
 * Wildcard value a content scope dimension can have when `getContentScopesForUser` grants access to any value for it.
 * Must match `UserPermissions.allValues` in `@comet/cms-api`.
 */
const contentScopeAllValues = "*";

interface ToolbarProps extends GridToolbarProps {
    toolbarAction?: ReactNode;
}

function ContentScopeGridToolbar({ toolbarAction }: ToolbarProps) {
    return (
        <DataGridToolbar>
            <FillSpace />
            {toolbarAction}
        </DataGridToolbar>
    );
}

export const ContentScopeGrid = ({ userId }: { userId: string }) => {
    const intl = useIntl();
    const [open, setOpen] = useState(false);
    const [scopeToDelete, setScopeToDelete] = useState<ContentScope | null>(null);

    const [deleteContentScope] = useMutation<GQLDeleteContentScopeMutation, GQLDeleteContentScopeMutationVariables>(gql`
        mutation DeleteContentScope($userId: String!, $input: UserContentScopesInput!) {
            userPermissionsUpdateContentScopes(userId: $userId, input: $input)
        }
    `);

    const { data, error } = useQuery<GQLContentScopesQuery, GQLContentScopesQueryVariables>(
        gql`
            query ContentScopes($userId: String!) {
                userContentScopes: userPermissionsContentScopes(userId: $userId)
                userContentScopesSkipManual: userPermissionsContentScopes(userId: $userId, skipManual: true)
                availableContentScopes: userPermissionsAvailableContentScopes {
                    scope
                    label
                }
                availableContentScopeDimensions: userPermissionsAvailableContentScopeDimensions {
                    name
                    label
                }
            }
        `,
        {
            variables: { userId },
        },
    );

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return <Loading />;
    }

    // A user has all content scopes (e.g. an admin) when the rule-based scopes cover every available content scope. Such a
    // user also has all values for dimensions that are not part of the available content scopes (e.g. an optional dimension).
    const hasAllContentScopes =
        data.availableContentScopes.length > 0 &&
        data.availableContentScopes.every((availableContentScope) =>
            data.userContentScopesSkipManual.some((scope) => isEqual(scope, availableContentScope.scope)),
        );

    // A scope is rule-based (as opposed to manually assigned) when it is part of the scopes granted by rule. Only manually
    // assigned scopes can be deleted here.
    const isRuleBasedScope = (scope: ContentScope) => data.userContentScopesSkipManual.some((ruleBasedScope) => isEqual(ruleBasedScope, scope));

    const handleDeleteScope = async (scope: ContentScope) => {
        const remainingManualContentScopes = data.userContentScopes.filter(
            (contentScope) => !isRuleBasedScope(contentScope) && !isEqual(contentScope, scope),
        );
        await deleteContentScope({
            variables: { userId, input: { contentScopes: remainingManualContentScopes } },
            refetchQueries: ["ContentScopes"],
            awaitRefetchQueries: true,
        });
    };

    const columns: GridColDef<ContentScope>[] = [
        ...generateGridColumnsFromContentScopeProperties(data.availableContentScopes, {
            contentScopes: data.userContentScopes as ContentScope[],
            dimensions: data.availableContentScopeDimensions,
            hasAllContentScopes,
        }),
        {
            field: "source",
            width: 200,
            pinnable: false,
            sortable: false,
            filterable: false,
            headerName: intl.formatMessage({ id: "comet.userPermissions.source", defaultMessage: "Assignment type" }),
            renderCell: ({ row }) =>
                isRuleBasedScope(row) ? (
                    <FormattedMessage id="comet.userPermissions.assignmentType.byRule" defaultMessage="By rule" />
                ) : (
                    <FormattedMessage id="comet.userPermissions.assignmentType.manual" defaultMessage="Manual" />
                ),
        },
        {
            field: "actions",
            headerName: "",
            width: 52,
            align: "right",
            pinnable: false,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) =>
                isRuleBasedScope(row) ? null : (
                    <IconButton onClick={() => setScopeToDelete(row)}>
                        <Delete />
                    </IconButton>
                ),
        },
    ];

    const toolbarSlotProps: ToolbarProps = {
        toolbarAction: (
            <Button startIcon={<Add />} onClick={() => setOpen(true)} variant="primary">
                <FormattedMessage id="comet.userPermissions.addScope" defaultMessage="Add scope" />
            </Button>
        ),
    };

    return (
        <FieldSet title={intl.formatMessage({ id: "comet.userPermissions.assignedScopes", defaultMessage: "Assigned Scopes" })} disablePadding>
            <DataGrid
                rows={data.userContentScopes}
                columns={columns}
                rowCount={data?.userContentScopes.length ?? 0}
                loading={false}
                getRowId={(row) => JSON.stringify(row)}
                slots={{
                    toolbar: ContentScopeGridToolbar,
                }}
                slotProps={{
                    toolbar: toolbarSlotProps,
                }}
                showToolbar
            />
            <SaveBoundary
                onAfterSave={() => {
                    setOpen(false);
                }}
            >
                <Dialog open={open} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <FormattedMessage id="comet.userPermissions.addScope" defaultMessage="Add scope" />
                    </DialogTitle>
                    <DialogContent>
                        <SelectScopesDialogContent
                            userId={userId}
                            userContentScopes={data.userContentScopes}
                            userContentScopesSkipManual={data.userContentScopesSkipManual}
                        />
                    </DialogContent>
                    <DialogActions>
                        <CancelButton onClick={() => setOpen(false)}>
                            <FormattedMessage {...messages.close} />
                        </CancelButton>
                        <SaveBoundarySaveButton startIcon={<Add />}>
                            <FormattedMessage id="comet.userPermissions.addScope" defaultMessage="Add scope" />
                        </SaveBoundarySaveButton>
                    </DialogActions>
                </Dialog>
            </SaveBoundary>
            <DeleteDialog
                dialogOpen={scopeToDelete !== null}
                deleteType="remove"
                onCancel={() => setScopeToDelete(null)}
                onDelete={async () => {
                    if (scopeToDelete !== null) {
                        await handleDeleteScope(scopeToDelete);
                    }
                    setScopeToDelete(null);
                }}
            />
        </FieldSet>
    );
};

export function generateGridColumnsFromContentScopeProperties(
    availableContentScopes: GQLAvailableContentScopesQuery["availableContentScopes"],
    {
        contentScopes = [],
        dimensions = [],
        hasAllContentScopes = false,
    }: {
        contentScopes?: ContentScope[];
        dimensions?: Array<{ name: string; label: string }>;
        hasAllContentScopes?: boolean;
    } = {},
): GridColDef[] {
    const dimensionLabelsByName = new Map(dimensions.map((dimension) => [dimension.name, dimension.label]));
    // Declared dimensions are the primary source so that dimensions not present in any value (e.g. an optional wildcard-only
    // dimension) still get a column; keys of the available and displayed scopes are unioned in as a fallback.
    const uniquePropertyNames = Array.from(
        new Set([
            ...dimensions.map((dimension) => dimension.name),
            ...availableContentScopes.flatMap((item) => Object.keys(item.scope)),
            ...contentScopes.flatMap((scope) => Object.keys(scope)),
        ]),
    );
    return uniquePropertyNames.map((propertyName, index) => {
        return {
            field: propertyName,
            flex: 1,
            pinnable: false,
            sortable: false,
            filterable: true,
            headerName: dimensionLabelsByName.get(propertyName) ?? camelCaseToHumanReadable(propertyName),
            renderCell: ({ row }: { row: ContentScope }) => {
                const value = row[propertyName];
                const isAllValues =
                    value === contentScopeAllValues ||
                    // A user with all content scopes also has all values for dimensions that are not part of the available
                    // content scopes (e.g. an optional dimension), which are therefore not set on the scope.
                    (value === undefined && hasAllContentScopes);
                if (isAllValues) {
                    return (
                        <Typography variant={index === 0 ? "subtitle2" : "body2"}>
                            <FormattedMessage id="comet.userPermissions.allContentScopeValues" defaultMessage="All" />
                        </Typography>
                    );
                }

                // A wildcard dimension prevents the whole scope from matching an available scope, so labels are resolved per dimension
                const label = availableContentScopes.find((availableContentScope) => availableContentScope.scope[propertyName] === value)?.label[
                    propertyName
                ];
                if (label) {
                    return <Typography variant={index === 0 ? "subtitle2" : "body2"}>{label}</Typography>;
                }
                // A value without a label is a free value of a dimension that is not part of the available content scopes
                if (value !== undefined) {
                    return <Typography variant={index === 0 ? "subtitle2" : "body2"}>{String(value)}</Typography>;
                }
                return "-";
            },
        };
    });
}
