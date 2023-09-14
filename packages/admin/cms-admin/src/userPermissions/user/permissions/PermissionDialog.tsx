import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormInput, FinalFormSelect, FormSection, SaveButton } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import { camelCaseToHumanReadable } from "../../utils/camelCaseToHumanReadable";
import {
    GQLAvailablePermissionsQuery,
    GQLAvailablePermissionsQueryVariables,
    GQLCreateUserPermissionMutation,
    GQLCreateUserPermissionMutationVariables,
    GQLPermissionQuery,
    GQLPermissionQueryVariables,
    GQLUpdateUserPermissionMutation,
    GQLUpdateUserPermissionMutationVariables,
    GQLUserPermissionDialogFragment,
    namedOperations,
} from "./PermissionDialog.generated";

interface FormProps {
    userId: string;
    permissionId: string | "add";
    handleDialogClose: () => void;
}
export const PermissionDialog: React.FC<FormProps> = ({ userId, permissionId, handleDialogClose }) => {
    const client = useApolloClient();
    const submit = async (submitData: GQLUserPermissionDialogFragment) => {
        const { source, __typename, ...data } = submitData; // Remove source and __typename from data

        if (permissionId && permissionId !== "add") {
            await client.mutate<GQLUpdateUserPermissionMutation, GQLUpdateUserPermissionMutationVariables>({
                mutation: gql`
                    mutation UpdateUserPermission($id: String!, $input: UpdateUserPermissionInput!) {
                        userPermissionsUpdatePermission(id: $id, input: $input) {
                            id
                        }
                    }
                `,
                variables: { id: permissionId, input: data },
                refetchQueries: [namedOperations.Query.Permission, "Permissions"],
            });
        } else {
            await client.mutate<GQLCreateUserPermissionMutation, GQLCreateUserPermissionMutationVariables>({
                mutation: gql`
                    mutation CreateUserPermission($userId: String!, $input: CreateUserPermissionInput!) {
                        userPermissionsCreatePermission(userId: $userId, input: $input) {
                            id
                        }
                    }
                `,
                variables: { userId, input: { ...data } },
                refetchQueries: [namedOperations.Query.Permission, "Permissions"],
            });
        }
        handleDialogClose();
    };

    const { data, error } = useQuery<GQLPermissionQuery, GQLPermissionQueryVariables>(
        gql`
            query Permission($permissionId: ID!, $userId: String) {
                userPermission: userPermissionsPermission(id: $permissionId, userId: $userId) {
                    ...UserPermissionDialog
                }
            }
            fragment UserPermissionDialog on UserPermission {
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
            skip: permissionId === "add",
            variables: { permissionId, userId },
        },
    );
    const { data: availablePermissionsData, error: availablePermissionsError } = useQuery<
        GQLAvailablePermissionsQuery,
        GQLAvailablePermissionsQueryVariables
    >(
        gql`
            query AvailablePermissions {
                availablePermissions: userPermissionsAvailablePermissions
            }
        `,
    );

    if (error) {
        throw new Error(error.message);
    }
    if (availablePermissionsError) {
        throw new Error(availablePermissionsError.message);
    }
    if (!availablePermissionsData || (permissionId !== "add" && !data)) {
        return <CircularProgress />;
    }

    const initialValues = data
        ? {
              ...data.userPermission,
              validFrom: data.userPermission.validFrom ? new Date(data.userPermission.validFrom) : null,
              validTo: data.userPermission.validTo ? new Date(data.userPermission.validTo) : null,
          }
        : {};

    const disabled = data && data.userPermission.source === "BY_RULE";

    return (
        <Dialog maxWidth="sm" open={true}>
            <FinalForm<GQLUserPermissionDialogFragment>
                mode={permissionId ? "edit" : "add"}
                onSubmit={submit}
                onAfterSubmit={() => null}
                initialValues={initialValues}
                render={({ values }) => (
                    <>
                        <DialogTitle>
                            <FormattedMessage id="comet.userPermissions.showPermission" defaultMessage="Show permission" />
                        </DialogTitle>
                        <DialogContent>
                            <Field
                                required
                                fullWidth
                                name="permission"
                                component={FinalFormSelect}
                                options={availablePermissionsData.availablePermissions}
                                getOptionLabel={(permission: string) => (
                                    <FormattedMessage id={`permission.${permission}`} defaultMessage={camelCaseToHumanReadable(permission)} />
                                )}
                                disabled={disabled}
                                label={<FormattedMessage id="comet.userPermissions.permission" defaultMessage="Permission" />}
                            />
                            <Field
                                name="validFrom"
                                label={<FormattedMessage id="comet.userPermissions.validFrom" defaultMessage="Valid from" />}
                                fullWidth
                                component={FinalFormDatePicker}
                                disabled={disabled}
                                clearable={true}
                                formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                            />
                            <Field
                                name="validTo"
                                label={<FormattedMessage id="comet.userPermissions.validTo" defaultMessage="Valid to" />}
                                fullWidth
                                component={FinalFormDatePicker}
                                disabled={disabled}
                                clearable={true}
                                formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                            />
                            <FormSection title={<FormattedMessage id="comet.userPermissions.documentation" defaultMessage="Documentation" />}>
                                <Field
                                    fullWidth
                                    name="reason"
                                    component={FinalFormInput}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userPermissions.reason" defaultMessage="Reason" />}
                                />
                                <Field
                                    fullWidth
                                    name="requestedBy"
                                    component={FinalFormInput}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userPermissions.requestedBy" defaultMessage="Requested by" />}
                                />
                                <Field
                                    fullWidth
                                    name="approvedBy"
                                    component={FinalFormInput}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userPermissions.approvedBy" defaultMessage="Approved by" />}
                                />
                            </FormSection>
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={handleDialogClose}>
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
