import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormCheckbox, FinalFormSwitch, SaveButton } from "@comet/admin";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
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
type ContentScope = {
    [key: string]: string;
};

export const OverrideContentScopesDialog: React.FC<FormProps> = ({ permissionId, userId, handleDialogClose }) => {
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
                                label={<FormattedMessage id="comet.userPermissions.overrideScopes" defaultMessage="Override Scopes" />}
                                component={FinalFormSwitch}
                                type="checkbox"
                            />
                            {values.overrideContentScopes &&
                                data.availableContentScopes.map((contentScope: ContentScope) => (
                                    <Field
                                        disabled={disabled}
                                        key={JSON.stringify(contentScope)}
                                        name="contentScopes"
                                        fullWidth
                                        variant="horizontal"
                                        type="checkbox"
                                        component={FinalFormCheckbox}
                                        value={JSON.stringify(contentScope)}
                                        label={Object.entries(contentScope).map(([scope, value]) => (
                                            <>
                                                <FormattedMessage
                                                    id={`contentScope.scope.${scope}`}
                                                    defaultMessage={camelCaseToHumanReadable(scope)}
                                                />
                                                :{" "}
                                                <FormattedMessage
                                                    id={`contentScope.values.${value}`}
                                                    defaultMessage={camelCaseToHumanReadable(value)}
                                                />
                                                <br />
                                            </>
                                        ))}
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
