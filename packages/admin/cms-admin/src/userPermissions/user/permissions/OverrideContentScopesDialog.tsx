import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, CheckboxListField, Field, FinalForm, FinalFormSwitch, SaveButton } from "@comet/admin";
import {
    CircularProgress,
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
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
type ContentScope = {
    [key: string]: string;
};

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
                            {values.overrideContentScopes && (
                                <CheckboxListField
                                    fullWidth
                                    name="contentScopes"
                                    variant="horizontal"
                                    layout="column"
                                    options={data.availableContentScopes.map((contentScope: ContentScope) => ({
                                        label: Object.entries(contentScope).map(([scope, value]) => (
                                            <>
                                                {camelCaseToHumanReadable(scope)}: {camelCaseToHumanReadable(value)}
                                                <br />
                                            </>
                                        )),
                                        value: JSON.stringify(contentScope),
                                        disabled: disabled,
                                    }))}
                                />
                            )}
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
