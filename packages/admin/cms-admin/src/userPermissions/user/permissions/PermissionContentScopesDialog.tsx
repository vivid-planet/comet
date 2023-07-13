import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormCheckbox, FinalFormSwitch, SaveButton } from "@comet/admin";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLPermissionContentScopesQuery,
    GQLPermissionContentScopesQueryVariables,
    GQLsetUserPermissionContentScopesMutation,
    GQLsetUserPermissionContentScopesMutationVariables,
    namedOperations,
} from "./PermissionContentScopesDialog.generated";

interface FormSubmitData {
    overrideContentScopes: boolean;
    contentScopes: { [key: string]: Array<string> };
}
interface FormProps {
    permissionId: string;
    userId: string;
    handleDialogClose: () => void;
}
export const PermissionContentScopesDialog: React.FC<FormProps> = ({ permissionId, userId, handleDialogClose }) => {
    const client = useApolloClient();

    const submit = async (data: FormSubmitData) => {
        await client.mutate<GQLsetUserPermissionContentScopesMutation, GQLsetUserPermissionContentScopesMutationVariables>({
            mutation: gql`
                mutation setUserPermissionContentScopes($data: UserPermissionContentScopesInput!) {
                    userPermissionsSetPermissionContentScopes(data: $data) {
                        id
                    }
                }
            `,
            variables: {
                data: {
                    permissionId,
                    overrideContentScopes: data.overrideContentScopes,
                    contentScopes: Object.entries(data.contentScopes).map((v) => ({ scope: v[0], values: v[1] })),
                },
            },
            refetchQueries: [namedOperations.Query.PermissionContentScopes, "Permissions"],
        });
        handleDialogClose();
    };

    const { data, error } = useQuery<GQLPermissionContentScopesQuery, GQLPermissionContentScopesQueryVariables>(
        gql`
            query PermissionContentScopes($permissionId: ID!, $userId: String) {
                availableContentScopes: userPermissionsAvailableContentScopes {
                    scope
                    label
                    values {
                        label
                        value
                    }
                }
                permission: userPermissionsPermission(id: $permissionId, userId: $userId) {
                    source
                    overrideContentScopes
                    contentScopes {
                        scope
                        values
                    }
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
        contentScopes: Object.fromEntries(
            data.availableContentScopes.map((v) => [v.scope, data.permission.contentScopes.find((cs) => cs.scope === v.scope)?.values ?? []]),
        ),
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
                                data.availableContentScopes.map((contentScope) => (
                                    <Accordion key={contentScope.scope} expanded={data.availableContentScopes.length < 10}>
                                        <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon />}>
                                            <Box sx={{ flexDirection: "column" }}>
                                                <Typography variant="h5" sx={{ fontWeight: "medium" }}>
                                                    {contentScope.label}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    <FormattedMessage
                                                        id="comet.userPermissions.contentScopesCount"
                                                        defaultMessage="{selected} of {count} selected"
                                                        values={{
                                                            selected:
                                                                data.permission.contentScopes.find((scope) => scope.scope === contentScope.scope)
                                                                    ?.values.length ?? 0,
                                                            count: contentScope.values.length,
                                                        }}
                                                    />
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {contentScope.values.map((value) => (
                                                <Field
                                                    fieldContainerProps={{ fieldMargin: "never" }}
                                                    key={value.value}
                                                    name={`contentScopes.${contentScope.scope}`}
                                                    variant="horizontal"
                                                    type="checkbox"
                                                    component={FinalFormCheckbox}
                                                    value={value.value}
                                                    label={value.label}
                                                    disabled={disabled}
                                                />
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
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
