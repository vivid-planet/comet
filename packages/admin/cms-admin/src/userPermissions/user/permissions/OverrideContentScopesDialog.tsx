import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormCheckbox, FinalFormSwitch, SaveButton } from "@comet/admin";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { getContentScopeAndLabel } from "./ContentScopeGrid";
import {
    GQLOverrideContentScopesMutation,
    GQLOverrideContentScopesMutationVariables,
    GQLPermissionContentScopesQuery,
    GQLPermissionContentScopesQueryVariables,
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
            query PermissionContentScopes($permissionId: ID!, $userId: String) {
                availableContentScopes: userPermissionsAvailableContentScopes
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
    const disabled = data && data.permission.source === "BY_RULE";

    return (
        <Dialog maxWidth="sm" open={true}>
            <FinalForm<FormSubmitData>
                mode="edit"
                onSubmit={submit}
                initialValues={initialValues}
                render={({ values }) => (
                    <>
                        <DialogTitle>
                            <FormattedMessage id="comet.userPermissions.scopes" defaultMessage="Scopes" />
                        </DialogTitle>
                        <DialogContent>
                            <Field
                                name="overrideContentScopes"
                                label={
                                    <FormattedMessage id="comet.userPermissions.overrideScopes" defaultMessage="Permission-specific Content-Scopes" />
                                }
                                component={FinalFormSwitch}
                                type="checkbox"
                                disabled={disabled}
                            />
                            {values.overrideContentScopes &&
                                getContentScopeAndLabel(data.availableContentScopes).map(({ contentScope, label }) => (
                                    <Field
                                        disabled={disabled}
                                        key={JSON.stringify(contentScope)}
                                        name="contentScopes"
                                        fullWidth
                                        variant="horizontal"
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        value={JSON.stringify(contentScope)}
                                        label={label}
                                    />
                                ))}
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={() => handleDialogClose()}>
                                <FormattedMessage id="comet.userPermissions.close" defaultMessage="Close" />
                            </CancelButton>
                            {!disabled && <SaveButton type="submit" />}
                        </DialogActions>
                    </>
                )}
            />
        </Dialog>
    );
};
