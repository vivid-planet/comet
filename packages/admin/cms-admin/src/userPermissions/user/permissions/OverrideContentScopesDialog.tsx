import { gql, useApolloClient, useQuery } from "@apollo/client";
import { Button, CancelButton, Field, FinalForm, FinalFormSwitch, type GridColDef, SaveButton } from "@comet/admin";
import { Add, Delete } from "@comet/admin-icons";
import {
    CircularProgress,
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { AddContentScopeDialog } from "./AddContentScopeDialog";
import { type ContentScope, ContentScopeDataGrid } from "./ContentScopeDataGrid";
import {
    type GQLOverrideContentScopesMutation,
    type GQLOverrideContentScopesMutationVariables,
    type GQLPermissionContentScopesQuery,
    type GQLPermissionContentScopesQueryVariables,
    namedOperations,
} from "./OverrideContentScopesDialog.generated";

interface FormSubmitData {
    overrideContentScopes: boolean;
    contentScopes: string[];
}
interface FormProps {
    permissionId: string;
    userId: string;
    handleDialogClose: () => void;
}

export const OverrideContentScopesDialog = ({ permissionId, userId, handleDialogClose }: FormProps) => {
    const client = useApolloClient();
    const [addScopeOpen, setAddScopeOpen] = useState(false);

    const submit = async (data: FormSubmitData) => {
        await client.mutate<GQLOverrideContentScopesMutation, GQLOverrideContentScopesMutationVariables>({
            mutation: gql`
                mutation OverrideContentScopes($input: UserPermissionOverrideContentScopesInput!) {
                    userPermissionsUpdateOverrideContentScopes(input: $input) {
                        id
                    }
                }
            `,
            variables: {
                input: {
                    permissionId,
                    overrideContentScopes: data.overrideContentScopes,
                    contentScopes: data.contentScopes.map((contentScope) => JSON.parse(contentScope)),
                },
            },
            refetchQueries: [namedOperations.Query.PermissionContentScopes, "Permissions"],
        });
        handleDialogClose();
    };

    const { data, error } = useQuery<GQLPermissionContentScopesQuery, GQLPermissionContentScopesQueryVariables>(
        gql`
            query PermissionContentScopes($permissionId: ID!, $userId: String!) {
                availableContentScopes: userPermissionsAvailableContentScopes {
                    scope
                    label
                }
                availableContentScopeDimensions: userPermissionsAvailableContentScopeDimensions {
                    name
                    label
                }
                permission: userPermissionsPermission(id: $permissionId, userId: $userId) {
                    source
                    overrideContentScopes
                    contentScopes
                }
            }
        `,
        {
            variables: { permissionId, userId },
        },
    );

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        return <CircularProgress />;
    }

    const initialValues: FormSubmitData = {
        overrideContentScopes: data.permission.overrideContentScopes,
        contentScopes: data.permission.contentScopes.map((v) => JSON.stringify(v)),
    };
    const disabled = data.permission.source === "BY_RULE";

    return (
        <Dialog maxWidth="lg" open={true}>
            <FinalForm<FormSubmitData>
                mode="edit"
                onSubmit={submit}
                initialValues={initialValues}
                render={({ values, form }) => {
                    const contentScopeStrings = values.contentScopes ?? [];

                    const addScope = (scope: ContentScope) => {
                        const scopeString = JSON.stringify(scope);
                        if (!contentScopeStrings.includes(scopeString)) {
                            form.change("contentScopes", [...contentScopeStrings, scopeString]);
                        }
                    };
                    const deleteScope = (scope: ContentScope) => {
                        form.change(
                            "contentScopes",
                            contentScopeStrings.filter((contentScopeString) => contentScopeString !== JSON.stringify(scope)),
                        );
                    };

                    const additionalColumns: GridColDef<ContentScope>[] = disabled
                        ? []
                        : [
                              {
                                  field: "actions",
                                  headerName: "",
                                  width: 52,
                                  align: "right",
                                  pinnable: false,
                                  sortable: false,
                                  filterable: false,
                                  renderCell: ({ row }) => (
                                      <IconButton onClick={() => deleteScope(row)}>
                                          <Delete />
                                      </IconButton>
                                  ),
                              },
                          ];

                    return (
                        <>
                            <DialogTitle>
                                <FormattedMessage id="comet.userPermissions.scopes" defaultMessage="Scopes" />
                            </DialogTitle>
                            <DialogContent>
                                <Field
                                    name="overrideContentScopes"
                                    label={
                                        <FormattedMessage
                                            id="comet.userPermissions.overrideScopes"
                                            defaultMessage="Permission-specific Content-Scopes"
                                        />
                                    }
                                    component={FinalFormSwitch}
                                    type="checkbox"
                                    disabled={disabled}
                                />
                                {values.overrideContentScopes && (
                                    <>
                                        <ContentScopeDataGrid
                                            rows={contentScopeStrings.map((contentScopeString) => JSON.parse(contentScopeString))}
                                            availableContentScopes={data.availableContentScopes}
                                            availableContentScopeDimensions={data.availableContentScopeDimensions}
                                            additionalColumns={additionalColumns}
                                            toolbarAction={
                                                disabled ? undefined : (
                                                    <Button startIcon={<Add />} onClick={() => setAddScopeOpen(true)} variant="primary">
                                                        <FormattedMessage id="comet.userPermissions.addScope" defaultMessage="Add scope" />
                                                    </Button>
                                                )
                                            }
                                        />
                                        <AddContentScopeDialog open={addScopeOpen} onClose={() => setAddScopeOpen(false)} onAdd={addScope} />
                                    </>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <CancelButton onClick={() => handleDialogClose()}>
                                    <FormattedMessage id="comet.userPermissions.close" defaultMessage="Close" />
                                </CancelButton>
                                {!disabled && <SaveButton type="submit" />}
                            </DialogActions>
                        </>
                    );
                }}
            />
        </Dialog>
    );
};
