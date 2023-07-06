import { gql, useApolloClient, useQuery } from "@apollo/client";
import { CancelButton, Field, FinalForm, FinalFormInput, FinalFormSelect, FormSection, SaveButton } from "@comet/admin";
import { FinalFormDatePicker } from "@comet/admin-date-time";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, InputBaseProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FieldRenderProps, Form } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { UserManagementSettings } from "../../UserManagementPage";
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

type ConfigurationProps = InputBaseProps &
    FieldRenderProps<JSON, HTMLInputElement | HTMLTextAreaElement> & {
        configurationComponent: () => React.ReactNode;
    };

const Configuration = ({ configurationComponent, input, disabled }: ConfigurationProps) => {
    const ConfigurationComponent = ({ values }: { values: JSON }) => {
        React.useEffect(() => {
            if (input.value !== values) {
                input.onChange(values);
            }
        }, [values]);
        return configurationComponent();
    };
    return (
        <FormSection title={<FormattedMessage id="comet.userManagement.configuration" defaultMessage="Configuration" />}>
            <Fieldset disabled={disabled}>
                <Form
                    onSubmit={() => {
                        /* */
                    }}
                    initialValues={input.value}
                    render={ConfigurationComponent}
                />
            </Fieldset>
        </FormSection>
    );
};

const createMutation = gql`
    mutation CreateUserPermission(
        $userId: String!
        $permission: String!
        $configuration: JSONObject
        $validFrom: DateTime
        $validTo: DateTime
        $reason: String
        $requestedBy: String
        $approvedBy: String
    ) {
        userManagementCreatePermission(
            data: {
                userId: $userId
                permission: $permission
                configuration: $configuration
                validFrom: $validFrom
                validTo: $validTo
                reason: $reason
                requestedBy: $requestedBy
                approvedBy: $approvedBy
            }
        ) {
            id
        }
    }
`;

const updateMutation = gql`
    mutation UpdateUserPermission(
        $id: ID!
        $permission: String!
        $configuration: JSONObject
        $validFrom: DateTime
        $validTo: DateTime
        $reason: String
        $requestedBy: String
        $approvedBy: String
    ) {
        userManagementUpdatePermission(
            data: {
                id: $id
                permission: $permission
                configuration: $configuration
                validFrom: $validFrom
                validTo: $validTo
                reason: $reason
                requestedBy: $requestedBy
                approvedBy: $approvedBy
            }
        ) {
            id
        }
    }
`;

interface FormProps {
    userId: string;
    permissionId: string | "add";
    handleDialogClose: () => void;
}
export const PermissionDialog: React.FC<FormProps> = ({ userId, permissionId, handleDialogClose }) => {
    const settings = React.useContext(UserManagementSettings);
    const client = useApolloClient();
    const submit = async (data: GQLUserPermissionDialogFragment) => {
        if (permissionId && permissionId !== "add") {
            await client.mutate<GQLUpdateUserPermissionMutation, GQLUpdateUserPermissionMutationVariables>({
                mutation: updateMutation,
                variables: { id: permissionId, ...data },
                refetchQueries: [namedOperations.Query.Permission, "Permissions"],
            });
        } else {
            await client.mutate<GQLCreateUserPermissionMutation, GQLCreateUserPermissionMutationVariables>({
                mutation: createMutation,
                variables: { userId, ...data },
                refetchQueries: [namedOperations.Query.Permission, "Permissions"],
            });
        }
        handleDialogClose();
    };

    const { data, error } = useQuery<GQLPermissionQuery, GQLPermissionQueryVariables>(
        gql`
            query Permission($permissionId: ID!, $userId: String) {
                userPermission: userManagementPermission(id: $permissionId, userId: $userId) {
                    ...UserPermissionDialog
                }
            }
            fragment UserPermissionDialog on UserPermission {
                permission
                name
                description
                source
                configuration
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
                availablePermissions: userManagementAvailablePermissions {
                    permission
                    name
                    description
                }
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
                initialValues={initialValues}
                render={({ values }) => (
                    <>
                        <DialogTitle>
                            <FormattedMessage id="comet.userManagement.showPermission" defaultMessage="Show permission" />
                        </DialogTitle>
                        <DialogContent>
                            <Field
                                required
                                fullWidth
                                name="permission"
                                component={FinalFormSelect}
                                options={availablePermissionsData.availablePermissions.map((p) => p.permission)}
                                getOptionLabel={(option: string) =>
                                    availablePermissionsData.availablePermissions.find((p) => p.permission === option)?.name
                                }
                                disabled={disabled}
                                label={<FormattedMessage id="comet.userManagement.permission" defaultMessage="Permission" />}
                            />
                            <Field
                                name="validFrom"
                                label={<FormattedMessage id="comet.userManagement.validFrom" defaultMessage="Valid from" />}
                                fullWidth
                                component={FinalFormDatePicker}
                                disabled={disabled}
                                clearable={true}
                                formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                            />
                            <Field
                                name="validTo"
                                label={<FormattedMessage id="comet.userManagement.validTo" defaultMessage="Valid to" />}
                                fullWidth
                                component={FinalFormDatePicker}
                                disabled={disabled}
                                clearable={true}
                                formatDateOptions={{ month: "short", day: "numeric", year: "numeric" }}
                            />

                            {settings.configurationSlots && values.permission && settings.configurationSlots[values.permission] && (
                                <Field
                                    name="configuration"
                                    type="hidden"
                                    component={Configuration}
                                    disabled={disabled}
                                    configurationComponent={settings.configurationSlots[values.permission]}
                                />
                            )}

                            <FormSection title={<FormattedMessage id="comet.userManagement.documentation" defaultMessage="Documentation" />}>
                                <Field
                                    fullWidth
                                    name="reason"
                                    component={FinalFormInput}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userManagement.reason" defaultMessage="Reason" />}
                                />
                                <Field
                                    fullWidth
                                    name="requestedBy"
                                    component={FinalFormInput}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userManagement.requestedBy" defaultMessage="Requested by" />}
                                />
                                <Field
                                    fullWidth
                                    name="approvedBy"
                                    component={FinalFormInput}
                                    disabled={disabled}
                                    label={<FormattedMessage id="comet.userManagement.approvedBy" defaultMessage="Approved by" />}
                                />
                            </FormSection>
                        </DialogContent>
                        <DialogActions>
                            <CancelButton onClick={handleDialogClose}>
                                <FormattedMessage id="comet.userManagement.close" defaultMessage="Close" />
                            </CancelButton>
                            {!disabled && <SaveButton type="submit" />}
                        </DialogActions>
                    </>
                )}
            />
        </Dialog>
    );
};

// TODO Make children aware of when disabled is set to true
const Fieldset = styled("fieldset")`
    border: none;
`;
